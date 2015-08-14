CSWAddForm = function(catClient,config){

		this.catClient = catClient;
		this.url = config.url;

		this.predefinedCSWStore = new Ext.data.JsonStore({
			url:this.url,
			baseParams: {request: "getservices"},
			root: 'services',
			id: 'serviceName',
			fields: ['serviceName','title','link','tab','method']
		});

		this.addPanel = new Ext.Panel({
			id: 'addPanel',
			title: '<font style="color: white">.</font>',
			iconCls: 'cat-imgsprite drop-add',
			border: false,
			autoScroll: true,
			listeners:{'activate': function(p){
				p.doLayout();
			}},
			items: [{
				title: HS.i18n('Add Predefined Catalogue'),
				layout: 'form',
				xtype: 'form',
				border: false,
				frame: true,
				buttonAlign: 'left',
				autoHeight: true,
				defaults:{
					width: 300
				},
				items:[{
					name: 'predefinedCSW',
					xtype: 'combo',
					store: this.predefinedCSWStore,
					fieldLabel: HS.i18n('Catalogue'),
					displayField: 'title',
					valueField: 'serviceName',
					forceSelection: true,
					autoLoad: true,
					hiddenName: 'serviceName',
					typeAhead: true,
					selectOnFocus: true,
					triggerAction: 'all',
					value: '',
					listeners:{
					'select': function(combo, record, index){
						this.items.items[0].form.items.items[1].setValue(record.data.title);
					}, scope: this
					}
				},{
					xtype: 'hidden',
					name: 'predtitle',
					value: ''
				}],
				buttons: [{
					text: HS.i18n('Add'),
					scope: this,
					handler: function(){
						var formValues = this.items.items[0].form.getValues();
						formValues.url = this.url;
						formValues.title = formValues.predtitle;
						this.catClient.addService(formValues);
					}
				}]
			},{
				title: HS.i18n('Add Custom Catalogue'),
				border: false,
				frame: true,
				layout: 'form',
				xtype: 'form',
				buttonAlign: 'left',
				autoHeight: true,
				defaults:{
					width: 300
				},
				items:[{
					xtype: 'textfield',
					name: 'title',
					fieldLabel: HS.i18n('Title')
				},{
					xtype: 'textfield',
					name: 'url',
					fieldLabel: 'URL'
				},{
					xtype: 'checkbox',
					name: 'Soap',
					fieldLabel: 'SOAP',
					checked: false
				}],
				buttons: [{
					text: HS.i18n('Add'),
					scope: this,
					handler: function(){
						this.items.items[1].form.submit({
							url: this.url,
							scope: this,
							params:{request: 'addservice', tab: 'true'},
							success: function(form,action){
								var formValues = form.getValues();
								formValues.serviceName = Ext.util.JSON.decode(action.response.responseText).service.name;
								formValues.url = this.url;
								this.catClient.addService(formValues);
							}
						})
					}
				}]
			}]
		});
		CSWAddForm.superclass.constructor.call(this,this.addPanel);
}

Ext.extend(CSWAddForm, Ext.Panel, {});
