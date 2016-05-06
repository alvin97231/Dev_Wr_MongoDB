'use strict';

angular.module('workingRoom')
    .controller('ModulesCtrl', function ($scope, $element, $filter, $timeout,$http, TicketsList, Tickets, User, $stateParams, $mdDialog, Toasts, Module, admin, GroupsList) {
        var vm = this;
        
        vm.moduleId = $stateParams.id;
        vm.module = Module;
        vm.openCreateTicket = openCreateTicket;
        vm.openTicketView = openTicketView;
        vm.filterAllTickets = filterAllTickets;
        vm.filterToDealTickets = filterToDealTickets;
        vm.filterNotReadTickets = filterNotReadTickets;
        vm.filterByStatusTickets = filterByStatusTickets;
        vm.filterTicketList = filterTicketList;
        vm.filterName = User.name;
        vm.getGroups = getGroups;
        vm.admin = admin;
        //vm.ticketsAll = Ref.child('tickets/'+Module.$id+'/');
        //vm.ticketsCount = vm.ticketsAll.once('value', function(snap){vm.ticketsTotal = snap.numChildren();});
        //vm.userName = Ref.child('users').child(authData.uid).child('name');
        //vm.groupQuery = Ref.child('users').child(authData.uid).child('groups');
        //vm.currentUserName = vm.userName.once('value', function(snap){vm.filterName = snap.val();});
        //vm.currentGroup = vm.groupQuery.once('value', function(snap){vm.groupName = snap.val();});
        vm.user = User.type === "user";
        vm.super = User.type === "super";
        vm.statusDuration = statusDuration;
        vm.takeLate = takeLate;
        vm.orderByField = 'id';
        vm.reverseSort = false;
        $scope.searchNbJ='';
        var defaultStatus = getDefaultStatus();
        vm.currentFilter = {status: defaultStatus};
        vm.status = defaultStatus;
        vm.filter = 'Tickets par statut';
        vm.tickets = null;

        function valuesToArray(obj) {
          return Object.keys(obj).map(function (key) { return obj[key]; });
        }

        //TicketsList = valuesToArray(TicketsList);

        filterTicketList();

        vm.ticketsNotRead = TicketsList.filter(function (ticket) {
          if (vm.admin || vm.super && !vm.user){
            return !ticket.lastResponse && ticket.lang == moment.locale();
          }
          else if (!vm.admin && !vm.super && vm.user){
            return !ticket.lastResponse && ticket.lang == moment.locale() && ticket.user.name == vm.filterName;
          }
        });

        vm.ticketsCurrent = TicketsList.filter(function (ticket) {
          if (vm.admin || vm.super && !vm.user){
            return ticket.status === 'En cours' && ticket.lang == moment.locale();
          }
          else if (!vm.admin && !vm.super && vm.user){
            return ticket.status === 'En cours' && ticket.lang == moment.locale() && ticket.user.name == vm.filterName;
          }
        });
        vm.ticketsCurrentCC = TicketsList.filter(function (ticket) {
          if (vm.admin || vm.super && !vm.user){
            return ticket.status === 'En cours : Attente conseiller' && ticket.lang == moment.locale();
          }
          else if (!vm.admin && !vm.super && vm.user){
            return ticket.status === 'En cours : Attente conseiller' && ticket.lang == moment.locale() && ticket.user.name == vm.filterName;
          }
        });

        vm.ticketsCurrentCPM = TicketsList.filter(function (ticket) {
          if (vm.admin || vm.super && !vm.user){
            return ticket.status === 'En cours : Attente CPM' && ticket.lang == moment.locale();
          }
          else if (!vm.admin && !vm.super && vm.user){
            return ticket.status === 'En cours : Attente CPM' && ticket.lang == moment.locale() && ticket.user.name == vm.filterName;
          }
        });

        function getGroups(){
          return GroupsList;
        }

        function filterTicketList() {
             $timeout(function () {
                vm.tickets = $filter('filter')(TicketsList, vm.currentFilter);
            });
        }

        function filterAllTickets()
        {
          if (vm.admin || vm.super && !vm.user){
            vm.currentFilter = {lang: moment.locale()};
            filterTicketList();
          }

          else if (!vm.admin && !vm.super && vm.user){
            vm.currentFilter = {lang: moment.locale(), user: {name: vm.filterName}};
            filterTicketList();
          }

          /*else if (!vm.admin && vm.super && !vm.user) {
             for (var i = 0; i < User.groups.length; i++) {
               console.log(User.groups[i]);
               vm.currentFilter = {lang: moment.locale(), user: {group: {name:User.groups[i].name}}};
               console.log(vm.currentFilter);
             }
          }*/
        }

        function filterToDealTickets()
        {
          if (vm.admin || vm.super && !vm.user){
            vm.currentFilter = {status: defaultStatus, lang: moment.locale()};
            filterTicketList();
          }
          else if (vm.user){
            vm.currentFilter = {status: defaultStatus, lang: moment.locale(), user: {name: vm.filterName}};
            filterTicketList();
          }
        }

        function filterNotReadTickets()
        {
          if (vm.admin || vm.super && !vm.user){
            vm.currentFilter = {lastResponse: '!', lang: moment.locale()};
            filterTicketList();
          }
          else if (vm.user){
            vm.currentFilter = {lastResponse: '!', lang: moment.locale(), user: {name: vm.filterName}};
            filterTicketList();
          }
        }

        function filterByStatusTickets(status)
        {
          var statusName = status;

            if (vm.admin || vm.super && !vm.user){
              vm.currentFilter = {status : statusName, lang: moment.locale()};
              filterTicketList();
            }
            else if (vm.user){
              vm.currentFilter = {status : statusName, user: {name: vm.filterName}, lang: moment.locale()};
              filterTicketList();
            }
        }

        function openTicketView(event, id) {
            $mdDialog.show({
                controller: 'ViewTicketCtrl as vm',
                templateUrl: 'partials/modules/view-ticket-modal.html',
                targetEvent: event,
                resolve: {
                    admin: function () {
                        return admin;
                    },
                    User: function () {
                        return User;
                    },
                    module: function () {
                        return Module;
                    },
                    ticket: function (Tickets) {
                        return Tickets.getTicket($stateParams.id, id);
                    }
                }
            });
        }

        function openCreateTicket(event) {
            $mdDialog.show({
                controller: 'CreateTicketCtrl as vm',
                templateUrl: 'partials/modules/create-ticket-modal.html',
                targetEvent: event,
                resolve: {
                    Module: function () {
                        return Module;
                    },
                    User: function () {
                        return User;
                    }
                }
            }).then(function (res) {
                Tickets.add($stateParams.id, res).then(function () {
                    Toasts.simple('Ticket créé');
                }, function (error) {
                    Toasts.error(error);
                });
            });
        }

        function getDefaultStatus() {
            if (Module.status) {
                for (var i = 0; i < Module.status.length; i++) {
                    if (Module.status.default) {
                        return Module.status.name;
                    }
                }
                return Module.status[0] ? Module.status[0].name : 'Tous les tickets';
            }
            return 'Tous les tickets';
        }

        function takeLate(ticket, delais){
          if(ticket.messages.length === 1){
            var id = 0;
          }
          else{
            var id = ticket.messages.length - 1;
          }
          var dateStatusChange = ticket.messages[id].date;
          var currentDate = Date.now();
          vm.diff = currentDate - dateStatusChange;
          console.log(vm.diff)
          if(vm.diff >= 172800000)
          {
            console.log('Notif Necessaire');
          }
          else if(vm.diff < 604800000)
          {
            if (ticket.status === 'Soldé : Recontact client effectué' || 'Clos' || 'Traité avec résolution DC' || 'Traité sans résolution DC') {
              console.log('Notif Non Necessaire');
              vm.done = dateStatusChange - ticket.created;
              vm.diffDisp = vm.done/3600000;
              console.log(vm.diffDisp+' heures');
              delais.push(vm.diffDisp);
              console.log(delais);
            }
            else {
              console.log('Tickets n° '+ticket.id+' trop vieux')
            }
          }
        }

        function statusDuration()
        {
          vm.ticketsAll.on('value', show);
          function show(snap){

            vm.test = snap.val();
            var i=0;
            var status = [];
            var delais = [];

              snap.forEach(function (childSnap){
              var child = childSnap.val();

              switch(child.status){
                case 'A solder : En attente de recontact client':
                  vm.takeLate(child,delais);
                  i ++;
                  status[0] = i;
                break;

                case 'En cours':
                  vm.takeLate(child,delais);
                  i ++;
                  status[1]=i;
                  console.log(status[1]);
                break;

                case 'En cours : Attente CPM':
                  vm.takeLate(child,delais);
                  status[1] = status[1]+1;
                  console.log(status[1]);
                break;

                case 'En cours : Attente conseiller':
                  vm.takeLate(child,delais);
                  status[1] = status[1]+1;
                  console.log(status[1]);
                break;

                case 'Soldé : Recontact client effectué':
                  vm.takeLate(child,delais);
                  tableAvg(delais);
                break;

                case 'Clos':
                  vm.takeLate(child,delais);
                  tableAvg(delais);
                break;

                case 'Traité avec résolution DC':
                  vm.takeLate(child,delais);
                  tableAvg(delais);
                break;

                case 'Traité sans résolution DC':
                  vm.takeLate(child, delais);
                  tableAvg(delais);
                break;
              }
          });
          for ( var x=0; x < status.length; x++){
            if(status[x] >= 0){
              switch (x) {
                case 0:
                    Toasts.simple('Il y a '+ status[0] +' ticket En attente de recontact client depuis plus de 48H');
                    console.log('Il y a '+ status[0] +' ticket En attente de recontact client depuis plus de 48H');
                break;
                case 1:
                setTimeout(function(){
                    Toasts.simple('Il y a '+ status[1] +' ticket En cours depuis plus de 48H');
                    console.log('Il y a '+ status[1] +' ticket En cours depuis plus de 48H');}, 5000);
                break;
              }
            }
          }
        }
      }

    function tableAvg(tableau){
      var somme = 0 ;
      for(var i=0; i<tableau.length; i++){
        somme += tableau[i];
      }
      var avg = somme/tableau.length
    }

    statusDuration;

}).controller('speedDialController', function ($scope){
  this.isOpen = false;
});
