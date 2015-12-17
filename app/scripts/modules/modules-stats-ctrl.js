'use strict';

angular.module('workingRoom')
    .controller('ModulesStatsCtrl', function ($scope, $mdDialog, $timeout, $log, $q,  Module, TicketsList, Ref, UsersList) {
        var vm = this;
        vm.users = UsersList;
        vm.tickets = TicketsList;
        vm.startDate = new Date();
        var jour = vm.startDate.getDay();
        var mois = vm.startDate.getMonth();
        var annee = vm.startDate.getFullYear();
        vm.startDate= new Date(annee, mois, jour);
        vm.endDate = new Date();
        vm.ticketsAll = Ref.child('tickets/'+Module.$id);
        vm.categoriesQuery = Ref.child('modules/'+Module.$id+'/ticketField/1/data');
        vm.simulateQuery = false;
        vm.isDisabled    = false;
        vm.querySearchName   = querySearchName;
        vm.selectedItemChange = selectedItemChange;
        vm.searchTextChange   = searchTextChange;
        vm.filter = filter;
        vm.firstChart = false;
        vm.cancel = $mdDialog.hide;

        function openStatView(event) {
            $mdDialog.show({
                controller: 'ViewTicketCtrl as vm',
                templateUrl: 'partials/modules/view-stat-modal.html',
                targetEvent: event,
            });
        }

    function filter(){
      if (vm.startDate && vm.endDate) {
        vm.startTime = vm.startDate.getTime();
        vm.endTime = vm.endDate.getTime();
        vm.periodQuery = vm.ticketsAll.orderByChild('created').startAt(vm.startTime).endAt(vm.endTime).on('value', show);

        function show(snap){
          vm.ticketsFiltered = snap.numChildren();
          vm.test = snap.val();

          if(vm.test){
            vm.tickets = [];
            snap.forEach(function (childSnap){
              var child = childSnap.val();
              vm.tickets.push(child);
            });

          $log.info(vm.tickets);
        }

        else if(!vm.test){
          vm.tickets = [];
        }
       }
      }

      else{
        vm.tickets = TicketsList;
      }

      if(vm.user.name){
        vm.ticketsUser = vm.tickets.filter(function (ticket) {return ticket.user.name===vm.user.name;});
        vm.ticketsToDeal = vm.tickets.filter(function (ticket) {return ticket.status === 'A traiter' && ticket.user.name===vm.user.name;});
        vm.ticketsDouble = vm.tickets.filter(function (ticket) {return ticket.status === 'Doublon' && ticket.user.name===vm.user.name;});
        vm.ticketsCurrent = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours' && ticket.user.name===vm.user.name;});
        vm.ticketsClimb = vm.tickets.filter(function (ticket) {return ticket.status === 'Escaladé' && ticket.user.name===vm.user.name;});
        vm.ticketsDCNo = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité sans résolution DC' && ticket.user.name===vm.user.name;});
        vm.ticketsDCYes = vm.tickets.filter(function (ticket) {return ticket.status === 'Traité avec résolution DC' && ticket.user.name===vm.user.name;});
        vm.ticketsNoCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'Demande hors procédure CPM' && ticket.user.name===vm.user.name;});
        vm.ticketsNotRead = vm.tickets.filter(function (ticket) {return !ticket.lastResponse && ticket.user.name===vm.user.name;});
        vm.ticketsClientNeedCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'A solder : En attente de recontact client' && ticket.user.name===vm.user.name;});
        vm.ticketsClientCtc = vm.tickets.filter(function (ticket) {return ticket.status === 'Soldé : Recontact client effectué' && ticket.user.name===vm.user.name;});
        vm.ticketsCurrentCC = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente conseiller' && ticket.user.name===vm.user.name;});
        vm.ticketsCurrentCPM = vm.tickets.filter(function (ticket) {return ticket.status === 'En cours : Attente CPM' && ticket.user.name===vm.user.name;});
        vm.ticketsReminder = vm.tickets.filter(function (ticket) {return ticket.status === 'A relancer' && ticket.user.name===vm.user.name;});
        vm.ticketsClos = vm.tickets.filter(function (ticket) {return ticket.status === 'Clos' && ticket.user.name===vm.user.name;});

        vm.ticketMotif = vm.tickets.filter(function (ticket) {return ticket[1].first;});
        vm.ticketsAccount = vm.tickets.filter(function (ticket) {return ticket[1].first === "Compte Membre";});
        vm.ticketsCertif = vm.tickets.filter(function (ticket) {return ticket[1].first === "Demande de certificat d'authenticité";});
        vm.ticketsNotice = vm.tickets.filter(function (ticket) {return ticket[1].first === "Demande de notice d'utilisation";});
        vm.ticketsChange = vm.tickets.filter(function (ticket) {return ticket[1].first === "Echange/Envoi de produit";});
        vm.ticketsBack = vm.tickets.filter(function (ticket) {return ticket[1].first === "Remboursement retours incomplets";});
        vm.ticketsPresse = vm.tickets.filter(function (ticket) {return ticket[1].first === "Vente presse";});
        vm.ticketsCoupons = vm.tickets.filter(function (ticket) {return ticket[1].first === "Ventes coupons";});
        vm.ticketsSAV = vm.tickets.filter(function (ticket) {return ticket[1].first === "Procédure SAV";});
        vm.ticketsProduit = vm.tickets.filter(function (ticket) {return ticket[1].first === "Informations produits";});

      }

      else if (vm.user.name === null) {
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

      vm.ticketMotif = vm.tickets.filter(function (ticket) {return ticket[1].first;});
      vm.ticketsAccount = vm.tickets.filter(function (ticket) {return ticket[1].first === "Compte Membre";});
      vm.ticketsCertif = vm.tickets.filter(function (ticket) {return ticket[1].first === "Demande de certificat d'authenticité";});
      vm.ticketsNotice = vm.tickets.filter(function (ticket) {return ticket[1].first === "Demande de notice d'utilisation";});
      vm.ticketsChange = vm.tickets.filter(function (ticket) {return ticket[1].first === "Echange/Envoi de produit";});
      vm.ticketsBack = vm.tickets.filter(function (ticket) {return ticket[1].first === "Remboursement retours incomplets";});
      vm.ticketsPresse = vm.tickets.filter(function (ticket) {return ticket[1].first === "Vente presse";});
      vm.ticketsCoupons = vm.tickets.filter(function (ticket) {return ticket[1].first === "Ventes coupons";});
      vm.ticketsSAV = vm.tickets.filter(function (ticket) {return ticket[1].first === "Procédure SAV";});
      vm.ticketsProduit = vm.tickets.filter(function (ticket) {return ticket[1].first === "Informations produits";});

      }
      vm.config2 = {
        options: {
          chart: {
            renderTo: 'container2',
          type: 'pie',
          options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
          }
      },
      title: {
          text: 'Catégories'
      }
      },
      plotOptions: {
          pie: {
              innerSize: 100,
              depth: 45
          }
      },
        series: [{
            colorByPoint: true,
            data: [
              {name:"Compte Membre",y:(vm.ticketsAccount.length/vm.ticketMotif.length)*100},
              {name:"Demande de certificat d'authenticité",y:(vm.ticketsCertif.length/vm.ticketMotif.length)*100},
              {name:"Demande de notice d'utilisation",y:(vm.ticketsNotice.length/vm.ticketMotif.length)*100},
              {name:"Echange/Envoi de produit",y:(vm.ticketsChange.length/vm.ticketMotif.length)*100},
              {name:"Remboursement retours incomplets",y:(vm.ticketsBack.length/vm.ticketMotif.length)*100},
              {name:"Vente presse",y:(vm.ticketsPresse.length/vm.ticketMotif.length)*100},
              {name:"Ventes coupons",y:(vm.ticketsCoupons.length/vm.ticketMotif.length)*100},
              {name:"Procédure SAV",y:(vm.ticketsSAV.length/vm.ticketMotif.length)*100},
              {name:"Informations produits",y:(vm.ticketsProduit.length/vm.ticketMotif.length)*100}]
        }],
      }

      vm.config1 = {
        options: {
          chart: {
          renderTo: 'container',
          type: 'column',
          margin: 75,
          options3d: {
              enabled: true,
              alpha: 15,
              beta: 30,
              depth: 50,
              viewDistance: 25
          }
      },
      title: {
          text: 'Statuts'
      } },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
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
            colorByPoint: true,
            data: [
              {name:'A traiter',y:(vm.ticketsToDeal.length/vm.ticketsUser.length)*100},
              {name:'Doublon',y:(vm.ticketsDouble.length/vm.ticketsUser.length)*100},
              {name:'En cours',y:(vm.ticketsCurrent.length/vm.ticketsUser.length)*100},
              {name:'Escaladé',y:(vm.ticketsClimb.length/vm.ticketsUser.length)*100},
              {name:'Traité sans résolution DC',y:(vm.ticketsDCNo.length/vm.ticketsUser.length)*100},
              {name:'Traité avec résolution DC',y:(vm.ticketsDCYes.length/vm.ticketsUser.length)*100},
              {name:'Demande hors procédure CPM',y:(vm.ticketsNoCPM.length/vm.ticketsUser.length)*100},
              {name:'A solder : En attente de recontact client',y:(vm.ticketsClientNeedCtc.length/vm.ticketsUser.length)*100},
              {name:'Soldé : Recontact client effectué',y:(vm.ticketsClientCtc.length/vm.ticketsUser.length)*100},
              {name:'En cours : Attente conseiller',y:(vm.ticketsCurrentCC.length/vm.ticketsUser.length)*100},
              {name:'En cours : Attente CPM',y:(vm.ticketsCurrentCPM.length/vm.ticketsUser.length)*100},
              {name:'A relancer',y:(vm.ticketsReminder.length/vm.ticketsUser.length)*100},
              {name:'Clos',y:(vm.ticketsClos.length/vm.ticketsUser.length)*100}]
        }],
      }
    }


    function querySearchName (query) {
      var results = query ? vm.users.filter( createFilterFor(query) ) : vm.users,
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
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(user) {
        var name = user.name.toLowerCase();
        return (name.indexOf(lowercaseQuery) === 0);
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
    });
