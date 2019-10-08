describe('model: SingleResultContext', function () {
  var model, rootScope, scope, location, WsApi;

  var initializeVariables = function(settings) {
    inject(function ($location, $rootScope, _WsApi_) {
      location = $location;
      rootScope = $rootScope;

      WsApi = _WsApi_;
    });
  };

  var initializeModel = function(settings) {
    inject(function (SingleResultContext) {
      scope = rootScope.$new();

      model = angular.extend(new SingleResultContext(), dataSingleResultContext1);

      // ensure that all pre-processing is called.
      if (!scope.$$phase) {
        scope.$digest();
      }
    });
  };

  beforeEach(function() {
    module("core");
    module("sage");
    module("mock.wsApi");

    initializeVariables();
    initializeModel();
  });

  describe('Is the model defined', function () {
    it('should be defined', function () {
      expect(model).toBeDefined();
    });
  });

  describe('Are the model methods defined', function () {
    it('getBreadcrumb should be defined', function () {
      expect(model.getBreadcrumb).toBeDefined();
      expect(typeof model.getBreadcrumb).toEqual("function");
    });
  });

  describe('Are the model methods working as expected', function () {
    it('getBreadcrumb should work', function () {
      var result;

      result = model.getBreadcrumb();
      expect(result.label).toBe(model.title);
    });
  });
});
