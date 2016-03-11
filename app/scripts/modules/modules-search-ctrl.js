'use strict';

angular.module('workingRoom')
    .controller('ModulesSearchCtrl', function (Module, TicketsList, $filter, $scope, $state, $timeout) {
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

        function searchTickets() {
            $scope.$parent.vm.currentFilter = vm.ticket;
            $scope.$parent.vm.filterTicketList();
            $filter('searchDate')(TicketsList, parseDate(vm.dateFrom), parseDate(vm.dateTo));
        }

        function largeSearch() {
          vm.hide = true;
          setTimeout(function(){
            $('#dateSearch1').datepicker({ dateFormat: "dd-mm-yy" });
            $('#dateSearch2').datepicker({ dateFormat: "dd-mm-yy" });
          }, 200);
        }

        function parseDate(input) {
          if(input){
            var parts = input.split('-');
            return new Date(parts[2], parts[1]-1, parts[0]);
          }
        }

    }).filter('searchDate', function($filter){
      return function(items, from, to){

       if(from == 'undifined' || to == 'undifined' ){
         return items
       }

       else if(from && to){

         var start = moment(from).startOf('day').toDate().getTime();
         var end = moment(to).endOf('day').toDate().getTime();

         var filtered = items.filter(function (item) {
            return item.created >= start && item.created <= end;
         });
           console.log(filtered);
       }
     }
});
