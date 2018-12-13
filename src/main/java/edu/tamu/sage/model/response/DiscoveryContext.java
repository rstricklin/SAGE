package edu.tamu.sage.model.response;

import java.io.Serializable;
import java.util.List;

import edu.tamu.sage.model.DiscoveryView;

public class DiscoveryContext implements Serializable {

    private static final long serialVersionUID = 6808155032067806535L;
    
    private String name;
    
    private String titleKey;

    private String uniqueIdentifierKey;
    
    private Search search;
    
    private List<Result> results;
    
    private List<SolrField> fields;
    
    private String infoText;

    private String infoLinkText;

    private String infoLinkUrl;

    public DiscoveryContext() {
        super();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public String getTitleKey() {
        return titleKey;
    }

    public void setTitleKey(String titleKey) {
        this.titleKey = titleKey;
    }
    
    public String getUniqueIdentifierKey() {
        return uniqueIdentifierKey;
    }

    public void setUniqueIdentifierKey(String uniqueIdentifierKey) {
        this.uniqueIdentifierKey = uniqueIdentifierKey;
    }

    public Search getSearch() {
        return search;
    }

    public void setSearch(Search search) {
        this.search = search;
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }
    
    public List<SolrField> getFields() {
        return fields;
    }

    public void setFields(List<SolrField> fields) {
        this.fields = fields;
    }

    public String getInfoText() {
        return infoText;
    }

    public void setInfoText(String infoText) {
        this.infoText = infoText;
    }

    public String getInfoLinkText() {
        return infoLinkText;
    }

    public void setInfoLinkText(String infoLinkText) {
        this.infoLinkText = infoLinkText;
    }

    public String getInfoLinkUrl() {
        return infoLinkUrl;
    }

    public void setInfoLinkUrl(String infoLinkUrl) {
        this.infoLinkUrl = infoLinkUrl;
    }

    public static DiscoveryContext of(DiscoveryView dv) {
        DiscoveryContext dc = new DiscoveryContext();
        
        dc.setName(dv.getName());
        dc.setTitleKey(dv.getTitleKey());
        dc.setUniqueIdentifierKey(dv.getUniqueIdentifierKey());
        dc.setInfoText(dv.getInfoText());
        dc.setInfoLinkUrl(dv.getInfoLinkUrl());
        dc.setInfoLinkText(dv.getInfoLinkText());
        
        return dc;
    }
}
