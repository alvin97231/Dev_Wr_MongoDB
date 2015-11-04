'use strict';

angular.module('workingRoom')
    .controller('CreateTicketCtrl', function ($scope, $mdDialog, Module, User, Toasts, FileUploader) {
        var vm = this;

        var defaultStatus = getDefaultStatus();
        vm.ticket = {
            user: {
                id: User.$id,
                name: User.name,
                lang ='fr',
            },
            status: defaultStatus
        };
        vm.module = Module;

        vm.cancel = cancel;
        vm.hide = $mdDialog.hide;
        vm.deleteFile = deleteFile;
        vm.getPattern = getPattern;
        vm.upload = new FileUploader();

        vm.getSubCat = function (cat, subcats) {
            var ret = [];
            if (cat) {
                for (var i = 0, len = subcats.length; i < len; i++) {
                    if (subcats[i].name === cat) {
                        ret = subcats[i].data;
                        break;
                    }
                }
            }
            return ret;
        };

        function cancel(event) {
            event.preventDefault();
            $mdDialog.cancel();
        }

        function getDefaultStatus() {
            if (Module.status) {
                for (var i = 0; i < Module.status.length; i++) {
                    if (Module.status.default) {
                        return Module.status.name;
                    }
                }
                return Module.status[0] ? Module.status[0].name : 'A traiter';
            }
            return 'A traiter';
        }

        function deleteFile() {
            vm.ticket.file = null;
            Toasts.simple('Fichier supprimé');
        }

        /*function upload(files) {
        $scope.files = files;
        angular.forEach(files, function(file) {
            if (file && !file.$error) {
                  var reader = new FileReader();

                  reader.onload = function(readerEvt) {
                      var binaryString = readerEvt.target.result;
                      vm.newFile = {
                          name: file.name,
                          data: 'data:' + file.type + ';base64,' + binaryString.substr(binaryString.indexOf('base64,') + 'base64,'.length)
                      };
                      Toasts.simple('Fichier ajouté');
                  };

                  reader.readAsDataURL(file);

    		}
        });
    }*/

        function getPattern(minSize) {
            if (minSize) {
                return '.{' + minSize + ',}';
            } else {
                return '.{0,}'
            }
        }
    });
