function getAsss(corID){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/assignments/getAsss");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            console.log(res);
            var smbd = $("#la-asss");
            smbd.html("");
            var data = res.res;
            for(var i =0;i<data.length;i++){
                var col = "#eaa191";
                console.log(data[i]);
                if(data[i].early==true){
                    col = "#ebebeb";
                }
                if(data[i].watched=="1"){
                    col = "#9fdea1"
                }
                var str = '<div class="la-con" style="background:'+col+';"><div class="la-main"><div class="la-name ass-name">'+ data[i].name +'</div><div class="la-edit ass-edit" id="'+ data[i]._id +'" >⋮</div></div><div class="la-time">'+ dateToStr(data[i].date) +'</div></div>';
                smbd.append(str);
            }
            $(".ass-edit").click(function (){
                var id =$(this).attr("id");
                assEdit(id);
                $("#addModal").modal('show');
            });
            $(".ass-name").click(function (){
                //hideCors();
                var id = $(this).next().attr("id")
                //initCourse(id);
            });
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({id:corID}));
}
$("#assAddButton").click(function (){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/assignments/createDigAssignment");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            $("#addModal").find(".modal-title").html("Add an Assignment");
            $("#addModal").find(".modal-body").html(xhr.responseText);
            initSchemaGen($("#addModal").find(".schemaJS"),asssCB);
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
function assEdit(id){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/assignments/editDigAssignment");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            $("#addModal").find(".modal-body").html(xhr.responseText);
            $("#addModal").find(".modal-title").html("Edit Assignment");
            initSchemaGen($("#addModal").find(".schemaJS"),asssCB);
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
var asssCB= function(data){
    $("#addModal").modal('hide');
    getAsss(course._id);
}