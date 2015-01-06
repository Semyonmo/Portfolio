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