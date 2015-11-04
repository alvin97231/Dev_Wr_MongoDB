'use strict';

angular.module('workingRoom')
    .controller('UserCtrl', function ($mdDialog, user, admin, User, Users, GroupsList) {
        var vm = this;

        vm.deleteUser = deleteUser;
        vm.user = user;
        vm.admin = admin;

        function deleteUser(event) {
            $mdDialog.show({
                controller: 'DeleteUserCtrl as vm',
                templateUrl: 'partials/users/delete-user-modal.html',
                targetEvent: event,
                resolve: {
                    email: function() {
                        return user.email;
                    }
                }
            }).then(function (res) {
                Users.delete(res, user, User);
            });
        }
    });
