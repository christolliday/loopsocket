'use strict';

// Configuring the Articles module
angular.module('user-sessions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'User sessions', 'user-sessions', 'dropdown', '/user-sessions(/create)?');
		Menus.addSubMenuItem('topbar', 'user-sessions', 'List User sessions', 'user-sessions');
		Menus.addSubMenuItem('topbar', 'user-sessions', 'New User session', 'user-sessions/create');
	}
]);