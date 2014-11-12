'use strict';

// Configuring the Articles module
angular.module('samples').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Samples', 'samples', 'dropdown', '/samples(/create)?');
		Menus.addSubMenuItem('topbar', 'samples', 'List Samples', 'samples');
		Menus.addSubMenuItem('topbar', 'samples', 'New Sample', 'samples/create');
	}
]);