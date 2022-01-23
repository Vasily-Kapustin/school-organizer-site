
var superSets={};
var superSchemas={};
var useCsrf=false;
var csrfToken="";
var editData= {};
var elements= {};
var validator={};
var data={};
elements.text = function (name, label,edit) {
    var str ='';
    var ro="";
    var value="";
    if(edit!=undefined){
        if(edit.value){
            value=edit.value;
        }
        if(edit.edit==false){
            ro="readonly";
        }
    }
    var a =' <div class="form-group"><label>';
    var b ='</label><input type="text" class="form-control" name="'+ name + '" placeholder="Enter '+label+'" value="'+value+'" '+ro+'><div></div></div>';
    str+=a+label+b;
    return str;
};
elements.email = function (name, label,edit,confirm) {
    var str ='';
    var ro="";
    var value="";
    if(edit!=undefined){
        value=edit.value;
        if(edit.edit==false){
            ro="readonly";
        }
    }
    var a ='<div class="form-group"><label>';
    var b ='</label><input type="email" class="form-control" name="'+ name + '" aria-describedby="emailHelp" placeholder="Enter email" value="'+value+'" '+ro+'><div></div></div>';
    str+=a+label+b;
    if(confirm){
        str+=a+'Confirm '+label+'</label><input type="email" class="form-control" name="'+ name + 'confirm" aria-describedby="emailHelp" placeholder="Enter email"><div></div></div>';
    }
    return str;
};
elements.password = function (name, label,edit,confirm) {
    var str ='';
    if(edit==undefined){
        var a ='<div class="form-group"><label>';
        var b ='</label><input type="password" class="form-control" name="'+ name + '" placeholder="Password"><div></div></div>';
        str+=a+label+b;
        if(confirm){
            str+=a+'Confirm '+label+'</label><input type="password" class="form-control" name="'+ name + 'confirm" placeholder="Password"><div></div></div>';
        }
    }else if(edit.edit==true){
        var a ='<div class="form-group"><label>';
        var b ='</label><input type="text" class="form-control" name="'+ name + '" placeholder="Password" value="'+edit.value+'"><div></div></div>';
        str+=a+label+b;
    }else{
        var a ='<div class="form-group"><label>';
        var b ='</label><input type="text" class="form-control" name="'+ name + '" placeholder="Password" readonly value="'+edit.value+'"><div></div></div>';
        str+=a+label+b;
    }
    return str;
};
elements.checkbox = function (name, label,edit) {
    var str ='';
    var ro="";
    var val="";
    if(edit!=undefined){
        if(edit.value==1){
            val="checked";
        }
        if(edit.edit==false){
            ro="disabled";
        }
    }
    var a ='<div class="form-check form-switch-xl form-switch" style="padding: 10px;"><input type="checkbox" class="form-check-input" '+val+' '+ ro+' name="'+ name + '"><label class="form-check-label" >'+label+'</label></div>';
    str+=a;
    return str;
};
elements.textarea = function (name, label,edit) {
    var str ='';
    var ro="";
    var val="";
    if(edit!=undefined){
        val =edit.value;
        if(edit.edit==false){
            ro="disabled";
        }
    }
    var a ='<div class="form-group"><label for="exampleFormControlTextarea1">';
    var b ='</label><textarea class="form-control" name="'+ name + '" rows="3" '+ro+'>'+val+'</textarea><div></div></div>';
    str+=a+label+b;
    return str;
};
elements.select = function (name, label,edit,options) {
    var str ='';
    var a ='<div class="form-group"><label for="exampleFormControlSelect1">';
    var b ='</label><select class="form-control" name="'+ name + '">\n';
    str+=a+label+b;
    for(var i = 0;i<options.length;i++){
        var sel='';
        var dis='';
        if(edit!=undefined){
            if(edit.value==options[i]) {
                sel = 'selected="selected"';
            }
            if(edit.value!=options[i]&&edit.edit==false) {
                dis = 'disabled';
            }
        }
        str+='<option '+sel +' '+ dis +'>';
        str+=options[i];
        str+='</option>';
    }
    str += '</select><div></div></div>';
    return str;
};

elements.selectM = function (name, label,edit,options) {
    var str ='';
    var a ='<div class="form-group"><label for="exampleFormControlSelect1">';
    var b ='</label><select class="form-control" multiple name="'+ name + '">\n';
    str+=a+label+b;
    for(var i = 0;i<options.length;i++){
        var sel='';
        var dis='';
        if(edit!=undefined){
            if(edit.value==options[i]) {
                sel = 'selected="selected"';
            }
            if(edit.value!=options[i]&&edit.edit==false) {
                dis = 'disabled';
            }
        }
        str+='<option '+sel +' '+ dis +'>';
        str+=options[i];
        str+='</option>';
    }
    str += '</select><div></div></div>';
    return str;
};

elements.year = function (name, label,edit,options) {
    var str ='';
        var a ='<div class="form-group"><label for="exampleFormControlSelect1">';
        var b ='</label><select class="form-control" name="'+ name + '">\n';
        str+=a+label+b;
        var start=parseInt(options[0]);
        var end =0;
        var dt = new Date();
        if(options[1]=="CY"){
            end = dt.getFullYear();
        }else{
            end = parseInt(options[1]);
        }
        for(var i = start;i<(end+1);i++){
            if(edit!=undefined){
                if(edit.edit==true){
                    if(edit.value==i){
                        str+='<option selected="selected">';
                        str+=i;
                        str+='</option>';
                    }else{
                        str+='<option>';
                        str+=i;
                        str+='</option>';
                    }
                }else{
                    if(edit.value==i) {
                        str+='<option selected="selected">';
                        str+=i;
                        str+='</option>';
                    }
                }
            }else{
                str+='<option>';
                str+=i;
                str+='</option>';
            }
        }
        str += '</select><div></div></div>';
    return str;
};
elements.date = function (name, label,edit) {
    var str = '';
    var val="";
    if(edit==undefined){
        var a = '<div class="form-group"><label for="exampleDate">';
        var b = ' </label><div class="input-group date">\n' +
            '    <input type="text" name="' + name + '" class="form-control DP" placeholder="MM/DD/YYYY"'+val+'><div></div>\n' +
            '    <div class="input-group-addon">\n' +
            '        <span class="glyphicon glyphicon-th"></span>\n' +
            '    </div>\n' +
            '</div></div>\n';
        str += a + label + b;
    }else{
        if(edit.edit=true){
            if(edit.value!=""){
                var date = new Date(edit.value);
                var strd = "";
                if((date.getMonth()+1)<10){
                    strd+="0"
                }
                strd+=(date.getMonth()+1) +'/';
                console.log("DAte:" + date.getDate());
                if((date.getDate())<10){
                    strd+="0"
                }
                strd+=(date.getDate()) +'/'+date.getFullYear();
                val='value="'+strd+'"';
            }
            var a = '<div class="form-group"><label for="exampleDate">';
            var b = ' </label><div class="input-group date">\n' +
                '    <input type="text" name="' + name + '" class="form-control DP" placeholder="MM/DD/YYYY"'+val+'><div></div>\n' +
                '    <div class="input-group-addon">\n' +
                '        <span class="glyphicon glyphicon-th"></span>\n' +
                '    </div>\n' +
                '</div></div>\n';
            str += a + label + b;
        }else {
            var date = new Date(edit.value);
            var strd = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
            var a = ' <div class="form-group"><label>';
            var b = '</label><input type="text" class="form-control" name="' + name + '" placeholder="Text" value="' + strd + '" readonly><div></div></div>';
            str += a + label + b;
        }
    }
    return str;
};

elements.CP = function (name, label,edit,options) {
    var str = '';
    var a = '<div class="form-group input-group-sm">\n' +
        '    <button class="btn btn-secondary btn-sm CPLaunch" type="button" url="/configs/" >';
    var b = '</button>\n' +
        '    <input name="';
    var c = '" class="form-control CPHidden" readonly value="';
    var d = '">\n' +
        '    <button class="btn btn-secondary btn-sm CPClear" type="button">Clear</button>\n' +
        '    <div class="CPSub">';
    //var f = '    <textarea class="form-control CPPickerTextArea" name="'+name+'Text" rows="4"></textarea>\n';
    var e = '    </div>' + '</div>';

    str=a+label+b+name+c;
    if(edit!=undefined){
        str+=edit.value;
    }
    str+=d;
    for(var i=0;i<options.length;i++){
        if(options[i] == "Text"){
            var val="";
            var ro =""
            if(edit!=undefined){
                val = edit.valueText;
                if(edit.edit==false){
                    ro="disabled";
                }
            }
            str+='    <textarea class="form-control CPPickerTextArea" name="'+name+'Text" rows="4" '+ro+'>'+val+'</textarea>\n';
        }else{
            var val="";
            var ro =""
            if(edit!=undefined){
                val = edit['value'+options[i]];
                if(edit.edit==false){
                    ro="readonly";
                }
            }
            str+='    <label>'+ options[i] +'</label><input type="text" class="form-control" name="'+ name+options[i] + '" placeholder="Enter ' + options[i] + '" value="'+val+'" '+ro+'>';
        }
    }
    str+=e;
    return str;
};
elements.OT = function (objArr,edit) {
    var str = '';
    var a='<div class="form-group clearfix" style="margin-top: 15px;margin-bottom: 15px;">\n';
    var b='    <div  style="float:left;width:';
    var c='%">\n' +
        '        <label for="">'
    var d='</label>\n' +
        '        <div class="input-group-sm" ';
    var x = ' >\n'
    var e='            <input type="text" class="form-control OTInput" value="'
    var f='"';
    var z= '>';
    var g='        </div>\n'+
        '        <textarea name="';
    var h='" style="display: none">';
    var i='</textarea>\n' +
        '    </div>';
    var j ='    <div style="float:left;">\n' +
        '        <div><button type="button" class="btn btn-secondary btn-sm OTAdd" ';
    var k='>Add Line</button></div>\n';
    var l= '        <div><button type="button" class="btn btn-outline-secondary btn-sm OTRmv" ';
    var m='>Remove</button></div>\n';
    var n='    </div>'
    var o='</div>';
    if(edit==undefined){
        //Create
        str+=a;
        for(var ic=0;ic<objArr.length;ic++){
            str+=b+objArr[ic].size+c+objArr[ic].label+d;
            if(objArr[ic].total){
                str+='total="true"';
            }
            str+=x+e+f+z;
            if(objArr[ic].total){
                str+=e+f+"readonly"+z;
            }
            str+=g+objArr[ic].name+h+i;
        }
        str+=j+k+l+m+n+o;
    }else{
        if(edit.edit=true){
            //Edit
            str+=a;
            var len =1;
            for(var ic=0;ic<objArr.length;ic++){
                str+=b+objArr[ic].size+c+objArr[ic].label+d;
                if(objArr[ic].total){
                    str+='total="true"'
                }
                str+=x;
                var tot=0;
                var temp=[];
                if(objArr[ic].edit){
                    temp=objArr[ic].edit.split('|');
                    len=temp.length;
                }else{
                    temp =[""];
                }

                for(var jc=0;jc<len;jc++){
                    str+=e+temp[jc]+f+z;
                    if(objArr[ic].total){
                        tot += parseFloat(temp[jc]);
                    }
                }
                console.log(objArr[ic].total);
                if(objArr[ic].total){
                    str+=e+tot+f+"readonly"+z;
                }
                if(objArr[ic].edit){
                    str+=g+objArr[ic].name+h+objArr[ic].edit+i;
                }else{
                    str+=g+objArr[ic].name+h+i;
                }

            }
            str+=j+k;
            for(var ic=0;ic<len;ic++) {
                str+=l + m;
            }
            str+=n+o;
        }else {
            //VIEW ONLY
            str+=a;
            var len =0;
            for(var ic=0;ic<objArr.length;ic++){
                str+=b+objArr[ic].size+c+objArr[ic].label+d;
                if(objArr[ic].total){
                    str+='total="true"'
                }
                str+=x;
                var temp=[];
                if(objArr[ic].edit){
                    temp=objArr[ic].edit.split('|');
                    len=temp.length;
                }
                for(var jc=0;jc<len;jc++){
                    str+=e+temp[jc]+f+"readonly"+z;
                }
                if(objArr[ic].total){
                    str+=e+f+"readonly"+z;
                }
                str+=g+objArr[ic].name+h+objArr[ic].edit+i;
            }
            str+=j+"disabled"+k;
            for(var ic=0;ic<len;ic++) {
                str+=l +"disabled"+ m;
            }
            str+=n+o;
        }
    }
    return str;
};

elements.label = function (label) {
    var str = '<div class="form-group"><label>'+label+'</label></div>';
    return str;
};



elements.NU = function (name, label,edit,options) {
    var ro="";
    var val="";
    if(edit!==undefined){
        val=edit.value;
        if(edit.edit=true){

        }else{
            ro="readonly";
        }
    }
    var str ='<div class="form-group">\n' +
        '    <label for="">'+label+'</label>\n' +
        '    <div style="width: 100%" class="clearfix">\n' +
        '    <input type="text" class="form-control" name="'+name+'" value="'+val+'" '+ro+' aria-label="" style="width:50%;float:left;" >\n' +
        '    <select class="form-control" name="'+options.unitName+'" style="width:50%; float: left;">\n';
    for(var i = 0;i<options.options.length;i++){
        var sel='';
        var dis='';
        if(edit!=undefined){
            if(edit.valueUnit==options.options[i]) {
                sel = 'selected="selected"';
            }
            if(edit.valueUnit!=options.options[i]&&edit.edit==false) {
                dis = 'disabled';
            }
        }
        str+='<option '+sel +' '+ dis +'>';
        str+=options.options[i];
        str+='</option>';
    }
    str += '</select></div></div>';
    return str;
};
elements.MP = function (name, label,edit,options) {
    var str ='';
    var ro="readonly";
    var value=edit.value;
    var values=edit.values;

    var a =' <div class="form-group"><label>';
    var b ='</label><input type="text" class="form-control" name="'+ name + '" placeholder="Enter '+label+'" value="'+values+'" '+ro+'><input type="text" style="display: none" name="'+ name + 'ID"  value="'+value+'"><div></div></div>';
    str+=a+label+b;
    return str;
};
elements.IP = function (name, label,edit,options) {
    var str ='';
    var ro="";
    var value="";
    var a =' <div class="form-group"><label>';
    var b ='</label><input type="text" class="form-control" name="'+ name + '" placeholder="Enter '+label+'" value="'+edit.value+'" readonly><div></div></div>';
    str+=a+label+b;
    return str;
};

validator.email = function(email){
   var ret={res:"",err:"",ptr:""};
   if(!email.includes("@")){
       ret.res="fail";
       ret.err="Please enter an email address";
   }
   else if(!email.includes(".")){
       ret.res="fail";
       ret.err="Please enter an email address";
   }else{
       ret.res="success";
   }
    return ret;
};

validator.password = function(password){
    var ret={res:"",err:"",ptr:""};
    if(password.length<4){
        ret.res="fail";
        ret.err="Please make a longer password";
    } else{
        ret.res="success";
    }
    return ret;
};

validator.NE = function(text){
    var ret={res:"",err:"",ptr:""};
    if(text.length<1){
        ret.res="fail";
        ret.err="Please type something in";
    } else{
        ret.res="success";
    }
    return ret;
};
validator.date = function(text){
    var ret={res:"",err:"",ptr:""};
    var flag= false;
    if(text.length==10){
        var nums = text.split("/");
        if(nums.length==3){
            if(parseInt(nums[0])<13&&parseInt(nums[1])<32&&nums[2].length==4){
                flag=true;
            }
        }
    }
    if(!flag){
        ret.res="fail";
        ret.err="Please pick a date";
    } else{
        ret.res="success";
    }
    return ret;
};


module.exports ={
    buildForm:function(model,format,url){

        var str="<form class='schemaJS' url='"+url+"'>";

        var superSch = superSchemas[model];

        var sets = superSets[model];


        var set = sets[format];

        var editOveride=false;
        var dataLink=false;
        for(var i =0;i<set.length;i++) {
            if (set[i].data == "settings") {
                if(set[i].edit=='all'){
                    editOveride=true;
                }
                if(set[i].dataLink==true){
                    dataLink=true;
                }
            }
        }
        str+=subDataSet(superSch,set,editOveride);
        if(useCsrf){
            str+='<input type="text" style="display: none;" name="_csrf" value="'+csrfToken+'">';
        }
        if(dataLink){
            str+='<div style="display: none">';
            Object.keys(data).forEach(function (item) {
                str+='<input type="text" name="'+item+'" value="'+data[item]+'">';
            })
            str+='</div>';
        }
        if(editOveride){
            str+='<input type="text" style="display: none;" name="_id" value="'+editData._id+'">';
        }
        str += "</form>"
        return str;
    },
    extract:function(model,format,body){
        var set=[];
        var sets = superSets[model];
        set = sets[format];
        var superSch = superSchemas[model];
        var data = subDataSetExtract(set,superSch,body);
        return data;
    },
    validate:function(model,data){
        var err ={res:"success",err:[]};
        var errs=[];
        var superSch={};
        superSch = superSchemas[model];
        Object.keys(data).forEach(function (item) {
            var sub={};
            if(item.substr(-7)=="confirm"){
                if(data[item.substr(0,item.length-7)]==data[item]){
                    sub={res:"success",err:"",ptr:item};
                }else{
                    sub={res:"fail",err:"Does not match",ptr:item};
                }
                errs.push(sub);
            }else{
                var temp  = superSch[item][1].validator;
                if(temp==undefined){
                }else{
                    sub = validator[temp](data[item]);
                    sub.ptr=item;
                    errs.push(sub);
                }

            }
        });
        for(var i =0;i<errs.length;i++){
            if(errs[i].res=="fail"){
                err.res="fail";
                err.err.push({err:errs[i].err,ptr:errs[i].ptr});
            }
        }
        return err;
    },
    schemaGen:function(model,superS,set){
        var sch ={};
        for (var i in superS) {
            sch[i] = superS[i][0];
        }
        superSets[model]=set;
        superSchemas[model]=superS;
        return sch;
    },
    useCsrf:function () {
        useCsrf=true;
    },
    csrf:function (token) {
        csrfToken=token;
    },
    setEditData:function (datas) {
        editData = datas;
    },
    passData:function(datas){
        data=datas;

    }
};

function subDataSet(superSch,set,editOveride){

    var editOver = editOveride;

    var rowFlag=false;
    var str="";
    var setSize=12;
    for(var i =0;i<set.length;i++) {
        if (set[i].data != "settings") {
            if (set[i].data != "set") {
                if(set[i].data != "button") {
                    if(set[i].data != "object") {
                        if(set[i].data != "label") {
                            var edit = set[i].edit;
                            var single = superSch[set[i].data];
                            if (edit != undefined || editOver) {
                                var te = edit;
                                edit = {};
                                edit.edit = te;
                                edit.value = "";
                                if (editData[set[i].data]) {
                                    edit.value = editData[set[i].data];
                                }
                                if (single[1].inputType == "CP") {
                                    var options =single[1].options;
                                    for(var k =0;k<options.length;k++) {
                                        if (editData[set[i].data + options[k]]) {
                                            edit['value' + options[k]] = editData[set[i].data + options[k]];
                                        } else {
                                            edit['value' + options[k]] = "";
                                        }
                                    }
                                }
                                if (single[1].inputType == "NU") {
                                    edit.valueUnit = editData[single[1].options];
                                }
                            }
                            var label = single[1].label;
                            var confirm = set[i].confirm;
                            var options = single[1].options;
                            if (single[1].inputType == "NU") {
                                options = {};
                                options.unitName = single[1].options;
                                options.options = superSch[single[1].options][1].options;
                            }
                            if (single[1].inputType == "MP") {
                                edit = {}
                                edit.value = data.MBOLID;
                                edit.values = data.MBOL;
                            }
                            if (single[1].inputType == "IP") {
                                edit = {}
                                edit.value = data[set[i].data];
                            }
                            if (confirm != undefined) {
                                if (options != undefined) {
                                    str += elements[single[1].inputType](set[i].data, label, edit, options, confirm);
                                } else {
                                    str += elements[single[1].inputType](set[i].data, label, edit, confirm);
                                }
                            } else {
                                if (options != undefined) {
                                    str += elements[single[1].inputType](set[i].data, label, edit, options);
                                } else {
                                    str += elements[single[1].inputType](set[i].data, label, edit);
                                }
                            }
                        }else{
                            str += elements["label"](set[i].label);
                        }
                    }else{

                        var arr = set[i].subData;
                        var objArr =[];
                        var names=[];
                        var labels=[];
                        var sizes=[];
                        var edit = set[i].edit;
                        if (edit != undefined || editOver) {
                            var te = edit;
                            edit = {};
                            edit.edit = true;

                        }
                        for(var l=0;l<arr.length;l++){
                            var tEdit="";
                            if(edit != undefined|| editOver) {
                                tEdit = editData[arr[l].data];
                            }
                            var tObj = {name:arr[l].data,size:arr[l].size,label:superSch[arr[l].data][1].label,edit:tEdit,total:arr[l].total}
                            objArr.push(tObj);
                        }
                        str += elements['OT'](objArr,edit);
                    }
                }else{
                    if(set[i].hidden!=undefined){
                        str+='<button style="display: none;" type="submit" class="btn btn-primary submit">'+ set[i].label+'</button>';
                    }else{
                        str+='<button type="submit" class="btn btn-primary submit">'+ set[i].label+'</button>';
                    }

                }
            } else {
                if(setSize==12){
                    str+='<div class="row">';
                    rowFlag=true;
                }
                if(set[i].size!=undefined){
                    setSize-=set[i].size;
                    if(setSize<0){
                        str+='</div><div class="row">';
                        setSize=12;
                    }
                    str+='<div class="col-'+set[i].size+'">';
                }else{
                    str+='<div class="col-'+setSize+'">';
                }
                str+=subDataSet(superSch,set[i].subData,editOver);
                str+='</div>';
                if(setSize==0){
                    str+='</div>';
                    setSize=12;
                }
            }
        }else{
            if(set[i].editOveride==true){
                editOver=true;
            }
        }
    }
    return str;
}

function subDataSetExtract(set,superSch,body){
    var data={};
    for(var i =0;i<set.length;i++){
        if(set[i].data!="settings"&&set[i].data!="button"&&set[i].data!="set"&&set[i].data!="object"&&set[i].data!="label") {
            if((set[i].edit!=false&&superSch[set[i].data][1].uneditable!=true)||(set[i].edit==undefined&&superSch[set[i].data][1].uneditable==true)) {

                data[set[i].data] = body[set[i].data];
                if (set[i].confirm == true) {
                    var temp = body[set[i].data + 'confirm'];
                    data[set[i].data + 'confirm'] = temp;
                }
                if(superSch[set[i].data][1].inputType=="CP"){
                    var ops = superSch[set[i].data][1].options;
                    for(var k=0;k<ops.length;k++){
                        data[set[i].data+ops[k]] = body[set[i].data+ops[k]];
                    }

                }
                if(superSch[set[i].data][1].inputType=="NU"){
                    var ops = superSch[set[i].data][1].options;
                    data[ops] = body[ops];


                }
            }
        }
        if(set[i].data=="set"){
            var sub  = subDataSetExtract(set[i].subData,superSch,body);
            var temp = Object.assign(data,sub);
            data = temp;
        }
        if(set[i].data=="object"){
            var temp = set[i].subData;
            for(var j=0;j<temp.length;j++){
                data[temp[j].data] = body[temp[j].data];
            }
        }
    }
    return data;
}