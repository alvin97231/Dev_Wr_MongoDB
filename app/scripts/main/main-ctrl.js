'use strict';

angular.module('workingRoom')
    .controller('MainCtrl', function ($rootScope, $state, $mdSidenav, $translate, amMoment, Auth, User, ModulesList, Modules) {
        var vm = this;

        vm.unauth = Auth.saveDisconnect;
        vm.currentState = $state.current.name;
        vm.toggleSidenav = toogleSidenav;
        vm.modules = ModulesList;
        vm.user = User;
        vm.showModulesGrid = true;
        vm.selectedLocale = 'fr';
        vm.changeLocale = changeLocale;
        vm.getLocale = getLocale;

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
                case 'main.modules.search':
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
            $translate.use(vm.selectedLocale);
            amMoment.changeLocale(vm.selectedLocale);
            lang = vm.selectedLocale;
        }

        function getLocale(){
          var L = document.getElementById('id');
          var lang = L.options[L.selectedIndex].text;
          return lang;
        }
    });
