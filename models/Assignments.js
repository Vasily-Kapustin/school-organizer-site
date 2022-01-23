var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaGen = require('../config/formGenerator');
var superSchema = {
    name: [{type: String,required:true},{inputType:'text',label:'Name',validator:'NE'}],
    date: [{type: Date,required:true},{inputType:'date',label:'Date',validator:'date'}],
    notes:[{type: String},{inputType:'textarea',label:'Notes'}],
    done: [{type: String,default:0},{inputType:'checkbox',label:'Done',validator:'NE'}],
    course:[{type:String,required:true},{inputType:'text',uneditable:true}],

};

var superSets = {
    create:[{data:'settings',dataLink:true},
        {data:"set",size:"6", subData:[{data:'name'},{data:'done'},{data:"button",label:"Create",hidden:"hidden"}]},
        {data:"set",size:"6",subData:[{data:'date'},{data:'notes'}]}],
    edit:[{data:'settings',edit:"all"},
        {data:"set",size:"6", subData:[{data:'name'},{data:'done'},{data:"button",label:"Edit",hidden:"hidden"}]},
        {data:"set",size:"6",subData:[{data:'date'},{data:'notes'}]}],

}
var schema = new Schema(schemaGen.schemaGen("assignments",superSchema,superSets));

module.exports = mongoose.model('Assignment',schema);