function SetTypeValue(type, menu) {
	Ext.query('form.simpleForm input[name=type]')[0].value = type;
	Ext.query('form.simpleForm input[name=menuId]')[0].value = menu;
	Ext.select('#north a.active').removeClass('active');
	Ext.get(menu).addClass('active');
}
