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
            vm.start = $('#date1').datepicker('getDate');
            vm.end = $('#date2').datepicker('getDate');
            var jour = vm.start.getDay();
            var mois = vm.start.getMonth();
            var annee = vm.start.getFullYear();
            vm.start= new Date(annee, mois, jour);
            vm.startTime = vm.start.getTime();
            vm.endTime = vm.end.getTime();

            function show(snap){
              vm.ticketsFiltered = snap.numChildren();
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
          }

          else{
            function show(snap){
              vm.startTime = 1438380000;
              vm.endTime = new Date().getTime();
              vm.ticketsFiltered = snap.numChildren();
              vm.test = snap.val();
              if(vm.test){
                vm.tickets = [];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  //if(child.user.group){console.log(child.user.group[0].name);}
                  vm.tickets.push(child);
                });
            }

            else if(!vm.test){
              vm.tickets = [];
            }
           }
            vm.periodQuery = vm.ticketsAll.orderByChild('created').startAt(vm.startTime).endAt(vm.endTime).on('value', show);
          }

          if(vm.openLogin.length===0 && vm.closeLogin.length===0){

            function takeStatsStatus(snap){
              vm.statsStatus=[];
              vm.sta=[];
              snap.forEach(function (childSnap){
                var child = childSnap.val();
                vm.test = vm.tickets.filter(function (ticket){return ticket.status === child.name;});
                vm.statsStatus.push(vm.test);
                vm.sta.push(child);
              });
            }

            function takeStatsData(snap){
              vm.statsData=[];
              vm.dat=[];
              snap.forEach(function (childSnap){
                var child = childSnap.val();
                vm.test = vm.tickets.filter(function (ticket){return ticket[0] === child.name;});
                vm.statsData.push(vm.test);
                vm.dat.push(child);
              });
            }

            function takeStatsCat1(snap){
              vm.statsCat=[];
              vm.cat=[];
              snap.forEach(function (childSnap){
                var child = childSnap.val();
                vm.test = vm.tickets.filter(function (ticket){return ticket[1].first === child.name;});
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
                    return ticket[5].first === child.name;
                  }
                  else if (!ticket[5].first) {
                    return ticket[5] === child.name;
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
            for(var i = 0; i<vm.statsStatus.length ; i++){
              dataStatus.push({name: vm.sta[i].name, y:vm.statsStatus[i].length});
            }

            var dataData = [];
            for(var i = 0; i<vm.statsData.length ; i++){
              dataData.push({name: vm.dat[i].name, y:vm.statsData[i].length});
            }
          }

          else if (vm.openLogin.length>0 ||vm.closeLogin.length>0 ) {
            if(vm.openLogin.length>0){
              vm.name = vm.openLogin[0].name;

              function takeStatsStatusByOpenLogin(snap){
                vm.statsStatus=[];
                vm.sta=[];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){return ticket.status === child.name && ticket.user.name===vm.name;});
                  vm.statsStatus.push(vm.test);
                  vm.sta.push(child);
                });
              }

              function takeStatsCat1ByOpenLogin(snap){
                vm.statsCat=[];
                vm.cat=[];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){return ticket[1].first === child.name && ticket.user.name===vm.name;});
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
                      return ticket[5].first === child.name && ticket.user.name===vm.name;
                    }
                    else if(!ticket[5].first){
                      return ticket[5] === child.name && ticket.user.name===vm.name;
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
                  vm.test = vm.tickets.filter(function (ticket){return ticket[0] === child.name && ticket.user.name===vm.name;});
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
              var dataData = [];
              for(var i = 0; i<vm.statsData.length ; i++){
                dataData.push({name: vm.dat[i].name, y:vm.statsData[i].length});
              }
            }

            else if(vm.closeLogin.length>0){
              vm.name = vm.closeLogin[0].name;

              function takeStatsStatusByCloseLogin(snap){
                vm.statsStatus=[];
                vm.sta=[];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){return ticket.status === child.name && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
                  vm.statsStatus.push(vm.test);
                  vm.sta.push(child);
                });
              }

              function takeStatsCat1ByCloseLogin(snap){
                vm.statsCat=[];
                vm.cat=[];
                snap.forEach(function (childSnap){
                  var child = childSnap.val();
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){return ticket[1].first === child.name && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
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
                      return ticket[5].first === child.name && ticket.messages[ticket.messages.length-1].author.name===vm.name;
                    }
                    else if (!ticket[5].first) {
                      return ticket[5] === child.name && ticket.messages[ticket.messages.length-1].author.name===vm.name;
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
                  vm.test = vm.tickets.filter(function (ticket){if(ticket.messages){return ticket[0] === child.name && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
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
              for(var i = 0; i<vm.statsData.length ; i++){
                dataData.push({name: vm.dat[i].name, y:vm.statsData[i].length});
              }
              var dataCat = [];
              for(var i = 0; i<vm.statsCat.length ; i++){
                dataCat.push({name: vm.cat[i].name, y:vm.statsCat[i].length});
              }

              var dataStatus = [];
              for(var i = 0; i<vm.statsStatus.length ; i++){
                dataStatus.push({name: vm.sta[i].name, y:vm.statsStatus[i].length});
              }

            }
          }

          vm.config1 = {
            options: {
              chart: {
              renderTo: 'container',
              type: 'column'
              },
              title: {
                  text: 'Statuts'
              },
              xAxis:{
                type: 'category'
              }
            },
            plotOptions: {
              series: {
                  dataLabels: {
                      enabled: true,
                      format: '{point.name}: {point.y:.1f}%'
                  }
                }
            },
            "credits": {
              "enabled": false
            },
            tooltip: {
                valueSuffix: '%'
            },
            series: [{
                name : 'Nombre de tickets',
                colorByPoint: true,
                data: dataStatus
            }],
          }



          vm.config2 = {
            options: {
              chart: {
                renderTo: 'container2',
                type: 'pie'
              },
              title: {
                  text: 'Catégories'
              },
              xAxis:{
                type: 'Statuts'
              }
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
          },
          plotOptions: {
                series: {
                  dataLabels: {
                      enabled: true,
                      format: '{point.name}: {point.y:.1f} %'
                  }
              }
          },
          "credits": {
            "enabled": false
          },
            series: [{
                type: 'pie',
                name : 'Nombre de tickets',
                colorByPoint: true,
                data: dataCat }],
          }

          vm.config3 = {
            options: {
              chart: {
                renderTo: 'container2',
                type: 'pie'
              },
              title: {
                  text: 'Source'
              },
              xAxis:{
                type: 'category'
              }
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
          },
          plotOptions: {
                series: {
                  dataLabels: {
                      enabled: true,
                      format: '{point.name}: {point.y:.1f} %'
                  }
              }
          },
          "credits": {
            "enabled": false
          },
            series: [{
                type: 'pie',
                name : 'Nombre de tickets',
                colorByPoint: true,
                data: dataData
            }],
          }

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

        TicketsList.$loaded().then(function () {
            vm.ticketsUser = vm.tickets.filter(function (ticket) {return ticket;});
            vm.ticketsToDeal = vm.tickets.filter(function (ticket) {return ticket.status === 'A traiter';});
            vm.ticketsDouble = vm.tickets.filter(function (ticket) {return ticket.status === 'Doublon';});
            vm.ticketsCurrent = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours';});
            vm.ticketsClimb = vm.tickets.filter(function (ticket) {return ticket.status === 'Escaladé';});
            vm.ticketsDCNo = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité sans résolution DC';});
            vm.ticketsDCYes = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité avec résolution DC';});
            vm.ticketsNoCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'Demande hors procédure CPM';});
            vm.ticketsNotRead = vm.tickets.filter(function (ticket) {return !ticket.lastResponse;});
            vm.ticketsClientNeedCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'A solder : En attente de recontact client';});
            vm.ticketsClientCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'Soldé : Recontact client effectué';});
            vm.ticketsCurrentCC = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente conseiller';});
            vm.ticketsCurrentCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente CPM';});
            vm.ticketsReminder = vm.tickets.filter(function (ticket) {return ticket.status === 'A relancer';});

        });

        function takeLate(ticket, delais){
          if (ticket.status === 'Soldé : Recontact client effectué' || 'Clos' || 'Traité avec résolution DC' || 'Traité sans résolution DC') {
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
        }

        function statusDuration(){

            function show(snap){
                if (vm.startDate && vm.endDate) {
                  vm.start = $('#date1').datepicker('getDate');
                  vm.end = $('#date2').datepicker('getDate');
                  vm.startTime = vm.start.getTime();
                  vm.endTime = vm.end.getTime();
                }
                else{
                  vm.startTime = 1438380000;
                  vm.endTime = new Date().getTime();
                }

                vm.test = snap.val();
                var i=0;
                var delais = [];

                snap.forEach(function (childSnap){
                var child = childSnap.val();

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
              //vm.allDuration =[];
        }
    $('#date1').datepicker({ dateFormat: "dd-mm-yy" });
    $('#date2').datepicker({ dateFormat: "dd-mm-yy" });
    statusDuration();
    filter();

  });
