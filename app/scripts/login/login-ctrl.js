'use strict';

angular.module('workingRoom')
    .controller('LoginCtrl', function ($rootScope, $state, $stateParams,$location, $mdDialog, Toasts, $http, Authentication) {
        var vm = this;
        vm.passwordReset = passwordReset;
        vm.testValues = testValues;
        vm.login = login;


        function goLastLocation()
        {
            if ($stateParams.state)
            {
                //$state.go($stateParams.state, $stateParams.params);
            }
            else
            {
                $state.go('main');
            }
        }

        function login() {
            vm.dataLoading = true;
            Authentication.login(vm.email, vm.password, function (response) {
                console.log(response);
                if (response) {
                  $rootScope.message = 'Authentication successful!';
                  Toasts.simple($rootScope.message);
                  Authentication.setCredentials(response, vm.email, vm.password);
                  $location.path('/');
                }
                else {
                  $rootScope.message = 'Authentication Failed!';
                  Toasts.simple($rootScope.message);
                  $log.error(response.message);
                  vm.dataLoading = false;
                }
            });
        };

        function passwordReset(event) {
            $mdDialog.show({
                controller: 'resetPasswordCtrl as vm',
                templateUrl: 'partials/login/reset-password-modal.html',
                targetEvent: event
            }).then(function (email) {
                Authentication.resetPassword({
                    email: email
                }).then(function () {
                    Toasts.simple('Email de récupération envoyé');
                }, function (error) {
                    Toasts.error(error);
                });
            });
        }

        
        function testValues(){
          loginForm.$invalid=true;
        }

    });
