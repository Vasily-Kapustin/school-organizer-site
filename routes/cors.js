var express = require('express');
var router = express.Router();
var formGen = require('../config/formGenerator');
var Course = require('../models/Courses');
var Semester = require('../models/Semesters');
var Lecture = require('../models/Lectures');
var Assignment = require('../models/Assignments');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'SOS' });
});
router.get('/info', function(req, res, next) {
    res.render('index', { title: 'SOS' });
});
router.get('/info/lecture', function(req, res, next) {
    res.render('index', { title: 'SOS' });
});


router.post('/getCors', function(req, res, next) {
    Course.find({ sem: req.body.id}).sort({ dateCreated: -1 }).exec(function(err,data){
        if(!err){
            res.send({res:data,err:"success"});
        }else{
            res.send({res:err,err:"fail"});
        }
    });
});

router.post('/getCor', function(req, res, next) {
    Course.findOne({"_id":req.body.id},function(err,result){
        if(!err){
            res.send({res:result,err:"success"});
        }else{
            res.send({res:err,err:"fail"});
        }
    });
});


router.post('/createCourse', function(req, res, next) {
    var data=formGen.extract("courses","create",req.body);
    data.sem=[req.body.semID];
    if(data.testNum=='0'){
        data.testD1="00/00/0000";
        data.testD2="00/00/0000";
        data.testD3="00/00/0000";
    }
    if(data.testNum=='1'){
        data.testD2="00/00/0000";
        data.testD3="00/00/0000";
    }
    if(data.testNum=='2'){
        data.testD3="00/00/0000";
    }
    var err= formGen.validate("courses",data);
    console.log(err);
    if(err.res=="success"){
        var newObject = new Course();
        Object.keys(data).forEach(function (item) {
            newObject[item]=data[item];
        });
        newObject.dateCreated = Date.now();
        newObject.dateLastEdit = Date.now();
        newObject.save(function(erro,result){
            if(erro){
                console.log(erro);
                err.res="fail";
                res.send(err);
            }
            else{
                Lecture.insertMany(genLects(data.lectureTiming,data.dateStart,data.dateEnd,"Lecture",result._id)).then(function (lecs) {
                    var lidarr=[];
                    for(var i =0;i<lecs.length;i++){
                        lidarr.push(lecs[i]._id);
                    }
                    Assignment.insertMany(genLects(data.assignmentTiming,data.dateStart,data.dateEnd,"Assignment",result._id)).then(function (asss) {
                        var aidarr=[];
                        for(var i =0;i<asss.length;i++){
                            aidarr.push(asss[i]._id);
                        }
                        Course.findOneAndUpdate({"_id":result._id},  { $push: { lectures:{$each: lidarr },assignments:{$each: aidarr }} },  function(error, docc) {
                            if (error){
                                err.res="fail";
                                return res.send(err);
                            }else{
                                Semester.findOneAndUpdate({"_id":req.body.semID},  { $push: { courses: result._id  } },  function(erroro, doc) {
                                    if (erroro){
                                        err.res="fail";
                                        return res.send(err);
                                    }else{
                                        err.res="success";
                                        err.data=result;
                                        return res.send(err);
                                    }
                                });
                            }
                        });
                    }).catch(function (err) {
                        console.log("docs failed");
                        console.log(err);
                        err.res="fail";
                        return res.send(err);
                    });
                }).catch(function (err) {
                    console.log("docs failed");
                    console.log(err);
                    err.res="fail";
                    return res.send(err);
                });
            }

        });
    }else{
        res.send(err);
    }
});

router.post('/editCourse', async function(req, res, next) {
    var data=formGen.extract("courses","edit",req.body);
    if(data.testNum=='0'){
        data.testD1="00/00/0000";
        data.testD2="00/00/0000";
        data.testD3="00/00/0000";
    }
    if(data.testNum=='1'){
        data.testD2="00/00/0000";
        data.testD3="00/00/0000";
    }
    if(data.testNum=='2'){
        data.testD3="00/00/0000";
    }
    var err= formGen.validate("courses",data);
    if(err.res=="success"){
        var newObject = {};
        Object.keys(data).forEach(function (item) {
            newObject[item] = data[item];
        });
        let doc = await Course.findOneAndUpdate({_id: req.body._id}, {$set: newObject}, {
            new: true
        });
        console.log(doc);
        res.send({res:data,err:"success"});
    }else{
        res.send(err);
    }
});

router.post('/createDigCourse', function(req, res, next) {
    formGen.passData({semID: req.body.semID});
    res.send(formGen.buildForm("courses","create","/courses/createCourse"));
});

router.post('/editDigCourse', function(req, res, next) {
    Course.findOne({"_id":req.body.id},function(erro,result){
        console.log(result);
        formGen.setEditData(result);
        res.send(formGen.buildForm("courses","edit","/courses/editCourse"));
    });
});

router.post('/addTopic', async function(req, res, next) {
    var err= {res:"fail",err:""};
    var t = req.body.top;
    console.log(req.body);
    if(t!=""){
        Course.findOne({"_id":req.body.id},function(erro,result){
            var tops= result.topics;
            if(erro){
                err= {res:"fail",err:"Internal Server Error"};
                return res.send(err);
            }else {
                if (tops.includes(t)) {
                    err= {res:"fail",err:"Topic already exists"};
                    return res.send(err);
                }else{
                    tops.push(t);
                    Course.findOneAndUpdate({"_id":req.body.id},  { topics:tops },  {new: true},function (error,doc){
                        if (error){
                            err.res="fail";
                            res.send(err);
                        }else{
                            console.log(doc);
                            console.log(doc.topics);
                            err.res="success";
                            err.data=doc;
                            console.log(err);
                            res.send(err);
                        }
                    });

                }
            }
        });
    }else{
        err= {res:"fail",err:"Name Can't be empty"};
        return res.send(err);
    }
});
router.post('/editTopic', async function(req, res, next) {
    var err= {res:"fail",err:""};
    var pt = req.body.pt;
    var t = req.body.top;
    console.log(req.body);
    console.log("r1");
    if(t!=""){
        Course.findOne({"_id":req.body.id},function(erro,result){
            var tops= result.topics;
            var grps =result.groups;
            if(erro){
                err= {res:"fail",err:"Internal Server Error"};
                return res.send(err);
            }else {
                if (tops.includes(t)) {
                    err= {res:"fail",err:"Topic/Group already exists"};
                    return res.send(err);
                }else{
                    var ntops = [];
                    var ngrps= [];
                    for (var i = 0; i < tops.length; i++) {
                        if (tops[i] == pt) {
                            ntops.push(t);
                        }else{
                            ntops.push(tops[i]);
                        }
                    }
                    for (var i = 0; i < grps.length; i++) {
                        if (grps[i] == pt) {
                            ngrps.push(t);
                        }else{
                            ngrps.push(grps[i]);
                        }
                    }
                    console.log(ngrps);
                    console.log(ntops);
                    console.log(pt);
                    console.log(t);
                    console.log("r2");
                    Course.findOneAndUpdate({"_id": req.body.id}, {topics: ntops, groups: ngrps}, {new: true}, function (error, doc) {
                        if (error) {
                            err.res = "fail";
                            res.send(err);
                        } else {
                            console.log(doc);
                            console.log(doc.topics);
                            err.res = "success";
                            err.data = doc;
                            console.log(err);
                            res.send(err);
                        }
                    });
                }
            }
        });
    }else{
        err= {res:"fail",err:"Name Can't be empty"};
        return res.send(err);
    }
});

router.post('/addGroup', async function(req, res, next) {
    var err= {res:"fail",err:""};
    var t = req.body.top;
    var ts = req.body.tops;
    console.log(req.body);
    if(t!=""){
        console.log("t0");
        Course.findOne({"_id":req.body.id},function(erro,result){
            console.log("t1");
            var tops= result.groups;
            if(erro){
                err= {res:"fail",err:"Internal Server Error"};
                return res.send(err);
            }else {
                console.log("t2");
                var bl = false;
                if (tops.includes(t)) {
                    err= {res:"fail",err:"Topic/Group already exists"};
                    return res.send(err);
                }else{
                    tops.push(t);
                    tops.push.apply(tops,ts);
                    tops.push("");
                    console.log(tops);
                    console.log("t3");
                    Course.findOneAndUpdate({"_id":req.body.id},  { groups:tops },  {new: true},function (error,doc){
                        console.log("t4");
                        if (error){
                            err.res="fail";
                            res.send(err);
                        }else{
                            console.log(doc);
                            console.log(doc.topics);
                            err.res="success";
                            err.data=doc;
                            console.log(err);
                            res.send(err);
                        }
                    });
                }
            }
        });
    }else{
        err= {res:"fail",err:"Name Can't be empty"};
        return res.send(err);
    }
});

router.post('/editGroup', async function(req, res, next) {
    var err= {res:"fail",err:""};
    var pt = req.body.pt;
    var t = req.body.top;
    var ts = req.body.tops;
    console.log(req.body);
    if(t!=""){
        console.log("t0");
        Course.findOne({"_id":req.body.id},function(erro,result){
            console.log("t1");
            var tops= result.groups;
            if(erro){
                err= {res:"fail",err:"Internal Server Error"};
                return res.send(err);
            }else {
                console.log("t2");
                var bl = false;
                if (tops.includes(t)) {
                    err= {res:"fail",err:"Topic/Group already exists"};
                    return res.send(err);
                }else{
                    var start=-1;
                    var end=-1;
                    for (var i = 0; i < tops.length; i++) {
                        if (tops[i] == pt) {
                            start=i;
                        }
                        if(tops[i]==""&&end==-1&&start!=-1){
                            end=i;
                        }
                    }
                    tops.splice(start,end-start+1);
                    tops.push(t);
                    tops.push.apply(tops,ts);
                    tops.push("");
                    console.log(tops);
                    console.log("t3");
                    Course.findOneAndUpdate({"_id":req.body.id},  { groups:tops },  {new: true},function (error,doc){
                        console.log("t4");
                        if (error){
                            err.res="fail";
                            res.send(err);
                        }else{
                            console.log(doc);
                            console.log(doc.topics);
                            err.res="success";
                            err.data=doc;
                            console.log(err);
                            res.send(err);
                        }
                    });
                }
            }
        });
    }else{
        err= {res:"fail",err:"Name Can't be empty"};
        return res.send(err);
    }
});

module.exports = router;

function genLects (timing,start,end,nameS,cid){
    var arr= [];
    var counter = 1;
    var tim = [];
    for(var i =0;i<timing.length;i++){
        if(timing[i]=="Sunday"){tim.push(0);}
        if(timing[i]=="Monday"){tim.push(1);}
        if(timing[i]=="Tuesday"){tim.push(2);}
        if(timing[i]=="Wednesday"){tim.push(3);}
        if(timing[i]=="Thursday"){tim.push(4);}
        if(timing[i]=="Friday"){tim.push(5);}
        if(timing[i]=="Saturday"){tim.push(6);}

    }
    var sd = new Date(start);
    var ed = new Date(end);
    var daysb= Math.round((ed-sd)/(1000*60*60*24))+1;
    for(var i=0;i<daysb;i++){
        for(var j =0;j<tim.length;j++){
            if(sd.getDay() == tim[j]){
                arr.push({name:nameS+" "+ counter,date:new Date(sd.valueOf()),course:cid});
                counter++;
            }
        }
        sd.setDate(sd.getDate() + 1);
    }
    return arr;
}