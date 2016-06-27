'use strict';

angular.module('workingRoom')
.config(function ($translateProvider) {
  $translateProvider.translations('it', {
    HOME_PAGE_TITLE: 'Modulos',
    HOME_PAGE_MODULES_STAT_CPM: 'STATISTICHE',
    HOME_PAGE_MODULES_TICKETS_CPM: 'TICKETS',
    SIDENAV_MODULES: 'Modulo',
    SIDENAV_PROFILE: 'Profilo',
    SIDENAV_ADMIN: 'Parametri',
    SIDENAV_LOGOUT: 'Chiudi sessione',
    PROFILE_TITLE: 'Profilo',
    PROFILE_CONNECT: 'Connesso',
    PROFILE_CONNECTED: 'Ultima connessione : ',
    PROFILE_BUTTON_MODIFY: 'Modificare il profilo',
    PROFILE_BUTTON_DEL: 'Eliminare il profilo',
    EDIT_PROFIL_NAME: 'Nome',
    EDIT_PROFIL_GROUPS: 'Aggiungere un gruppo',
    EDIT_PROFIL_USER: 'Utente',
    EDIT_PROFIL_ADMIN: 'Amministratore',
    EDIT_PROFIL_MAIL: 'CAMBIARE E-MAIL',
    EDIT_PROFIL_PWD: 'CAMBIARE LA PASSWORD',
    EDIT_PROFIL_SAVE: 'Registrare',
    EDIT_PROFIL_CANCEL: 'Cancellare',
    ADMIN_TITLE: 'Parametri',
    ADMIN_MODULE_TAB: 'MODULI',
    ADMIN_MODULE_CPM_DEL: 'ELIMINARE',
    ADMIN_MODULE_CPM_MODIFY: 'MODIFICARE',
    ADMIN_MODULE_ESCALADE_DEL_: 'ELIMINARE',
    ADMIN_MODULE_ESCALADE_MODIFY: 'MODIFICARE',
    ADMIN_MODULE_VOYAGE_DEL: 'ELIMINARE',
    ADMIN_MODULE_VOYAGE_MODIFY: 'MODIFICARE',
    ADMIN_MODULES_BUTTON_CREATE: 'Creare un modulo',
    BUTTON_CREATE_MODULE: 'CREARE',
    BUTTON_CLOSE_CREATION_MODULE: 'CHIUDERE',
    CREATE_NAME_MODULE: 'Nome del modulo',
    MODIFY_MODULE_NAME: 'Nome del modulo',
    MODIFY_MODULE_FIELDS: 'Nome della nuova casella per i ticket',
    MODIFY_MODULE_BUTTON_CLOSE: 'CHIUDERE',
    MODIFY_MODULE_BUTTON_SAVE: 'REGISTRARE',
    MODIFY_FIELDS_NAME: 'Nome',
    MODIFY_FIELDS_BUTTON_DEL: 'ELIMINARE',
    MODIFY_FIELDS_BUTTON_CLOSE: 'CHIUDERE',
    MODIFY_FIELDS_BUTTON_SAVE: 'SALVARE',
    DELETE_MODULE_CARE: 'Attenzione',
    DELETE_MODULE_QUESTION: 'Vuoi davvero eliminare questo modulo?',
    DELETE_MODULE_YES: 'SÌ',
    DELETE_MODULE_NO: 'NO',
    ADMIN_GROUPS_TAB: 'GRUPPI',
    ADMIN_GROUPS_BUTTON_CREATE: 'Creare un gruppo',
    BUTTON_CREATE_GROUPE: 'CREARE',
    BUTTON_CLOSE_CREATION_GROUPE: 'CHIUDERE',
    CREATE_NAME_GROUPE: 'Nome del gruppo',
    ADMIN_GROUPS_BUTTON_DEL: 'ELIMINARE',
    ADMIN_GROUPS_BUTTON_MODIFY: 'MODIFICARE',
    ADMIN_USERS_TAB: 'UTENTI',
    ADMIN_USERS_BUTTON_CREATE: 'Creare un utente',
    TICKET_TABLE_NAME: 'Nome',
    TICKET_TABLE_SUBJECT: 'Oggetto',
    TICKET_TABLE_CREATED: 'Data di creazione',
    TICKET_TABLE_LAST_REPLY: 'Ultima risposta',
    TICKET_CREATE: 'Creare un ticket',
    TICKET_BY_STATUS: 'Tickets per status',
    TICKET_CURRENT: 'Tickets in corso',
    TICKET_NOT_READ: 'Tickets non letto',
    TICKET_BUTTON_SEARCH: "Ricercare un ticket",
    TICKET_BUTTON_EDIT: "Modificare un modulo",
    ALL_TICKETS : 'Tutti i tickets',
    MODAL_EDIT_PROFILE_INFOS: 'Informazioni',
    CHANGE_MAIL_MODAL_NEW: 'Nuova email',
    CHANGE_MAIL_MODAL_CONFIRM_MDP: 'Password',
    CHANGE_MAIL_MODAL_CLOSE: 'CHIUDERE',
    CHANGE_MAIL_MODAL_SAVE: 'SALVARE',
    CHANGE_PWD_MODAL_OLD: 'Vecchia password',
    CHANGE_PWD_MODAL_NEW: 'Nuova password',
    CHANGE_PWD_MODAL_CLOSE: 'CHIUDERE',
    CHANGE_PWD_MODAL_SAVE: 'SALVARE',
    MODAL_EDIT_GROUP_CLOSE: 'CHIUDERE',
    MODAL_EDIT_GROUP_SAVE: 'SALVARE',
    MODAL_EDIT_GROUP_NAME: 'Nome',
    REQUIRED_FIELD: 'Questo campo è obbligatorio',
    INVALID_MAIL: 'E-mail non valido.',
    TICKETS_PER_PAGE: 'Tickets per pagina',
    SUR: 'per',
    USERS_PER_PAGE: 'Utenti per pagina',
    SEARCH_TICKETS_CLOSE: 'CHIUDERE',
    SEARCH_TICKETS: 'RICERCA',
    VIEW_TICKET_MODAL_ANSWER: 'Scrivere la risposta',
    VIEW_TICKET_MODAL_SEND: 'INVIARE',
    VIEW_TICKET_MODAL_CLOSE: 'CHIUDERE',
    DELETE_USER_MODAL_DELETE_ACCOUNT: 'Cancellazione dell\'account',
    DELETE_USER_MODAL_PWD: 'Password',
    DELETE_USER_MODAL_CANCEL: 'CANCELLARE',
    DELETE_USER_MODAL_BUTTON_DEL: 'ELIMINARE'
  });
});
