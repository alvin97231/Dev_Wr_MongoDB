'use strict';

angular.module('workingRoom')
    .controller('DeleteUserCtrl', function (id, $mdDialog) {
        var vm = this;

        vm.user = {
            id: id
        };
        vm.hide = $mdDialog.hide;
        vm.cancel = $mdDialog.cancel;
    });
