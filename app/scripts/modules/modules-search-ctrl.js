'use strict';

angular.module('workingRoom')
    .controller('ModulesSearchCtrl', function (Module, TicketsList, $filter, $scope, $state) {
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
        }

        function largeSearch() {
          vm.hide = true;
          setTimeout(function(){
            $('#dateSearch1').datepicker({ dateFormat: "dd-mm-yy" });
            $('#dateSearch2').datepicker({ dateFormat: "dd-mm-yy" });
          }, 200);
        }

        vm.searchDate= function(items){
          var startDateT = $('#dateSearch1').datepicker('getDate');
          var endDateT = $('#dateSearch2').datepicker('getDate');
          console.log(startDateT);
          if(!startDateT || !endDateT)
          return items

          if(startDateT && endDateT){
            var start = startDateT.getTime();
            var end = endDateT.getTime();
            for (var i=0; i<items.length; i++){
              console.log(items[i].created >= start && item[i].created <= end);
            }
          }
        }

    }).filter('searchDate', function($filter){
     return function(items, start, end){
       var startDate = $('#dateSearch1').datepicker('getDate');
       var endDate = $('#dateSearch2').datepicker('getDate');
       if(!startDate || !endDate)
       return items

       if(startDate && endDate){
         var start = startDate.getTime();
         var end = endDate.getTime();
         return items.filter(function (item) {
           return item.created >= start && item.created <= end;
         });
       }
     }
});
