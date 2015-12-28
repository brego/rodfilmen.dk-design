/* jshint freeze:false */
(function(doc, win) {
    var addEvent         = 'addEventListener';
    var getByTag         = 'getElementsByTagName';
    var getByClass       = 'getElementsByClassName';
    var type             = 'gesturestart';
    var qsa              = 'querySelectorAll';
    var fix_viewport     = null;
    var fix_links        = null;
    var fix_members_flex = null;
    var load_ga          = null;
    var get_script       = null;
    var add_class        = null;
    var remove_class     = null;
    var has_class        = null;
    var toggle_class     = null;
    var debounce         = null;
    var document_ready   = null;
    var scales           = [1, 1];
    var meta             = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];
    var links            = doc[getByTag]('a');
    // var font_families    = ['Lato:400,900:latin', 'Permanent+Marker::latin'];
    var font_families    = ['Lato:400,900:latin', 'PT+Sans:700:latin'];
    var html             = doc[getByTag]('html')[0];
    var body             = doc[getByTag]('body')[0];

    document_ready = function (callback) {
        var readyList                   = [];
        var readyFired                  = false;
        var readyEventHandlersInstalled = false;

        function ready() {
            if (!readyFired) {
                readyFired = true;
                for (var i = 0; i < readyList.length; i++) {
                    readyList[i].fn.call(win);
                }
                readyList = [];
            }
        }
        function readyStateChange() {
            if (doc.readyState === "complete") {
                ready();
            }
        }

        if (readyFired) {
            setTimeout(function() {callback();}, 1);
            return;
        } else {
            readyList.push({fn: callback});
        }
        if (doc.readyState === "complete" || (!doc.attachEvent && doc.readyState === "interactive")) {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            if (doc.addEventListener) {
                doc.addEventListener("DOMContentLoaded", ready, false);
                win.addEventListener("load", ready, false);
            } else {
                doc.attachEvent("onreadystatechange", readyStateChange);
                win.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    };

    get_script = function (options) {
        var script = doc.createElement('script');
        var prior  = doc[getByTag]('script')[0];
        script.async = 1;
        prior.parentNode.insertBefore(script, prior);

        script.onload = script.onreadystatechange = function( _, isAbort ) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
                script.onload = script.onreadystatechange = null;
                script = undefined;

                if (!isAbort) {
                    options.success();
                }
            }
        };

        script.src = options.url;
    };

    add_class = function (el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    };

    remove_class = function (el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(
                new RegExp('(?:^|\\s)' + className + '(?!\\S)'),
                ''
            );
        }
    };

    has_class = function (el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };

    toggle_class = function (el, className) {
        if (has_class(el, className)) {
            remove_class(el, className);
        } else {
            add_class(el, className);
        }
    };

    debounce = function (func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };

    // Google font loader
    get_script({
        dataType: 'script',
        url:      'http://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js',
        cache:    true,
        success: function() {
            win.WebFont.load({
                google: {
                    families: font_families
                },
                timeout: 3000
            });
        }
    });

    // By @mathias, @cheeaun and @jdalton
    // https://gist.github.com/mathiasbynens/901295
    // iOS viewport scaling bug
    fix_viewport = function() {
        meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
        doc.removeEventListener(type, fix_viewport, true);
    };
    if ((meta = meta[meta.length - 1]) && addEvent in doc) {
        fix_viewport();
        scales = [0.25, 1.6];
        doc[addEvent](type, fix_viewport, true);
    }

    // Those mailto links
    fix_links = function() {
        for (var i = 0; i < links.length; i++) {
            if (links[i].href.indexOf(' indsaet-snabel-a-her ') !== -1) {
                links[i].href = links[i].href.replace(' indsaet-snabel-a-her ', '@');
                links[i].innerHTML = links[i].innerHTML.replace(' indsaet-snabel-a-her ', '@');
            }
        }
    };

    // Google Analytics loader
    load_ga = function (uid) {
        get_script({
            dataType: 'script',
            url:      'http://www.google-analytics.com/ga.js',
            cache:    true,
            success: function() {
                try {
                    var t;
                    if (!(win._gat && win._gat._getTracker)) {
                        throw 'Tracker has not been defined';
                    }
                    t = win._gat._getTracker(uid);
                    t._trackPageview();
                } catch(e) {}
            }
        });
    };

    // DOCUMENT LOAD
    document_ready(function() {

        // Fix mailto links
        fix_links();

        setTimeout(function() {
            if (!win.WebFont) {
                add_class(html, 'wf-inactive');
            }
        }, 2000);

        // Load Google Analytics
        load_ga('UA-7594481-6');

    });
} (document, window));

/* jshint ignore:start */
