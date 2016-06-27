'use strict';

angular.module('workingRoom')
  .controller('CreateUserCtrl', function($mdDialog) {
    var vm = this;

    vm.user = {};

    vm.cancel = $mdDialog.cancel;
    vm.hide = $mdDialog.hide;
  });
