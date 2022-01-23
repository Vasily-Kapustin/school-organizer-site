var express = require('express');
var router = express.Router();
var formGen = require('../config/formGenerator');
var Lecture = require('../models/Lectures');
var Course = require('../models/Courses');
var mongoose = require('mongoose');

router.post('/getLecs', function(req, res, next) {
    Lecture.find({course:req.body.id}).sort({ date: 1 }).exec(function(err,data){
        if(!err){
            var datas = [];
            for(var i= 0;i<data.length;i++){
                var dat = {_id:data[i]._id,name:data[i].name,date:data[i].date,course:data[i].course,watched:data[i].watched,notes:data[i].notes,link:data[i].link,early:false};
                if(dat.date>new Date()){
                    dat.early=true;
                }
                datas.push(dat);
            }
            res.send({res:datas,err:"success"});
        }else{
            res.send({res:err,err:"fail"});
        }
    });
});

router.post('/getLec', function(req, res, next) {
    Lecture.findOne({"_id":req.body.id},function(err,result){
        if(!err){
            console.log(result);
            res.send({res:result,err:"success"});
        }else{
            res.send({res:err,err:"fail"});
        }
    });
});

router.post('/createDigLecture', function(req, res, next) {
    formGen.passData({corID: req.body.corID});
    res.send(formGen.buildForm("lectures","create","/lectures/createLecture"));
});

router.post('/editDigLecture', function(req, res, next) {
    Lecture.findOne({"_id":req.body.id},function(erro,result){
        console.log(result);
        formGen.setEditData(result);
        res.send(formGen.buildForm("lectures","edit","/lectures/editLecture"));
    });
});

router.post('/createLecture', function(req, res, next) {
    var data=formGen.extract("lectures","create",req.body);
    data.course=req.body.corID;
    var err= formGen.validate("lectures",data);
    console.log(data);
    if(err.res=="success"){
        var newObject = new Lecture();
        Object.keys(data).forEach(function (item) {
            newObject[item]=data[item];
        });
        newObject.dateCreated = Date.now();
        newObject.dateLastEdit = Date.now();
        console.log(newObject);
        newObject.save(function(erro,result){
            if(erro){
                console.log(erro);
                err.res="fail";
                res.send(err);
            }
            else{
                Course.findOneAndUpdate({"_id":req.body.corID},  { $push: { lectures: result._id  } },  function(erroro, doc) {
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
    }else{
        res.send(err);
    }
});

router.post('/editLecture', async function(req, res, next) {
    var data=formGen.extract("lectures","edit",req.body);
    var err= formGen.validate("lectures",data);
    if(err.res=="success"){
        var newObject = {};
        Object.keys(data).forEach(function (item) {
            newObject[item] = data[item];
        });
        let doc = await Lecture.findOneAndUpdate({_id: req.body._id}, {$set: newObject}, {
            new: true
        });
        console.log(doc);
        res.send({res:data,err:"success"});
    }else{
        res.send(err);
    }
});

router.post('/sendNotes', async function(req, res, next) {
    var err= {res:"fail"};
    console.log(req.body);
    Lecture.findOneAndUpdate({"_id":req.body.id},  { notes: req.body.doc,watched:req.body.watched,topic:req.body.topic},  function(erroro, doc) {
        if (erroro){
            err.res="fail";
            return res.send(err);
        }else{
            err.res="success";
            err.data=doc;
            return res.send(err);
        }
    });

});

router.post('/delete', async function(req, res, next) {
    var err= {res:"fail"};
    console.log(req.body);
    Lecture.findOne({"_id":req.body.id},function(erro,result) {
        if(erro){
            err.res = "fail";
            res.send(err);
        }else {
            console.log(result);
            Course.findOneAndUpdate({"_id": result.course}, {$pullAll: {lectures: [mongoose.Types.ObjectId(req.body.id)]}}, function (erroro, doc) {
                if (erroro) {
                    console.log(erroro);
                    err.res = "fail";
                    res.send(err);
                } else {
                    console.log(doc);
                    Lecture.deleteOne({"_id": req.body.id}, function (error) {
                        if (error) {
                            err.res = "fail";
                            res.send(err);
                        } else {
                            err.res = "success";
                            err.data = doc;
                            res.send(err);
                        }
                        // deleted at most one tank document
                    });
                }
            });
        }
    });


});

module.exports=router;