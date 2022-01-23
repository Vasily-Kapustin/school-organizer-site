var express = require('express');
var router = express.Router();
var formGen = require('../config/formGenerator');
var Assignment = require('../models/Assignments');
var Course = require('../models/Courses');

router.post('/getAsss', function(req, res, next) {
    Assignment.find({course:req.body.id}).sort({ date: 1 }).exec(function(err,data){
        if(!err){
            var datas = [];
            for(var i= 0;i<data.length;i++){
                var dat = {_id:data[i]._id,name:data[i].name,date:data[i].date,course:data[i].course,notes:data[i].notes,done:data[i].done,early:false};
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

router.post('/getAss', function(req, res, next) {
    Assignment.findOne({"_id":req.body.id},function(err,result){
        if(!err){
            console.log(result);
            res.send({res:result,err:"success"});
        }else{
            res.send({res:err,err:"fail"});
        }
    });
});

router.post('/createDigAssignment', function(req, res, next) {
    formGen.passData({corID: req.body.corID});
    res.send(formGen.buildForm("lectures","create","/assignments/createAssignment"));
});

router.post('/editDigAssignment', function(req, res, next) {
    Assignment.findOne({"_id":req.body.id},function(erro,result){
        console.log(result);
        formGen.setEditData(result);
        res.send(formGen.buildForm("lectures","edit","/assignment/editAssignment"));
    });
});

router.post('/createAssignment', function(req, res, next) {
    var data=formGen.extract("assignments","create",req.body);
    data.course=[req.body.corID];
    var err= formGen.validate("assignments",data);

    if(err.res=="success"){
        var newObject = new Assignment();
        Object.keys(data).forEach(function (item) {
            newObject[item]=data[item];
        });
        newObject.dateCreated = Date.now();
        newObject.dateLastEdit = Date.now();
        newObject.save(function(erro,result){
            if(erro){
                console.log(erro);
                err.res="fail";
            }
            else{
                Course.findOneAndUpdate({"_id":req.body.corID},  { $push: { assignments: result._id  } },  function(erroro, doc) {
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
            res.send(err);
        });
    }else{
        res.send(err);
    }
});

router.post('/editAssignment', async function(req, res, next) {
    var data=formGen.extract("assignments","edit",req.body);
    var err= formGen.validate("assignments",data);
    if(err.res=="success"){
        var newObject = {};
        Object.keys(data).forEach(function (item) {
            newObject[item] = data[item];
        });
        let doc = await Assignment.findOneAndUpdate({_id: req.body._id}, {$set: newObject}, {
            new: true
        });
        console.log(doc);
        res.send({res:data,err:"success"});
    }else{
        res.send(err);
    }
});
module.exports=router;