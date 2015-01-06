(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (!$) {
    throw new Error('jQuery not load');
}

if (!angular) {
    throw new Error('AngularJS not load');
}

/**
 * Load angular modules
 * @type {exports}
 */
var works = require('./modules/works');

/**
 * Load angular app config modules
 * @type {exports}
 */
var appRoutes =  require('./app.routes'),
    appConfig =  require('./app.config');

/**
 * Load menu
 * @type {function(): Menu|exports}
 */
var menu = require('./modules/menu');

/**
 * Load header particles
 * @type {function(): Header|exports}
 */
var header = require('./modules/header');


/**
 * Init AgngulrJS App
 */
angular
    .module('app', [
        //'firebase',
        'ngRoute',
        works.name,
        appConfig.name,
        appRoutes.name
    ]);

//imported from ./modules/menu
//init menu
menu('nav.menu');
header('header');

},{"./app.config":2,"./app.routes":3,"./modules/header":5,"./modules/menu":6,"./modules/works":8}],2:[function(require,module,exports){
module.exports =
    angular
        .module('app.config', [])
        .config(appConfig);

function appConfig() {
    "use strict";
}

},{}],3:[function(require,module,exports){
module.exports =
    angular
        .module('app.routes', [])
        .config(appRoutes);

function appRoutes($routeProvider) {
    "use strict";

    $routeProvider
        .when('/', {
            controller: 'WorksController',
            controllerAs: 'vm'
        })
        .when('/work', {
            templateUrl: 'work.html',
            controller: 'WorksController',
            controllerAs: 'vm'
        }).otherwise({
            redirectTo: '/'
        });

}

},{}],4:[function(require,module,exports){
module.exports = angular
    .module('data.constants',[])
    .constant('SERVICE_URL', 'https://my-portfolio-app.firebaseio.com/');
},{}],5:[function(require,module,exports){
module.exports = function (selector) {
    "use strict";
    return new Header(selector);
};

function Header(selector) {
    "use strict";
    var that = this;
    that.selector = selector;

    init();

    function init() {
        "use strict";
        particlesJS(that.selector, {
            particles: {
                color: '#fff',
                shape: 'circle', // "circle", "edge" or "triangle"
                opacity: 1,
                size: 4.5,
                size_random: true,
                nb: 30,
                line_linked: {
                    enable_auto: true,
                    distance: 100,
                    color: '#fff',
                    opacity: 1,
                    width: 1,
                    condensed_mode: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 600
                    }
                },
                anim: {
                    enable: true,
                    speed: 3
                }
            },
            interactivity: {
                enable: true,
                mouse: {
                    distance: 250
                },
                detect_on: 'canvas', // "canvas" or "window"
                mode: 'grab',
                line_linked: {
                    opacity: .5
                },
                events: {
                    onclick: {
                        enable: true,
                        mode: 'push', // "push" or "remove" (particles)
                        nb: 1
                    }
                }
            },
            /* Retina Display Support */
            retina_detect: true
        });
    }
}
},{}],6:[function(require,module,exports){
module.exports = function (selector) {
    "use strict";
    return new Menu(selector);
};

function Menu(selector) {
    "use strict";
    var that = this;
    that.$element = $(selector);
    init();

    that.reduce = function () {
        "use strict";
        that.$element.addClass('small');
    };

    that.increase = function () {

        "use strict";
        that.$element.removeClass('small');
    };

    function init() {
        "use strict";
        $(window).scroll(function () {
            "use strict";

            if ($(window).scrollTop() > 0)
                that.reduce();
            else
                that.increase();
        });
    }
}
},{}],7:[function(require,module,exports){
var dataConstants = require('../constants/data.constants');

module.exports =
    angular
        .module('data.service', [
            dataConstants.name
        ])
        .service('dataService', dataService);

dataService.$inject = ['$http', '$log', 'SERVICE_URL'];

function dataService($http, $log, SERVICE_URL) {
    "use strict";

    var service = {
        getWorks: getWorks,
        getPage: getPage
    };

    return service;

    function getWorks() {

    }

    function getPage(pageURL) {
        pageURL = pageURL + ".json";

        return $http
            .get(SERVICE_URL + pageURL)
            .then(getPageComplete)
            .catch(getPageFailed);


        function getPageComplete(response) {
            return response.data;
        }

        function getPageFailed(error) {
            $log.error('Get Page: ' + pageURL + ' failed because: ' + error.data);
        }
    }
}



},{"../constants/data.constants":4}],8:[function(require,module,exports){
var dataService = require('../services/data.service');
var workHeaderDirective = require('./work.header.directive');


    module.exports =
    angular
        .module('app.works', [
            dataService.name,
            workHeaderDirective.name
        ])
        .controller('WorksController', WorksController);

WorksController.$inject = ['$log', 'dataService'];
/**
 * Список работ и взаимодействие с ними
 * @constructor
 */
function WorksController($log, dataService) {
    "use strict";
    var vm = this;

    vm.title = "List of my works";
    vm.list = [];
    vm.page = {};

    init();

    function init() {
        return getPage()
            .then(function () {
                $log.info('page loaded');
            });

    }

    function getPage() {
        return dataService.getPage('pages/index')
            .then(function (data) {
                vm.works = data.works;
            });
    }
}
},{"../services/data.service":7,"./work.header.directive":9}],9:[function(require,module,exports){
module.exports =
    angular
        .module('work.header.directive', [])
        .directive('workHeader', workHeader);

function workHeader() {
    "use strict";

    var directive = {
        link: link,
        restrict: 'EA',
        scope: {}
    };
    return directive;

    function link(scope, element, attrs) {
        var height = element.outerHeight();

        height = height - 14;

        element.css('marginTop', - height);
    }
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2FwcC5jb25maWcuanMiLCJzcmMvanMvYXBwLnJvdXRlcy5qcyIsInNyYy9qcy9tb2R1bGVzL2NvbnN0YW50cy9kYXRhLmNvbnN0YW50cy5qcyIsInNyYy9qcy9tb2R1bGVzL2hlYWRlci9pbmRleC5qcyIsInNyYy9qcy9tb2R1bGVzL21lbnUvaW5kZXguanMiLCJzcmMvanMvbW9kdWxlcy9zZXJ2aWNlcy9kYXRhLnNlcnZpY2UuanMiLCJzcmMvanMvbW9kdWxlcy93b3Jrcy9pbmRleC5qcyIsInNyYy9qcy9tb2R1bGVzL3dvcmtzL3dvcmsuaGVhZGVyLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpZiAoISQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2pRdWVyeSBub3QgbG9hZCcpO1xufVxuXG5pZiAoIWFuZ3VsYXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuZ3VsYXJKUyBub3QgbG9hZCcpO1xufVxuXG4vKipcbiAqIExvYWQgYW5ndWxhciBtb2R1bGVzXG4gKiBAdHlwZSB7ZXhwb3J0c31cbiAqL1xudmFyIHdvcmtzID0gcmVxdWlyZSgnLi9tb2R1bGVzL3dvcmtzJyk7XG5cbi8qKlxuICogTG9hZCBhbmd1bGFyIGFwcCBjb25maWcgbW9kdWxlc1xuICogQHR5cGUge2V4cG9ydHN9XG4gKi9cbnZhciBhcHBSb3V0ZXMgPSAgcmVxdWlyZSgnLi9hcHAucm91dGVzJyksXG4gICAgYXBwQ29uZmlnID0gIHJlcXVpcmUoJy4vYXBwLmNvbmZpZycpO1xuXG4vKipcbiAqIExvYWQgbWVudVxuICogQHR5cGUge2Z1bmN0aW9uKCk6IE1lbnV8ZXhwb3J0c31cbiAqL1xudmFyIG1lbnUgPSByZXF1aXJlKCcuL21vZHVsZXMvbWVudScpO1xuXG4vKipcbiAqIExvYWQgaGVhZGVyIHBhcnRpY2xlc1xuICogQHR5cGUge2Z1bmN0aW9uKCk6IEhlYWRlcnxleHBvcnRzfVxuICovXG52YXIgaGVhZGVyID0gcmVxdWlyZSgnLi9tb2R1bGVzL2hlYWRlcicpO1xuXG5cbi8qKlxuICogSW5pdCBBZ25ndWxySlMgQXBwXG4gKi9cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnLCBbXG4gICAgICAgIC8vJ2ZpcmViYXNlJyxcbiAgICAgICAgJ25nUm91dGUnLFxuICAgICAgICB3b3Jrcy5uYW1lLFxuICAgICAgICBhcHBDb25maWcubmFtZSxcbiAgICAgICAgYXBwUm91dGVzLm5hbWVcbiAgICBdKTtcblxuLy9pbXBvcnRlZCBmcm9tIC4vbW9kdWxlcy9tZW51XG4vL2luaXQgbWVudVxubWVudSgnbmF2Lm1lbnUnKTtcbmhlYWRlcignaGVhZGVyJyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29uZmlnJywgW10pXG4gICAgICAgIC5jb25maWcoYXBwQ29uZmlnKTtcblxuZnVuY3Rpb24gYXBwQ29uZmlnKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPVxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdXRlcycsIFtdKVxuICAgICAgICAuY29uZmlnKGFwcFJvdXRlcyk7XG5cbmZ1bmN0aW9uIGFwcFJvdXRlcygkcm91dGVQcm92aWRlcikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICBjb250cm9sbGVyOiAnV29ya3NDb250cm9sbGVyJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xuICAgICAgICB9KVxuICAgICAgICAud2hlbignL3dvcmsnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3dvcmsuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnV29ya3NDb250cm9sbGVyJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xuICAgICAgICB9KS5vdGhlcndpc2Uoe1xuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgICAgIH0pO1xuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcbiAgICAubW9kdWxlKCdkYXRhLmNvbnN0YW50cycsW10pXG4gICAgLmNvbnN0YW50KCdTRVJWSUNFX1VSTCcsICdodHRwczovL215LXBvcnRmb2xpby1hcHAuZmlyZWJhc2Vpby5jb20vJyk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gbmV3IEhlYWRlcihzZWxlY3Rvcik7XG59O1xuXG5mdW5jdGlvbiBIZWFkZXIoc2VsZWN0b3IpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhhdC5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXG4gICAgaW5pdCgpO1xuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHBhcnRpY2xlc0pTKHRoYXQuc2VsZWN0b3IsIHtcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgICAgICAgICAgc2hhcGU6ICdjaXJjbGUnLCAvLyBcImNpcmNsZVwiLCBcImVkZ2VcIiBvciBcInRyaWFuZ2xlXCJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIHNpemU6IDQuNSxcbiAgICAgICAgICAgICAgICBzaXplX3JhbmRvbTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBuYjogMzAsXG4gICAgICAgICAgICAgICAgbGluZV9saW5rZWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlX2F1dG86IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAxMDAsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb25kZW5zZWRfbW9kZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZVg6IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZVk6IDYwMFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhbmltOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3BlZWQ6IDNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW50ZXJhY3Rpdml0eToge1xuICAgICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZTogMjUwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZXRlY3Rfb246ICdjYW52YXMnLCAvLyBcImNhbnZhc1wiIG9yIFwid2luZG93XCJcbiAgICAgICAgICAgICAgICBtb2RlOiAnZ3JhYicsXG4gICAgICAgICAgICAgICAgbGluZV9saW5rZWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogLjVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlOiAncHVzaCcsIC8vIFwicHVzaFwiIG9yIFwicmVtb3ZlXCIgKHBhcnRpY2xlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIG5iOiAxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogUmV0aW5hIERpc3BsYXkgU3VwcG9ydCAqL1xuICAgICAgICAgICAgcmV0aW5hX2RldGVjdDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gbmV3IE1lbnUoc2VsZWN0b3IpO1xufTtcblxuZnVuY3Rpb24gTWVudShzZWxlY3Rvcikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGF0LiRlbGVtZW50ID0gJChzZWxlY3Rvcik7XG4gICAgaW5pdCgpO1xuXG4gICAgdGhhdC5yZWR1Y2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGF0LiRlbGVtZW50LmFkZENsYXNzKCdzbWFsbCcpO1xuICAgIH07XG5cbiAgICB0aGF0LmluY3JlYXNlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGF0LiRlbGVtZW50LnJlbW92ZUNsYXNzKCdzbWFsbCcpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICAgICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSA+IDApXG4gICAgICAgICAgICAgICAgdGhhdC5yZWR1Y2UoKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGF0LmluY3JlYXNlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJ2YXIgZGF0YUNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9kYXRhLmNvbnN0YW50cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdkYXRhLnNlcnZpY2UnLCBbXG4gICAgICAgICAgICBkYXRhQ29uc3RhbnRzLm5hbWVcbiAgICAgICAgXSlcbiAgICAgICAgLnNlcnZpY2UoJ2RhdGFTZXJ2aWNlJywgZGF0YVNlcnZpY2UpO1xuXG5kYXRhU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckbG9nJywgJ1NFUlZJQ0VfVVJMJ107XG5cbmZ1bmN0aW9uIGRhdGFTZXJ2aWNlKCRodHRwLCAkbG9nLCBTRVJWSUNFX1VSTCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgIGdldFdvcmtzOiBnZXRXb3JrcyxcbiAgICAgICAgZ2V0UGFnZTogZ2V0UGFnZVxuICAgIH07XG5cbiAgICByZXR1cm4gc2VydmljZTtcblxuICAgIGZ1bmN0aW9uIGdldFdvcmtzKCkge1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGFnZShwYWdlVVJMKSB7XG4gICAgICAgIHBhZ2VVUkwgPSBwYWdlVVJMICsgXCIuanNvblwiO1xuXG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgICAgLmdldChTRVJWSUNFX1VSTCArIHBhZ2VVUkwpXG4gICAgICAgICAgICAudGhlbihnZXRQYWdlQ29tcGxldGUpXG4gICAgICAgICAgICAuY2F0Y2goZ2V0UGFnZUZhaWxlZCk7XG5cblxuICAgICAgICBmdW5jdGlvbiBnZXRQYWdlQ29tcGxldGUocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UGFnZUZhaWxlZChlcnJvcikge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignR2V0IFBhZ2U6ICcgKyBwYWdlVVJMICsgJyBmYWlsZWQgYmVjYXVzZTogJyArIGVycm9yLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbiIsInZhciBkYXRhU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2RhdGEuc2VydmljZScpO1xudmFyIHdvcmtIZWFkZXJEaXJlY3RpdmUgPSByZXF1aXJlKCcuL3dvcmsuaGVhZGVyLmRpcmVjdGl2ZScpO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAud29ya3MnLCBbXG4gICAgICAgICAgICBkYXRhU2VydmljZS5uYW1lLFxuICAgICAgICAgICAgd29ya0hlYWRlckRpcmVjdGl2ZS5uYW1lXG4gICAgICAgIF0pXG4gICAgICAgIC5jb250cm9sbGVyKCdXb3Jrc0NvbnRyb2xsZXInLCBXb3Jrc0NvbnRyb2xsZXIpO1xuXG5Xb3Jrc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJGxvZycsICdkYXRhU2VydmljZSddO1xuLyoqXG4gKiDQodC/0LjRgdC+0Log0YDQsNCx0L7RgiDQuCDQstC30LDQuNC80L7QtNC10LnRgdGC0LLQuNC1INGBINC90LjQvNC4XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gV29ya3NDb250cm9sbGVyKCRsb2csIGRhdGFTZXJ2aWNlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHZtID0gdGhpcztcblxuICAgIHZtLnRpdGxlID0gXCJMaXN0IG9mIG15IHdvcmtzXCI7XG4gICAgdm0ubGlzdCA9IFtdO1xuICAgIHZtLnBhZ2UgPSB7fTtcblxuICAgIGluaXQoKTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHJldHVybiBnZXRQYWdlKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmluZm8oJ3BhZ2UgbG9hZGVkJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhZ2UoKSB7XG4gICAgICAgIHJldHVybiBkYXRhU2VydmljZS5nZXRQYWdlKCdwYWdlcy9pbmRleCcpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLndvcmtzID0gZGF0YS53b3JrcztcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCd3b3JrLmhlYWRlci5kaXJlY3RpdmUnLCBbXSlcbiAgICAgICAgLmRpcmVjdGl2ZSgnd29ya0hlYWRlcicsIHdvcmtIZWFkZXIpO1xuXG5mdW5jdGlvbiB3b3JrSGVhZGVyKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgbGluazogbGluayxcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgIHNjb3BlOiB7fVxuICAgIH07XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50Lm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0IC0gMTQ7XG5cbiAgICAgICAgZWxlbWVudC5jc3MoJ21hcmdpblRvcCcsIC0gaGVpZ2h0KTtcbiAgICB9XG59Il19
