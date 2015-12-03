'use strict';

angular.module('workingRoom')
    .controller('ModulesStatsCtrl', function ($scope, $timeout, $log, $q,  Module, TicketsList, Ref, UsersList) {
        var vm = this;
        vm.users = UsersList;
        vm.tickets = TicketsList;
        vm.startDate = new Date();
        var jour = vm.startDate.getDay();
        var mois = vm.startDate.getMonth();
        var annee = vm.startDate.getFullYear();
        vm.startDate= new Date(annee, mois, jour);
        vm.endDate = new Date();
        vm.ticketsAll = Ref.child('tickets/'+Module.$id);
        vm.simulateQuery = false;
        vm.isDisabled    = false;
        vm.querySearch   = querySearch;
        vm.selectedItemChange = selectedItemChange;
        vm.searchTextChange   = searchTextChange;
        vm.filter = filter;

    function filter(){
      if (vm.startDate && vm.endDate) {
        vm.startTime = vm.startDate.getTime();
        vm.endTime = vm.endDate.getTime();
        vm.periodQuery = vm.ticketsAll.orderByChild('created').startAt(vm.startTime).endAt(vm.endTime).on('value', show);

        function show(snap){
          vm.ticketsFiltered = snap.numChildren();
          vm.test = snap.val();

          if(vm.test){
            vm.tickets = [];
            snap.forEach(function (childSnap){
              var child = childSnap.val();
              if(child){
                vm.tickets.push(child);
              }

            });

          $log.info(vm.tickets);
        }

        else if(!vm.test){
          vm.tickets = [];
        }
       }
      }

      else{
        vm.tickets = TicketsList;
      }

      if(vm.user.name){
        vm.ticketsUser = vm.tickets.filter(function (ticket) {return ticket.user.name===vm.user.name;});
        vm.ticketsToDeal = vm.tickets.filter(function (ticket) {return ticket.status === 'A traiter' && ticket.user.name===vm.user.name;});
        vm.ticketsDouble = vm.tickets.filter(function (ticket) {return ticket.status === 'Doublon' && ticket.user.name===vm.user.name;});
        vm.ticketsCurrent = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours' && ticket.user.name===vm.user.name;});
        vm.ticketsClimb = vm.tickets.filter(function (ticket) {return ticket.status === 'Escaladé' && ticket.user.name===vm.user.name;});
        vm.ticketsDCNo = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité sans résolution DC' && ticket.user.name===vm.user.name;});
        vm.ticketsDCYes = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité avec résolution DC' && ticket.user.name===vm.user.name;});
        vm.ticketsNoCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'Demande hors procédure CPM' && ticket.user.name===vm.user.name;});
        vm.ticketsNotRead = vm.tickets.filter(function (ticket) {return !ticket.lastResponse && ticket.user.name===vm.user.name;});
        vm.ticketsClientNeedCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'A solder : En attente de recontact client' && ticket.user.name===vm.user.name;});
        vm.ticketsClientCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'Soldé : Recontact client effectué' && ticket.user.name===vm.user.name;});
        vm.ticketsCurrentCC = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente conseiller' && ticket.user.name===vm.user.name;});
        vm.ticketsCurrentCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente CPM' && ticket.user.name===vm.user.name;});
        vm.ticketsReminder = vm.tickets.filter(function (ticket) {return ticket.status === 'A relancer' && ticket.user.name===vm.user.name;});
      }

      else if (vm.user.name === null) {
      vm.ticketsUser = vm.tickets.filter(function (ticket) {return ticket;});
      vm.ticketsToDeal = vm.tickets.filter(function (ticket) {return ticket.status === 'A traiter';});
      vm.ticketsDouble = vm.tickets.filter(function (ticket) {return ticket.status === 'Doublon';});
      vm.ticketsCurrent = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours';});
      vm.ticketsClimb = vm.tickets.filter(function (ticket) {return ticket.status === 'Escaladé';});
      vm.ticketsDCNo = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité sans résolution DC';});
      vm.ticketsDCYes = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité avec résolution DC';});
      vm.ticketsNoCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'Demande hors procédure CPM';});
      vm.ticketsNotRead = vm.tickets.filter(function (ticket) {return !ticket.lastResponse;});
      vm.ticketsClientNeedCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'A solder : En attente de recontact client';});
      vm.ticketsClientCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'Soldé : Recontact client effectué';});
      vm.ticketsCurrentCC = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente conseiller';});
      vm.ticketsCurrentCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente CPM';});
      vm.ticketsReminder = vm.tickets.filter(function (ticket) {return ticket.status === 'A relancer';});
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
            vm.ticketsUser = vm.tickets.filter(function (ticket) {return ticket;});
            vm.ticketsToDeal = vm.tickets.filter(function (ticket) {return ticket.status === 'A traiter';});
            vm.ticketsDouble = vm.tickets.filter(function (ticket) {return ticket.status === 'Doublon';});
            vm.ticketsCurrent = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours';});
            vm.ticketsClimb = vm.tickets.filter(function (ticket) {return ticket.status === 'Escaladé';});
            vm.ticketsDCNo = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité sans résolution DC';});
            vm.ticketsDCYes = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité avec résolution DC';});
            vm.ticketsNoCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'Demande hors procédure CPM';});
            vm.ticketsNotRead = vm.tickets.filter(function (ticket) {return !ticket.lastResponse;});
            vm.ticketsClientNeedCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'A solder : En attente de recontact client';});
            vm.ticketsClientCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'Soldé : Recontact client effectué';});
            vm.ticketsCurrentCC = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente conseiller';});
            vm.ticketsCurrentCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente CPM';});
            vm.ticketsReminder = vm.tickets.filter(function (ticket) {return ticket.status === 'A relancer';});
        });
    });
