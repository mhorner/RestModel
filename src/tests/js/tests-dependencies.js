ns = function(ns) {
    if(ns) {
        var nsParts = ns.split(".");
        var ctx = window;
        for(var idx in nsParts) {
            namespace = nsParts[idx];

            if (!ctx[namespace]) {
                ctx[namespace] = {};
            }
            ctx = ctx[namespace];
        }
    }
};

yepnope({
    load: [
        '../../lib/qunit/qunit.js',
        '../../lib/qunit/qunit.css',
        '../../lib/touch2/sencha-touch-all.js',
        '../../lib/touch2/resources/css/apple.css',
        '../js/data/Uri.js',
        '../js/data/RestModel.js',
        'js/models/TestPersonModel.js',
        'js/models/TestInterestsModel.js',
        'js/testsetup.js',
        'js/testcases-UriType.js',
        'js/testcases-RestModel.js'
    ],
    complete: function() {
        if (Test.Cases) {
            for (var method in Test.Cases) {
                if("function" === typeof Test.Cases[method]) {
                    Test.Cases[method].apply();
                }
            }
        }
    }
});