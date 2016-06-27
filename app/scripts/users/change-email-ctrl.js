'use strict';

angular.module('workingRoom')
    .controller('ChangeEmailCtrl', function (email, $mdDialog) {
        var vm = this;

        vm.email = {
            oldEmail: email
        };
        vm.hide = $mdDialog.hide;
        vm.cancel = $mdDialog.cancel;
    });