'use strict';

angular.module('workingRoom')
    .controller('ModulesStatsCtrl', function ($scope, $mdDialog, $timeout, $stateParams, $log, $q,  Module, TicketsList, UsersList, GroupsList, Socket) {
        var vm = this;
        vm.users = UsersList;
        vm.groups = GroupsList;
        vm.tickets = TicketsList;
        vm.simulateQuery = false;
        vm.isDisabled    = false;
        vm.querySearchName   = querySearchName;
        vm.querySearchGroup   = querySearchGroup;
        vm.selectedItemChange = selectedItemChange;
        vm.searchTextChange   = searchTextChange;
        vm.filter = filter;
        vm.takeLate= takeLate;
        vm.statusDuration= statusDuration;
        vm.cancel = $mdDialog.hide;
        vm.transformChip = transformChip;
        vm.closeLogin = [];
        vm.openLogin = [];
        vm.activeQS = activeQS;
        vm.QSCpm = false;
        vm.exportExcel = exportExcel;

        function filterTicketList() {
             $timeout(function () {
                vm.tickets = $filter('filter')(TicketsList, vm.currentFilter);
            });
        }

        Socket.on('new_user', function (data) {
          updateArray(vm.users, data, 'add');
        });
        Socket.on('update_user', function (data) {
          updateArray(vm.users, data, 'update');
        });
        Socket.on('delete_user', function (data) {
          updateArray(vm.users, data, 'delete');
        });

        Socket.on('new_group', function (data) {
          updateArray(vm.groups, data, 'add');
        });
        Socket.on('update_group', function (data) {
          updateArray(vm.groups, data, 'update');
        });
        Socket.on('delete_group', function (data) {
          updateArray(vm.groups, data, 'delete');
        });

        Socket.on('new_module', function (data) {
          updateArray(vm.modules, data, 'add');
        });
        Socket.on('update_module', function (data) {
          updateArray(vm.modules, data, 'update');
        });
        Socket.on('delete_module', function (data) {
          updateArray(vm.modules, data, 'delete');
        });

        Socket.on('new_ticket', function (data) {
          updateArray(vm.tickets, data, 'add');
          filterTicketList();
        });
        Socket.on('update_ticket', function (data) {
          updateArray(vm.tickets, data, 'update');
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

        function exportExcel(id){
          return ExcellentExport.excel(this, id, 'TicketExport');
        }

        function activeQS(){
          if(Module.name === 'CPM'){
            if(vm.QSCpm){
              vm.QSCpm = false;
            }
            else if (!vm.QSCpm) {
              vm.QSCpm = true;
            }
          }
          else{
            alert("Vous n'êtes pas sur le module CPM");
          }
        }

        function transformChip(chip) {
          if (angular.isObject(chip)) {
              return chip;
          }
        }

        function filter(){
          vm.categoriesQuery1 = Module.ticketFields[1].data;
          vm.categoriesQuery2 = Module.ticketFields[5].data;
          vm.dataQuery = Module.ticketFields[0].data;
          vm.statusQuery = Module.status;

          if (vm.startDate && vm.endDate) {
            vm.startTime = moment($('#date1').datepicker( "getDate" )).startOf('day').toDate().getTime();
            vm.endTime = moment($('#date2').datepicker( "getDate" )).startOf('day').toDate().getTime();
          }
          else if (!vm.startDate || !vm.endDate) {
            vm.startTime = 1438380000;
            vm.endTime = new Date().getTime();
          }

          vm.tickets = TicketsList.filter(function (ticket) {
              if(ticket.created >= vm.startTime && ticket.created <= vm.endTime){
                return ticket;
              }
          });

          if(vm.openLogin.length===0 && vm.closeLogin.length===0){
            vm.ticketEi =[];
            for (var i = 0; i < vm.tickets.length; i++) {
              if(vm.tickets[i].messages){
                for (var j = 0; j < vm.tickets[i].messages.length; j++) {
                  if (vm.tickets[i].messages[j].ei && vm.tickets[i].lang == moment.locale()) {
                    if (vm.ticketEi.indexOf(vm.tickets[i]) === -1) {
                      vm.ticketEi.push(vm.tickets[i]);
                      console.log(vm.ticketEi);
                    }
                  }
                }
              }
            }

            function takeStatsStatus(status){
              vm.statsStatus=[];
              vm.sta=[];
              status.forEach(function (statut){
                vm.test = vm.tickets.filter(function (ticket){return ticket.status === statut.name && ticket.lang == moment.locale();});
                vm.statsStatus.push(vm.test);
                vm.sta.push(statut);
              });

              vm.oldiestTicketToDeal = vm.statsStatus[0][0];
              if (vm.oldiestTicketToDeal) {
                vm.QSDaysToDeal = (new Date().getTime() - vm.oldiestTicketToDeal.created)/86400000;
                vm.QSHoursToDeal = (Math.round(vm.QSDaysToDeal))*24;
              }

              vm.dateTableToDeal=[]
              for (var i = 0; i < vm.statsStatus[0].length; i++) {
                var dateToDeal = moment(vm.statsStatus[0][i].created).format("DD-MM-YYYY");
                if(vm.dateTableToDeal.indexOf(dateToDeal) === -1){
                  vm.dateTableToDeal.push(dateToDeal);
                }
              }

              vm.countTicketTableToDeal=[]
              for (var i = 0; i < vm.dateTableToDeal.length; i++) {
                vm.qsTicketsToDeal = vm.statsStatus[0].filter(function (ticket){return moment(ticket.created).format("DD-MM-YYYY") === vm.dateTableToDeal[i];});
                vm.countTicketTableToDeal.push({date:vm.dateTableToDeal[i], count:vm.qsTicketsToDeal.length});
              }

              vm.oldiestTicketClimb = vm.statsStatus[2][0];
              if(vm.oldiestTicketClimb){
                vm.QSDaysClimb = (new Date().getTime() - vm.oldiestTicketClimb.created)/86400000;
                vm.QSHoursClimb = (Math.round(vm.QSDaysClimb))*24;
              }

              vm.dateTableClimb=[]
              if(vm.dateTableClimb){
                for (var i = 0; i < vm.statsStatus[2].length; i++) {
                  var dateToDeal = moment(vm.statsStatus[6][i].created).format("DD-MM-YYYY");
                  if(vm.dateTableClimb.indexOf(dateToDeal) === -1){
                    vm.dateTableClimb.push(dateToDeal);
                  }
                }
              }

              vm.countTicketTableClimb=[]
              if(vm.countTicketTableClimb){
                for (var i = 0; i < vm.dateTableClimb.length; i++) {
                  vm.qsTicketsClimb = vm.statsStatus[2].filter(function (ticket){return moment(ticket.created).format("DD-MM-YYYY") === vm.dateTableClimb[i];});
                  vm.countTicketTableClimb.push({date:vm.dateTableClimb[i], count:vm.qsTicketsClimb.length});
                }
              }

            }

            function takeStatsData(datas){
              vm.statsData=[];
              vm.dat=[];
              datas.forEach(function (data){
                vm.test = vm.tickets.filter(function (ticket){return ticket[0] === data.name && ticket.lang == moment.locale();});
                vm.statsData.push(vm.test);
                vm.dat.push(data);
              });
            }

            function takeStatsCat1(cats){
              vm.statsCat=[];
              vm.cat=[];
              cats.forEach(function (cat){
                vm.test = vm.tickets.filter(function (ticket){return ticket[1].first === cat.name && ticket.lang == moment.locale();});
                vm.statsCat.push(vm.test);
                vm.cat.push(cat);
              });

            }

            function takeStatsCat2(cats){
              vm.statsCat=[];
              vm.cat=[];
              cats.forEach(function (cat){
                vm.test = vm.tickets.filter(function (ticket){
                  if(ticket[5].first){
                    return ticket[5].first === cat.name && ticket.lang == moment.locale();
                  }
                  else if (!ticket[5].first) {
                    return ticket[5] === cat.name && ticket.lang == moment.locale();
                  }
                });
                vm.statsCat.push(vm.test);
                vm.cat.push(cat);
              });
            }

            takeStatsStatus(vm.statusQuery);
            takeStatsData(vm.dataQuery);
            if(Module.name === 'CPM'){takeStatsCat1(vm.categoriesQuery1);}
            else{takeStatsCat2(vm.categoriesQuery2);}

            var dataCat = [];
            for(var i = 0; i<vm.statsCat.length ; i++){
              dataCat.push({name: vm.cat[i].name, y:vm.statsCat[i].length});
            }

            var dataStatus = [];
            var sommeStatus = 0;
            for(var i = 0; i<vm.statsStatus.length ; i++){
              dataStatus.push({name: vm.sta[i].name, y:vm.statsStatus[i].length});
            }

            if(dataStatus[3]){
              dataStatus[3].y = vm.ticketEi.length;
            }

            for(var i = 0; i<dataStatus.length ; i++){
              sommeStatus += dataStatus[i].y;
            }

            var dataData = [];
            var somme = 0;
            for(var i = 0; i<vm.statsData.length ; i++){
              dataData.push({name: vm.dat[i].name, y:vm.statsData[i].length});
            }
            for(var i = 0; i<dataData.length; i++){
              somme += dataData[i].y;
            }
            vm.ticketsFiltered = somme;
          }

          else if (vm.openLogin.length>0 ||vm.closeLogin.length>0 ) {
            if(vm.openLogin.length>0){
              vm.name = vm.openLogin[0].name;

              vm.ticketEi =[];
              for (var i = 0; i < vm.tickets.length; i++) {
                if(vm.tickets[i].messages){
                  for (var j = 0; j < vm.tickets[i].messages.length; j++) {
                    if (vm.tickets[i].messages[j].ei && vm.tickets[i].user.name===vm.name && vm.tickets[i].lang == moment.locale()) {
                      if (vm.ticketEi.indexOf(vm.tickets[i]) === -1) {
                        vm.ticketEi.push(vm.tickets[i]);
                      }
                    }
                  }
                }
              }

              function takeStatsStatusByOpenLogin(status){
                vm.statsStatus=[];
                vm.sta=[];
                status.forEach(function (statut){
                  vm.test = vm.tickets.filter(function (ticket){return ticket.status === statut.name && ticket.user.name===vm.name && ticket.lang == moment.locale();});
                  vm.statsStatus.push(vm.test);
                  vm.sta.push(statut);
                });
              }

              function takeStatsCat1ByOpenLogin(cats){
                vm.statsCat=[];
                vm.cat=[];
                cats.forEach(function (cat){
                  vm.test = vm.tickets.filter(function (ticket){return ticket[1].first === cat.name && ticket.user.name===vm.name && ticket.lang == moment.locale();});
                  vm.statsCat.push(vm.test);
                  vm.cat.push(cat);
                });

              }

              function takeStatsCat2ByOpenLogin(cats){
                vm.statsCat=[];
                vm.cat=[];
                cats.forEach(function (cat){
                  vm.test = vm.tickets.filter(function (ticket){
                    if(ticket[5].first){
                      return ticket[5].first === cat.name && ticket.user.name===vm.name && ticket.lang == moment.locale();
                    }
                    else if(!ticket[5].first){
                      return ticket[5] === cat.name && ticket.user.name===vm.name && ticket.lang == moment.locale();
                    }
                  });
                  vm.statsCat.push(vm.test);
                  vm.cat.push(cat);
                });
              }

              function takeStatsDataByOpenLogin(datas){
                vm.statsData=[];
                vm.dat=[];
                datas.forEach(function (data){
                  vm.test = vm.tickets.filter(function (ticket){return ticket[0] === data.name && ticket.user.name===vm.name && ticket.lang == moment.locale();});
                  vm.statsData.push(vm.test);
                  vm.dat.push(data);
                });
              }

              takeStatsDataByOpenLogin(vm.dataQuery);

              takeStatsStatusByOpenLogin(vm.statusQuery);
              if(Module.name === 'CPM'){
                takeStatsCat1ByOpenLogin(vm.categoriesQuery1);
              }
              else{
                takeStatsCat2ByOpenLogin(vm.categoriesQuery2);
              }
              var dataCat = [];
              for(var i = 0; i<vm.statsCat.length ; i++){
                dataCat.push({name: vm.cat[i].name, y:vm.statsCat[i].length});
              }
              var dataStatus = [];
              for(var i = 0; i<vm.statsStatus.length ; i++){
                dataStatus.push({name: vm.sta[i].name, y:vm.statsStatus[i].length});
              }
              dataStatus[3].y = vm.ticketEi.length;
              var sommeStatus = 0;
              for(var i = 0; i<dataStatus.length ; i++){
                sommeStatus += dataStatus[i].y;
              }

              var dataData = [];
              var somme = 0;
              for(var i = 0; i<vm.statsData.length ; i++){
                dataData.push({name: vm.dat[i].name, y:vm.statsData[i].length});
              }
              for(var i = 0; i<dataData.length; i++){
                somme += dataData[i].y;
              }
              vm.ticketsFiltered = somme;
            }

            else if(vm.closeLogin.length>0){
              vm.name = vm.closeLogin[0].name;

              function takeStatsStatusByCloseLogin(status){
                vm.statsStatus=[];
                vm.sta=[];
                status.forEach(function (statut){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){return ticket.status === statut.name && ticket.messages[ticket.messages.length-1].author.name===vm.name && ticket.lang == moment.locale();}});
                  vm.statsStatus.push(vm.test);
                  vm.sta.push(statut);
                });
              }

              function takeStatsCat1ByCloseLogin(cats){
                vm.statsCat=[];
                vm.cat=[];
                cats.forEach(function (cat){
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){return ticket[1].first === cat.name && ticket.messages[ticket.messages.length-1].author.name===vm.name && ticket.lang == moment.locale();}});
                  vm.statsCat.push(vm.test);
                  vm.cat.push(cat);
                });

              }

              function takeStatsCat2ByCloseLogin(cats){
                vm.statsCat=[];
                vm.cat=[];

                cats.forEach(function (cat){
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){
                    if(ticket[5].first){
                      return ticket[5].first === cat.name && ticket.messages[ticket.messages.length-1].author.name===vm.name && ticket.lang == moment.locale();
                    }
                    else if (!ticket[5].first) {
                      return ticket[5] === cat.name && ticket.messages[ticket.messages.length-1].author.name===vm.name && ticket.lang == moment.locale();
                    }
                  }
                  });
                  vm.statsCat.push(vm.test);
                  vm.cat.push(cat);
                });
              }

              function takeStatsDataByCloseLogin(datas){
                vm.statsData=[];
                vm.dat=[];
                datas.forEach(function (data){
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){return ticket[0] === data.name && ticket.messages[ticket.messages.length-1].author.name===vm.name && ticket.lang == moment.locale();}});
                  vm.statsData.push(vm.test);
                  vm.dat.push(data);
                });
              }

              takeStatsDataByCloseLogin(vm.dataQuery);

              takeStatsStatusByCloseLogin(vm.statusQuery);
              if(Module.name === 'CPM'){
                takeStatsCat1ByCloseLogin(vm.categoriesQuery1);
              }
              else{
                takeStatsCat2ByCloseLogin(vm.categoriesQuery2);
              }
              var dataData = [];
              var somme = 0 ;
              for(var i = 0; i<vm.statsData.length ; i++){
                dataData.push({name: vm.dat[i].name, y:vm.statsData[i].length});
              }
              for(var i = 0; i<dataData.length; i++){
                somme += dataData[i].y;
              }
              vm.ticketsFiltered = somme;

              var dataCat = [];
              for(var i = 0; i<vm.statsCat.length ; i++){
                dataCat.push({name: vm.cat[i].name, y:vm.statsCat[i].length});
              }

              var dataStatus = [];
              for(var i = 0; i<vm.statsStatus.length ; i++){
                dataStatus.push({name: vm.sta[i].name, y:vm.statsStatus[i].length});
              }
              var sommeStatus = 0;
              for(var i = 0; i<dataStatus.length ; i++){
                sommeStatus += dataStatus[i].y;
              }
            }
          }
          Highcharts.chart('container1', {
            chart: {
                      type: 'column'
                  },
                  title: {
                      text: 'Statuts'
                  },
                  xAxis:{
                    type: 'category'
                  },
                  tooltip: {
                      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> Tickets<br/>'
                  },
                  plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                var pcnt = (this.y / sommeStatus) * 100;
                                return Highcharts.numberFormat(pcnt) + '%';
                            }
                        }
                    }
                  },
                  "credits": {
                    "enabled": false
                  },
                  series: [{
                      name: 'Tickets par Statuts',
                      colorByPoint: true,
                      data: dataStatus
                  }]
          });

          Highcharts.chart('container2', {
            chart: {
                      plotBackgroundColor: null,
                      plotBorderWidth: null,
                      plotShadow: false,
                      type: 'pie'
                  },
                  title: {
                      text: 'Catégories'
                  },
                  xAxis:{
                    type: 'Statuts'
                  },
                  tooltip: {
                      pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} Tickets)'
                  },
                  plotOptions: {
                      pie: {
                          allowPointSelect: true,
                          cursor: 'pointer',
                          dataLabels: {
                              enabled: false
                          },
                          showInLegend: true
                      }
                  },
                  "credits": {
                    "enabled": false
                  },
                  series: [{
                      name: 'Pourcentage',
                      colorByPoint: true,
                      data:dataCat
                  }]
              });

          Highcharts.chart('container3', {
            chart: {
                      plotBackgroundColor: null,
                      plotBorderWidth: null,
                      plotShadow: false,
                      type: 'pie'
                  },
                  title: {
                      text: 'Source'
                  },
                  xAxis:{
                    type: 'Type'
                  },
                  tooltip: {
                      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y} Tickets)'
                  },
                  plotOptions: {
                      pie: {
                          allowPointSelect: true,
                          cursor: 'pointer',
                          dataLabels: {
                              enabled: false
                          },
                          showInLegend: true
                      }
                  },
                  "credits": {
                    "enabled": false
                  },
                  series: [{
                      name: 'Pourcentage',
                      colorByPoint: true,
                      data:dataData
                  }]
              });
              statusDuration();
        }


        function querySearchName (query) {
          var results = query ? vm.users.filter( createFilterForName(query, name) ) : vm.users,
              deferred;
          if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
          } else {
            return results;
          }
        }

        function querySearchGroup (query) {
          var results = query ? vm.groups.filter( createFilterForGroup(query) ) : vm.groups,
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
          console.log('Text changed to ' + text);
        }

        function selectedItemChange(item) {
          console.log('Item changed to ' + JSON.stringify(item));
        }

        function createFilterForName(query, type) {
          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(type) {
            var name = type.name.toLowerCase();
            return (name.indexOf(lowercaseQuery) === 0);
          };
        }

          function createFilterForGroup(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(group) {
              var group = group.name.toLowerCase();
              return (group.indexOf(lowercaseQuery) === 0);
            };
          }

        function takeLate(ticket, delais){
          if(ticket.messages.length === 1){
            var id = 0;
          }
          else{
            var id = ticket.messages.length - 1;
          }
          vm.closeName = ticket.messages[id].author.name;

          if(vm.openLogin.length>0 && vm.closeName === vm.openLogin[0].name){
            var dateStatusChange = ticket.messages[id].date;
            vm.done = dateStatusChange - ticket.created;
            vm.diffDisp = vm.done/3600000;
            delais.push(vm.diffDisp);
            tableAvg(delais);
          }
          else if(vm.openLogin.length==0){
            if(ticket.messages.length === 1){
              var id = 0;
            }
            else{
              var id = ticket.messages.length - 1;
            }

            var dateStatusChange = ticket.messages[id].date;
            vm.done = dateStatusChange - ticket.created;
            vm.diffDisp = vm.done/3600000;
            delais.push(vm.diffDisp);
            tableAvg(delais);
          }
        }

        function statusDuration(){

          if (vm.startDate && vm.endDate) {
            vm.startTime = moment($('#date1').datepicker( "getDate" )).startOf('day').toDate().getTime();
            vm.endTime = moment($('#date2').datepicker( "getDate" )).startOf('day').toDate().getTime();
          }
          else{
            vm.startTime = 1438380000;
            vm.endTime = new Date().getTime();
          }

          vm.tickets = TicketsList.filter(function (ticket) {
              if(ticket.created >= vm.startTime && ticket.created <= vm.endTime){
                return ticket;
              }
          });
                var i=0;
                var delais = [];

                vm.tickets.forEach(function (ticket){

                if(ticket.lang == moment.locale()){
                  switch(ticket.status){

                    case 'Clos':
                      vm.takeLate(ticket,delais);
                    break;

                    case 'Soldé : Recontact client effectué':
                      vm.takeLate(ticket,delais);
                    break;

                    case 'Traité avec résolution DC':
                      vm.takeLate(ticket,delais);
                    break;

                    case 'Traité sans résolution DC':
                      vm.takeLate(ticket, delais);
                    break;

                    case 'Résolu avec solution satisfaisante':
                      vm.takeLate(ticket, delais);
                    break;

                    case 'Résolu sans solution satisfaisante':
                      vm.takeLate(ticket, delais);
                    break;
                  }
                }
                else{
                  console.log("Ticket N° "+ticket.id+" N/A");
                }
                });
              }

        function tableAvg(tableau){
            var somme = 0 ;
              for(var i=0; i<tableau.length; i++){
                somme += tableau[i];
              }
              vm.avg = somme/tableau.length;
              vm.avg = Math.round(vm.avg);
        }
    $('#date1').datepicker({ dateFormat: "dd-mm-yy" });
    $('#date2').datepicker({ dateFormat: "dd-mm-yy" });

    filter();
  });
