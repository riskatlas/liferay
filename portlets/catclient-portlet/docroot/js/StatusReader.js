// --- StatusReader ---
var HSStatusReader = function(config) {
    this.project = config.project;
    this.url     = config.url;
    this.handler = config.handler;

    this.save = function(data){
        /*Ext.Ajax.request({
            url: this.url,
            method: "post",
            success: function(){alert('OK');},
            failure: function(){alert(HS.i18n('StatusReader save failure!'));},
            jsonData: {"project":this.project,"request":"save","data":data}
        });*/
        var format  = new OpenLayers.Format.JSON();
        var str = format.write({"project":this.project,"request":"save","data":data},true);

        var proxy = OpenLayers.ProxyHost;
        OpenLayers.ProxyHost = null;
        var request =  OpenLayers.Request.POST({
            url: this.url,
            data: str,
            async: false,
            success: function(){},
            failure: function(){alert('Save status failure');}
        });
        OpenLayers.ProxyHost = proxy;
  	}



    this.load = function(){
        Ext.Ajax.request({
            url: this.url+'?project='+this.project+'&request=load',
            scope: this,
            success: this.loadResponse,
            failure: function(){alert(HS.i18n('StatusReader load failure!'));}
        });
    }

    this.loadResponse = function(r,o){
        if(r.responseText){
            if(r.responseText=='null'){
                this.handler(null);
                return;
            }else try{
                var data = Ext.util.JSON.decode(r.responseText);
            }catch(e){
                alert(HS.i18n('StatusReader load data error!')+r.responseText);
            }
            this.handler(data);
        }
    }
} // end class
