'use strict';

// Configuring the Articles module
angular.module('loops').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Loops', 'loops', 'dropdown', '/loops(/create)?');
		Menus.addSubMenuItem('topbar', 'loops', 'List Loops', 'loops');
		Menus.addSubMenuItem('topbar', 'loops', 'New Loop', 'loops/create');
	}
]);