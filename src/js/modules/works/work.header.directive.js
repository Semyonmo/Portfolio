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