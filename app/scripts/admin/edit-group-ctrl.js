'use strict';

angular.module('workingRoom')
    .controller('EditGroupCtrl', function (Group, ModulesList, $mdDialog) {
        var vm = this;

        vm.group = {
            name: Group.name,
            modules: Group.modules ? Group.modules.slice(0) : []
        };

        //TODO: exclude selected modules from the vm.modules list
        vm.modules = ModulesList.slice(0);
        vm.hide = $mdDialog.hide;
        vm.cancel = $mdDialog.cancel;
        vm.selectedModule = null;
        vm.addModule = function () {
            if (vm.selectedModule && vm.modules[vm.selectedModule]) {
                var module = vm.modules[vm.selectedModule];
                vm.group.modules.push({
                    id: module.$id,
                    name: module.name
                });
                vm.selectedModule = null;
            }
        };
        vm.removeModule = function (key) {
            vm.group.modules.splice(key, 1);
        };
    });
