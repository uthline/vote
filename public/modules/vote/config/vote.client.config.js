'use strict';

// Configuring the Articles module
angular.module('vote').run(['Menus',
  function(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Submit', 'submit', '/submit');
    Menus.addMenuItem('topbar', 'Products', 'products', '/products');
  }
]);