//HEAD 
(function(app) {
try { app = angular.module("avanadeApp.template"); }
catch(err) { app = angular.module("avanadeApp.template", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("modules/dashboard/views/main.html","Olá Mundo!")
}]);
})();