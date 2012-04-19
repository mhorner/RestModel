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
    
    loadByUri: function(config) {
        var me = this, 
            proxy = me.getProxy(), scope = config.scope || me;
        
        if (!proxy) {
            Ext.Logger.error("Attempting to load a model without a configured proxy.");
        }
        
        var operationConfig = {
            url: config.url,
            action: 'read'
        };
        
        var operation = Ext.create("Ext.data.Operation", operationConfig);
        var callback = function(operation) {
            me.setExpanding(false);
            if (operation.wasSuccessful()) {
                var record = operation.getRecords()[0];
                this.setData(record.getData());
                Ext.callback(config.success, scope, [this, operation]);
            }
            else {
                Ext.Logger.error("Failed to expand the record with additional information from uri");
                Ext.callback(config.failure, scope, [null, operation]);
            }
            Ext.callback(config.callback, scope, this);
        };
        
        proxy.read(operation, callback, me);
    },
    
    expand: function() {
        var me = this,
            uriPresent = me._isUriField(me.getUriName());
        
        if (!uriPresent) {
            return; // nothing to expand
        }
        me.setUriExpanded(true);
        me.setExpanding(true);
        
        var uri = me.get(me.getUriName());
        me.loadByUri({
            url: uri
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