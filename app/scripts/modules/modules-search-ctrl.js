'use strict';

angular.module('workingRoom')
    .controller('ModulesSearchCtrl', function (Module, TicketsList, $filter, $scope, $state) {
        var vm = this;

        vm.ticket = {};
        vm.moduleId = Module.$id;
        vm.module = Module;
        vm.searchTickets = searchTickets;
        vm.hide = true;
        vm.exportExcel = exportExcel;
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
    });
