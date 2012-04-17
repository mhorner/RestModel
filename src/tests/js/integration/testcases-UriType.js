ns("Test.Cases");

Test.Cases.UriType = function() {
    module("UriType");
    
    test("create new uri data type", function() {
        equal(Ext.data.Types.Uri.type, "uri", "verify the existence of the Uri type.");
        ok(Ext.isFunction(Ext.data.Types.Uri.convert), "validate existence of the convert method.");
    });
};
