'use strict';

angular.module('workingRoom')
    .controller('LoginCtrl', function (Auth, $state, $stateParams, $mdDialog, Toasts) {
        var vm = this;

        if (Auth.$getAuth()) {
            goLastLocation();
        }

        vm.passwordReset = passwordReset;
        vm.passwordLogin = passwordLogin;
        vm.testValues = testValues;

        function goLastLocation()
        {
            //if ($stateParams.state)
            //{
                //$state.go($stateParams.state, $stateParams.params);
            //}
            //else
            //{
                $state.go('main');
            //}
        }

        function passwordLogin()
        {
          if(!vm.email && !vm.password){
            console.log('bitch');

            vm.email = $('#email').val();
            vm.password = $('#password').val();
          }
          Auth.$authWithPassword({email: vm.email,password: vm.password,rememberMe: true}).then(function ()
          {
            goLastLocation();
          }, function (error)
          {
                Toasts.error(error);
          });
        }

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
          console.log($('#email').val());
          console.log($('#password').val());
          console.log(loginForm);
        }

    });
