var lecture = null;

function getLecs(corID){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/lectures/getLecs");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            console.log(res);
            var smbd = $("#la-lecs");
            smbd.html("");
            var data = res.res;
            for(var i =0;i<data.length;i++){

                var col = "#eaa191";
                if(data[i].link==""||data[i].link==undefined){
                    col = "#ea6059";
                }
                if(data[i].early==true){
                    col = "#ebebeb";
                }
                if(data[i].watched=="1"){
                    col = "#9fdea1"
                }
                var str = '<div class="la-con" style="background:'+col+';"><div class="la-main"><div class="la-name lec-name">'+ data[i].name +'</div><div class="la-edit lec-edit" id="'+ data[i]._id +'" >⋮</div></div><div class="la-time">'+ dateToStr(data[i].date) +'</div></div>';
                smbd.append(str);
            }
            $(".lec-edit").click(function (){
                var id =$(this).attr("id");
                lecEdit(id);
                $("#addModal").modal('show');
            });
            $(".lec-name").click(function (){
                hideCourse();
                var id = $(this).next().attr("id")
                initLecture(id);
            });
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({id:corID}));
}

function getLec(lecID,cb){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/lectures/getLec");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            cb(JSON.parse(xhr.responseText));
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({id:lecID}));
}

$("#lecAddButton").click(function (){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/lectures/createDigLecture");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            $("#addModal").find(".modal-title").html("Add a Lecture");
            $("#addModal").find(".modal-body").html(xhr.responseText);
            initSchemaGen($("#addModal").find(".schemaJS"),lecsCB);
            var buttonText = $("#addModal").find(".submit").html();
            console.log(buttonText);
            $("#addModal").find(".submitAlt").html(buttonText);

        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({corID:course._id}));
});
function lecEdit(id){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/lectures/editDigLecture");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            $("#addModal").find(".modal-body").html(xhr.responseText);
            initSchemaGen($("#addModal").find(".schemaJS"),lecsCB);
            var buttonText = $("#addModal").find(".submit").html();
            console.log(buttonText);
            $("#addModal").find(".modal-title").html("Edit Lecture");
            $("#addModal").find(".submitAlt").html(buttonText);
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({id:id}));
}
var lecsCB= function(data){
    $("#addModal").modal('hide');
    getLecs(course._id);
}

var getLecCB = function(lec){
    if(lec.err="success") {
        lecture = lec.res;
        console.log(lecture);
        $(".web-header").html(course.code+" "+lecture.name+" "+dateToStr(lecture.date));
        var cb = $(".lec-body");
        if(lecture.watched=="1"){
            cb.find(".form-check-input").prop('checked', true);
        }else{
            cb.find(".form-check-input").prop('checked', false);
        }
        if(lecture.link==undefined||lecture.link==""){
            cb.find(".lec-lint").html("Link: Empty");
        }else{
            cb.find(".lec-lint").html("<b>Link: </b>"+lecture.link);
        }
        if(lecture.notes != undefined&&lecture.notes!=""){
            console.log(JSON.parse(lecture.notes));
            editor.setContents(JSON.parse(lecture.notes));
        }else{
            editor.setText('\n');
        }
        var sel = $(".lec-tsel");
        var selStr="";
        if(lecture.topic==''||lecture.topic == undefined){
            selStr= "<option selected>N/A</option>";
        }else{
            selStr= "<option>N/A</option>";
        }
        for(var i=0;i<course.topics.length;i++){
            var sstr = ""
            if(course.topics[i] == lecture.topic){
                sstr = "selected";
            }
            selStr+='<option '+sstr+' value="'+course.topics[i]+'">'+course.topics[i]+'</option>';
        }
        sel.html(selStr);
        if(redSkipper==false){
            window.history.pushState({semester:semester,course:course,lecture:lecture,state:3}, "lecture", "/courses/info/lecture");
        }else{
            redSkipper=false;
        }
        getCards(course._id);
    }else{
        hideLecture();
        initCourse(course._id);
    }
}

function initLecture(lecID){
    $(".lec-body").show();
    getLec(lecID,getLecCB);
}
function hideLecture(){
    if(lecture!=null) {
        sendNotes(JSON.stringify(editor.getContents()));
    }
    $(".lec-body").hide();
}

$("#lec-copy").click(function (){
    navigator.clipboard.writeText(lecture.link);
});
$("#lec-red").click(function (){
    window.open(lecture.link,'_blank');
});

function sendNotes(doc){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/lectures/sendNotes");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(JSON.parse(xhr.responseText));
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    var ch=0;
    if($(".lec-body").find(".form-check-input").is(":checked")) {
        ch = 1;
    }else{
        ch = 0;
    }

    var tselval = $(".lec-tsel").val();
    if(tselval=="N/A"){
        tselval="";
    }
    xhr.send(JSON.stringify({doc:doc,id:lecture._id,watched:ch,topic:tselval}));

}
