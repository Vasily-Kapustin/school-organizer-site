var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaGen = require('../config/formGenerator');
var superSchema = {
    name: [{type: String,required:true},{inputType:'text',label:'Name',validator:'NE'}],
    date: [{type: Date,required:true},{inputType:'date',label:'Date',validator:'date'}],
    link: [{type: String},{inputType:'text',label:'Link'}],
    notes:[{type: String},{inputType:'textarea',label:'Notes'}],
    watched: [{type: String,default:0},{inputType:'checkbox',label:'Watched',validator:'NE'}],
    course:[{type:String,required:true},{inputType:'text',uneditable:true}],
    topic:[{type:String,required:false,default:""},{inputType:'text',uneditable:true}],
    cards:[{type:Array},{}]
};

var superSets = {
    create:[{data:'settings',dataLink:true},
        {data:"set",size:"6", subData:[{data:'name'},{data:'link'},{data:"button",label:"Create",hidden:"hidden"}]},
        {data:"set",size:"6",subData:[{data:'date'},{data:'watched'}]}],
    edit:[{data:'settings',edit:"all"},
        {data:"set",size:"6", subData:[{data:'name'},{data:'link'},{data:"button",label:"Edit",hidden:"hidden"}]},
        {data:"set",size:"6",subData:[{data:'date'},{data:'watched'}]}]

}
var schema = new Schema(schemaGen.schemaGen("lectures",superSchema,superSets));

module.exports = mongoose.model('Lecture',schema);