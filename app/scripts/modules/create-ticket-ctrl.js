'use strict';

angular.module('workingRoom')
    .controller('CreateTicketCtrl', function ($scope, $mdDialog, Ref, Module, User, Toasts, Upload, $timeout) {
        var vm = this;

        var defaultStatus = getDefaultStatus();
        vm.groupsQuery = Ref.child('groups').once('value', function(snap){vm.groups = snap.val();});
        vm.getLocale = getLocale;
        vm.getAttribution = getAttribution;
        if(User.groups){
          vm.ticket = {
              user: {
                  id: User.$id,
                  name: User.name,
                  group : User.groups
              },
              lang : getLocale(),
              status: defaultStatus
          };
        }
        else if (!User.groups) {
          vm.ticket = {
              user: {
                  id: User.$id,
                  name: User.name,
              },
              lang : getLocale(),
              status: defaultStatus
          };
        }

        vm.module = Module;

        vm.cancel = cancel;
        vm.hide = $mdDialog.hide;
        vm.deleteFile = deleteFile;
        vm.getPattern = getPattern;
        vm.upload = upload;
        vm.required = true;

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

        function getAttribution() {
          for (var objet in vm.groups){
            if(vm.groups[objet].name.slice(0, 3).toLowerCase() == vm.ticket[5].first.slice(0, 3).toLowerCase()){
              vm.attributed = vm.groups[objet];
              vm.ticket[6] = vm.attributed;
              console.log(vm.ticket);
            }
          }
        }

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
          vm.newFile = null;
          Toasts.simple('Fichier supprimé');
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
