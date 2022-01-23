var express = require('express');
var router = express.Router();
var formGen = require('../config/formGenerator');
var Semester = require('../models/Semesters');

router.post('/getSems', function(req, res, next) {
    Semester.find().sort({ dateCreated: -1 }).exec(function(err,data){
        if(!err){
            res.send({res:data,err:"success"});
        }else{
            res.send({res:err,err:"fail"});
        }
    });
});

router.post('/getSem', function(req, res, next) {
    Semester.findOne({"_id":req.body.id},function(err,result){
        if(!err){
            console.log(result);
            res.send({res:result,err:"success"});
        }else{
            res.send({res:err,err:"fail"});
        }
    });
});

router.post('/createSemester', function(req, res, next) {
    var data=formGen.extract("semesters","create",req.body);
    var err= formGen.validate("semesters",data);

    if(err.res=="success"){
        var newObject = new Semester();
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
                console.log("Semester created");
                err.link="/";
                err.data=result;
            }
            res.send(err);
        });
    }else{
        res.send(err);
    }
});

router.post('/editSemester', async function(req, res, next) {
    var data=formGen.extract("semesters","edit",req.body);
    var err= formGen.validate("semesters",data);
    if(err.res=="success"){
        var newObject = {};
        Object.keys(data).forEach(function (item) {
            newObject[item] = data[item];
        });
        let doc = await Semester.findOneAndUpdate({_id: req.body._id}, {$set: newObject}, {
            new: true
        });
        console.log(doc);
        res.send({res:data,err:"success"});
    }else{
        res.send(err);
    }
});

router.post('/createDigSemester', function(req, res, next) {
    res.send(formGen.buildForm("semesters","create","/semesters/createSemester"));
});

router.post('/editDigSemester', function(req, res, next) {
    Semester.findOne({"_id":req.body.id},function(erro,result){
        console.log(result);
        formGen.setEditData(result);
        res.send(formGen.buildForm("semesters","edit","/semesters/editSemester"));
    });
});

module.exports = router;
