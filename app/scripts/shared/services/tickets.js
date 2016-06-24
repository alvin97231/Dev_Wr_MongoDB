'use strict';

angular.module('workingRoom')
    .factory('Tickets', function ($http, $q, $log, Socket) {
        var ticketsForModule = {};
        var tickets = null;
        var vm = this;

        /*Auth.$onAuth(function (user) {
            if (!user) {
                destroy();
            }
        });*/

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
            var url = '/tickets';
            return $http.get(url).
              then(function mySucces(response) {
                return response.data;
              }, function myError(response) {
                $log.error(response.statusText);
              });
          },

          get: function (moduleId) {
            var url = '/tickets/'+moduleId;
            return $http.get(url).
              then(function mySucces(response) {
                ticketsForModule = response.data;
                return response.data;
              }, function myError(response) {
                $log.error(response.statusText);
              });
          },

          getTicket: function (moduleId, ticketId) {
            for (var i = 0; i < ticketsForModule.length; i++) {
              if (ticketsForModule[i].id == ticketId) {
                return ticketsForModule[i];
              }
            }
            /*var url = '/tickets/'+moduleId+'/'+ticketId;
            return $http.get(url).
              then(function mySucces(response) {
                console.log(response);
                return response.data;
              }, function myError(response) {
                $log.error(response.statusText);
              });*/
          },

          add: function (moduleId, ticket) {
            var url = '/tickets/'+moduleId;
            ticket.id = ticketsForModule.length+1;
            ticket.created = new Date().getTime();
            return $http.post(url, ticket).
              then(function mySucces(response) {
                return response.data;
                $log.info('Ticket crée');
              }, function myError(response) {
                $log.error(response.statusText);
              });
          },

          update: function (moduleId, ticket) {
            var url = '/tickets/' + moduleId;
            return $http.put(url, ticket).
              then(function mySucces(response) {
                $log.info('Ticket mis à jour');
              }, function myError(response) {
                $log.error(response.statusText);
              });
          },

        };

        /*
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
                    obj.id = ticketsForModule[id].length + 2;
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
        }*/
    });
