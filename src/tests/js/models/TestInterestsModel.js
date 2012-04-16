Ext.define('TestInterestsModel', {
    extend: 'Ext.ux.data.RestModel',
    
    config: {
        fields: [
             {name: 'id'},
             {name: 'person_id'},
             {name: 'uri', type: Ext.data.Types.Uri},
             {name: 'name'},
             {name: 'comment'},
        ],
        proxy: {
            type: 'ajax',
            url: 'json/interests.json'
        },
        belongsTo: 'TestPersonModel'
    }
});