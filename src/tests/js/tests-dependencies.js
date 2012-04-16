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
        'http://localhost/~matt/3rdparty/qunit/qunit/qunit.js',
        'http://localhost/~matt/3rdparty/qunit/qunit/qunit.css',
        'http://localhost/~matt/3rdparty/touch-2.0.0/bundled/sencha-touch-all-200.js',
        'http://localhost/~matt/3rdparty/touch-2.0.0/bundled/resources/css/apple-200.css',
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