(function () {
    'use strict';
    angular.module('workingRoom')
        .factory('Auth', function ($firebaseAuth, Ref) {
            var auth = $firebaseAuth(Ref);
            var lastOnlineRef = null;
            var connectedRef = null;


            auth.saveDisconnect = function () {
                if (lastOnlineRef && connectedRef) {
                    lastOnlineRef.set(Firebase.ServerValue.TIMESTAMP);
                    connectedRef.set(false);

                    lastOnlineRef = null;
                    connectedRef = null;
                }
                auth.$unauth();
            };

            auth.$onAuth(function (authData, $scope) {
                if (authData)
                {
                  lastOnlineRef = Ref.child('users/' + authData.uid + '/lastOnline');
                  connectedRef = Ref.child('users/' + authData.uid + '/connected');

                  lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);

                  connectedRef.onDisconnect().set(false);
                  connectedRef.set(true);
                }
            });

            auth.cancelSave = function () {
                if (lastOnlineRef) lastOnlineRef.onDisconnect().cancel();
                if (connectedRef) connectedRef.onDisconnect().cancel();
            };

            return auth;
        });
})();
