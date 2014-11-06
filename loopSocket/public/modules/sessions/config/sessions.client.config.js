'use strict';

// Configuring the Articles module
angular.module('sessions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sessions', 'sessions', 'dropdown', '/sessions(/create)?');
		Menus.addSubMenuItem('topbar', 'sessions', 'List Sessions', 'sessions');
		Menus.addSubMenuItem('topbar', 'sessions', 'New Session', 'sessions/create');
	}
]);