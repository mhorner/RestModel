Ext.define("Model", {
    extend: "Ext.ux.data.RestModel",
    config: {
        showMask: true,
        fields: ['id', 
                 'name', 
                 'maker_id', 
                 {name: 'uri', type: Ext.data.Types.Uri},
                 'year',
                 'color',
                 'engine',
                 'transmission',
                 'powerMirrors'],
         proxy: {
             type: 'ajax',
         }
    }, 
    expand: function() {
        this.callParent(arguments);
        return this;
    },
    
    loadAndAttachToForm: function(form) {
        var me = this;
        
        me.on({
            'afterExpanding': function() {
                form.setRecord(me);
            },
            scope: this
        });
        
        me.expand();
    }
});

Ext.define("Maker", {
    extend: "Ext.ux.data.RestModel",
    config: {
        fields: ['id', 'name'],
        hasMany: {
            model: "Model",
            associationName: 'models',
            foreignKey: 'maker_id'
        }
    }
});

var store = Ext.create("Ext.data.Store", {
    model: 'Maker',
    proxy: {
        type: 'ajax',
        url: 'data/makers.json',
        reader: {
            type: 'json'
        },
    },
    autoLoad: true
});


Ext.setup({
    viewport: {
        layout: 'fit',
    },
    onReady: function() {
        var nav = null;
        var deselectItem = function(view, index) {
            view.deselect(index);
        };
        
        var makerList = {
            xtype: 'list',
            fullscreen: true,
            title: 'Cars',
            itemTpl: "<div>{name}</div>",
            store: store,
            onItemDisclosure: true,
            listeners: {
                itemtap: function(view, index, item, record) {
                    nav.push({
                        xtype: 'list',
                        fullscreen: true,
                        deselectOnContainerClick: true,
                        title: 'Model',
                        itemTpl: "<div>{name} ({year})</div>",
                        onItemDisclosure: false,
                        store: record.models(),
                        listeners: {
                            itemtap: function(view, index, item, record) {
                                var form = Ext.create("Ext.form.Panel", {
                                    items: [
                                            {xtype: 'textfield', label: "Model", name: 'name'}, 
                                            {xtype: 'textfield', label: "Year", name: 'year'}, 
                                            {xtype: 'textfield', label: 'Color', name: 'color'}, 
                                            {xtype: 'textfield', label: 'Engine', name: 'engine'
                                           }]
                                });
                                
                                record.loadAndAttachToForm(form);
                                nav.push(form);
                                Ext.defer(deselectItem, 250, this, [view, index]);
                            }
                        }
                    });
                    
                    Ext.defer(deselectItem, 250, this, [view, index]);
                }
            }
        };
        
        nav = Ext.create('Ext.navigation.View', {items: [makerList]});
        
        Ext.Viewport.add(nav);
    }
});
