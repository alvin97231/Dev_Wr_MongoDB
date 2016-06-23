'use strict';

angular.module('workingRoom')
    .controller('MainCtrl', function ($rootScope,$scope, $state, $mdSidenav, $translate,$location, amMoment, User, ModulesList, Modules, $http, Toasts, Socket, Authentication) {
        var vm = this;

        vm.logout = logout;
        vm.currentState = $state.current.name;
        vm.toggleSidenav = toogleSidenav;
        vm.modules = ModulesList;
        vm.user = User;
        vm.showModulesGrid = true;
        $scope.selectedLocale = 'fr';
        vm.changeLocale = changeLocale;

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
                if (array[i].id === newValue.id) {
                  array.splice(i,1);
                }
              }
              break;
          }
          $scope.$apply();
        }

        updateState();
        checkModulesState($state.params);

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
            closeSidenav();
            vm.currentState = toState.name;

            updateState();
            checkModulesState(toParams);
        });

        function toogleSidenav() {
            $mdSidenav('left').toggle();
        }

        function closeSidenav() {
            $mdSidenav('left').close();
        }

        function checkModulesState(params) {
            vm.modulesState = {};
            if (vm.currentState === 'main.modules') vm.modulesState[params.id] = true;
        }

        function updateState() {
            switch (vm.currentState) {
                case 'main':
                    vm.toolbarTitle = 'Modules';
                    break;
                case 'main.modules':
                case 'main.modules.edit':
                    vm.toolbarTitle = 'Module';
                    break;
                case 'main.modulesAll.search':
                    vm.toolbarTitle = 'Recherche';
                    break;
                case 'main.admin':
                    vm.toolbarTitle = 'Administration';
                    break;
                case 'main.users':
                case 'main.edit':
                    vm.toolbarTitle = 'Profil';
                    break;
                default:
                    vm.toolbarTitle = 'WorkingRoom';
            }
        }

        function changeLocale() {
            $translate.use($scope.selectedLocale);
            amMoment.changeLocale($scope.selectedLocale);
        }

        function logout(){
          $http.get('/logout')
          .success(function(){
            Authentication.clearCredentials();
            $rootScope.message = 'Logout successful!';
            Toasts.simple($rootScope.message);
            $location.url('/login');
          })
          .error(function(){
            $rootScope.message = 'Logout failed.';
            Toasts.simple($rootScope.message);
            $location.url('/');
          });
        }

    });
