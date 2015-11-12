'use strict';

angular.module('workingRoom')
    .controller('ModulesStatsCtrl', function ($scope, $timeout, $log, $q,  Module, TicketsList, Ref, UsersList) {
        var vm = this;
        vm.users = UsersList;
        vm.tickets = null;
        vm.startDate = new Date();
        vm.endDate = new Date();
        vm.ticketsAll = Ref.child('tickets/'+Module.$id);
        vm.simulateQuery = false;
        vm.isDisabled    = false;
        vm.querySearch   = querySearch;
        vm.selectedItemChange = selectedItemChange;
        vm.searchTextChange   = searchTextChange;
        vm.filter = filter;

    function filter(){

      $log.info(vm.startDate);
      $log.info(vm.endDate);
      $log.info(vm.ticketsAll);
      vm.startTime = vm.startDate.getTime();
      vm.endTime = vm.endDate.getTime();
      $log.info(vm.startTime);
      $log.info(vm.endTime);
      vm.periodQuery = vm.ticketsAll.startAt(vm.startTime).endAt(vm.endTime).once('value', show);
      function show(snap){
        $('pre').text(JSON.stringify(snap.val(),null, 2));
      }
    }


    function querySearch (query) {
      var results = query ? vm.users.filter( createFilterFor(query) ) : vm.users,
          deferred;
      if (vm.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(user) {
        var name = user.name.toLowerCase();
        return (name.indexOf(lowercaseQuery) === 0);
      };

    }

        TicketsList.$loaded().then(function () {
            vm.tickets = TicketsList;
            vm.ticketsToDeal = TicketsList.filter(function (ticket) {
                return ticket.status === 'A traiter';
            });
            vm.ticketsDouble = TicketsList.filter(function (ticket) {
                return ticket.status === 'Doublon';
            });
            vm.ticketsCurrent = TicketsList.filter(function (ticket) {
                return ticket.status === 'En cours';
            });
            vm.ticketsClimb = TicketsList.filter(function (ticket) {
                return ticket.status === 'Escaladé';
            });
            vm.ticketsDCNo = TicketsList.filter(function (ticket) {
                return ticket.status === 'Traité sans résolution DC';
            });
            vm.ticketsDCYes = TicketsList.filter(function (ticket) {
                return ticket.status === 'Traité avec résolution DC';
            });
            vm.ticketsNoCPM = TicketsList.filter(function (ticket) {
                return ticket.status === 'Demande hors procédure CPM';
            });
            vm.ticketsNotRead = TicketsList.filter(function (ticket) {
                return !ticket.lastResponse;
            });
            vm.ticketsClientNeedCtc = TicketsList.filter(function (ticket) {
                return ticket.status === 'A solder : En attente de recontact client';
            });
            vm.ticketsClientCtc = TicketsList.filter(function (ticket) {
                return ticket.status === 'Soldé : Recontact client effectué';
            });
            vm.ticketsCurrentCC = TicketsList.filter(function (ticket) {
                return ticket.status === 'En cours : Attente conseiller';
            });
            vm.ticketsCurrentCPM = TicketsList.filter(function (ticket) {
                return ticket.status === 'En cours : Attente CPM';
            });
            vm.ticketsReminder = TicketsList.filter(function (ticket) {
                return ticket.status === 'A relancer';
            });
        });
        //vm.module = Module;
    });
