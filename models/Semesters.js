var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaGen = require('../config/formGenerator');
var superSchema = {
    name: [{type: String, required: true},{inputType:'text',label:'Name',validator:'NE'}],
    dateStart: [{type: String, required: true},{inputType:'date', label:'Starting Date',validator:'date'}],
    dateEnd: [{type: String, required: true},{inputType:'date', label:'Ending Date',validator:'date'}],
    courses: [{type: Array, default:[]},{}],
    dateCreated: [{type: Date, default:Date.now(), required: true},{inputType:'text', label:'Date of Creation', uneditable:true}],
    dateLastEdit: [{type: Date, default:Date.now(), required: true},{inputType:'text', label:'Date of Last Edit', uneditable:true}],
};

var superSets = {
    create:[{data:'settings'},
        {data:"set",size:"6", subData:[{data:'name'},{data:"button",label:"Create",hidden:"hidden"}]},
        {data:"set",size:"6", subData:[{data:'dateStart'},{data:'dateEnd'}]}],
    edit:[{data:'settings',edit:"all"},
        {data:"set",size:"6", subData:[{data:'name'},{data:"button",label:"Edit",hidden:"hidden"}]},
        {data:"set",size:"6", subData:[{data:'dateStart'},{data:'dateEnd'}]}],

}
var schema = new Schema(schemaGen.schemaGen("semesters",superSchema,superSets));

module.exports = mongoose.model('Semester',schema);