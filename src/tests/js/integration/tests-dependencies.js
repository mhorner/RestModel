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
        /* unit tests */
        'js/unit/RestModel.js',
        /* integration style testing */
        'js/integration/models/TestPersonModel.js',
        'js/integration/models/TestInterestsModel.js',
        'js/integration/testsetup.js',
        'js/integration/testcases-UriType.js',
        'js/integration/testcases-RestModel.js'
    ],
    complete: function() {
        function startTests(ns) {
            if (ns) {
                for (var method in ns) {
                    if("function" === typeof ns[method]) {
                        ns[method].apply();
                    }
                }
            }
        }
        
        startTests(Test.Unit);
        startTests(Test.Cases);
    }
});