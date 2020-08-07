$(function() {


axios.get('./php/mypage.php')
  .then(function (response) {
    console.log(response.data.result);
    if(response.data.result == 'session exists') {

      // Other Languages内のテーブル要素を生成
      let tables = '';
      for(i=0; i<response.data.otherANDlevel.length; i++) {
        tables += '<div class="language_table">';
        tables += '<table><tr><th colspan="3" class="lanName">';
        tables += response.data.otherANDlevel[i]['otherlanguages'];
        tables += '</th></tr><tr><th>Learning Level</th><td>:</td><td>';
        tables += response.data.otherANDlevel[i]['learningLevel'];
        tables += '</td></tr>';

        for(j=0; j<response.data.certification[i].length; j++) {
          tables += '<tr><th></th><td>:</td><td>';
          tables += response.data.certification[i][j]['certification'];
          tables += '</td></tr>';
        }

        tables += '</table>';
        tables += '</div>';
      }

      let thumbnailURL = 'user_default2.png';

      if(response.data.thumbnailURL != null) {
        thumbnailURL = response.data.thumbnailURL;
      }


      console.log(response.data.otherANDlevel[0]['otherlanguages']);


      $('#userInfo').html('<div id="editContain" class="modeEdit">'+
        '<button class=\"edit resetBtn\" type="button\" name=\"button\"><i class=\"fas fa-edit fa-2x\"></i></button>'+
      '</div>'+
      '<h2>Hello, '+response.data.name+'!!</h2>'+
      '<div id="userImageFormWrap">'+
        // '<form id="userImageForm" enctype="multipart/form-data" method="post">'+
          '<p class="userImage"><img src="./img/'+thumbnailURL+'"></p>'+
          // '<label for="file_photo">'+
          //   '＋Choose a photo'+
            '<input id="file_photo" type="file" name="userfile" accept="image/*">'+
        //   '</label>'+
        // '</form>'+
      '</div>'+
      '<div id="profile" class="dividend">'+
        '<h3>Profile</h3>'+
        '<table>'+
          '<tr>'+
            '<th>Gender</th>'+
            '<td>:</td>'+
            '<td>'+response.data.gender+'</td>'+
          '</tr>'+
          '<tr>'+
            '<th>Age</th>'+
            '<td>:</td>'+
            '<td>'+response.data.age+'</td>'+
          '</tr>'+
          '<tr>'+
            '<th>Mother Tongue</th>'+
            '<td>:</td>'+
            '<td>'+response.data.motherTongue+'</td>'+
          '</tr>'+
        '</table>'+
      '</div>'+
      '<div id="otherLanguages" class="dividend">'+
        '<h3>Other Languages</h3>'+
        '<div class="language">'+tables+'</div>'+
      '</div>'+
      '<div id="introduce" class="dividend">'+
        '<h3>Introduce</h3>'+
        '<div id="introText">'+
          '<p>'+response.data.introduce+'</p>'+
        '</div>'+
      '</div>');


      $('.language table tr:nth-of-type(3) th').html('Certification');

    } else {
      $('#userInfo').html('<h2>Hello, guest!!</h2>'+
        '<p class=\"userImage\">'+
          '<img src=\"./img/user_default2.png\">'+
        '</p>'+
        '<div id=\"promptLogin\">'+
          '<h3>You need to login or register to use all functions!</h3>'+
          '<ul>'+
            '<div class=\"BtnBg loginBtnBg\">'+
              '<li class=\"Btn loginBtn\">Login</li>'+
            '</div>'+
            '<div class=\"BtnBg RegBtnBg\">'+
              '<li class=\"Btn RegBtn\">Register</li>'+
            '</div>'+
          '</ul>'+
        '</div>');
    }
  })
  .catch(function (error) {
      console.log(error);
  });




});
