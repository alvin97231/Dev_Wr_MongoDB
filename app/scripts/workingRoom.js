'use strict';

angular.module('workingRoom', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngMessages',
    'ngTouch',
    'ngResource',
    'ngMaterial',
    'ngLocale',
    'ui.router',
    'pascalprecht.translate',
    'angularMoment',
    'ngFileUpload',
    'angularFileUpload',
    'highcharts-ng',
    'btford.socket-io'

]).config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $compileProvider, $locationProvider, $httpProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
    $mdThemingProvider.definePalette('workingRoomPrimary', {
        "50": "#f2f2f2",
        "100": "#d9d9d9",
        "200": "#c0c0c0",
        "300": "#aaaaaa",
        "400": "#959595",
        "500": "#808080",
        "600": "#707070",
        "700": "#606060",
        "800": "#505050",
        "900": "#404040",
        "A100": "#d9d9d9",
        "A200": "#c0c0c0",
        "A400": "#959595",
        "A700": "#606060",
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50', '100', '200', 'A100', 'A200']
    });

    $mdThemingProvider.definePalette('workingRoomAccent', {
        "50": "#fcebf3",
        "100": "#f7c3dc",
        "200": "#f29bc4",
        "300": "#ee79b0",
        "400": "#e9579d",
        "500": "#e53689",
        "600": "#c82f78",
        "700": "#ac2967",
        "800": "#8f2256",
        "900": "#731b45",
        "A100": "#f7c3dc",
        "A200": "#f29bc4",
        "A400": "#e9579d",
        "A700": "#ac2967",
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50', '100', 'A100']
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('workingRoomPrimary', {
            default: '500'
        })
        .accentPalette('workingRoomAccent', {
            default: '500'
        });

    $urlRouterProvider.otherwise('/login');
    //noinspection JSUnusedGlobalSymbols
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login/login.html',
            controller: 'LoginCtrl as vm',
            params: {
                state: null,
                params: null
            }
        })
        .state('main', {
            url: '/',
            templateUrl: 'partials/main.html',
            controller: 'MainCtrl as vm',
            authenticate: true,
            resolve: {

                User: function (Users) {
                    return Users.current();
                },
                admin: function (User) {
                    return User.type === 'admin';
                },
                ModulesList: function (User, Modules) {
                    return Modules.all(User);
                },
                UsersList: function (User, Users) {
                    return Users.all();
                },
                GroupsList: function (User, Groups) {
                    return Groups.all(User);
                }
            }
        })
        .state('main.modules', {
            url: 'modules/:id',
            templateUrl: 'partials/modules/modules.html',
            controller: 'ModulesCtrl as vm',
            authenticate: true,
            resolve: {

                User: function (Users) {
                    return Users.current();
                },
                admin: function (User) {
                    return User.type === 'admin';
                },
                Module: function ($stateParams, Modules, GroupsList) {
                    return Modules.get($stateParams.id);
                },
                TicketsList: function (Tickets, $stateParams) {
                    return Tickets.get($stateParams.id);
                },
                GroupsList: function (User, Groups) {
                    return Groups.all(User);
                }
            },
        })
        .state('main.modulesAll', {
            url: 'modules/:id/all',
            templateUrl: 'partials/modules/modules-all.html',
            controller: 'ModulesCtrl as vm',
            authenticate: true,
            resolve: {
                User: function (Users) {
                    return Users.current();
                },
                admin: function (User) {
                    return User.type === 'admin';
                },
                Module: function ($stateParams, Modules) {
                    return Modules.get($stateParams.id);
                },
                TicketsList: function (Tickets, $stateParams) {
                    return Tickets.get($stateParams.id);
                },
            }
        })
        .state('main.modulesNotRead', {
            url: 'modules/:id/not-read',
            templateUrl: 'partials/modules/modules-not-read.html',
            controller: 'ModulesCtrl as vm',
            authenticate: true,
            resolve: {
                User: function (Users) {
                    return Users.current();
                },
                admin: function (User) {
                    return User.type === 'admin';
                },
                Module: function ($stateParams, Modules) {
                    return Modules.get($stateParams.id);
                },
                TicketsList: function (Tickets, $stateParams) {
                    return Tickets.get($stateParams.id);
                },
            }
        })
        .state('main.modulesCurrent', {
            url: 'modules/:id/current',
            templateUrl: 'partials/modules/modules-current.html',
            controller: 'ModulesCtrl as vm',
            authenticate: true,
            resolve: {
                User: function (Users) {
                    return Users.current();
                },
                admin: function (User) {
                    return User.type === 'admin';
                },
                Module: function ($stateParams, Modules) {
                    return Modules.get($stateParams.id);
                },
                TicketsList: function (Tickets, $stateParams) {
                    return Tickets.get($stateParams.id);
                },
            }
        })
        .state('main.modulesStats', {
            url: 'modules/:id/stats',
            templateUrl: 'partials/modules/modules-stats.html',
            controller: 'ModulesStatsCtrl as vm',
            authenticate: true,
            resolve: {
                GroupsList: function (User, Groups) {
                    return Groups.all(User);
                },
                ModulesList: function (User, Modules, GroupsList) {
                    return Modules.all(User, GroupsList);
                },
                User: function (User) {
                    return User;
                },
                user: function (User) {
                    return User.type === 'user';
                },
                admin: function (User) {
                    return User.type === 'admin';
                },
                Module: function ($stateParams, Modules) {
                    return Modules.get($stateParams.id);
                },
                TicketsList: function (Tickets, $stateParams) {
                    return Tickets.get($stateParams.id);
                }
            }
        })
        .state('main.modules.search', {
            url: '/search',
            templateUrl: 'partials/modules/modules-search.html',
            controller: 'ModulesSearchCtrl as vm',
            authenticate: true,
            resolve: {
                Module: function (Module) {
                    return Module;
                },
                User: function (User) {
                    return User;
                }
            }
        })
        .state('main.modules.edit', {
            url: '/edit',
            templateUrl: 'partials/modules/edit-modules.html',
            controller: 'EditModulesCtrl as vm',
            authenticate: true,
            resolve: {
                Module: function (Module) {
                    return Module;
                },
                admin: function (admin) {
                    return admin;
                },
                User: function (User) {
                    return User;
                },
                TicketsList: function (TicketsList) {
                    return TicketsList;
                }
            }
        })
        .state('main.users', {
            url: 'users/:id',
            templateUrl: 'partials/users/user.html',
            controller: 'UserCtrl as vm',
            authenticate: true,
            resolve: {
                User: function (Users) {
                    return Users.current();
                },
                admin: function (admin) {
                    return admin;
                },
                user: function (Users, $stateParams) {
                    return Users.get($stateParams.id);
                },
                GroupsList: function (GroupsList) {
                    return GroupsList;
                }
            }
        })
        .state('main.users.edit', {
            url: '/edit',
            templateUrl: 'partials/users/edit-user.html',
            controller: 'EditUserCtrl as vm',
            authenticate: true,
            resolve: {
                user: function (user) {
                    return user;
                },
                User: function (User) {
                    return User;
                },
                GroupsList: function (GroupsList) {
                    return GroupsList;
                }
            }
        })
        .state('main.admin', {
            url: 'admin',
            templateUrl: 'partials/admin/admin.html',
            controller: 'AdminCtrl as vm',
            authenticate: true,
            resolve: {
                admin: function (User, $q, admin) {
                    return $q(function (resolve, reject) {
                        User.type === 'admin' ? resolve(admin) : reject(admin);
                    });
                }
            }
        });


}).run(function ($rootScope, $location, $cookieStore, $http, $state, amMoment) {
    amMoment.changeLocale('fr');

    $rootScope.globals = $cookieStore.get('globals') || {};

    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !$rootScope.globals.currentUser) {
        $state.transitionTo("login");
        event.preventDefault();
      }
      //$state.go('main');
    });
});

angular.element(document).ready(function () {
    angular.bootstrap(document, ['workingRoom']);
});
