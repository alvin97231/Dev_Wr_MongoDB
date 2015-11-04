'use strict';

angular.module('workingRoom')
    .controller('ChangePasswordCtrl', function (email, $mdDialog) {
        var vm = this;

        vm.password = {
            email: email
        };
        vm.hide = $mdDialog.hide;
        vm.cancel = $mdDialog.cancel;
    });