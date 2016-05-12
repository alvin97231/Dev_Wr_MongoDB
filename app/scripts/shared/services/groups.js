'use strict';

angular.module('workingRoom')
    .factory('Groups', function ($q, $http) {

        var groups = null;
        var groupsList = {};

        return {

          all: function () {
            var url = '/groups';
            return $http.get(url).
              then(function mySucces(response) {
                return response.data;
              }, function myError(response) {
                $log.error(response.statusText);
              });
          },

          get: function (id) {
            var url = '/groups/'+ id;
            return $http.get(url).
              then(function mySucces(response) {
                return response.data;
              }, function myError(response) {
                $log.error(response.statusText);
              });
          },

          add: function (group) {
            var url = '/groups';
            return $http.post(url, group).
              then(function mySucces(response) {
                $log.info('Nouveau groupe ajouté');
              }, function myError(response) {
                $log.error(response.statusText);
              });
          },

          update: function (group) {
            var url = '/groups/' + group.id;
            return $http.put(url, group).
              then(function mySucces(response) {
                $log.info('Groupe modifié');
              }, function myError(response) {
                $log.error(response.statusText);
              });
          },

          delete: function(group) {
            var url = '/groups/' + group.id;
            return $http.delete(url).
              then(function mySucces(response) {
                $log.info('Groupe supprimé');
              }, function myError(response) {
                $log.error(response.statusText);
              });
          }

        };
        /*function destroy() {
            for (var groupId in groupsList) {
                groupsList[groupId].$destroy();
                groupsList[groupId] = null;
            }
            if (groups) {
                groups.$destroy();
                groups = null;
            }
        }

        return {
            all: function (user) {
                if (user.type === 'admin' || user.type === 'user' || user.type === 'super') {
                    if (!groups) groups = $firebaseArray(ref);
                    return groups.$loaded();
                } else {
                    var dfds = [];
                    user.groups.forEach(function (g) {
                        if (!groupsList[g.id]) {
                            groupsList[g.id] = $firebaseObject(ref.child(g.id));
                            dfds.push(groupsList[g.id].$loaded());
                        }
                    });
                    return $q.all(dfds);
                }
            },
            get: function (id) {
                if (!groupsList[id]) {
                    groupsList[id] = $firebaseObject(ref.child(id));
                }
                return groupsList[id].$loaded();
            },
            add: function (group) {
                return groups.$add(group);
            },
            save: function (group) {
                return groups.$save(group);
            },
            delete: function (item) {
                return groups.$remove(item);
            }
        }*/
    });
