'use strict';

angular.module('workingRoom')
  .factory('Ref', function (Firebase, FBURL) {
    return new Firebase(FBURL);
  });
