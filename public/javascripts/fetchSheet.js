console.log("Connected")
$(document).on("click", ".drive-item", function(){
  console.log("clicked")
  $.ajax({
    url: '/sheet',
    type: 'POST',
    data: {id: this.id}
  })
  .then(function(resp){
    console.log(resp)
  })
})
