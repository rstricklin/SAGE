describe('controller: ReaderManagementController', function () {

    var controller, scope, Reader, ReaderRepo, InternalMetadataRepo;

    beforeEach(function() {
      module('core');
      module('sage');
      module('mock.reader');
      module('mock.readerRepo');
      module('mock.source');
      module('mock.sourceRepo');
      module('mock.internalMetadata');
      module('mock.internalMetadataRepo');
      module('mock.user');
      module('mock.userService');

      inject(function ($controller, $rootScope, _InternalMetadata_, _InternalMetadataRepo_, _Reader_, _ReaderRepo_, _Source_, _SourceRepo_, _User_, _UserService_) {
        installPromiseMatchers();
        scope = $rootScope.$new();

        controller = $controller('ReaderManagementController', {
          $scope: scope,
          InternalMetadataRepo: _InternalMetadataRepo_,
          Reader: _Reader_,
          ReaderRepo: _ReaderRepo_,
          Source: _Source_,
          SourceRepo: _SourceRepo_,
          User: _User_,
          UserService: _UserService_
        });

        InternalMetadataRepo = _InternalMetadataRepo_;
        Reader = _Reader_;
        ReaderRepo = _ReaderRepo_;

        // ensure that the isReady() is called.
        scope.$digest();
      });
    });

    describe('Is the controller defined', function () {
      it('should be defined', function () {
        expect(controller).toBeDefined();
      });
    });

    describe('Are the scope methods defined', function () {
      it('cancelCreateReader should be defined', function () {
        expect(scope.cancelCreateReader).toBeDefined();
        expect(typeof scope.cancelCreateReader).toEqual("function");
      });

      it('cancelDeleteReader should be defined', function () {
        expect(scope.cancelDeleteReader).toBeDefined();
        expect(typeof scope.cancelDeleteReader).toEqual("function");
      });

      it('cancelUpdateReader should be defined', function () {
        expect(scope.cancelUpdateReader).toBeDefined();
        expect(typeof scope.cancelUpdateReader).toEqual("function");
      });

      it('confirmDeleteReader should be defined', function () {
        expect(scope.confirmDeleteReader).toBeDefined();
        expect(typeof scope.confirmDeleteReader).toEqual("function");
      });

      it('createReader should be defined', function () {
        expect(scope.createReader).toBeDefined();
        expect(typeof scope.createReader).toEqual("function");
      });

      it('deleteReader should be defined', function () {
        expect(scope.deleteReader).toBeDefined();
        expect(typeof scope.deleteReader).toEqual("function");
      });

      it('resetReaderForms should be defined', function () {
        expect(scope.resetReaderForms).toBeDefined();
        expect(typeof scope.resetReaderForms).toEqual("function");
      });

      it('setTable should be defined', function () {
        expect(scope.setTable).toBeDefined();
        expect(typeof scope.setTable).toEqual("function");
      });

      it('startCreateReader should be defined', function () {
        expect(scope.startCreateReader).toBeDefined();
        expect(typeof scope.startCreateReader).toEqual("function");
      });

      it('startUpdateReader should be defined', function () {
        expect(scope.startUpdateReader).toBeDefined();
        expect(typeof scope.startUpdateReader).toEqual("function");
      });

      it('updateReader should be defined', function () {
        expect(scope.updateReader).toBeDefined();
        expect(typeof scope.updateReader).toEqual("function");
      });
    });

    describe('Are the scope methods working as expected', function () {
      it('cancelCreateReader should cancel creating a reader', function () {
        scope.readerFields = null;

        spyOn(scope, 'resetReaderForms');

        scope.cancelCreateReader();

        expect(typeof scope.readerToCreate).toEqual("object");
        expect(scope.resetReaderForms).toHaveBeenCalled();
        expect(scope.readerFields).not.toBe(null);
      });

      it('cancelDeleteReader should cancel deleting a reader', function () {
        scope.readerToDelete = mockReader1;

        spyOn(scope, 'resetReaderForms');

        scope.cancelDeleteReader(mockReader1);

        expect(scope.readerToDelete).not.toEqual(mockReader1);
        expect(scope.resetReaderForms).toHaveBeenCalled();
      });

      it('cancelUpdateReader should cancel updating a reader', function () {
        scope.readerToUpdate = mockReader1;

        spyOn(scope, 'resetReaderForms');

        scope.cancelUpdateReader(mockReader1);

        expect(scope.readerToUpdate).not.toEqual(mockReader1);
        expect(scope.resetReaderForms).toHaveBeenCalled();
      });

      it('confirmDeleteReader should confirm deleting a reader', function () {
        var reader = new Reader();
        reader.mock(mockReader1);

        scope.readerToDelete = null;
        scope.openModal = function(name) { };

        spyOn(scope, 'openModal');

        scope.confirmDeleteReader(reader);

        expect(scope.readerToDelete).toEqual(reader);
        expect(scope.openModal).toHaveBeenCalled();
      });

      it('createReader should create a reader', function () {
        var newReader = new Reader();
        newReader.mock(mockReader1);
        newReader.name = "New Reader";
        delete newReader.id;

        spyOn(scope, 'cancelCreateReader');

        scope.createReader(newReader);
        scope.$digest();

        expect(scope.cancelCreateReader).toHaveBeenCalled();
      });

      it('deleteReader should delete a reader', function () {
        scope.deletingReader = null;
        scope.readerToDelete = new Reader();
        scope.readerToDelete.mock(mockReader1);;

        spyOn(scope, 'resetReaderForms');

        scope.deleteReader();
        scope.$digest();

        expect(typeof scope.deletingReader).toEqual('boolean');
        expect(scope.resetReaderForms).toHaveBeenCalled();
      });

      it('resetReaderForms should reset reader form', function () {
        scope.closeModal = function() { };

        spyOn(ReaderRepo, 'clearValidationResults');
        spyOn(scope, 'closeModal');

        var key;
        for (key in scope.readerForms) {
          scope.readerForms[key].$setPristine = function() { };
          spyOn(scope.readerForms[key], '$setPristine');
        }

        scope.resetReaderForms();
        scope.$digest();

        expect(ReaderRepo.clearValidationResults).toHaveBeenCalled();
        expect(scope.closeModal).toHaveBeenCalled();

        for (key in scope.readerForms) {
          expect(scope.readerForms[key].$setPristine).toHaveBeenCalled();
        }
      });

      it('setTable should start creating a reader', function () {
        var data = scope.tableParams._settings.getData();

        expect(scope.readers).toEqual(data);
      });

      it('startCreateReader should start creating a reader', function () {
        scope.openModal = function(name) { };

        spyOn(scope, 'openModal');

        scope.startCreateReader();

        expect(scope.openModal).toHaveBeenCalled();
      });

      it('startUpdateReader should start updating a reader', function () {
        scope.readerToUpdate = null;
        scope.openModal = function(name) { };

        spyOn(scope, 'openModal');

        scope.startUpdateReader(mockReader1);

        expect(scope.readerToUpdate).toEqual(mockReader1);
        expect(scope.openModal).toHaveBeenCalled();
      });

      it('updateReader should update a reader', function () {
        scope.updatingReader = null;
        scope.readerToUpdate = new Reader();
        scope.readerToUpdate.mock(mockReader1);
        scope.readerToUpdate.name = "Updated Reader 1";

        spyOn(scope, 'resetReaderForms');

        scope.updateReader();
        scope.$digest();

        expect(typeof scope.updatingReader).toEqual('boolean');
        expect(scope.resetReaderForms).toHaveBeenCalled();
      });

      it('source candidates should be readOnly', function () {
        var foundWriteableCandidate = false;
        for (var i in scope.sources) {
          if (scope.sources[i].readOnly == false) {
            foundWriteableCandidate = true;
            break;
          }
        }
        expect(foundWriteableCandidate).toEqual(false);
      });
    });

});
