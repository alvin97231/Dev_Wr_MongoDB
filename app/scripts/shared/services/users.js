'use strict';

angular.module('workingRoom')
    .factory('Users', function (Ref, $http, $firebaseArray, $firebaseObject, $q, Toasts, Auth) {
        var vm = this;

        var ref = Ref.child('users');
        var users = null;
        var usersList = {};

        Auth.$onAuth(function (user) {
            if (!user) {
                destroy();
            }
        });

        function destroy() {
            for (var userId in usersList) {
                usersList[userId].$destroy();
                usersList[userId] = null;
            }
            if (users) {
                users.$destroy();
                users = null;
            }
        }

        return {
            all: function (user) {
                if (user.type === 'admin'|| user.type === 'user' || user.type === 'super') {
                    if (!users) {
                        users = $firebaseArray(ref);
                    }
                    return users.$loaded();
                } else {
                    return [];
                }
            },
            get: function (id) {
                if (!usersList[id]) {
                    usersList[id] = $firebaseObject(ref.child(id));
                }
                return usersList[id].$loaded();
            },
            add: function (user) {
                return $q(function (resolve, reject) {
                    Ref.createUser({
                        email: user.email,
                        password: 'workingRoom'
                    }, function (error, userData) {
                        if (error) {
                            Toasts.error(error);
                            reject(error);
                        } else {
                            var count = Ref.child('userCounter');
                            count.once("value", function(snap) {
                                vm.counter = snap.val();
                                ref.child(userData.uid).set({
                                    id: parseInt(vm.counter+1, 10),
                                    email: user.email,
                                    name: user.name,
                                    type: user.type
                                },
                                 function (err) {
                                    if (err) {
                                        Toasts.error(err);
                                        reject(err);
                                    } else {
                                        resolve(ref.child(userData.uid));
                                    }
                                });
                                Ref.child('userCounter').set(vm.counter+1);
                            });

                        }
                    });
                });
            },
            changePassword: function (obj) {
                return Auth.$changePassword(obj).then(function () {
                    Toasts.simple('Mot de passe changé');
                }, function (error) {
                    Toasts.error(error);
                });
            },
            changeEmail: function (obj, user) {
                return $q(function (resolve, reject) {
                    Auth.$changeEmail(obj).then(function () {
                        user.email = obj.newEmail;
                        user.$save().then(function () {
                            Toasts.simple('Email changé');
                            resolve();
                        }, function (error) {
                            Toasts.error(error);
                            reject();
                        });
                    }, function (error) {
                        Toasts.error(error);
                        reject();
                    });
                });
            },
            delete: function (obj, user, connectedUser) {
                var auth = user.$id === connectedUser.$id;
                return $q(function (resolve, reject) {
                    Auth.$authWithPassword(obj).then(function () {
                        user.$remove().then(function () {
                            if (auth) Auth.cancelSave();
                            Auth.$removeUser(obj).then(function () {
                                Toasts.simple('Utilisateur supprimé');
                                resolve();
                            }, function (error) {
                                Toasts.error(error);
                                reject();
                            });
                        }, function (error) {
                            Toasts.error(error);
                            reject();
                        });
                    }, function (error) {
                        Toasts.error(error);
                        reject();
                    });
                })
            }
        };
    });
