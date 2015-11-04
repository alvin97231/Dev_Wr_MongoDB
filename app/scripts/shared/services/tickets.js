'use strict';

angular.module('workingRoom')
    .factory('Tickets', function (Ref, $firebaseObject, $firebaseArray, $q, Auth) {
        var ref = Ref.child('tickets');
        var ticketsForModule = {};
        var tickets = null;
        var vm = this;

        Auth.$onAuth(function (user) {
            if (!user) {
                destroy();
            }
        });

        function destroy() {
            for (var moduleId in ticketsForModule) {
                ticketsForModule[moduleId].$destroy();
                ticketsForModule[moduleId] = null;
            }
            if (tickets) {
                tickets.$destroy();
                tickets = null;
            }
        }

        return {
            all: function () {
                if (!tickets) {
                    tickets = $firebaseArray(ref);
                }
                return tickets;
            },
            get: function (id) {
                if (!ticketsForModule[id]) {
                    ticketsForModule[id] = $firebaseArray(ref.child(id));
                }
                return ticketsForModule[id];
            },
            getTicket: function (moduleId, ticketId) {
                return $q(function (resolve, reject) {
                    if (ticketsForModule[moduleId]) {
                        resolve(ticketsForModule[moduleId].$getRecord(ticketId));
                    } else {
                        reject();
                    }
                });
            },
            add: function (id, obj) {
                if (ticketsForModule[id]) {
                    obj.id = ticketsForModule[id].length + 1;
                    obj.created = new Date().getTime();
                    return ticketsForModule[id].$add(obj);
                } else {
                    return $q(function (resolve, reject) { reject(); });
                }
            },
            save: function (moduleId, obj) {
                if (ticketsForModule[moduleId]) {
                    ticketsForModule[moduleId].$save(obj);
                }
            },
            delete: function (moduleId) {
                ref.child(moduleId).remove();
            }
        }
    });
