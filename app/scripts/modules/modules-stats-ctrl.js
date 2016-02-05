//'use strict';

angular.module('workingRoom')
    .controller('ModulesStatsCtrl', function ($scope, $mdDialog, $timeout, $log, $q,  Module, TicketsList, Ref, UsersList, GroupsList) {
        var vm = this;
        vm.users = UsersList;
        vm.groups = GroupsList;
        vm.tickets = TicketsList;
        vm.ticketsAll = Ref.child('tickets/'+Module.$id);
        vm.categoriesQuery = Ref.child('modules/'+Module.$id+'/ticketField/1/data');
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


        function openStatView(event) {
            $mdDialog.show({
                controller: 'ViewTicketCtrl as vm',
                templateUrl: 'partials/modules/view-stat-modal.html',
                targetEvent: event,
            });
        }

        function transformChip(chip) {
          if (angular.isObject(chip)) {
              return chip;
          }
        }

        function encode_utf8( s )
        {
          return unescape( encodeURIComponent( s ) );
        }

        function decode_utf8( s )
        {
          return decodeURIComponent( escape( s ) );
        }

        function filter(){

          if (vm.startDate && vm.endDate) {

            var jour = vm.startDate.getDay();
            var mois = vm.startDate.getMonth();
            var annee = vm.startDate.getFullYear();
            vm.startDate= new Date(annee, mois, jour);
            vm.startTime = vm.startDate.getTime();
            vm.endTime = vm.endDate.getTime();

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
                  if(child.user.group){console.log(child.user.group[0].name);}
                  vm.tickets.push(child);
                });

              $log.info(vm.tickets);
            }

            else if(!vm.test){
              vm.tickets = [];
            }
           }
            vm.periodQuery = vm.ticketsAll.orderByChild('created').startAt(vm.startTime).endAt(vm.endTime).on('value', show);
            //vm.tickets = vm.test;
            //console.log(vm.tickets);
          }
          //console.log(vm.openLogin.length);
          if(vm.openLogin.length===0 && vm.closeLogin.length===0){
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
            vm.ticketsClos = vm.tickets.filter(function (ticket) {return ticket.status === 'Clos';});

            vm.ticketMotif = vm.tickets.filter(function (ticket) {return ticket;});
            vm.ticketsAccount = vm.tickets.filter(function (ticket) {return ticket[1].first === "Compte Membre";});
            vm.ticketsCertif = vm.tickets.filter(function (ticket) {return ticket[1].first === "Demande de certificat d'authenticité";});
            vm.ticketsNotice = vm.tickets.filter(function (ticket) {return ticket[1].first === "Demande de notice d'utilisation";});
            vm.ticketsChange = vm.tickets.filter(function (ticket) {return ticket[1].first === "Echange/Envoi de produit";});
            vm.ticketsBack = vm.tickets.filter(function (ticket) {return ticket[1].first === "Remboursement retours incomplets";});
            vm.ticketsPresse = vm.tickets.filter(function (ticket) {return ticket[1].first === "Vente presse";});
            vm.ticketsCoupons = vm.tickets.filter(function (ticket) {return ticket[1].first === "Ventes coupons";});
            vm.ticketsSAV = vm.tickets.filter(function (ticket) {return ticket[1].first === "Procédure SAV";});
            vm.ticketsProduit = vm.tickets.filter(function (ticket) {return ticket[1].first === "Informations produits";});

            vm.ticketSale = vm.tickets.filter(function (ticket) {return ticket;});
            vm.ticketsBeforeSale = vm.tickets.filter(function (ticket) {return ticket[0] === "Avant vente";});
            vm.ticketsAfterSale = vm.tickets.filter(function (ticket) {return ticket[0] === "Après vente";});
          }

          else if (vm.openLogin.length>0 ||vm.closeLogin.length>0 ) {
            if(vm.openLogin.length>0){
              vm.name = vm.openLogin[0].name;
              vm.ticketsUser = vm.tickets.filter(function (ticket) {return ticket.user.name===vm.name;});
              vm.ticketsToDeal = vm.tickets.filter(function (ticket) {return ticket.status === 'A traiter' && ticket.user.name===vm.name;});
              vm.ticketsDouble = vm.tickets.filter(function (ticket) {return ticket.status === 'Doublon' && ticket.user.name===vm.name;});
              vm.ticketsCurrent = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours' && ticket.user.name===vm.name;});
              vm.ticketsClimb = vm.tickets.filter(function (ticket) {return ticket.status === 'Escaladé' && ticket.user.name===vm.name;});
              vm.ticketsDCNo = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité sans résolution DC' && ticket.user.name===vm.name;});
              vm.ticketsDCYes = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité avec résolution DC' && ticket.user.name===vm.name;});
              vm.ticketsNoCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'Demande hors procédure CPM' && ticket.user.name===vm.name;});
              vm.ticketsNotRead = vm.tickets.filter(function (ticket) {return !ticket.lastResponse && ticket.user.name===vm.name;});
              vm.ticketsClientNeedCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'A solder : En attente de recontact client' && ticket.user.name===vm.name;});
              vm.ticketsClientCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'Soldé : Recontact client effectué' && ticket.user.name===vm.name;});
              vm.ticketsCurrentCC = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente conseiller' && ticket.user.name===vm.name;});
              vm.ticketsCurrentCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente CPM' && ticket.user.name===vm.name;});
              vm.ticketsReminder = vm.tickets.filter(function (ticket) {return ticket.status === 'A relancer' && ticket.user.name===vm.name;});
              vm.ticketsClos = vm.tickets.filter(function (ticket) {return ticket.status === 'Clos' && ticket.user.name===vm.name;});

              vm.ticketMotif = vm.tickets.filter(function (ticket) {return ticket[1].first && ticket.user.name===vm.name;});
              vm.ticketsAccount = vm.tickets.filter(function (ticket) {return ticket[1].first === "Compte Membre" && ticket.user.name===vm.name;});
              vm.ticketsCertif = vm.tickets.filter(function (ticket) {return ticket[1].first === "Demande de certificat d'authenticité" && ticket.user.name===vm.name;});
              vm.ticketsNotice = vm.tickets.filter(function (ticket) {return ticket[1].first === "Demande de notice d'utilisation" && ticket.user.name===vm.name;});
              vm.ticketsChange = vm.tickets.filter(function (ticket) {return ticket[1].first === "Echange/Envoi de produit" && ticket.user.name===vm.name;});
              vm.ticketsBack = vm.tickets.filter(function (ticket) {return ticket[1].first === "Remboursement retours incomplets" && ticket.user.name===vm.name;});
              vm.ticketsPresse = vm.tickets.filter(function (ticket) {return ticket[1].first === "Vente presse" && ticket.user.name===vm.name;});
              vm.ticketsCoupons = vm.tickets.filter(function (ticket) {return ticket[1].first === "Ventes coupons" && ticket.user.name===vm.name;});
              vm.ticketsSAV = vm.tickets.filter(function (ticket) {return ticket[1].first === "Procédure SAV" && ticket.user.name===vm.name;});
              vm.ticketsProduit = vm.tickets.filter(function (ticket) {return ticket[1].first === "Informations produits" && ticket.user.name===vm.name;});

              vm.ticketsBeforeSale = vm.tickets.filter(function (ticket) {return ticket[0] === "Avant vente" && ticket.user.name===vm.name;});
              vm.ticketsAfterSale = vm.tickets.filter(function (ticket) {return ticket[0] === "Après vente" && ticket.user.name===vm.name;});

            }
            else if(vm.closeLogin.length>0){
              vm.name = vm.closeLogin[0].name;

              vm.ticketsUser = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsToDeal = vm.tickets.filter(function (ticket) {if(ticket.messages){return ticket.status === 'A traiter' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsDouble = vm.tickets.filter(function (ticket) {if(ticket.messages){return ticket.status === 'Doublon' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsCurrent = vm.tickets.filter(function (ticket) {if(ticket.messages){return ticket.status === 'En cours' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsClimb = vm.tickets.filter(function (ticket) {if(ticket.messages){return ticket.status === 'Escaladé' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsDCNo = vm.tickets.filter(function (ticket) {if(ticket.messages){return ticket.status === 'Traité sans résolution DC' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsDCYes = vm.tickets.filter(function (ticket) {if(ticket.messages){return ticket.status === 'Traité avec résolution DC' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsNoCPM = vm.tickets.filter(function (ticket) {if(ticket.messages){return ticket.status === 'Demande hors procédure CPM' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsNotRead = vm.tickets.filter(function (ticket) {if(ticket.messages){return !ticket.lastResponse && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsClientNeedCtc = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket.status === 'A solder : En attente de recontact client' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsClientCtc = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket.status === 'Soldé : Recontact client effectué' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsCurrentCC = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket.status === 'En cours : Attente conseiller' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsCurrentCPM = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket.status === 'En cours : Attente CPM' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsReminder = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket.status === 'A relancer' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsClos = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket.status === 'Clos' && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});

              vm.ticketMotif = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket[1].first &&  ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsAccount = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket[1].first === "Compte Membre" && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsCertif = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket[1].first === "Demande de certificat d'authenticité" && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsNotice = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket[1].first === "Demande de notice d'utilisation" && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsChange = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket[1].first === "Echange/Envoi de produit" &&  ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsBack = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket[1].first === "Remboursement retours incomplets" && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsPresse = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket[1].first === "Vente presse" && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsCoupons = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket[1].first === "Ventes coupons" && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsSAV = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket[1].first === "Procédure SAV" && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});
              vm.ticketsProduit = vm.tickets.filter(function (ticket) {if(ticket.messages) {return ticket[1].first === "Informations produits" && ticket.messages[ticket.messages.length-1].author.name===vm.name;}});

              vm.ticketsBeforeSale = vm.tickets.filter(function (ticket) {return ticket[0] === "Avant vente" && ticket.messages[ticket.messages.length-1].author.name===vm.name;});
              vm.ticketsAfterSale = vm.tickets.filter(function (ticket) {return ticket[0] === "Après vente" && ticket.messages[ticket.messages.length-1].author.name===vm.name;});

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
                data: [
                  {name:"A traiter",y:vm.ticketsToDeal.length},
                  {name:"Doublon",y:vm.ticketsDouble.length},
                  {name:"En cours",y:vm.ticketsCurrent.length},
                  {name:"Escaladé",y:vm.ticketsClimb.length},
                  {name:"Traité sans résolution DC",y:vm.ticketsDCNo.length},
                  {name:"Traité avec résolution DC",y:vm.ticketsDCYes.length},
                  {name:"Demande hors procédure CPM",y:vm.ticketsNoCPM.length},
                  {name:"A solder : En attente de recontact client",y:vm.ticketsClientNeedCtc.length},
                  {name:"Soldé : Recontact client effectué",y:vm.ticketsClientCtc.length},
                  {name:"En cours : Attente conseiller",y:vm.ticketsCurrentCC.length},
                  {name:"En cours : Attente CPM",y:vm.ticketsCurrentCPM.length},
                  {name:"A relancer",y:vm.ticketsReminder.length},
                  {name:"Clos",y:vm.ticketsClos.length}]
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
                data: [
                  {name:"Compte Membre",y:vm.ticketsAccount.length, drilldown :"Compte Membre"},
                  {name:"Demande de certificat d'authenticité",y:vm.ticketsCertif.length, drilldown :"Demande de certificat d'authenticité"},
                  {name:"Demande de notice d'utilisation",y:vm.ticketsNotice.length, drilldown :"Demande de notice d'utilisation"},
                  {name:"Echange/Envoi de produit",y:vm.ticketsChange.length, drilldown :"Echange/Envoi de produit"},
                  {name:"Remboursement retours incomplets",y:vm.ticketsBack.length, drilldown :"Remboursement retours incomplets"},
                  {name:"Vente presse",y:vm.ticketsPresse.length, drilldown :"Vente presse"},
                  {name:"Ventes coupons",y:vm.ticketsCoupons.length, drilldown :"Ventes coupons"},
                  {name:"Procédure SAV",y:vm.ticketsSAV.length, drilldown :"Procédure SAV"},
                  {name:"Informations produits",y:vm.ticketsProduit.length, drilldown :"Informations produits"}]
            }],
          }

          vm.config3 = {
            options: {
              chart: {
                renderTo: 'container2',
                type: 'pie'
              },
              title: {
                  text: 'Avant/Après Vente'
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
                data: [
                  {name:"Avant vente",y:vm.ticketsBeforeSale.length, drilldown :"Compte Membre"},
                  {name:"Après vente",y:vm.ticketsAfterSale.length, drilldown :"Demande de certificat d'authenticité"}]
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
                  vm.startTime = vm.startDate.getTime();
                  vm.endTime = vm.endDate.getTime();
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


    statusDuration();
    filter();

  });
