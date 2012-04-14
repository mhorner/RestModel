Test = {};

Test.Setup = function() {
    
    return {
        createModelWithData: function(data) {
            var model = Ext.create('TestRestModel', data);
            
            return model;
        }
    };
}();