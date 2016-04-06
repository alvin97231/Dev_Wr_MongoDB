//'use strict';

angular.module('workingRoom')
    .controller('ModulesStatsCtrl', function ($scope, $mdDialog, $timeout, $stateParams, $log, $q,  Module, TicketsList, Ref, UsersList, GroupsList) {
        var vm = this;
        vm.users = UsersList;
        vm.groups = GroupsList;
        vm.tickets = TicketsList;
        vm.ticketsAll = Ref.child('tickets/'+Module.$id);
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

        function exportExcel(id){
          return ExcellentExport.excel(this, id, 'TicketExport');
        }

        function activeQS(){
          if(Module.name === 'CPM'){
            vm.QSCpm = true;
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
          vm.categoriesQuery1 = Ref.child('modules').child(Module.$id).child('ticketFields').child(1).child('data');
          vm.categoriesQuery2 = Ref.child('modules').child(Module.$id).child('ticketFields').child(5).child('data');
          vm.dataQuery = Ref.child('modules').child(Module.$id).child('ticketFields').child(0).child('data');
          vm.statusQuery = Ref.child('modules').child(Module.$id).child('status');

          if (vm.startDate && vm.endDate) {
            vm.startTime = moment($('#date1').datepicker( "getDate" )).startOf('day').toDate().getTime();
            vm.endTime = moment($('#date2').datepicker( "getDate" )).startOf('day').toDate().getTime();
          }
          else if (!vm.startDate || !vm.endDate) {
            vm.startTime = 1438380000;
            vm.endTime = new Date().getTime();
          }
            function show(snap){
              vm.test = snap.val();

              if(vm.test){
                vm.tickets = [];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.tickets.push(child);
                });
              }
            else if(!vm.test){
              vm.tickets = [];
            }
           }
          vm.periodQuery = vm.ticketsAll.orderByChild('created').startAt(vm.startTime).endAt(vm.endTime).on('value', show);

          if(vm.openLogin.length===0 && vm.closeLogin.length===0){

            function takeStatsStatus(snap){
              vm.statsStatus=[];
              vm.sta=[];
              snap.forEach(function (childSnap){
                var child = childSnap.val();
                vm.test = vm.tickets.filter(function (ticket){return ticket.status === child.name && ticket.lang == moment.locale();});
                vm.statsStatus.push(vm.test);
                vm.sta.push(child);
              });

              vm.oldiestTicketToDeal = vm.statsStatus[0][0];
              vm.QSDaysToDeal = (new Date().getTime() - vm.oldiestTicketToDeal.created)/86400000;
              vm.QSHoursToDeal = (Math.round(vm.QSDaysToDeal))*24;

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

              vm.oldiestTicketClimb = vm.statsStatus[6][0];
              vm.QSDaysClimb = (new Date().getTime() - vm.oldiestTicketClimb.created)/86400000;
              vm.QSHoursClimb = (Math.round(vm.QSDaysClimb))*24;

              vm.dateTableClimb=[]
              for (var i = 0; i < vm.statsStatus[6].length; i++) {
                var dateToDeal = moment(vm.statsStatus[6][i].created).format("DD-MM-YYYY");
                if(vm.dateTableClimb.indexOf(dateToDeal) === -1){
                  vm.dateTableClimb.push(dateToDeal);
                }
              }

              vm.countTicketTableClimb=[]
              for (var i = 0; i < vm.dateTableClimb.length; i++) {
                vm.qsTicketsClimb = vm.statsStatus[6].filter(function (ticket){return moment(ticket.created).format("DD-MM-YYYY") === vm.dateTableClimb[i];});
                vm.countTicketTableClimb.push({date:vm.dateTableClimb[i], count:vm.qsTicketsClimb.length});
              }
            }

            function takeStatsData(snap){
              vm.statsData=[];
              vm.dat=[];
              snap.forEach(function (childSnap){
                var child = childSnap.val();
                vm.test = vm.tickets.filter(function (ticket){return ticket[0] === child.name && ticket.lang == moment.locale();});
                vm.statsData.push(vm.test);
                vm.dat.push(child);
              });
            }

            function takeStatsCat1(snap){
              vm.statsCat=[];
              vm.cat=[];
              snap.forEach(function (childSnap){
                var child = childSnap.val();
                vm.test = vm.tickets.filter(function (ticket){return ticket[1].first === child.name && ticket.lang == moment.locale();});
                vm.statsCat.push(vm.test);
                vm.cat.push(child);
              });

            }

            function takeStatsCat2(snap){
              vm.statsCat=[];
              vm.cat=[];
              snap.forEach(function (childSnap){
                var child = childSnap.val();
                vm.test = vm.tickets.filter(function (ticket){
                  if(ticket[5].first){
                    return ticket[5].first === child.name && ticket.lang == moment.locale();
                  }
                  else if (!ticket[5].first) {
                    return ticket[5] === child.name && ticket.lang == moment.locale();
                  }
                });
                vm.statsCat.push(vm.test);
                vm.cat.push(child);
              });
            }

            vm.statusQuery.once('value',takeStatsStatus);
            vm.dataQuery.once('value', takeStatsData);
            if(Module.name === 'CPM'){vm.categoriesQuery1.once('value', takeStatsCat1);}
            else{vm.categoriesQuery2.once('value', takeStatsCat2);}

            var dataCat = [];
            for(var i = 0; i<vm.statsCat.length ; i++){
              dataCat.push({name: vm.cat[i].name, y:vm.statsCat[i].length});
            }

            var dataStatus = [];
            var sommeStatus = 0;
            for(var i = 0; i<vm.statsStatus.length ; i++){
              dataStatus.push({name: vm.sta[i].name, y:vm.statsStatus[i].length});
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

              function takeStatsStatusByOpenLogin(snap){
                vm.statsStatus=[];
                vm.sta=[];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){return ticket.status === child.name && ticket.user.name===vm.name && ticket.lang == moment.locale();});
                  vm.statsStatus.push(vm.test);
                  vm.sta.push(child);
                });
              }

              function takeStatsCat1ByOpenLogin(snap){
                vm.statsCat=[];
                vm.cat=[];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){return ticket[1].first === child.name && ticket.user.name===vm.name && ticket.lang == moment.locale();});
                  vm.statsCat.push(vm.test);
                  vm.cat.push(child);
                });

              }

              function takeStatsCat2ByOpenLogin(snap){
                vm.statsCat=[];
                vm.cat=[];

                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){
                    if(ticket[5].first){
                      return ticket[5].first === child.name && ticket.user.name===vm.name && ticket.lang == moment.locale();
                    }
                    else if(!ticket[5].first){
                      return ticket[5] === child.name && ticket.user.name===vm.name && ticket.lang == moment.locale();
                    }
                  });
                  vm.statsCat.push(vm.test);
                  vm.cat.push(child);
                });
              }

              function takeStatsDataByOpenLogin(snap){
                vm.statsData=[];
                vm.dat=[];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){return ticket[0] === child.name && ticket.user.name===vm.name && ticket.lang == moment.locale();});
                  vm.statsData.push(vm.test);
                  vm.dat.push(child);
                });
              }

              vm.dataQuery.once('value', takeStatsDataByOpenLogin);

              vm.statusQuery.once('value',takeStatsStatusByOpenLogin);
              if(Module.name === 'CPM'){
                vm.categoriesQuery1.once('value', takeStatsCat1ByOpenLogin);
              }
              else{
                vm.categoriesQuery2.once('value', takeStatsCat2ByOpenLogin);
              }
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

              function takeStatsStatusByCloseLogin(snap){
                vm.statsStatus=[];
                vm.sta=[];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){return ticket.status === child.name && ticket.messages[ticket.messages.length-1].author.name===vm.name && ticket.lang == moment.locale();}});
                  vm.statsStatus.push(vm.test);
                  vm.sta.push(child);
                });
              }

              function takeStatsCat1ByCloseLogin(snap){
                vm.statsCat=[];
                vm.cat=[];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){return ticket[1].first === child.name && ticket.messages[ticket.messages.length-1].author.name===vm.name && ticket.lang == moment.locale();}});
                  vm.statsCat.push(vm.test);
                  vm.cat.push(child);
                });

              }

              function takeStatsCat2ByCloseLogin(snap){
                vm.statsCat=[];
                vm.cat=[];

                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){
                    if(ticket[5].first){
                      return ticket[5].first === child.name && ticket.messages[ticket.messages.length-1].author.name===vm.name && ticket.lang == moment.locale();
                    }
                    else if (!ticket[5].first) {
                      return ticket[5] === child.name && ticket.messages[ticket.messages.length-1].author.name===vm.name && ticket.lang == moment.locale();
                    }
                  }
                  });
                  vm.statsCat.push(vm.test);
                  vm.cat.push(child);
                });
              }

              function takeStatsDataByCloseLogin(snap){
                vm.statsData=[];
                vm.dat=[];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){return ticket[0] === child.name && ticket.messages[ticket.messages.length-1].author.name===vm.name && ticket.lang == moment.locale();}});
                  vm.statsData.push(vm.test);
                  vm.dat.push(child);
                });
              }

              vm.dataQuery.once('value', takeStatsDataByCloseLogin);

              vm.statusQuery.once('value',takeStatsStatusByCloseLogin);
              if(Module.name === 'CPM'){
                vm.categoriesQuery1.once('value', takeStatsCat1ByCloseLogin);
              }
              else{
                vm.categoriesQuery2.once('value', takeStatsCat2ByCloseLogin);
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

            function show(snap){
                vm.test = snap.val();
                var i=0;
                var delais = [];

                snap.forEach(function (childSnap){
                var child = childSnap.val();

                if(child.lang == moment.locale()){
                  switch(child.status){

                    case 'Clos':
                      vm.takeLate(child,delais);
                    break;

                    case 'Soldé : Recontact client effectué':
                      vm.takeLate(child,delais);
                    break;

                    case 'Traité avec résolution DC':
                      vm.takeLate(child,delais);
                    break;

                    case 'Traité sans résolution DC':
                      vm.takeLate(child, delais);
                    break;

                    case 'Résolu avec solution satisfaisante':
                      vm.takeLate(child, delais);
                    break;

                    case 'Résolu sans solution satisfaisante':
                      vm.takeLate(child, delais);
                    break;
                  }
                }
                else{
                  console.log("Ticket N° "+child.id+" N/A");
                }
                });
              }
            vm.ticketsAll.orderByChild('created').startAt(vm.startTime).endAt(vm.endTime).on('value', show);
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
    //vm.avg = 0;
    filter();
  });
