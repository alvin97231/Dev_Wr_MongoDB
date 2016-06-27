'use strict';

angular.module('workingRoom')
    .factory('Socket', function (socketFactory) {
      return socketFactory();
    });
