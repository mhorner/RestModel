ns("Test.Cases");

Test.Cases.RestModel = function() {
    module("RestModel");
    
    var id = 0, 
        name = "Matt Horner", 
        email = "matthorner7@yahoo.com", 
        uri = "json/testdata.json";

    var model = Test.Setup.createModelWithData({
        id: id,
        name: name,
        email: email,
        uri: uri
    });
    
    var expanded = false;
    var afterExpanded = false;
    var asyncTestOnModelEvents = function() {
        console.log("async test going now.");
        ok(expanded, "check to ensure the beginExpanding event was fired.");
        ok(afterExpanded, "check to ensure the afterExpanding event was fired.");
        ok(!model.isExpanding(), "verify the model is no longer in expanding mode.");
        
        
        equal(model.get("address"), '1234 Loony St.', "verify the address data was loaded into the store");
        equal(model.get("phone"), "867-5309", "verify the phone data was loaded into the model.");
        start();
    };
    
    test("verify model creation and inheritance of Ext.data.Model", function() {
        ok(model instanceof TestRestModel, "expected the TestRestModel implementation");
        ok(model instanceof Ext.ux.data.RestModel, "expected inheritance from the Ext.ux.data.RestModel");
        ok(model instanceof Ext.data.Model, "expected inheritance from the Ext.data.Model");
    });
    
    test("create model with data", function() {
        equal(model.get("id"), id, "expect the id returned unaltered");
        equal(model.get("name"), name, "expect the id returned unaltered");
        equal(model.get("email"), email, "expect the id returned unaltered");
        equal(model.get("uri"), uri, "expect the id returned unaltered");
    });
    
    test("test the detection of the uri element", function() {
        model.on({
            "beginExpanding": function() {
                console.log("caught event beginExpanding");
                expanded = true;
                var a = 1;
            },
            "afterExpanding": function() {
                console.log("caught event afterExpanding");
                afterExpanded = true;
            }
        });
        
        var address = model.get("address");
        
        equal(address, undefined, "check that the returned value is undefined.");
        ok(model.isExpanding(), "verify the model is put into expanding mode.");
    });
    
    asyncTest("test the event firing during model expansion", function() {
        setTimeout(asyncTestOnModelEvents, 100);
    });
};