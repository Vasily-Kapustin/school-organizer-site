var semester=null;
var course=null;
function initCors(semId){
    $(".cor-body").show();
    getSem(semId,getSemCB);
}
var getSemCB = function (sem){
    if(sem.err="success") {
        semester = sem.res;
        console.log(semester);
        $(".web-header").html(semester.name);
        if(redSkipper==false) {
            window.history.pushState({semester: semester, state: 1}, "semester", "/courses");
        }else{
            redSkipper=false;
        }
        getCors();
    }else{
        hideCors();
        initSems();
    }
}

function hideCors(){
    $(".cor-body").hide();
}

var corsCB= function(data){
    console.log("Call Back");
    console.log(data);
    $("#addModal").modal('hide');
    getCors();
}

$("#corAddButton").click(function (){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/courses/createDigCourse");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            $("#addModal").find(".modal-title").html("Add a Course");
            $("#addModal").find(".modal-body").html(xhr.responseText);
            initSchemaGen($("#addModal").find(".schemaJS"),corsCB);
            var buttonText = $("#addModal").find(".submit").html();
            console.log(buttonText);
            $("#addModal").find(".submitAlt").html(buttonText);

        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({semID:semester._id}));
});

function getCors(){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/courses/getCors");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            console.log(res);
            var smbd = $(".cor-cors");
            smbd.html("");
            var data = res.res;
            for(var i =0;i<data.length;i++){
                var str = '<div class="cor-cor"><div class="cor-main"><div class="cor-name">'+ data[i].code +'</div><div class="cor-edit" id="'+ data[i]._id +'" >⋮</div></div><div class="cor-time">'+ data[i].name +'</div></div>';
                smbd.append(str);
            }
            $(".cor-edit").click(function (){
                var id =$(this).attr("id");
                corEdit(id);
                $("#addModal").modal('show');
            });
            $(".cor-name").click(function (){
                hideCors();
                var id = $(this).next().attr("id")
                initCourse(id);
            });
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({id:semester._id}));
}

function corEdit(id){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/courses/editDigCourse");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            $("#addModal").find(".modal-body").html(xhr.responseText);
            $("#addModal").find(".modal-title").html("Edit Course");
            initSchemaGen($("#addModal").find(".schemaJS"),corsCB);
            var buttonText = $("#addModal").find(".submit").html();
            console.log(buttonText);
            $("#addModal").find(".submitAlt").html(buttonText);
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({id:id}));
}
function getCor(corId,cb){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/courses/getCor");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            cb(JSON.parse(xhr.responseText));
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({id:corId}));
}

var getCorCB = function (cor){
    if(cor.err="success") {
        course = cor.res;
        console.log(course);
        $(".web-header").html(course.code+" "+course.name);
        var cb = $(".course-body");
        cb.find(".prof-name").html(course.prof);
        cb.find(".prof-email").html(course.profEmail);
        cb.find(".ta-name").html(course.ta);
        cb.find(".ta-email").html(course.taEmail);
        if(redSkipper==false){
            window.history.pushState({semester:semester,course:course,state:2}, "course", "/courses/info");
        }else{
            redSkipper=false;
        }
        setTopics();
        getLecs(course._id);
        getAsss(course._id);
    }else{
        hideCourse();
        initCors(semester._id);
    }
}
function initCourse(corID){
    $(".course-body").show();
    getCor(corID,getCorCB);
}
function hideCourse(){
    $(".course-body").hide();
}

$("#studyButton").click(function (){
});
$("#topAddButton").click(function (){
    dTG ("Add a Topic","addTopic",null);

});
$("#grpAddButton").click(function (){
    dTG ("Add a Group","addGroup",null);
});

function dTG (txt,url,pt){
    $("#topModal").find(".modal-title").html(txt);
    if(pt){
        $("#topModal").find(".form-control").val(pt);
        $("#topModal").find(".topAlt").html("Edit");
    }else{
        $("#topModal").find(".form-control").val("");
        $("#topModal").find(".topAlt").html("Create");
    }
    $("#topModal").find(".invalid-feedback").html("");

    $("#topModal").find(".topAlt").unbind('click');
    $("#topModal").find(".topAlt").click(function(){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "/courses/"+url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                var err = JSON.parse(xhr.responseText);
                if(err.res=="fail"){
                    $("#topModal").find(".invalid-feedback").html(err.err);
                }else{
                    $("#topModal").modal('hide');

                    console.log(err.data);
                    course = err.data;
                    setTopics();
                }
            }
            else if (xhr.status !== 200) {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        if(txt.includes("Group")){
            var ts = [];
            var inps = $(".top-input");
            console.log(inps);
            for(var i=0;i<inps.length;i++){
                var t = $(inps[i]);
                if(t.is(':checked')){
                    ts.push(t.parent().parent().find(".top-name").html());
                }
            }
            console.log(ts);
            xhr.send(JSON.stringify({top:$("#topModal").find(".form-control").val(),tops:ts,id:course._id,pt:pt}));
        }else{
            xhr.send(JSON.stringify({top:$("#topModal").find(".form-control").val(),id:course._id,pt:pt}));
        }

    });
}


function setTopics(){
    var tc = $("#la-tops");
    var gc = $("#la-grps");
    tc.html("");
    gc.html("");
    var top = course.topics;
    var grpu = course.groups;
    var grps=[];
    if(grpu.length>0){
        grps.push(grpu[0]);
    }
    var addable = false;
    for(var i=1;i<grpu.length;i++){
        if(addable==true){
            grps.push(grpu[i]);
            addable=false;
        }
        if(grpu[i]==""){
            addable=true;
        }
    }
    for(var i =0;i<top.length;i++){
        var str = '<div class="top-con" name="'+top[i]+'"><div class="top-check"><input class="form-check-input top-input" type="checkbox" value=""></div><div class="top-main"><div class="top-name">'+top[i]+'</div><div class="top-edit">⋮</div></div></div>';
        tc.append(str);
    }
    gc.append('<div class="grp"><div class="grp-check"><input class="form-check-input grp-input" type="checkbox" value=""></div><div class="grp-wrp"><div class="grp-name">All</div></div></div>');
    for(var i =0;i<grps.length;i++){
        var str = '<div class="grp"><div class="grp-check"><input class="form-check-input grp-input" type="checkbox" value=""></div><div class="grp-wrp"><div class="grp-name">'+grps[i]+'</div>' +
            '<div class="grp-edit">Edit</div><div class="grp-delete">Delete</div></div></div>';
        gc.append(str);
    }
    $(".top-edit").click(function (){
        var pt = $(this).prev().html();
        dTG ("Edit a Topic","editTopic",pt);
        $("#topModal").modal('show');
    });
    $(".grp-edit").click(function (){
        var pt = $(this).prev().html();
        dTG ("Edit a Group","editGroup",pt);
        $("#topModal").modal('show');
    });
    $(".grp-input").click(function (){
        var pt = $(this).parent().parent().find(".grp-name").html();
        var grps = course.groups;
        var trigger = false;
        var set = $(this).is(':checked');
        if(pt == "All"){
            var tops = course.topics;
            for(var i = 0;i<tops.length;i++){
                $("#la-tops").find("[name='"+tops[i]+"']").find(".top-input").prop('checked', set);
            }
        }else {
            for(var i = 0;i<grps.length;i++){
                if(grps[i]==""){
                    trigger=false;
                }
                if(trigger){
                    console.log(grps[i]);
                    $("#la-tops").find("[name='"+grps[i]+"']").find(".top-input").prop('checked', set);
                }
                if(grps[i]==pt){
                    trigger =true;
                }

            }
        }
    });
}