'use strict';

angular.module('workingRoom')
    .controller('resetPasswordCtrl', function ($mdDialog) {
        var vm = this;

        vm.email = '';

        vm.hide = $mdDialog.hide;
        vm.cancel = $mdDialog.cancel;
    });