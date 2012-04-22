Ext.define('Ext.ux.data.RestModel', {
    extend: 'Ext.data.Model',
    mixin: ['Ext.mixin.Observable'],
    
    /** events
     */
    BEGIN_EXPANDING: 'beginExpanding',
    AFTER_EXPANDING: 'afterExpanding',
    
    config: {
        showMask: false,
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
    
    displayMasking: function(show) {
        var me = this;

        if (!me.getShowMask() || !Ext.Viewport) {
            return;
        }
        
        Ext.Viewport.setMasked({xtype: 'loadmask', hidden: !show, message: "Retrieving..."});
    },
    
    applyExpanding: function(v) {
        var me = this;

        me.displayMasking(v === true);
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
        
        var op = Ext.create("Ext.data.Operation", operationConfig);
        var callback = function(o) {
            if (o.wasSuccessful()) {
                var record = o.getRecords()[0];
                this.setData(record.getData());
                Ext.callback(config.success, scope, [this, o]);
            }
            else {
                Ext.Logger.error("Failed to expand the record with additional information from uri");
                Ext.callback(config.failure, scope, [null, o]);
            }
            me.setExpanding(false);
            Ext.callback(config.callback, scope, this);
        };
        
        console.log("loading data in 1000ms");
        Ext.defer(proxy.read, 1000, proxy, [op, callback, me]);
    },
    
    expand: function() {
        var me = this,
            uriPresent = me._isUriField(me.getUriName());
        
        if (!uriPresent || me.uriExpanded) {
            me.fireEvent("afterExpanding");
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
                var isDefined = Ext.isDefined(me.data[un]);
                var isUriType = uriField.getType().type === Ext.data.Types.Uri.type;
                returnValue = isDefined && isUriType;
            }
            
        }

        return returnValue;
    }
});