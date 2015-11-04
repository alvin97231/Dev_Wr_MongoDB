'use strict';

angular.module('workingRoom')
    .controller('DeleteUserCtrl', function (email, $mdDialog) {
        var vm = this;

        vm.user = {
            email: email
        };
        vm.hide = $mdDialog.hide;
        vm.cancel = $mdDialog.cancel;
    });