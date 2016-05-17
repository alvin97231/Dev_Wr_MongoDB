'use strict';

angular.module('workingRoom')
    .controller('UserCtrl', function ($mdDialog, user, admin, User, Users, GroupsList) {
        var vm = this;

        vm.deleteUser = deleteUser;
        vm.user = user;
        vm.admin = admin;

        function deleteUser(event, user) {
            event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .title('Attention')
                .content('Voulez-vous vraiment supprimer cet utilisateur ?')
                .ariaLabel('confirm delete')
                .ok('Oui')
                .cancel('Non')
                .targetEvent(event);
            $mdDialog.show(confirm).then(function () {
              console.log(user);
              if(User.type == 'admin'){Users.delete(user);}
            });
        }
    });
