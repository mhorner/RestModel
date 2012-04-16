ns("Test.Cases");

Test.Cases.RestModel = function() {
    module("RestModel");
    
    var model = null,
        id = 0, 
        name = "Matt Horner", 
        email = "matthorner7@yahoo.com", 
        uri = "json/testdata.json",
        DEFAULT_TIMEOUT_SETTING = 100;

    function setup() {
        /* this model represents the initial data load
         * which would typically be returned from the server
         */
        model = Test.Setup.createModelWithData({
           id: id,
           name: name,
           email: email,
           uri: uri
       });
    }
    
    test("verify model creation and inheritance of Ext.data.Model", function() {
        setup();
        ok(model instanceof TestPersonModel, "expected the TestPersonModel implementation");
        ok(model instanceof Ext.ux.data.RestModel, "expected inheritance from the Ext.ux.data.RestModel");
        ok(model instanceof Ext.data.Model, "expected inheritance from the Ext.data.Model");
    });
    
    test("create model with data", function() {
        setup();
        equal(model.get("id"), id, "expect the id returned unaltered");
        equal(model.get("name"), name, "expect the id returned unaltered");
        equal(model.get("email"), email, "expect the id returned unaltered");
        equal(model.get("uri"), uri, "expect the id returned unaltered");
    });
    
    test("test the detection of the uri element", function() {
        var expanded = false, 
            afterExpanded = false, 
            asyncTestOnModelEvents = function() {
                ok(expanded, "check to ensure the beginExpanding event was fired.");
                ok(afterExpanded, "check to ensure the afterExpanding event was fired.");
                ok(!model.isExpanding(), "verify the model is no longer in expanding mode.");
                
                equal(model.get("address"), '1234 Loony St.', "verify the address data was loaded into the store");
                equal(model.get("phone"), "867-5309", "verify the phone data was loaded into the model.");
                start();
            };

        setup();
        model.on({
            "beginExpanding": function() {
                expanded = true;
            },
            "afterExpanding": function() {
                afterExpanded = true;
            }
        });
        
        var address = model.get("address");
        
        equal(address, undefined, "check that the returned value is undefined.");
        ok(model.isExpanding(), "verify the model is put into expanding mode.");
        stop();
        
        setTimeout(asyncTestOnModelEvents, DEFAULT_TIMEOUT_SETTING);
    });
    
    
    test("check that the person has some interests", function() {
        setup();
        var interestsStore = model.getInterests(),
            expectedValues = [{
                id: 1,
                uri: 'json/interests1.json',
                name: 'Beer',
                comment: 'Mmmmm.... Beer!'
            }, {
                id: 2,
                uri: 'json/interests2.json',
                name: 'Development',
                comment: "Isn't this fun?!"
            }],
            asyncValidateRecordExpansion = function() {
                var i = 0, rec; 
            
                for (; i < 2; i++) {
                    ev = expectedValues[i];
                    rec = interestsStore.getAt(i);
                    for (var field in ev) {
                        equal(rec.get(field), ev[field], "verify the field " + field + " of record " + i + "matches the expected value.");
                    }
                }
                start();
            },
            asyncTestsOnInterestsLoad = function() {
                ok(interestsStore instanceof Ext.data.Store, "make sure we have a store before moving on.");

                for (var i = 0; i < 2; i++) {
                    var record = interestsStore.getAt(i);
                    
                    ok(record instanceof TestInterestsModel, "verify the model is using the interests model");
                    ok(record instanceof Ext.ux.data.RestModel, "verify the model is using the RestModel implmentation");
                    ok(record instanceof Ext.data.Model, "verify the model is using the standard Ext model.");
                    record.get("name");
                }
                start();

                stop();
                setTimeout(asyncValidateRecordExpansion, DEFAULT_TIMEOUT_SETTING);
            };
        
        ok(interestsStore instanceof Ext.data.Store, "verify interests is store");
        stop();
        
        setTimeout(asyncTestsOnInterestsLoad, DEFAULT_TIMEOUT_SETTING);
    });
};