MdExtFormParser = function (){

    this.qstr = '';
    this.AND = ' ';
    this.OR = ' OR ';

    this.htmlspecialchars = function(s){
        s = s.replace(/&/g, '&amp;');
        s = s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return s;
    }

    this.parseTextField = function(s, name, lk){
        if(!s) return '';
        s = s.replace(/\s+/g, " ");
        if(s.indexOf(this.OR)==-1) var tokens=[s];
        else var tokens = s.split(this.OR);
        for(var i=0;i<tokens.length;i++){
            if(tokens[i].indexOf(this.AND)>-1){
                var atokens = tokens[i].split(this.AND);
                for(var j=0;j<atokens.length;j++){
                    if(lk) atokens[j] = name+" like '*" + atokens[j].trim() + "*'";
                    else atokens[j] = name+"='"+atokens[j].trim()+"'";
                }
                tokens[i] = "("+atokens.join(" AND ")+")";
            }
            else{
                if(lk) tokens[i]= name+" like '*"+tokens[i].trim()+"*'";
                else tokens[i]= name+"='"+tokens[i].trim()+"'";
            }
        }
        s = tokens.join(" OR ");
        if(tokens.length>1) s = "("+s+")";
        return s;
    }

    this.add = function(s){
        if(!s) return;
        if(this.qstr) this.qstr += " AND ";
        this.qstr += s;
    }

    this.addQuery = function(str, name, lk, parse){
        if(str){
            str = this.htmlspecialchars(str);
            if(parse) this.add(this.parseTextField(str,name,lk));
            else {
                if(lk) this.add(name+" like '"+str+"*'");
                else this.add(name+"='"+str+"'");
            }
        }
    }

    this.parse = function(f){
        this.qstr = '';
        this.addQuery(f.anytext,f.ttype,true, false);
        this.addQuery(f.keywords,'subject',true);
        this.addQuery(f.onege,'subject',true);
        this.addQuery(f.hierarchyLevelName,'HierarchyLevelName',true);
        var partySub = (f.partySub=="on");
        if(f.role=='metadata' || !f.role){
            this.addQuery(f.party,'MetadataContact',partySub);
        }
        else if(f.role=='primary'){
            this.addQuery(f.party,'MetadataContact',partySub);
            this.addQuery('1','IsPrimary',false);
        }
        else{
            this.addQuery(f.party,'OrganisationName',partySub);
            this.addQuery(f.role,'role',false);
        }
        if(f.bbox){
            if(f.inside=="on") this.addQuery(f.bbox,'ibbox',false);
            else this.addQuery(f.bbox,'bbox',false);
        }
        if(f.tempFrom) this.add("TempExtent_begin>="+AdvancedSearch.SearchForm.date2iso(f.tempFrom));
        if(f.tempTo) this.add("TempExtent_end<="+AdvancedSearch.SearchForm.date2iso(f.tempTo));
        if(f.dateType){
            var dtype = f.dateType.substr(0,1).toUpperCase()+f.dateType.substr(1);
            if(f.dateFrom) this.add(dtype+"Date>="+AdvancedSearch.SearchForm.date2iso(f.dateFrom));
            if(f.dateTo) this.add(dtype+"Date<="+AdvancedSearch.SearchForm.date2iso(f.dateTo));
        }
        if(f.modifiedFrom) this.add("modified>="+AdvancedSearch.SearchForm.date2iso(f.modifiedFrom));
        if(f.modifiedTo) this.add("modified<="+AdvancedSearch.SearchForm.date2iso(f.modifiedTo));
        if(f.scale1) this.add("Denominator>="+f.scale1);
        if(f.scale2) this.add("Denominator<="+f.scale2);
        if(f.hlevel){
            if(f.hlevel=='data'){
                this.add("(type=dataset OR type=series)");
                this.addQuery(f.topic,'TopicCategory',false);
            } else if(f.hlevel=='map'){
                //this.add("type=application");
                this.add("hierarchyLevelName=MapContext");
            } else if(f.hlevel=='service'){
                this.addQuery(f.hlevel,'type',false);
                this.addQuery(f.serviceType,'ServiceType',false);
                this.addQuery(f.serviceClass, 'subject', false);
            } else {
                this.addQuery(f.hlevel,'type',false);
            }
        }
        this.addQuery(f.language,'language',false);
        this.addQuery(f.ConditionApplyingToAccessAndUse,'ConditionApplyingToAccessAndUse',true);
        this.addQuery(f.otherConstraints,'OtherConstraints',true);
        if(f.inspireKeyword){
            //jako specifikace
            if(f.compliant=="on"){
                this.addQuery(f.inspireKeyword,'SpecificationTitle',true);
                this.addQuery('1','degree',false); // TODO udelat true
            }
            // jako klic. slovo
            else{
                    this.addQuery(f.inspireKeyword,'subject',false);
            }
        }
        return this.qstr;
    }
}; //end class
