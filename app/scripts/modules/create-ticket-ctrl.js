'use strict';

angular.module('workingRoom')
    .controller('CreateTicketCtrl', function ($scope, $mdDialog, Module, User, Toasts, Upload, $timeout) {
        var vm = this;

        var defaultStatus = getDefaultStatus();
        vm.getLocale = getLocale;
        vm.ticket = {
            user: {
                id: User.$id,
                name: User.name,
                group : User.groups
            },
            lang : getLocale(),
            status: defaultStatus
        };
        vm.module = Module;

        vm.cancel = cancel;
        vm.hide = $mdDialog.hide;
        vm.deleteFile = deleteFile;
        vm.getPattern = getPattern;
        vm.upload = upload;


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
          Toasts.simple('Fichier ' + vm.ticket.file.name+ ' supprimé');
          vm.ticket.file = null;
        }

        function getLocale()
        {
          var lang = moment.locale();
          return lang;
        }

        function upload() {
          vm.newFile = [];
          var files = document.getElementById('file').files;
            if (files) {
              for (var i = 0; i < files.length; i++) {
                (function(file) {
                  var reader = new FileReader();
                  reader.onload = function(readerEvt) {
                      var binaryString = readerEvt.target.result;
                      vm.newFile.push({
                          name: file.name,
                          data: 'data:' + file.type + ';base64,' + binaryString.substr(binaryString.indexOf('base64,') + 'base64,'.length)
                      });
                  };
                  reader.readAsDataURL(file);
                })(files[i]);
              }
              vm.ticket.file = vm.newFile;
            }
        }

        function getPattern(minSize) {
                  if (minSize) {
                      return '.{' + minSize + ',}';
                  } else {
                      return '.{0,}'
                  }
        }
});
