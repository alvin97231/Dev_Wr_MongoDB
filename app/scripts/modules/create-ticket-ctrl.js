'use strict';

angular.module('workingRoom')
    .controller('CreateTicketCtrl', function ($scope, $mdDialog, Module, User, Toasts, Upload, $timeout) {
        var vm = this;

        var defaultStatus = getDefaultStatus();
        vm.getLocale = getLocale;
        vm.ticket = {
            user: {
                id: User.$id,
                name: User.name
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

        function upload(files) {
          console.log(files);
              for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                reader.onload = function (e) {
                  var binaryString = e.target.result;
                  if(f){
                    vm.ticket.file.push(f);
                  }
                };
                reader.readAsDataURL(f);
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
