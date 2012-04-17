ns("Test.Unit");

Test.Unit.RestModel = function() {
    module("RestModel Unit");

    function defineDefaultConfigIfNotDefined(config) {
        var defaultConfig = {
            "config": {
                "fields": ['id', 'name']
            }
        };
        
        if (!config) {
            config = defaultConfig;
        }
        else if (!config.config) {
            config.config = defaultConfig.config;
        }
        
        return config;
    }
    
    /**
     * define BasicRestModel with bare-bones model implementation 
     */
    function defineBasicModel(config) {
        config = defineDefaultConfigIfNotDefined(config);
        
        var override = {
            extend: 'Ext.ux.data.RestModel',
        };
        
        Ext.apply(override, config);
        
        Ext.define('BasicRestModel', override);
    }
    
    test("create model and verify initial state", function() {
        defineBasicModel();
        var model = Ext.create("BasicRestModel");
        
        ok(model.getUriExpanded() === false, "ensure the URI expanded property is false");
        ok(model.getExpanding() === false, "ensure the expanding state of the model is initially false.");
        ok(model.getUriName() === "uri", "default value for the uri field name is uri");
    });
    
    test("do get with a unexpanded model with a full data set", function() {
        defineBasicModel();
        var values = {
            id: 1234,
            name: 'Matt'
        };
        
        var model = Ext.create("BasicRestModel", values);
        
        equal(model.get("id"), values.id, "check that the id returned is the value sent in");
        equal(model.get("name"), values.name, "check that the name returned is the value sent in");
        ok(model.getUriExpanded() === false, "the uriExpanded should still be false");
    });
    
    test("evalute _isUriField with a uri field specification using default name uri", function() {
        defineBasicModel({
            config: {
                fields: [
                  {name: 'id'},
                  {name: 'uri', type: Ext.data.Types.Uri}
                ]
            }
        });
        
        var model = Ext.create("BasicRestModel", {
            id: 0,
            uri: null 
        });
        
        equal(model._isUriField('uri'), true, "check that the default uri field (uri) is flagged as the uri field");
        equal(model._isUriField('id'), false, "check that the default id field is not flagged as the uri field");
    });
    
    test("evalute _isUriField with a non-uri field specification using default name uri", function() {
        defineBasicModel({
            config: {
                fields: [
                  {name: 'id'},
                  {name: 'uri'}
                ]
            }
        });
        
        var model = Ext.create("BasicRestModel", {
            id: 0,
            uri: null 
        });
        
        equal(model._isUriField('uri'), false, "check that the default uri field (uri) is not flagged as the uri field");
        equal(model._isUriField('id'), false, "check that the default id field is not flagged as the uri field");
    });
    
    test("evalute _isUriField with a field specification using name href", function() {
        defineBasicModel({
            config: {
                uriName: "href",
                fields: [
                  {name: 'id'},
                  {name: 'href', type: Ext.data.Types.Uri}
                ]
            }
        });
        
        var model = Ext.create("BasicRestModel", {
            id: 0,
            href: null 
        });
        
        equal(model._isUriField('href'), true, "check that the default uri field (href) is flagged as the uri field");
        equal(model._isUriField('id'), false, "check that the default id field is not flagged as the uri field");
    });
    
    test("evalute _isUriField with a field specification using name href and not typed as a Uri", function() {
        defineBasicModel({
            config: {
                uriName: "href",
                fields: [
                  {name: 'id'},
                  {name: 'href'}
                ]
            }
        });
        
        var model = Ext.create("BasicRestModel", {
            id: 0,
            href: null 
        });
        
        equal(model._isUriField('href'), false, "check that the default uri field (href) is flagged as the uri field");
        equal(model._isUriField('id'), false, "check that the default id field is not flagged as the uri field");
    });
    
    test("get field with a non-empty value and uriExpanded is false", function() {
        defineBasicModel();
        
        var values = {
            id: 0,
            name: 'Matt'
        };
        
        var model = Ext.create("BasicRestModel", values);
        
        equal(model.get("id"), values.id, "verify id has the expected value");
        equal(model.get("name"), values.name, "verify name has the expected value");
        equal(model.getUriExpanded(), false, "the uriExpanded flag should be false after retrieving these values");
    });
    
    test("get field with an empty value and uriExpanded is false", function() {
        defineBasicModel();
        
        var values = {
            id: 0,
            name: undefined
        };
        
        var model = Ext.create("BasicRestModel", values);
        
        equal(model.get("id"), values.id, "verify id has the expected value");
        equal(model.get("name"), undefined, "verify name is undefined");
        equal(model.getUriExpanded(), false, "the uriExpanded flag should be false after retrieving these values");
    });
    
    test("get field with an empty value and uriExpanded is true", function() {
        defineBasicModel({
            expand: function() {
                var me = this;
                me.setUriExpanded(true);
                me.set('name', 'Matt');
            }
        });
        
        var values = {
            id: 0,
            name: undefined
        };
        
        var model = Ext.create("BasicRestModel", values);
        
        equal(model.get("id"), values.id, "verify id has the expected value");
        equal(model.get("name"), undefined, "verify name is undefined");
        equal(model.get("name"), "Matt", "verify after expansion the field is now set");
        equal(model.getUriExpanded(), true, "the uriExpanded flag should be false after retrieving these values");
    });
    
    test("get uri field with an empty value and uri expanded remains false", function() {
        defineBasicModel({config: {
            fields: [
                 'id',
                 'name',
                 {name: 'uri', type: Ext.data.Types.Uri}
            ]
        }});
        
        var values = {
            id: 0,
            name: undefined,
            uri: undefined
        };
        
        var model = Ext.create("BasicRestModel", values);
        
        equal(model.get("id"), values.id, "verify id has the expected value");
        equal(model._isUriField('uri'), true, "cross check the uri field is flagged as a uri field.");
        equal(model.get("uri"), undefined, "verify name is undefined");
        equal(model.getUriExpanded(), false, "the uriExpanded flag should be false after retrieving these values");
    });
}();