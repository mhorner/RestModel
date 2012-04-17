Test = {};

Test.Setup = function() {
    
    return {
        createModelWithData: function(data) {
            var model = Ext.create('TestPersonModel', data);
            
            return model;
        }
    };
}();