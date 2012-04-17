Ext.define('Ext.ux.data.RestModel', {
    extend: 'Ext.data.Model',
    mixin: ['Ext.mixin.Observable'],
    
    /** events
     */
    BEGIN_EXPANDING: 'beginExpanding',
    AFTER_EXPANDING: 'afterExpanding',
    
    config: {
        uriName: "uri",
        expanding: false,
        uriExpanded: false
    },
    
    get: function(fN) {
        var me = this,
            v = me.callParent(arguments),
            isUriField = me._isUriField(fN);
        
        if (!isUriField && Ext.isEmpty(v) && !me.getUriExpanded()) {
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

        me.fireEvent(v === true ? me.BEGIN_EXPANDING : me.AFTER_EXPANDING);
        return v;
    },
    
    expand: function() {
        var me = this,
            uriPresent = me._isUriField(me.getUriName()),
            c = console;
        
        if (!uriPresent) {
            return; // nothing to expand
        }
        me.setUriExpanded(true);
        me.setExpanding(true);
        
        var uri = me.get(me.getUriName());
        Ext.Ajax.request({
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
    },
    
    /* private */
    _isUriField: function(fN) {
        var me = this,
            un = me.getUriName(),
            isFieldNameUriName = fN === un,
            returnValue = false;
        
        if (isFieldNameUriName) {
            var uriField = me.getFields().getByKey(fN);
            if (Ext.isObject(uriField)) {
                returnValue = uriField.getType().type === Ext.data.Types.Uri.type;
            }
            
        }

        return returnValue;
    }
});