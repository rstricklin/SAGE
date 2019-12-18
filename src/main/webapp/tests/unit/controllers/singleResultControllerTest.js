describe("controller: SingleResultController", function () {
  var $q, $scope, MockedDiscoveryContext, MockedSingleResultContext, MockedUser, WsApi, controller;

  var initializeVariables = function () {
    inject(function (_$q_, _WsApi_) {
      $q = _$q_;

      MockedUser = new mockUser($q);
      MockedDiscoveryContext = new mockDiscoveryContext($q);
      MockedSingleResultContext = new mockSingleResultContext($q);

      WsApi = _WsApi_;
    });
  };

  var initializeController = function (settings) {
    inject(function (_$controller_, _$rootScope_, _DiscoveryContext_, _SingleResultContext_, _UserService_) {
      $scope = _$rootScope_.$new();

      sessionStorage.role = settings && settings.role ? settings.role : "ROLE_ADMIN";
      sessionStorage.token = settings && settings.token ? settings.token : "faketoken";

      controller = _$controller_("SingleResultController", {
        $q: $q,
        $scope: $scope,
        DiscoveryContext: _DiscoveryContext_,
        SingleResultContext: _SingleResultContext_,
        UserService: _UserService_,
        WsApi: WsApi
      });

      // ensure that the isReady() is called.
      if (!$scope.$$phase) {
        $scope.$digest();
      }
    });
  };

  beforeEach(function () {
    module("core");
    module("sage");
    module("mock.discoveryContext", function ($provide) {
      var DiscoveryContext = function () {
        return MockedDiscoveryContext;
      };
      $provide.value("DiscoveryContext", DiscoveryContext);
    });
    module("mock.singleResultContext", function ($provide) {
      var SingleResultContext = function () {
        return MockedSingleResultContext;
      };
      $provide.value("SingleResultContext", SingleResultContext);
    });
    module("mock.user", function ($provide) {
      var User = function () {
        return MockedUser;
      };
      $provide.value("User", User);
    });
    module("mock.userService");
    module("mock.wsApi");

    installPromiseMatchers();
    initializeVariables();
    initializeController();
  });

  describe("Is the controller defined", function () {
    it("should be defined for admin", function () {
      expect(controller).toBeDefined();
    });
    it("should be defined for manager", function () {
      initializeController({role: "ROLE_MANAGER"});
      expect(controller).toBeDefined();
    });
    it("should be defined for user", function () {
      initializeController({role: "ROLE_USER"});
      expect(controller).toBeDefined();
    });
    it("should be defined for anonymous", function () {
      initializeController({role: "ROLE_ANONYMOUS"});
      expect(controller).toBeDefined();
    });
  });

});
