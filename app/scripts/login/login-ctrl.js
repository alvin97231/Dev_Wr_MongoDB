'use strict';

angular.module('workingRoom')
    .controller('LoginCtrl', function (Auth,$rootScope, $state, $stateParams, $mdDialog, Toasts, UsersList, $http) {
        var vm = this;

        if (Auth.$getAuth()) {
            goLastLocation();
        }
        console.log(UsersList.data);
        vm.passwordReset = passwordReset;
        vm.testValues = testValues;


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

        vm.login = function(){
          $http.post('/login', {
            username: vm.email,
            password: vm.password,
          })
          .success(function(user){
            // No error: authentication OK
            $rootScope.message = 'Authentication successful!';
            console.log($rootScope.message);
            $state.go('main');
          })
          .error(function(){
            // Error: authentication failed
            $rootScope.message = 'Authentication failed.';
            Toasts.simple($rootScope.message);
            $state.go('login');
          });
        };

        function passwordReset(event) {
            $mdDialog.show({
                controller: 'resetPasswordCtrl as vm',
                templateUrl: 'partials/login/reset-password-modal.html',
                targetEvent: event
            }).then(function (email) {
                Auth.$resetPassword({
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
