var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaGen = require('../config/formGenerator');
var superSchema = {
    name: [{type: String, required:true},{inputType:'text',label:'Name',validator:'NE'}],
    code: [{type: String, required:true},{inputType:'text',label:'Code',validator:'NE'}],
    prof: [{type: String},{inputType:'text',label:'Prof Name'}],
    profEmail: [{type: String},{inputType:'text',label:'Prof Email'}],
    ta: [{type: String},{inputType:'text',label:'TA Name'}],
    taEmail: [{type: String},{inputType:'text',label:'TA Email'}],
    testNum: [{type: Number, required:true},{inputType:'select',label:'Number of Tests',validator:'NE', options:["0","1","2","3"]}],
    testD1: [{type: String},{inputType:'date', label:'Test 1 Date',validator:'date'}],
    testD2: [{type: String},{inputType:'date', label:'Test 2 Date',validator:'date'}],
    testD3: [{type: String},{inputType:'date', label:'Test 3 Date',validator:'date'}],
    dateStart: [{type: String,required:true},{inputType:'date', label:'Start of Lectures',validator:'date'}],
    dateEnd: [{type: String,required:true},{inputType:'date', label:'End of Lectures',validator:'date'}],
    lectureTiming: [{type: Array},{inputType:'selectM',label:'Lecture Timing', uneditable:true, options:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]}],
    assignmentTiming: [{type: Array},{inputType:'selectM',label:'Assignment Timing', uneditable:true, options:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]}],
    sem: [{type: Array, required:true},{uneditable:true}],
    topics: [{type: Array,required:true, default:[]},{}],
    groups: [{type: Array,required:true, default:[]},{}],
    assignments: [{type: Array,required:true, default:[]},{}],
    lectures: [{type: Array,required:true, default:[]},{}],
    cards: [{type: Array,required:true, default:[]},{}],
    dateCreated: [{type: Date, default:Date.now(), required: true},{inputType:'text', label:'Date of Creation', uneditable:true}],
    dateLastEdit: [{type: Date, default:Date.now(), required: true},{inputType:'text', label:'Date of Last Edit', uneditable:true}],
};

var superSets = {
    create:[{data:'settings',dataLink:true},
        {data:"set",size:"6", subData:[{data:'name'},{data:'prof'},{data:'ta'},{data:'testNum'},{data:'testD2'},{data:'dateStart'},{data:'assignmentTiming'}]},
        {data:"set",size:"6",subData:[{data:'code'},{data:'profEmail'},{data:'taEmail'},{data:'testD1'},{data:'testD3'}, {data:'dateEnd'},{data:'lectureTiming'},{data:"button",label:"Create",hidden:"hidden"}]}],
    edit:[{data:'settings',edit:"all"},
        {data:"set",size:"6", subData:[{data:'name'},{data:'prof'},{data:'ta'},{data:'testNum'},{data:'testD2'},{data:'dateStart'},{data:'assignmentTiming'}]},
        {data:"set",size:"6",subData:[{data:'code'},{data:'profEmail'},{data:'taEmail'},{data:'testD1'},{data:'testD3'}, {data:'dateEnd'},{data:'lectureTiming'},{data:"button",label:"Edit",hidden:"hidden"}]}],

}
var schema = new Schema(schemaGen.schemaGen("courses",superSchema,superSets));

module.exports = mongoose.model('Course',schema);