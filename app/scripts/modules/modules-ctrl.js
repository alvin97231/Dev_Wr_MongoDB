'use strict';

angular.module('workingRoom')
    .controller('ModulesCtrl', function ($scope, $element, $filter, $timeout, Ref, TicketsList, Tickets, User, $stateParams, $mdDialog, Toasts, Module, admin) {
        var vm = this;

        var authData = Ref.getAuth();
        vm.moduleId = $stateParams.id;
        vm.module = Module;
        vm.openCreateTicket = openCreateTicket;
        vm.openTicketView = openTicketView;
        vm.filterAllTickets = filterAllTickets;
        vm.filterToDealTickets = filterToDealTickets;
        vm.filterNotReadTickets = filterNotReadTickets;
        vm.filterByStatusTickets = filterByStatusTickets;
        vm.filterTicketList = filterTicketList;
        vm.admin = admin;
        vm.ticketsAll = Ref.child('tickets/'+Module.$id+'/');
        vm.ticketsCount = vm.ticketsAll.once('value', function(snap){vm.ticketsTotal = snap.numChildren();});
        vm.userName = Ref.child('users').child(authData.uid).child('name');
        vm.currentUserName = vm.userName.once('value', function(snap){vm.filterName = snap.val();});
        vm.user = User.type === "user";
        vm.super = User.type === "super";
        vm.statusDuration = statusDuration;
        vm.takeLate = takeLate;
        vm.orderByField = 'id';
        vm.reverseSort = false;
        vm.searchNbJ='';
        vm.dataTable = dataTable;

        var defaultStatus = getDefaultStatus();
        vm.currentFilter = {status: defaultStatus};
        vm.status = defaultStatus;
        vm.filter = 'Tickets par statut';
        vm.label = {
            text: 'Tickets par page',
            of: 'sur'
        };

        vm.query = {
            filter: '',
            order: '-id',
            limit: 10,
            page: 1,
            rowSelect: [10, 20, 50, 100, 200, 500]
        };

        vm.tickets = null;
        TicketsList.$loaded().then(function () {
            TicketsList.$watch(filterTicketList);
            filterTicketList();
        });

        vm.ticketsNotRead = TicketsList.filter(function (ticket) {
            return !ticket.lastResponse;
        });
        vm.ticketsCurrent = TicketsList.filter(function (ticket) {
            return ticket.status === 'En cours';
        });
        vm.ticketsCurrentCC = TicketsList.filter(function (ticket) {
            return ticket.status === 'En cours : Attente conseiller';
        });
        vm.ticketsCurrentCPM = TicketsList.filter(function (ticket) {
            return ticket.status === 'En cours : Attente CPM';
        });

        function filterTicketList() {
             $timeout(function () {
                vm.tickets = $filter('filter')(TicketsList, vm.currentFilter);
            });
        }

        function filterAllTickets()
        {
          vm.currentFilter = {lang: moment.locale()};
          filterTicketList();
          setTimeout(function(){vm.dataTable();}, 1000);
        }

        function filterToDealTickets()
        {
          vm.currentFilter = {status: defaultStatus, lang: moment.locale()};
          filterTicketList();
          setTimeout(function(){vm.dataTable();}, 1000);
        }

        function filterNotReadTickets()
        {
          vm.currentFilter = {lastResponse: '!', lang: moment.locale()};
          filterTicketList();
          setTimeout(function(){vm.dataTable();}, 1000);
        }

        function filterByStatusTickets(status)
        {
          var statusName = status;

            if (vm.admin || vm.super && !vm.user)
            {
              vm.currentFilter = {status : statusName, lang: moment.locale()};
              filterTicketList();
              setTimeout(function(){vm.dataTable();}, 1000);
            }

            else if (vm.user)
            {
              vm.currentFilter = {status : statusName, user: {name: vm.filterName}, lang: moment.locale()};
              filterTicketList();
              setTimeout(function(){vm.dataTable();}, 1000);
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

        function takeLate(ticket){
          if(ticket.messages.length === 1){
            var id = 0;
          }
          else{
            var id = ticket.messages.length - 1;
          }
          var dateStatusChange = ticket.messages[id].date;
          var currentDate = Date.now();
          vm.diff = currentDate - dateStatusChange;
          if(vm.diff >= 172800000)
          {
            console.log('Notif Necessaire');
          }
          else
          {
            console.log('Notif Non Necessaire');
            console.log(vm.diff);
          }
        }

        function statusDuration()
        {
          vm.ticketsAll.on('value', show);
          function show(snap){

            vm.test = snap.val();
            var i=0;
            var status = [];

              snap.forEach(function (childSnap){
              var child = childSnap.val();

              switch(child.status){
                case 'A solder : En attente de recontact client':
                  vm.takeLate(child);
                  i ++;
                  status[0] = i;
                break;

                case 'En cours':
                  vm.takeLate(child);
                  i ++;
                  status[1]=i;
                break;

                case 'En cours : Attente conseiller':
                  vm.takeLate(child);
                  i ++;
                  status[2]=i;
                break;

                case 'En cours : Attente CPM':
                  vm.takeLate(child);
                  i ++;
                  status[3]=i;
                break;

                case 'Soldé : Recontact client effectué':console.log(child);
                break;

                case 'Clos':console.log(child);
                break;

                case 'Traité avec résolution DC':console.log(child);
                break;
                
                case 'Traité sans résolution DC':console.log(child);
                break;

              }
          });
          for ( var x=0; x < status.length; x++){
            if(status[x] >= 0){
              switch (x) {
                case 0:
                    alert('Il y a '+ status[0] +' ticket En attente de recontact client depuis plus de 48H');
                break;
                case 1:
                    alert('Il y a '+ status[1] +' ticket En cours depuis plus de 48H');
                break;
                case 2:
                    alert('Il y a '+ status[2] +' ticket En cours: Attente conseiller depuis plus de 48H');
                break;
                case 3:
                    alert('Il y a '+ status[3] +' ticket En cours: Attente CPM depuis plus de 48H');
                break;
              }
            }
          }
        }
      }
    function dataTable(){

      function filterColumn ( i ) {
        var table = $('#table_id').DataTable();
        table.column( i ).search(
            $('#col'+i+'_filter').val(),
            $('#col'+i+'_regex').prop('checked'),
            $('#col'+i+'_smart').prop('checked')
        ).draw();
      }

      $(document).ready(function() {
        var table = $('#table_id').DataTable();

        $('input.column_filter').on( 'keyup click', function () {
            filterColumn( $(this).parents('td').attr('data-column') );
        } );
      });
    }

  });
