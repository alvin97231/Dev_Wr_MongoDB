'use strict';

angular.module('workingRoom')
    .controller('NewTicketFieldCtrl', function ($mdDialog) {
        var vm = this;

        vm.newTicketField = '';
        vm.cancel = cancel;
        vm.saveField = saveField;

        function cancel(event) {
            event.preventDefault();
            $mdDialog.cancel();
        }

        function saveField() {
            if (vm.newTicketField.length > 0) {
                $mdDialog.hide({
                    name: vm.newTicketField,
                    data: [],
                    required: true,
                    showInTable: true
                });
            }
        }
    });
