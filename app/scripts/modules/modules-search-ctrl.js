'use strict';

angular.module('workingRoom')
    .controller('ModulesSearchCtrl', function (Module, TicketsList, $filter, $scope, $state, $timeout, Socket) {
        var vm = this;

        vm.ticket = {};
        vm.moduleId = Module.$id;
        vm.module = Module;
        vm.searchTickets = searchTickets;
        vm.hide = false;
        vm.exportExcel = exportExcel;
        vm.largeSearch = largeSearch;

        searchTickets();

        vm.getSubCat = function (cat, subcats) {
            var ret = [];
            if (cat) {
                for (var i = 0, len = subcats.length; i < len; i++) {
                    if (subcats[i].name === cat) {
                        ret = subcats[i].data;
                        break;
                    }
                }
            }
            return ret;
        };

        function exportExcel(){
          return ExcellentExport.excel(this, 'table_export', 'TicketExport');
        }

        vm.back = function () {
            $scope.$parent.vm.filterAllTickets();
            $state.go('^');
        };

        Socket.on('new_ticket', function (data) {
          updateArray(TicketsList, data, 'add');
          filterTicketList();
        });
        Socket.on('update_ticket', function (data) {
          updateArray(TicketsList, data, 'update');
          filterTicketList();
        });

        function updateArray(array, newValue, type) {
          switch (type) {

            case 'add':
              array.push(newValue);
              break;

            case 'update':
              var i;
              for (i = 0; i < array.length; i++) {
                if (array[i].id === newValue.id) {
                  array[i] = newValue;
                }
              }
              break;

            case 'delete':
              var i;
              for (i = 0; i < array.length; i++) {
                if (array[i].id === newValue.id) {
                  array.splice(i,1);
                }
              }
              break;
          }
          $scope.$apply();
        }

        function searchTickets() {
          if(vm.dateFrom && vm.dateTo){

            if(vm.ticket.length > 0){
              $scope.$parent.vm.currentFilter = vm.ticket;
              $scope.$parent.vm.filterTicketList();
              var start = moment($('#dateSearch1').datepicker( "getDate" )).startOf('day').toDate().getTime();
              var end = moment($('#dateSearch2').datepicker( "getDate" )).endOf('day').toDate().getTime();
              vm.ticketsSearch = $scope.$parent.vm.tickets.filter(function (ticket) {
                  if(ticket.created >= start && ticket.created <= end){
                    return ticket;
                  }
              });
              $scope.$parent.vm.tickets = vm.ticketsSearch;
            }
            else if(!vm.ticket.length){

              var start = moment($('#dateSearch1').datepicker( "getDate" )).startOf('day').toDate().getTime();
              var end = moment($('#dateSearch2').datepicker( "getDate" )).endOf('day').toDate().getTime();
              vm.ticketsSearch = $scope.$parent.vm.tickets.filter(function (ticket) {
                  if(ticket.created >= start && ticket.created <= end){
                    return ticket;
                  }
              });
              $scope.$parent.vm.tickets = vm.ticketsSearch;
            }

          }
          else if(!vm.dateFrom || !vm.dateTo){

            $scope.$parent.vm.currentFilter = vm.ticket;
            $scope.$parent.vm.filterTicketList();
          }
        }

        function largeSearch() {
          vm.hide = true;
          setTimeout(function(){
            $('#dateSearch1').datepicker({ dateFormat: "dd-mm-yy" });
            $('#dateSearch2').datepicker({ dateFormat: "dd-mm-yy" });
          }, 200);
        }

    });
