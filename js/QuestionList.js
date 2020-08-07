$(function() {


axios.get('./php/QuestionList.php')
  .then(function (response) {
    console.log(response.data);

    if(response.data.result == 'session exists') {
      let questions = response.data.questions;
      let thumbnailURL = 'user_default2.png';
      let questionHTML ='';
      let i_plus = 0;

      // 受け取った質問の数だけループする
      for(let i =0; i<questions.length; i++) {
        i_plus = i + 1;
        if(questions[i]['thumbnailURL'] != null) {
          thumbnailURL = questions[i]['thumbnailURL'];
        }
        // axiosで受けっとった値を変数に保存
        let audioID = questions[i]['audioID'];
        let audioURL = questions[i]['audioURL'];
        let script = questions[i]['script'];

        // 投票済みか否かを判定
        // 投票済みの場合は投票結果を表示させる
        if(response.data.vote_exists[i]['USERID']) {
          innerVote =
            '<label>'+
              '<p></p>'+'<p></p>'+'<p></p>'+
            '</label>'+

            '<label>'+
              '<p></p>'+'<p></p>'+'<p></p>'+
            '</label>'+

            '<label>'+
              '<p></p>'+'<p></p>'+'<p></p>'+
            '</label>'+

            '<label>'+
              '<p></p>'+'<p></p>'+'<p></p>'+
            '</label>'+

            '<label>'+
              '<p></p>'+'<p></p>'+'<p></p>'+
            '</label>';
        } else {
          innerVote =
            '<label>'+
              '<input type="radio" name="vote'+i_plus+'" value="1">'+
              '<span>'+
                'Your pronunciation is good as native speaker.'+
              '</span>'+
            '</label>'+

            '<label>'+
              '<input type="radio" name="vote'+i_plus+'" value="2">'+
              '<span>'+
                'I can hear you without feeling unconfotable.'+
              '</span>'+
            '</label>'+

            '<label>'+
              '<input type="radio" name="vote'+i_plus+'" value="3">'+
              '<span>'+
                'I understand but you still have an accent.'+
              '</span>'+
            '</label>'+

            '<label>'+
              '<input type="radio" name="vote'+i_plus+'" value="4">'+
              '<span>'+
                'Your accent is a little hard to understand.'+
              '</span>'+
            '</label>'+

            '<label>'+
              '<input type="radio" name="vote'+i_plus+'" value="5">'+
              '<span>'+
                'I can\'t understand.'+
              '</span>'+
            '</label>'+
          '<button class="vote_submit">submit</button>';
        }





        questionHTML = questionHTML +
        '<div id="question'+audioID+'" class="column">'+
          '<div class="script">'+
            '<div class="script_left">'+
              '<img src="./img/'+thumbnailURL+'">'+
            '</div>'+
            '<div class="script_right">'+
              '<p>'+script+'</p>'+
            '</div>'+
          '</div>'+

          '<div class="row">'+
            '<div class="questionLeft">'+
              '<audio class="sound" preload="auto">'+
                '<source src="./blobFiles/'+audioURL+'" type="audio/wav">'+
              '</audio>'+

              '<button class="play resetBtn">'+
                '<div class="audioCircle">'+
                  '<i class="fas fa-volume-up soundicon big"></i>'+
                '</div>'+
              '</button><br/>'+

              '<div class="skip_wrap">'+
                '<button class="resetBtn skipBtn reset">≪</button>'+
                '<button class="resetBtn skipBtn rewind5s"><</button>'+
                '<button class="resetBtn skipBtn skip5s">></button>'+
                '<button class="resetBtn skipBtn skipNext">≫</button>'+
              '</div>'+
            '</div>'+

            '<div class="questionRight">'+
              '<div class="vote">'+innerVote+'</div>'+
            '</div>'+
          '</div>'+


          // '<div class="questionBottom">'+
          //   '<textarea class="textarea" rows="1"></textarea>'+
          //   '<button class="resetBtn advice">Advise</button>'+
          // '</div>'+
        '</div>';
      }
      questionHTML = '<div id="question_wrap">'+questionHTML+'</div>';
      // #question_wrapが存在していれば挿入、あれば置き換え
      if(document.getElementById("question_wrap") == null) {
        $('#title_image').after(questionHTML);
      } else {
        $('#question_wrap').html(questionHTML);
      }

      console.log(questions.length);
      // 受け取った質問の数だけループする
      for(let i =0; i<questions.length; i++) {
        i_plus = i + 1;
        // 投票済みか否かを判定
        // 投票済みの場合は投票結果を表示させる
        if(response.data.vote_exists[i]['USERID']) {
          // 投票結果を変数に代入
          let vote1 = response.data.vote1[i]['count(*)'];
          let vote2 = response.data.vote2[i]['count(*)'];
          let vote3 = response.data.vote3[i]['count(*)'];
          let vote4 = response.data.vote4[i]['count(*)'];
          let vote5 = response.data.vote5[i]['count(*)'];
          let allVote = response.data.allVote[i]['count(*)'];

          let vote1_per = Math.round(vote1/allVote*100 *10)/10;
          let vote2_per = Math.round(vote2/allVote*100 *10)/10;
          let vote3_per = Math.round(vote3/allVote*100 *10)/10;
          let vote4_per = Math.round(vote4/allVote*100 *10)/10;
          let vote5_per = Math.round(vote5/allVote*100 *10)/10;
          let vote1_width1_per = vote1_per*0.7;
          let vote2_width1_per = vote2_per*0.7;
          let vote3_width1_per = vote3_per*0.7;
          let vote4_width1_per = vote4_per*0.7;
          let vote5_width1_per = vote5_per*0.7;
          let vote1_width2_per = 70 - vote1_width1_per;
          let vote2_width2_per = 70 - vote2_width1_per;
          let vote3_width2_per = 70 - vote3_width1_per;
          let vote4_width2_per = 70 - vote4_width1_per;
          let vote5_width2_per = 70 - vote5_width1_per;

          // for文内でsettimeoutを使う場合は即時関数を使う必要がある
          // https://qiita.com/yam_ada/items/2867985bcb6b77288548
          (function(i_plus, vote1_width1_per, vote1_width2_per, vote2_width1_per, vote2_width2_per, vote3_width1_per, vote3_width2_per, vote4_width1_per, vote4_width2_per, vote5_width1_per, vote5_width2_per){
            setTimeout(function(){
              // vote1～vote5のcss処理
              $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(1) p:nth-of-type(1)').css('width', vote1_width1_per+'%');
              $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(1) p:nth-of-type(2)').css('width', vote1_width2_per+'%');

              $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(2) p:nth-of-type(1)').css('width', vote2_width1_per+'%');
              $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(2) p:nth-of-type(2)').css('width', vote2_width2_per+'%');

              $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(3) p:nth-of-type(1)').css('width', vote3_width1_per+'%');
              $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(3) p:nth-of-type(2)').css('width', vote3_width2_per+'%');

              $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(4) p:nth-of-type(1)').css('width', vote4_width1_per+'%');
              $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(4) p:nth-of-type(2)').css('width', vote4_width2_per+'%');

              $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(5) p:nth-of-type(1)').css('width', vote5_width1_per+'%');
              $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(5) p:nth-of-type(2)').css('width', vote5_width2_per+'%');
            },200);
          })(i_plus, vote1_width1_per, vote1_width2_per, vote2_width1_per, vote2_width2_per, vote3_width1_per, vote3_width2_per, vote4_width1_per, vote4_width2_per, vote5_width1_per, vote5_width2_per);



          // 右端のp要素にパーセント表示の文字を加える
          $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(1) p:nth-of-type(3)').text(vote1_per+'%');
          $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(2) p:nth-of-type(3)').text(vote2_per+'%');
          $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(3) p:nth-of-type(3)').text(vote3_per+'%');
          $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(4) p:nth-of-type(3)').text(vote4_per+'%');
          $('.column:nth-of-type('+i_plus+') .vote label:nth-of-type(5) p:nth-of-type(3)').text(vote5_per+'%');

          // voteボックスのpadding変更
          $('.column:nth-of-type('+i_plus+') .vote').css('padding', '40px 0');
        }
      }
      // please loginの非表示
      $('#please_login').css('display', 'none');
    }
  })
  .catch(function (error) {
      console.log(error);
  });




});
