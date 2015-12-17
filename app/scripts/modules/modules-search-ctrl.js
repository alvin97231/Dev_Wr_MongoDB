'use strict';

angular.module('workingRoom')
    .controller('ModulesSearchCtrl', function (Module, TicketsList, $filter, $scope, $state) {
        var vm = this;

        vm.ticket = {};
        vm.moduleId = Module.$id;
        vm.module = Module;
        vm.searchTickets = searchTickets;
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

        vm.exportExcel = (function ()
                            {
                                var uri = 'data:application/vnd.ms-excel;base64,',
                                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table><table>{table}</table></body></html>',
                                base64 = function (s)
                              {
                                  return window.btoa(unescape(encodeURIComponent(s)))
                              }
                                , format = function (s, c)
                                {
                                  return s.replace(/{(\w+)}/g, function (m, p)
                                  {
                                    return c[p];
                                  })
                                }

                                return function (table, name)
                                {
                                  if (!table.nodeType) table = document.getElementById('table_id')
                                  var ctx =
                                  {
                                    worksheet: name || 'Worksheet',
                                    table: table.innerHTML
                                  }

                                  window.location.href = uri + base64(format(template, ctx))
                                }
                              })();

        vm.back = function () {
            $scope.$parent.vm.filterAllTickets();
            $state.go('^');
        };

        function searchTickets() {
            $scope.$parent.vm.currentFilter = vm.ticket;
            $scope.$parent.vm.filterTicketList();
        }
    });
