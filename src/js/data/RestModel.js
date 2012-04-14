
Ext.define('Ext.ux.data.RestModel', {
    extend: 'Ext.data.Model',
    mixin: ['Ext.mixin.Observable'],
    
    config: {
        expanding: false
    },
    
    get: function(fieldName) {
        var value = this.callParent(arguments);
        
        if (fieldName !== "uri" && value === null) {
            this.expand();
            return undefined;
        }
        return value;
    },
    
    isExpanding: function() {
        return this.getExpanding();
    },
    
    applyExpanding: function(v) {
        console.log("firing event " + (v ? "beginExpanding" : "afterExpanding"));
        this.fireEvent(v === true ? "beginExpanding" : "afterExpanding");
        
        return v;
    },
    
    expand: function() {
        var uri = this.get("uri");
        
        console.log("Additional data required, expanding from URI : " + uri + ".");
        
        this.setExpanding(true);
            
        var request = Ext.Ajax.request({
            url: uri,
            success: function(response) {
                this.setExpanding(false);
                var fields = this.getFields();
                var obj = Ext.JSON.decode(response.responseText);
                for (var field in obj) {
                    if (fields.getByKey(field) !== undefined) {
                        console.log("setting field : " + field + " to value: " + obj[field]);
                        this.set(field, obj[field]);
                    }
                }
            },
            failure: function(response) {
                this.setExpanding(false);
                console.error("Failed to expand the record with additional information from uri");
                console.error(response);
            },
            scope: this
        });
    }
});