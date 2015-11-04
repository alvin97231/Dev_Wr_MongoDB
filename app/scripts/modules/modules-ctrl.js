'use strict';

angular.module('workingRoom')
    .controller('ModulesCtrl', function ($scope, $element, $filter, $timeout, Ref, TicketsList, Tickets, User, $stateParams, $mdDialog, Toasts, Module, admin ) {
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
        vm.userName = Ref.child('users').child(authData.uid).child('name');
        vm.currentUserName = vm.userName.once('value', function(snap){vm.filterName = snap.val();});
        vm.user = User.type === "user";
        vm.super = User.type === "super";
        vm.statusDuration = statusDuration;
        vm.getLocale = getLocale;

        var defaultStatus = getDefaultStatus();
        vm.currentFilter = {status: defaultStatus};
        vm.status = defaultStatus;
        vm.filter = 'Tickets par statut';
        vm.filters = [
            'Tickets à traiter',
            'Tickets Non Lus',
            'Tickets par statut',
            'Tous les tickets'
        ];

        vm.label = {
            text: 'Tickets par page',
            of: 'sur'
        };

        vm.query = {
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

        function filterTicketList() {
             $timeout(function () {
                vm.tickets = $filter('filter')(TicketsList, vm.currentFilter);
            });
        }

        function filterAllTickets()
        {
          vm.currentFilter = {};
          filterTicketList();
        }

        function filterToDealTickets()
        {
          vm.currentFilter = {status: defaultStatus};
          filterTicketList();
        }

        function filterNotReadTickets()
        {
          vm.currentFilter = {lastResponse: '!'};
          filterTicketList();
        }

        function filterByStatusTickets(status)
        {
          var statusName = status;

            if (vm.admin || vm.super && !vm.user)
            {
              vm.currentFilter = {status : statusName};
              filterTicketList();
            }

            else if (vm.user)
            {
              vm.currentFilter = {status : statusName, user: {name: vm.filterName}};
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

        function getLocale(){
          var L = document.getElementById('langue');
          var lang = L.options[L.selectedIndex].text;
          return lang;
          }

        function statusDuration()
        {
          var nbLigne = document.getElementById('testTable').rows;

          for (var i = 1; i < nbLigne.length; i++)
          {
            var statusTable = document.getElementsByTagName('table')[1].getElementsByTagName('tr')[i].cells[3].innerHTML;
            var nbJours = document.getElementsByTagName('table')[0].getElementsByTagName('tr')[i].cells[6].innerHTML;
            var nb = String(nbJours);
            var jours = nb.charAt(0);
            var parsed = parseInt(jours);
            var nan = isNaN(parsed);

            if (nan == false)
            {
              if(statusTable == 'En cours' && parsed >= 2)
              {
                vm.nbCurrent= i;
              }
            }
          }
        }
    });
