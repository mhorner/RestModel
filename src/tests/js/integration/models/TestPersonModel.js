Ext.define("TestPersonModel", {
    extend: "Ext.ux.data.RestModel",
    
    config: {
        fields: [
             {name: 'id', type:'int'},
             {name: 'name', type: 'string'},
             {name: 'email', type: 'string'},
             {name: 'uri', type: Ext.data.Types.Uri},
             {name: 'address', type: 'string'},
             {name: 'phone', type: 'string'}
        ],
        hasMany: {
            model: 'TestInterestsModel', 
            name: 'getInterests', 
            autoLoad: true, 
            foreignKey: 'person_id'
        }
    }
});