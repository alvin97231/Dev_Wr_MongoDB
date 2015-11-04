'use strict';

angular.module('workingRoom')
    .factory('Modules', function ($q, Ref, $firebaseObject, $firebaseArray, Auth) {
        var ref = Ref.child('modules');
        var modulesList = {};
        var modules = null;

        Auth.$onAuth(function (user) {
            if (!user) {
                destroy();
            }
        });

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
        };
    });
