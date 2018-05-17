var mongoose = require('mongoose')
var studentResponseSchema = new mongoose.Schema({
  problemName: {type:String, trim:true, lowercase:true, default:''},
  teacher: {type:String, trim:true, lowercase:true, default:''},
  responses: {type:Array, required:true, default:[]},
  timestamp: {type:Date, required:true, default: Date.now()}

})

module.exports = mongoose.model('studentResponseSchema', studentResponseSchema)
