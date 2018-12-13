sage.model("DiscoveryContext", function ($q, $location, HttpMethodVerbs, WsApi, Result, Field, Search) {
  return function DiscoveryContext() {

    var discoveryContext = this;

    var fetchContext = function () {

      var q = {};

      angular.forEach(discoveryContext.search.filters, function(filter) {
        if(!q[filter.key]) {
          q[filter.key] = [];  
        }
        q[filter.key].push(filter.value);
      });

      return WsApi.fetch(discoveryContext.getMapping().load, {
        pathValues: {
          slug: discoveryContext.slug
        },
        query: q
      });
    };

    var populateProperty = function(pname, ctor) {
      for(var i in discoveryContext[pname]) {
        discoveryContext[pname][i] = new ctor(discoveryContext[pname][i]);
      }
    };

    discoveryContext.before(function () {

      var filters = [];
      angular.forEach($location.search(), function(v,k) {
        var filter = {
          key: k,
          value: v
        };
        filters.push(filter);
      });

      discoveryContext.search = new Search({
        filters: filters,
        query: $location.search()
      });

      return discoveryContext.reload();
    });

    discoveryContext.reload = function() {
      var defer = $q.defer();
      fetchContext().then(function (res) {
        var dc = angular.fromJson(res.body).payload.DiscoveryContext;

        angular.extend(discoveryContext, dc);

        populateProperty("results", Result);

        populateProperty("fields", Field);

        defer.resolve(discoveryContext);
      });
      return defer.promise;
    };

    return this;

  };
});
