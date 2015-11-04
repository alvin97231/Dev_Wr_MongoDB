'use strict';

angular.module('workingRoom')
  .controller('CreateGroupCtrl', function($mdDialog) {
    var vm = this;

    vm.group = {};

    vm.cancel = $mdDialog.cancel;
    vm.hide = $mdDialog.hide;
  });
