'use strict';

angular.module('workingRoom')
    .controller('ModulesStatsCtrl', function ($scope, Module, TicketsList) {
        var vm = this;

        $scope.startDate = new Date();
        console.log($scope.startDate);
        $scope.endDate = new Date();
        vm.tickets = null;
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

            vm.periodFilter = function ()
            {
              var startDate = moment($scope.startDate);
              var endDate = moment($scope.endDate);
              var period = moment('2015-08-18').isBetween(startDate,endDate);

              if(period === true)
              {
                vm.periodFilter === true;
              }
            };
        });
        vm.module = Module;
    });
