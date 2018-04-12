package edu.tamu.sage.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.SolrInputDocument;
import org.codehaus.plexus.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.tamu.sage.model.SolrCore;
import edu.tamu.sage.model.repo.SolrCoreRepo;

@Service
public class ProcessorService {
    @Autowired
    private SolrCoreRepo solrCoreRepo;
    
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    
    public void process() {
        logger.info("Processing!");
        
        List<Map<String,String>> mappedResults = new ArrayList<Map<String,String>>();

        //gather Readers
        //loop and Reader->read()        
        List<SolrCore> solrCores = solrCoreRepo.findAll();
        solrCores.forEach(solrCore -> {
            logger.info("Reading from SOLR Core: "+solrCore.getName()+" - "+solrCore.getUri());
            SolrClient solr = new HttpSolrClient(solrCore.getUri());

            try {
                solr.ping();               

                SolrQuery query = new SolrQuery();
                query.set("q", "*");
                query.set("rows", "100");

                QueryResponse queryResponse = solr.query(query);
                
                SolrDocumentList results = queryResponse.getResults();
                for (int i = 0; i < results.size(); ++i) {
                    Map<String,String> resultsMap = new HashMap<String,String>();                    
                    SolrDocument doc = (SolrDocument) results.get(i);
                    solrCore.getFields().forEach(field -> {
                        if (doc.getFieldValue("title") != null && doc.getFieldValue(field.getName()) != null) {
                            if (field.getName().equals("id") && doc.getFieldValue(field.getName()).toString().contains("://")) {
                                resultsMap.put(field.getSchemaMapping(), new String(Base64.encodeBase64(doc.getFieldValue(field.getName()).toString().getBytes())));
                            } else if (field.getName().equals("title")) {
                                resultsMap.put("title_display", doc.getFieldValue(field.getName()).toString());
                                resultsMap.put("title", doc.getFieldValue(field.getName()).toString());
                            } else {
                                resultsMap.put(field.getSchemaMapping(), doc.getFieldValue(field.getName()).toString());
                            }
                        }
                    });
                    
                    if (!resultsMap.isEmpty()) {
                        // Dummy data
                        resultsMap.put("alternative","subtitle text");
                        resultsMap.put("spatial","India");
                        resultsMap.put("subject","Priests, Buddhist");
                        resultsMap.put("published_display","Publisher text");
                        resultsMap.put("creator","Author text");
                        resultsMap.put("created","2002");
                        resultsMap.put("format","Format");
                        resultsMap.put("medium","type display");
                        resultsMap.put("language","English");
                        mappedResults.add(resultsMap);
                    }
                }
            } catch (Exception e) {
                e.getMessage();
                e.printStackTrace();
            } finally {
                try {
                    solr.close();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }            
        });

        //gather Writers
        //loop and Writer->write()
        Map<String,List<String>> schemaMap = new HashMap<String,List<String>>();
        schemaMap.put("title", Arrays.asList("title_t","title_display"));
        schemaMap.put("terms.identifier", Arrays.asList("id"));

        schemaMap.put("alternative", Arrays.asList("subtitle_display","subtitle_t"));
        schemaMap.put("spatial",Arrays.asList("subject_geo_facet"));
        schemaMap.put("subject",Arrays.asList("subject_topic_facet"));
        schemaMap.put("created",Arrays.asList("published_display","pub_date"));
        schemaMap.put("creator",Arrays.asList("author_display"));
        schemaMap.put("format",Arrays.asList("format"));
        schemaMap.put("medium",Arrays.asList("material_type_display","lc_callnum_display"));
        schemaMap.put("language",Arrays.asList("language_facet"));

        SolrClient blSolr = new HttpSolrClient("http://localhost:8983/solr/blacklight-core");
        
        try {
            blSolr.ping();

            logger.info("Writing to Destination SOLR...");
            mappedResults.forEach(map -> {
                logger.info("Creating SOLR Document");
                SolrInputDocument document = new SolrInputDocument();
                schemaMap.forEach((dc,bl) -> {
                    if (map.containsKey(dc)) {
                        logger.debug("Indexing metatdata: "+dc+" = '"+map.get(dc)+"' to fields: "+bl);
                        bl.forEach(m -> {
                            document.addField(m, map.get(dc));
                        });

                    } else {
                        logger.debug("Skipping indexing of metadata: "+dc);
                    }
                 });
                try {
                    blSolr.add(document);
                } catch (SolrServerException | IOException e) {
                    logger.error("Error adding SOLR document");
                    e.printStackTrace();
                }
            });

            UpdateResponse ur = blSolr.commit();
            logger.debug("SOLR Commit response:");
            logger.debug(ur.getResponse().toString());


            blSolr.close();
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

}
