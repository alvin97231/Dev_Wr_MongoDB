'use strict';

angular.module('workingRoom')
    .controller('ViewTicketCtrl', function ($state, $mdDialog, ticket, User, $stateParams, Tickets, module, Toasts, admin) {
        var vm = this;

        vm.module = module;
        vm.ticket = ticket;
        vm.admin = admin;
        vm.newMessage = '';
        vm.ei = false;
        vm.newStatus = null;
        vm.recontact = false;
        vm.newFile = null;
        vm.sendMessage = sendMessage;
        vm.upload = upload;
        vm.deleteFile = deleteFile;
        vm.super = User.type === "super";

        vm.cancel = $mdDialog.hide;

        function sendMessage() {
            if (vm.newMessage.length > 0) {
                if (vm.newStatus === 'Escalade injustifié' && ticket.status === 'Escaladé'){
                  ticket.status = 'A traiter';
                  vm.ei = true;

                }
                else if (vm.newStatus === 'Escalade injustifié' && ticket.status !== 'Escaladé'){
                  ticket.status = 'En cours';
                  vm.ei = true;
                }
                else if (vm.newStatus === 'A solder : En attente de recontact client'){
                  ticket.status = vm.newStatus;
                }
                else if (vm.newStatus !== 'Escalde injustifié'){
                  vm.dateChangeState = Date.now();
                  ticket.status = vm.newStatus;
                }
                if (vm.recontact){
                  vm.recontact ='Recontacter Membre';
                }
                else{
                  vm.recontact = '';
                }
                if (!ticket.messages) ticket.messages = [];
                ticket.messages.push({
                    ei : vm.ei,
                    date: Date.now(),
                    author: {id: User.$id, name: User.name},
                    content: vm.newMessage,
                    recontact : vm.recontact,
                    file: vm.newFile,
                    status: vm.newStatus
                });
                ticket.lastResponse = User.name;
                Tickets.save($stateParams.id, ticket);
                vm.newMessage = '';
                $mdDialog.hide();
            }
        }

        function deleteFile() {
            vm.newFile = null;
            Toasts.simple('Fichier supprimé');
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
                      console.log(vm.newFile);
                      Toasts.simple('Fichier '+ file.name+ ' ajouté');
                  };
                  reader.readAsDataURL(file);
                })(files[i]);
              }
            }
        }
    });
