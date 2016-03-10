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
        $('#dateSearch1').datepicker({ dateFormat: "dd-mm-yy" });
        $('#dateSearch2').datepicker({ dateFormat: "dd-mm-yy" });
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
          return ExcellentExport.excel(this, 'table_0', 'TicketExport');
        }

        vm.back = function () {
            $scope.$parent.vm.filterAllTickets();
            $state.go('^');
        };

        function searchTickets() {
            $scope.$parent.vm.currentFilter = vm.ticket;
            $scope.$parent.vm.filterTicketList();
        }

    }).filter('searchDate', function($filter){
     return function(items){
       var startDate = $('#date1').datepicker('getDate');
       var endDate = $('#date2').datepicker('getDate');
       if(!startDate && !endDate)
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
