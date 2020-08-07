$(function(){
  axios.get('./php/loginCheck.php')
    .then(function (response) {
      console.log(response.data.html);
      $('#logReg').html(response.data.html);
    })
    .catch(function (error) {
        console.log(error);
    });
});
