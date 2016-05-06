'use strict';

angular.module('workingRoom')
    .factory('Modules', function ($q, $http,$log) {

      var modulesList = {};
      var modules = null;

      return {

        all: function () {
          var url = '/modules';
          return $http.get(url).
            then(function mySucces(response) {
              return response.data;
            }, function myError(response) {
              $log.error(response.statusText);
            });
        },

        get: function (id) {
          var url = '/modules';
          return $http.get(url).
            then(function mySucces(response) {
              for (var i = 0; i < response.data.length; i++) {
                if(response.data[i].id == id){
                  return response.data[i];
                }
              }
            }, function myError(response) {
              $log.error(response.statusText);
            });
        },

        add: function (module) {
          var url = '/modules';
          return $http.post(url, module).
            then(function mySucces(response) {
              $log.info('Nouveau groupe ajouté');
            }, function myError(response) {
              $log.error(response.statusText);
            });
        },

        update: function (module) {
          var url = '/modules' + module.id;
          return $http.put(url, user).
            then(function mySucces(response) {
              $log.info('Module modifié');
            }, function myError(response) {
              $log.error(response.statusText);
            });
        },

        delete: function(id) {
          var url = '/modules' + id;
          return $http.delete(url).
            then(function mySucces(response) {
              $log.info('Module supprimé');
            }, function myError(response) {
              $log.error(response.statusText);
            });
        }

      };
/*
        function destroy() {
            for (var moduleId in modulesList) {
                modulesList[moduleId].$destroy();
                modulesList[moduleId] = null;
            }
            if (modules) {
                modules.$destroy();
                modules = null;
            }
        }

        return {
            all: function (user, groupsList) {
                if (user.type === 'admin' || user.type === 'user' || user.type === 'super') {
                    if (!modules) {
                        modules = $firebaseArray(ref);
                    }
                    return modules.$loaded();
                } else {
                    var dfds = [];
                    groupsList.forEach(function (g) {
                        g.modules.forEach(function (m) {
                            if (!modulesList[m.id]) {
                                modulesList[m.id] = $firebaseObject(ref.child(m.id));
                                modulesList[m.id].$rights = m.rights;
                                dfds.push(modulesList[m.id].$loaded());
                            } else if (modulesList[m.id].$rights !== m.rights) {
                                switch (m.rights) {
                                    case 'c':
                                        if (modulesList[m.id].$rights === 'r') {
                                            modulesList[m.id].$rights = 'b';
                                        }
                                        break;
                                    case 'r':
                                        if (modulesList[m.id].$rights === 'c') {
                                            modulesList[m.id].$rights = 'b';
                                        }
                                        break;
                                    case 'a':
                                        modulesList[m.id].$rights = 'a';
                                        break;
                                }
                            }
                        });
                    });
                    return $q.all(dfds);
                }
            },
            get: function (id) {
                if (!modulesList[id]) {
                    modulesList[id] = $firebaseObject(ref.child(id));
                }
                return modulesList[id].$loaded();
            },
            add: function (obj) {
                if (modules) return modules.$add(obj);
            },
            save: function (obj) {
                if (modules) return modules.save(obj);
            },
            delete: function (item) {
                if (modules) return modules.$remove(item);
            }
        };*/
    });
