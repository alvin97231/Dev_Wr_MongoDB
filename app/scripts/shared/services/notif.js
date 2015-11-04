angular.module('workingRoom')
    .controller('NotifCtrl', function ($scope) {
        var vm = this;

        vm.tickets = null;
        TicketsList.$loaded().then(function ()
        {
          vm.tickets = TicketsList;
          $scope.ticketsNotRead = TicketsList.filter(function (ticket)
          {
                return !ticket.lastResponse;
          });
          vm.nbTicketNotRead = ticketsNotRead.length;
         });
        vm.module = Module;
    });
