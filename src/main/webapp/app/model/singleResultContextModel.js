sage.model("SingleResultContext", function ($q, $location, $routeParams, WsApi, Result, Field, Search) {
  return function SingleResultContext() {

    var singleResultContext = this;

    singleResultContext.before(function() {
      WsApi.fetch(singleResultContext.getMapping().load, {
        pathValues: {
          slug: singleResultContext.slug,
          resultId: singleResultContext.resultId
        }
      }).then(function(res) {
        var rc = angular.fromJson(res.body).payload.SingleResultContext;
        angular.extend(singleResultContext, rc);
      });
    });

    return singleResultContext;

  };
});
