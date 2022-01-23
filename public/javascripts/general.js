var editor ={};
var Delta = {};
var change = {};
$(window).on('load', function() {

   var container = $('.notes-editor').get(0);
   editor = new Quill(container,{
      modules: {
         formula: true,
         toolbar: [[{ 'header': [1, 2, 3, 4, 5, 6, false] }],  ['bold', 'italic', 'underline', 'strike'],[{ 'script': 'sub'}, { 'script': 'super' }], [{ 'list': 'ordered'}, { 'list': 'bullet' }],['link', 'image', 'formula'],['clean']]
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'
   });
   Delta = Quill.import('delta');
   change = new Delta();
   editor.on('text-change', function(delta) {
      change = change.compose(delta);
   });
   window.onpopstate = function(event) {
      console.log(event.state);
      console.log(history);
      //var state = JSON.parse(event.state);
      selector(event.state);
   };
   window.onbeforeunload = function() {
      if (change.length() > 0) {
         return 'There are unsaved changes. Are you sure you want to leave?';
      }
   }
   setInterval(function() {
      if (change.length() > 0 && lecture!=null) {
         console.log('Saving changes', change);
         /*
         Send partial changes
         $.post('/your-endpoint', {
           partial: JSON.stringify(change)
         });*/
         sendNotes(JSON.stringify(editor.getContents()));
         change = new Delta();
      }
   }, 5*1000);
   selector(history.state);
});

var redSkipper = false;
function selector(state){
   console.log(state);
   if(state=="null"||state==null){
      console.log("State null");
   }else{
      console.log("State "+ state.state);
   }
   if(state=="null"||state==null){
      initSems();
      hideCors();
      semester=null;
      hideCourse();
      hideLecture();
      course=null;
      lecture=null;
   }else if(state.state==1){
      hideSems();
      redSkipper = true;
      initCors(state.semester._id);
      hideCourse();
      hideLecture();
      course=null;
      lecture=null;
   }else if(state.state==2){
      hideSems();
      hideCors();
      semester=state.semester;
      redSkipper = true;
      initCourse(state.course._id);
      hideLecture();
      lecture=null;
   }else if(state.state==3){
      hideSems();
      hideCors();
      hideCourse();
      semester=state.semester;
      course=state.course;
      redSkipper = true;
      initLecture(state.lecture._id);
   }
}
$("#addModal").find(".submitAlt").click(function (){
   $("#addModal").find(".submit").click();
});


function dateToStr(dt){
   var date = new Date(dt);
   var strd = "";
   if((date.getMonth()+1)<10){
      strd+="0"
   }
   strd+=(date.getMonth()+1) +'/';
   if((date.getDate())<10){
      strd+="0"
   }
   strd+=(date.getDate()) +'/'+date.getFullYear();
   return strd;
}

$(".btn-delete").click(function (){
   var id = $(this).parent().prev().find('[name="_id"]').val();
   var text = $(this).parent().parent().find('.modal-title').html().toLowerCase();
   var url =""
   if(text.includes("lecture")){
      url = "lectures";
   }else if(text.includes("course")){
      url = "courses";
   }else if(text.includes("sem")){
      url = "semesters";
   }
   var cmodal = $(this).parent().parent().parent().parent();
   cmodal.modal('hide');
   $("#confirmModal").modal('show');
   $("#confirmModal").find('.confDel').unbind('click');
   $("#confirmModal").find('.confDel').click(function(){
      var xhr = new XMLHttpRequest();
      xhr.open('POST', "/"+url+"/delete");
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() {
         if (xhr.status === 200) {
            console.log(JSON.parse(xhr.responseText));
         }
         else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
         }
      };
      xhr.send(JSON.stringify({id:id}));
   });
   $("#confirmModal").find('.goBack').click(function(){
      cmodal.modal('show');
      $("#confirmModal").modal('hide');
   });
});