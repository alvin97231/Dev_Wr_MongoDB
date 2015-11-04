'use strict';

angular.module('workingRoom')
    .controller('CreateModuleCtrl', function ($mdDialog) {
        var vm = this;

        vm.module = {};

        vm.cancel = $mdDialog.cancel;
        vm.hide = $mdDialog.hide;
    });
