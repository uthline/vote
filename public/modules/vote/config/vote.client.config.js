'use strict';

// Configuring the Articles module
angular.module('vote').run(['Menus',
  function(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Vote', 'vote', '/vote');
  }
]);