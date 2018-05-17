studentResponses = require('../models/studentResponses')

module.exports = {
  get: function(){
    return new Promise(function(resolve, reject){
      // null =
      studentResponses.find(null, function(err, inquiries){
        if (err){
          reject(err)
          return
        }
        resolve(inquiries)
      })
    })
  },
  getById: function(id){
    return new Promise(function(resolve, reject){
      studentResponses.findById(id, function(err, studentResponses){
        if (err){
          reject(err)
          return
        }
        resolve(studentResponses)
      })
    })
  },
  post: function(params){
    return new Promise(function(resolve, reject){
      studentResponses.create(params, function(err, item){
        if (err){
          reject(err)
          return
        }
        resolve(item)
        return
      })

    })
  }
}
