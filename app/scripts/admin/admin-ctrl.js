'use strict';

angular.module('workingRoom')
    .controller('AdminCtrl', function ($mdDialog, $state,$scope, Modules, Groups, Users, Tickets, ModulesList, GroupsList, UsersList, Toasts, Socket) {
        var vm = this;

        vm.modules = ModulesList;
        vm.groups = GroupsList;
        vm.users = UsersList;
        vm.openCreateModule = openCreateModule;
        vm.openDeleteModule = openDeleteModule;
        vm.openCreateGroup = openCreateGroup;
        vm.openEditGroup = openEditGroup;
        vm.openDeleteGroup = openDeleteGroup;
        vm.openCreateUser = openCreateUser;
        vm.goToModule = goToModule;
        vm.types = ['', 'admin','super','user'];

        vm.label = {
            text: 'Utilisateurs par page',
            of: 'sur'
        };

        vm.query = {
            order: '-id',
            limit: 10,
            page: 1,
            rowSelect: [10, 20, 50, 100, 200, 500]
        };

        Socket.on('new_user', function (data) {
          updateArray(vm.users, data, 'add');
        });
        Socket.on('update_user', function (data) {
          updateArray(vm.users, data, 'update');
        });
        Socket.on('delete_user', function (data) {
          updateArray(vm.users, data, 'delete');
        });

        Socket.on('new_group', function (data) {
          updateArray(vm.groups, data, 'add');
        });
        Socket.on('update_group', function (data) {
          updateArray(vm.groups, data, 'update');
        });
        Socket.on('delete_group', function (data) {
          updateArray(vm.groups, data, 'delete');
        });

        Socket.on('new_module', function (data) {
          updateArray(vm.modules, data, 'add');
        });
        Socket.on('update_module', function (data) {
          updateArray(vm.modules, data, 'update');
        });
        Socket.on('delete_module', function (data) {
          updateArray(vm.modules, data, 'delete');
        });

        function updateArray(array, newValue, type) {
          switch (type) {

            case 'add':
              array.push(newValue);
              break;

            case 'update':
              var i;
              for (i = 0; i < array.length; i++) {
                if (array[i].id === newValue.id) {
                  array[i] = newValue;
                }
              }
              break;

            case 'delete':
              var i;
              for (i = 0; i < array.length; i++) {
                if (array[i].id === null) {
                  array.splice(i,1);
                }
              }
              break;
          }
          $scope.$apply();
        }

        function openCreateModule(event) {
            $mdDialog.show({
                controller: 'CreateModuleCtrl as vm',
                templateUrl: 'partials/admin/create-module-modal.html',
                targetEvent: event
            }).then(function (res) {
                Modules.add(res);
            });
        }

        function openDeleteModule(event, module) {
            event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .title('Attention')
                .content('Voulez-vous vraiment supprimer ce module ?')
                .ariaLabel('confirm delete')
                .ok('Oui')
                .cancel('Non')
                .targetEvent(event);
            $mdDialog.show(confirm).then(function () {
                Tickets.delete(module.id);
                Modules.delete(module);
            });
        }

        function openCreateGroup(event) {
            $mdDialog.show({
                controller: 'CreateGroupCtrl as vm',
                templateUrl: 'partials/admin/create-group-modal.html',
                targetEvent: event
            }).then(function (res) {
                Groups.add(res);
            });
        }

        function openEditGroup(event, group) {
            //noinspection JSUnusedGlobalSymbols
            $mdDialog.show({
                controller: 'EditGroupCtrl as vm',
                templateUrl: 'partials/admin/edit-group-modal.html',
                targetEvent: event,
                resolve: {
                    Group: function () {
                        return group;
                    },
                    ModulesList: function () {
                        return ModulesList;
                    }
                }
            }).then(function (res) {
                if (res.name.length > 0) {
                    group.name = res.name;
                    group.modules = res.modules;
                    Groups.update(group).then(function () {
                        Toasts.simple('Sauvegarde réussie');
                    }, function (error) {
                        Toasts.error(error);
                    });
                }
            });
        }

        function openDeleteGroup(event, group) {
            event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .title('Attention')
                .content('Voulez-vous vraiment supprimer ce groupe ?')
                .ariaLabel('confirm delete')
                .ok('Oui')
                .cancel('Non')
                .targetEvent(event);
            $mdDialog.show(confirm).then(function () {
                Groups.delete(group);
            });
        }

        function openCreateUser(event) {
            $mdDialog.show({
                controller: 'CreateUserCtrl as vm',
                templateUrl: 'partials/admin/create-user-modal.html',
                targetEvent: event
            }).then(function (res) {
                Users.add(res);
            });
        }

        function goToModule(module) {
            $state.go('main.modules.edit', {id: module.id});
        }

    });
