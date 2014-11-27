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

angular.module('loops').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 403:
								// Unauthorized user redirect to loops page
								$location.path('listLoops');
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);