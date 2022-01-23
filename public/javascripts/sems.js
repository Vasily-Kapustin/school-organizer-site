function initSems(){
    getSems();
    $(".web-header").html("School Organizer");
    $(".sem-body").show();

}
function hideSems(){
    $(".sem-body").hide();
}

$("#semAddButton").click(function (){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/semesters/createDigSemester");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            $("#addModal").find(".modal-title").html("Add a Semester");
            $("#addModal").find(".modal-body").html(xhr.responseText);
            initSchemaGen($("#addModal").find(".schemaJS"),semesCB);
            var buttonText = $("#addModal").find(".submit").html();
            console.log(buttonText);
            $("#addModal").find(".submitAlt").html(buttonText);

        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({}));
});

var semesCB= function(data){
    console.log("Call Back");
    console.log(data);
    $("#addModal").modal('hide');
    getSems();
}
function semEdit(id){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/semesters/editDigSemester");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            $("#addModal").find(".modal-body").html(xhr.responseText);
            $("#addModal").find(".modal-title").html("Edit Semester");
            initSchemaGen($("#addModal").find(".schemaJS"),semesCB);
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
function getSems(){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/semesters/getSems");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            console.log(res);
            var smbd = $(".sem-sems");
            smbd.html("");
            var data = res.res;
            for(var i =0;i<data.length;i++){
                var str = '<div class="sem-sem"><div class="sem-main"><div class="sem-name">'+ data[i].name +'</div><div class="sem-edit" id="'+ data[i]._id +'" >⋮</div></div><div class="sem-time">'+ data[i].dateStart +' to '+ data[i].dateEnd +'</div></div>';
                smbd.append(str);
            }
            $(".sem-edit").click(function (){
                var id =$(this).attr("id");
                semEdit(id);
                $("#addModal").modal('show');
            });
            $(".sem-name").click(function (){
                hideSems();
                var id = $(this).next().attr("id")
                initCors(id);
            });
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({}));
}

function getSem(semId,cb){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/semesters/getSem");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            cb(JSON.parse(xhr.responseText));
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify({id:semId}));
}