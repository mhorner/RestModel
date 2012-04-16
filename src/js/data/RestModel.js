
Ext.define('Ext.ux.data.RestModel', {
    extend: 'Ext.data.Model',
    mixin: ['Ext.mixin.Observable'],
    
    /** events
     */
    BEGIN_EXPANDING: 'beginExpanding',
    AFTER_EXPANDING: 'afterExpanding',
    
    config: {
        expanding: false,
        $expanded: false
    },
    
    get: function(fN) {
        var me = this, v = me.callParent(arguments);
        
        if (fN !== "uri" && Ext.isEmpty(v) && !me.$expanded) {
            me.expand();
            return undefined;
        }
        return v;
    },
    
    isExpanding: function() {
        return this.getExpanding();
    },
    
    applyExpanding: function(v) {
        var me = this;
        me.$expanded = true;

        me.fireEvent(v === true ? me.BEGIN_EXPANDING : me.AFTER_EXPANDING);
        return v;
    },
    
    expand: function() {
        var me = this, uri = me.get("uri"),
            c = console;
        
        me.setExpanding(true);
            
        var request = Ext.Ajax.request({
            url: uri,
            success: function(response) {
                me.setExpanding(false);
                var fs = me.getFields();
                var o = Ext.JSON.decode(response.responseText);
                
                for (var f in o) {
                    if (fs.getByKey(f) !== undefined) {
                        me.set(f, o[f]);
                    }
                }
            },
            failure: function(response) {
                me.setExpanding(false);
                c.error("Failed to expand the record with additional information from uri");
                c.error(response);
            },
            scope: me
        });
    }
});