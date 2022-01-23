var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaGen = require('../config/formGenerator');
var superSchema = {
    name: [{type: String,required:true},{inputType:'text',label:'Name',validator:'NE'}],
    date: [{type: Date,required:true},{inputType:'date',label:'Date',validator:'date'}],
    topic:[{type: String},{inputType:'textarea',label:'Notes'}],
    course:[{type:String,required:true},{inputType:'text',uneditable:true}],
    lecture:[{type:String,required:true},{inputType:'text',uneditable:true}],
    dateCreated: [{type: Date, default:Date.now(), required: true},{inputType:'text', label:'Date of Creation', uneditable:true}],
    dateLastEdit: [{type: Date, default:Date.now(), required: true},{inputType:'text', label:'Date of Last Edit', uneditable:true}],
};

var superSets = {
    create:[{data:'settings'},
        {data:"set",size:"6", subData:[{data:'name'},{data:'oldAccountNum'},{data:'email'},{data:'contact'},{data:'phone'},{data:'phoneAlt'},{data:'memo'}]},
        {data:"set",size:"6",subData:[{data:'street'},{data:'city'},{data:'province'},{data:'country'}, {data:'zip'},{data:'fax'},{data:'faxAlt'},{data:"button",label:"Create"}]}],
    edit:[{data:'settings',edit:"all"},
        {data:"set",size:"6", subData:[{data:'name'},{data:'oldAccountNum'},{data:'email'},{data:'contact'},{data:'phone'},{data:'phoneAlt'},{data:'memo'}]},
        {data:"set",subData:[{data:'street'},{data:'city'},{data:'province'},{data:'country'}, {data:'zip'},{data:'fax'},{data:'faxAlt'},{data:"button",label:"Edit"}]}],

}
var schema = new Schema(schemaGen.schemaGen("agents",superSchema,superSets));

module.exports = mongoose.model('Agent',schema);