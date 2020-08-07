$(function(){
  // ログインしているユーザーに合った質問リストを表示
  // 内容はQuestionList.jsと一緒
  let questionList = () => {
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
          // #question_wrapが存在していなければ挿入、あれば置き換え
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
  }

  // ログインチェックした結果に応じてMyPage内のhtml変更
  // mypage_loginCheck.jsと内容は一緒
  let loginCheck = () => {
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
  }

  let $gn = $('#GlobalNavi'),
      $mb = $('.menuButton'),
      $in = $('.innerCircle'),
      $ind = $('.innerCircle div'),
      $hb = $('.helpButton'),
      $hc = $('.helpCircle'),
      degCnt = 0, LogRegflg = 0, helpflg = 0, add400 = 0, add360 = 360, rsltflg = 0, AskQuestionCloseFlg = 0,
      $lgBtn = $('#login .loginBtn'),
      $regBtn = $('.form .RegBtn');

  let container = () => {
    //背景画像に白いフィルターをかける
    $('#whitefilter').css('z-index', '1');
    $('#whitefilter').css('opacity', '0.4');
    //マウス操作禁止
    $('#container').css('pointer-events', 'none');
    //ウィンドウ内のスクロールを禁止
    //overflow: hidden;を使うとwidthなどがずれるため
    $(window).on('wheel',function(e){
      e.preventDefault();
    });
  }

  let containerOK = () => {
    //背景画像の白いフィルターをはずす
    $('#whitefilter').css('z-index', '-1');
    $('#whitefilter').css('opacity', '0');
    //マウス操作禁止解除
    $('#container').css('pointer-events', 'auto');
    $('body').css('overflow','visible');
    //ウィンドウ内のスクロールを禁止を解除
    $(window).off('wheel');
  }

  let minh437 = () =>{
    $('.form').css('min-height','437.5px');
    $('#formFilter').css('min-height','437.5px');
  }



  //textareaの改行数に応じてheightを変える
  $(document).on('input', '.questionBottom .textarea', function(e) {
    let $textarea = $('.questionBottom .textarea');
    let lineHeight = parseInt($textarea.css('lineHeight'));
    let lines = ($(this).val() + '\n').match(/\n/g).length;
    if(lines >= 2 && lines <= 10) {
      console.log('lineHeight'+lineHeight+'\n');
      console.log('lines'+lines+'\n');
      $(this).height(lineHeight * lines);
      $(this).next('.advice').height(lineHeight * lines + 6);
    }
  });


  let height = () => {
    let $inputH = ($('.form').height() - 208) * 0.20633188,
      $btnH = ($('.form').height() - 208) * 0.08733624,
      $dividerH = $inputH * 3 + $btnH + 148 + 'px',
      $regH = ($('.form').height() - 225) / 6,
      $selectH = $('.form').height() * 0.30663616 + 'px',
      $ProgressBarH = $('#AskQuestion').height() * 0.166 + 'px';
      $AQLH = ($('#AskQuestion').height() - 317)/6;
      $AQRH = ($('#AskQuestion').height() - 327)/6;
      $AQLMiddleH = $AQLH * 3 + 223.5 + 'px';
      $AQRMiddleH = $AQRH * 3 + 242.5 + 'px';

    //loginフォーム内
    $('#login input:nth-of-type(1)').css('margin-top', $inputH);
    $('#login input').css('margin-bottom', $inputH);
    $('#login .loginBtnBg').css('margin-bottom', $btnH);
    $('#login .RegBtnBg').css('margin-top', $btnH);
    if(document.getElementById("dividerH") == null) {
      $('head').append('<style id="dividerH">.divider::after { top: '+$dividerH+'; } .select_wrap::before { top:'+$selectH +'; } </style>');
    } else {
      $('#dividerH').html('.divider::after { top: '+$dividerH+'; } .select_wrap::before { top:'+$selectH +'; } ');
    }
    //registerフォーム内
    $('#register input').css('margin-bottom', $regH);
    $('#register input:nth-of-type(1)').css('margin-top', $regH);
    $('#register select').css('margin', '0px 0px ' + $regH + 'px 4.4px');
    //AskQuestionフォーム内
    if(document.getElementById("progressBarH") == null) {
      $('head').append('<style id="progressBarH"> #progressBar::before { top: '+$ProgressBarH+'; } </style>');
    } else {
      $('#progressBarH').html('#progressBar::before { top: '+$ProgressBarH+'; }');
    }
    if(document.getElementById("AQLMiddleH") == null) {
      $('head').append('<style id="AQLMiddleH"> #AQLMiddle::before { top: '+$AQLMiddleH+'; } </style>');
    } else {
      $('#AQLMiddleH').html('#AQLMiddle::before { top: '+$AQLMiddleH+'; }');
    }
    if(document.getElementById("AQRMiddleH") == null) {
      $('head').append('<style id="AQRMiddleH"> #AQRMiddle::before { top: '+$AQRMiddleH+'; } </style>');
    } else {
      $('#AQRMiddleH').html('#AQRMiddle::before { top: '+$AQRMiddleH+'; }');
    }
  }


  //ウィンドウサイズに合わせてフォーム内要素の高さを変える
  //最初の高さを決定
  height();
  //リサイズした時
  $(window).resize(() => {
    height();
  })


  // メニューボタン押下時のcss処理
  $mb.mousedown( ()=>{
    //hover時の明るさ変更をoff
    if(degCnt == 0) {
      $('head').append('<style id="filter"> .innerCircle:hover { filter: brightness(100%); } </style>');
    } else {
      $('#filter').html('.innerCircle:hover { filter: brightness(100%); }');
    }
    //transitionを付ける
    $in.css('transition','all 550ms 0s ease');
    $in.css('background','#b39300');
    $in.css('border-color','#534c98');
    $ind.css('background','#534c98');
  })
  .mouseup( ()=>{
    $mb.toggleClass('menuActive');
    $in.css('background','#fad831');
    $in.css('border-color','#7574bc');
    $ind.css('background','#7574bc');
    degCnt += 270;
    $in.css('transform', 'rotate('+degCnt+'deg)');
    // グローバルナビの表示/非表示の切り替え
    if($gn.css('display') == 'none'){
      $gn.slideDown();
    } else {
      $gn.slideUp();
    }
    //時間差でtransitionとhover時の動作を切り替え
    setTimeout(
      function(){
        $in.css('transition','none');
        $('#filter').html('.innerCircle:hover { filter: brightness(115%); }');
      },550
    );
  });


  // ヘルプボタン押下時のcss処理
  $hb.mousedown( ()=>{
    //hover時の明るさ変更をoff
    if(add360 == 360) {
      $('head').append('<style id="filter2"> .helpCircle:hover { filter: brightness(100%); } </style>');
    } else {
      $('#filter2').html('.helpCircle:hover { filter: brightness(100%); }');
    }
    //transitionを付ける
    $hc.css('transition','all 550ms 0s ease');
    $hc.css('background','#b39300');
    $hc.css('border-color','#534c98');
  })
  .mouseup( ()=>{
    if(helpflg == 0) {
      $('.helpCircle img').attr('src','./img/exclamation.svg');
      $hb.css('background','#7574bc');
      $hc.css('background','#7574bc');
      $hc.css('border-color','#fad831');
      $hb.css('border-radius','35px 35px 0 0');
      helpflg = 1;
    } else {
      $('.helpCircle img').attr('src','./img/question.svg');
      $hb.css('background','#fad831');
      $hc.css('background','#fad831');
      $hc.css('border-color','#7574bc');
      $hb.css('border-radius','35px');
      helpflg = 0;
    }
    $hc.css('transform','rotate('+add360+'deg)');
    add360 += 360;

    // ヘルプの表示/非表示の切り替え
    if($('#help').css('display') == 'none'){
      $('#help').css('background', '#7574bc');
      $('#help').slideDown();
    } else {
      $('#help').slideUp();
      $('#help').css('background', '#fad831');
    }

    //時間差でtransitionとhover時の動作を切り替え
    setTimeout(
      function(){
        $hc.css('transition','none');
        $('#filter2').html('.helpCircle:hover { filter: brightness(115%); }');
      },550
    );
  });


  //ボタンhover時のcss処理
  // 新たに追加された要素にイベントを加えるには$(document).onを使う
  // mousedown時と競合するためcssではなくjsで処理
  $(document).on("mouseover", ".RegBtnBg", function () {
    $(this).css('background','#D8D8D8');
  });
  $(document).on("mouseout", ".RegBtnBg", function () {
    $(this).css('background','#FFF');
  });

  $(document).on("mouseover", ".loginBtnBg", function () {
    $(this).css('background','#E1E6B2');
  });
  $(document).on("mouseout", ".loginBtnBg", function () {
    $(this).css('background','#FFF');
  });

  // ログアウトボタンのhover処理
  $(document).on("mouseover", ".logoutBtnBg", function () {
    $(this).css('background','#ECE0ED');
  });
  $(document).on("mouseout", ".logoutBtnBg", function () {
    $(this).css('background','#FFF');
  });

  // 投票ボタンのホバー処理
  $(document).on("mouseover", ".vote_submit", function () {
    $(this).css('background','#D8D8D8');
  });
  $(document).on("mouseout", ".vote_submit", function () {
    $(this).css('background','#FFF');
  });


  // loginボタン押下時の処理
  $(document).on("click", ".loginBtnBg", function () {
    // グローバルナビからログインボタンを押した場合の処理
    // ログインフォームからログインボタンを押した場合を取り除く
    if(LogRegflg == 0) {
      // アニメーションの最中にwhitefilterをクリックしてもフォームが閉じないようにするため、アニメーションの最中のみLogRegflgを-1に設定
      LogRegflg = -1;
      //フォーム画面以外を操作禁止
      container();
      //フォーム画面表示
      $('#login').slideDown();

      //slideDownを正常に効かせるため、SlidDown終了後にminh437();
      setTimeout( function(){
        minh437();
        //loginフォームフラグを立てる
        LogRegflg = 1;
        console.log(LogRegflg);
      }, 400);
    }
  });


  //registerボタン押下時の処理
  $(document).on("click", ".RegBtnBg", function () {
    // registerフォーム内からregisterボタンを押した場合を取り除く
    if(LogRegflg != 2) {
      container();

      //loginフォームからregisterを押下している時の処理
      if(LogRegflg == 1) {
        LogRegflg = -1;
        //slideUpを正しく表示するためmin-hightをリセット
        $('.form').css('min-height','0');
        $('#login').slideUp();
        //loginフォームのslideUpが終わった後にregisterをslideUp
        setTimeout(function(){ $('#register').slideDown(); }, 400);
        add400 = 400;
      } else {
        LogRegflg = -1;
        $('#register').slideDown();
      }
      setTimeout(function(){
        minh437();
        // registerフォームフラグを立てる
        LogRegflg = 2;
      }, 400 + add400);
    }
  });


  let close = () => {
    // slideUpを正しく表示するためmin-hightをリセット
    $('.form').css('min-height','0');
    $('.form').slideUp();
    // 背景の操作を可能にする
    containerOK();
    // loginフォームフラグを初期値に戻す
    LogRegflg = 0;
  }
  // LogRegflgについて
  // 2: registerフォームが開かれた状態を示す
  // 1: loginフォームが開かれた状態を示す。ホーム画面からregister画面に移った時と、ログインフォームからregisterフォームに移った時の挙動を分岐するのに使う
  // 0: 通常時。フォームを閉じると0になる
  // -1: フォームのアニメーションが行われている時を示す。アニメーション中にフォーム外が押されてもフォームを閉じないようにするため
  // -2: register処理時のエラーメッセージが表示されている状態を示すフラグ


  //閉じるボタンホバー時のcss処理
  $('.formClose div').hover( ()=>{
    $('.formClose div').css('background','#363636');
  }, () => {
    $('.formClose div').css('background','#8a8a8a');
  });

  //閉じるボタンまたはフォーム外押下時のcss処理
  $('.formClose div').on('click', close);
  $('#whitefilter').click(()=>{
    // login/registerフォームが開いている時にフォームを閉じる
    if(LogRegflg >= 1) {
      console.log(LogRegflg);
      close();
    }
    // AskQuestionフォームが開いている時にフォームを閉じる関数
    AskQuestionCloseFunction();
  });




  //フォーム内でlogin/registerボタンを押したときの処理
  // ※アロー関数を使うとthisが効かなくなるので注意
  //loginボタンcss処理
  $('.form .loginBtnBg').mousedown(function(){
    $lgBtn.css('border-bottom', 'dashed 2px #fff');
    $lgBtn.css('color', '#fff');
    $(this).css('background', '#b7c82b');
    $(this).css('top', '2px');
    $(this).css('left', '2px');
  })
  .mouseup(function(){
    $lgBtn.css('border-bottom', 'dashed 2px #b7c82b');
    $lgBtn.css('color', '#b7c82b');
    $(this).css('background', '#fff');
    $(this).css('top', '0');
    $(this).css('left', '0');

    acceptLogin();
  });
  //registerボタン処理
  $('.form .RegBtnBg').mousedown(function(){
    $regBtn.css('border-bottom', 'dashed 2px #fff');
    $regBtn.css('color', '#fff');
    $(this).css('background', '#7574bc');
    $(this).css('top', '2px');
    $(this).css('left', '2px');
  })
  .mouseup(function(){
    $regBtn.css('border-bottom', 'dashed 2px #7574bc');
    $regBtn.css('color', '#7574bc');
    $(this).css('background', '#fff');
    $(this).css('top', '0');
    $(this).css('left', '0');
  });

  $('#register .RegBtnBg').click(function(){
    acceptRegister();
  });


  //logoutボタンcss処理
  $(document).on('mousedown', '.logoutBtnBg', function () {
    $('.logoutBtn').css('border-bottom', 'dashed 2px #fff');
    $('.logoutBtn').css('color', '#fff');
    $(this).css('background', '#a165a8');
    $(this).css('top', '2px');
    $(this).css('left', '2px');
  });
  $(document).on('mouseup', '.logoutBtnBg', function () {
    $('.logoutBtn').css('border-bottom', 'dashed 2px #a165a8');
    $('.logoutBtn').css('color', '#a165a8');
    $(this).css('background', '#fff');
    $(this).css('top', '0');
    $(this).css('left', '0');
  });



  // phpと通信
  let acceptLogin = () => {
    let loginUN = $('input[name="loginUN"]').val();
    let loginPW = $('input[name="loginPW"]').val();

    let loginPost = {
      loginUN : loginUN,
      loginPW : loginPW
    };

    console.log(loginPost);

    // ログイン処理
    axios.post('./php/login.php', loginPost)
      .then(function(){
        axios.get('./php/login.php')
          .then(function (response) {
            console.log(response.data.msg);

            // rsltflgの値に応じて、ログアウトボタンの表示などの処理分けを行う
            if(response.data.result == "success") {
              rsltflg = 1;
              // columnの表示
              $('.column').css('display', 'flex');
              // please loginの非表示
              $('#please_login').css('display', 'none');
              // ユーザに合った質問リストを表示
              questionList();
              // MyPageの表示を更新
              loginCheck();
            } else {
              rsltflg = 2;
            }

            // html要素の追加
            $('.logRegMsg p').html(response.data.msg);
            $('#resultMsg').css('border-color','#9cad00');
            $('.logRegMsg').css('color','#9cad00');

            //フォームに白いフィルターをかける
            // z-indexにもtranisitionがかかるらしく、transitionが既に指定されている時にopacityを変更すると、あるタイミングで唐突に変化が始まるという状態になった
            // 例えば、元のz-indexが0で、transition500msで1に変更した場合、250msでz-indexが0から1に変化すると思われる
            // setTimeoutを使うことでtransitionとopacityを後置処理にしバグ回避
            $('#formFilter').css('z-index', '7');

            // ログイン処理時にメッセージが表示されている状態を示すフラグ
            LogRegflg = -2;
            console.log(LogRegflg);

            setTimeout(
              function(){
                $('#formFilter').css('transition', 'all 550ms 0s ease');
                $('#formFilter').css('opacity', '0.5');
              },0
            );

            //マウス操作禁止
            $('.form').css('pointer-events', 'none');

            // リザルトメッセージの表示
            $('#resultMsg').slideDown();

          })
          .catch(function (error) {
              console.log(error);
          })
          .then(function () {
          });
      });
  }



  // 会員登録処理
  let acceptRegister = () => {
    let registerUN = $('input[name="registerUN"]').val();
    let motherTongue = $('[name="motherTongue"] option:selected').val();
    let registerPW = $('input[name="registerPW"]').val();
    let Re_enterPW =  $('input[name="Re_enterPW"]').val();

    let registerPost = {
      registerUN : registerUN,
      motherTongue : motherTongue,
      newPW : {
        registerPW : registerPW,
        Re_enterPW : Re_enterPW
      }
    };

    console.log(registerPost);

    axios.post('./php/register.php', registerPost)
      .then(function(){
        axios.get('./php/register.php')
          .then(function (response) {
            console.log(response.data.msg);

            // rsltflgの値に応じて、ログアウトボタンの表示などの処理分けを行う
            if(response.data.result == "success") {
              rsltflg = 1;
              // columnの表示
              $('.column').css('display', 'flex');
              // please loginの非表示
              $('#please_login').css('display', 'none');
              // ユーザに合った質問リストを表示
              questionList();
              // MyPageの表示を更新
              loginCheck();
            } else {
              rsltflg = 2;
            }

            // html要素の追加
            $('.logRegMsg p').html(response.data.msg);
            $('#resultMsg').css('border-color','#7574bc');
            $('.logRegMsg').css('color','#7574bc');

            //フォームに白いフィルターをかける
            $('#formFilter').css('z-index', '7');

            // 会員登録処理時にメッセージが表示されている状態を示すフラグ
            LogRegflg = -3;
            console.log(LogRegflg);

            setTimeout(
              function(){
                $('#formFilter').css('transition', 'all 550ms 0s ease');
                $('#formFilter').css('opacity', '0.5');
              },0
            );

            //マウス操作禁止
            $('.form').css('pointer-events', 'none');

            // リザルトメッセージの表示
            $('#resultMsg').slideDown();
          })
          .catch(function (error) {
              console.log(error);
          })
          .then(function () {
          });
      });
  }



  // メッセージフォーム以外が押下された時の処理
  $('div').not('#resultMsg, .logRegMsg').click( ()=>{
    // AskQuestionCloseFlgが-2(MyPage更新時)はフォームを閉じなくする
    // -4はAskQuestion成功時
    if(AskQuestionCloseFlg != -2) {
      // エラーなしの時
      if(rsltflg == 1) {
        $('#formFilter').css('opacity', '0');
        setTimeout(
          function(){
            $('#formFilter').css('transition', 'none');
            $('#formFilter').css('z-index', '-2');
            //マウス操作禁止解除
            $('.form').css('pointer-events', 'auto');
            // リザルトフラグを戻す
            rsltflg = 0;
          },550
        );
        // フォームを閉じる
        close();
        // ログアウトボタンの表示
        $('#logReg').html('<div class="BtnBg logoutBtnBg"><li class="Btn logoutBtn">Logout</li></div></div>');
        // リザルトフラグを戻す
        rsltflg = 0;

        // エラーがあったとき
      } else if(rsltflg == 2) {


        $('#formFilter').css('opacity', '0');

        setTimeout(
          function(){
            $('#formFilter').css('transition', 'none');
            $('#formFilter').css('z-index', '-2');
            //マウス操作禁止解除
            $('.form').css('pointer-events', 'auto');
            // リザルトフラグを戻す
            rsltflg = 0;

            if(LogRegflg == -2) {
              LogRegflg = 1;
              console.log(LogRegflg);
            } else if (LogRegflg == -3) {
              LogRegflg = 2;
              console.log(LogRegflg);
            }
          },550
        );
        // ログアウトメッセージ表示時の処理
      } else if(rsltflg == 3) {
        containerOK();
        $('#logReg').html("<div class=\"BtnBg loginBtnBg\"><li class=\"Btn loginBtn\">Login</li></div><div class=\"BtnBg RegBtnBg\"><li class=\"Btn RegBtn\">Register</li></div>");
        rsltflg = 0;
      } else if (AskQuestionCloseFlg == -1) {
        containerOK();
        AskQuestionCloseFlg = 0;
      } else if(AskQuestionCloseFlg == -3) {
        // アニメーション中のみどこを押してもフォームを消えなくする
        AskQuestionCloseFlg = -2;
        $('#AskQuestionFilter').css('opacity', '0');
        setTimeout(
          function(){
            $('#AskQuestionFilter').css('transition', 'none');
            $('#AskQuestionFilter').css('z-index', '-2');
            //マウス操作禁止解除
            $('#AskQuestion').css('pointer-events', 'auto');
            AskQuestionCloseFlg = 1;
          },550);
      } else if (AskQuestionCloseFlg == -4) {
        console.log(AskQuestionCloseFlg);
        // アニメーション中のみどこを押してもフォームを消えなくする
        AskQuestionCloseFlg = -2;
        $('#AskQuestionFilter').css('opacity', '0');
        setTimeout(
          function(){
            AskQuestionCloseFlg = 1;
            $('#AskQuestionFilter').css('transition', 'none');
            $('#AskQuestionFilter').css('z-index', '-2');
            console.log(AskQuestionCloseFlg);
            AskQuestionCloseFunction();
            //マウス操作禁止解除
            $('#AskQuestion').css('pointer-events', 'auto');

            // AskQuestionフォームの入力内容を初期化
            setTimeout(function(){
              $('#AskQuestion input').val('');
              $('#AskQuestion textarea').val('');
              $('#AskQuestion select').each(function() {
                $(this).children('option').removeAttr('selected'); //optionのselected要素の削除
                this.selectedIndex= 0; //selectIndexを0に設定。
              });

              // プログレスバーとボタンのカラーを戻す
              $('#progressBar').css('border-top','solid 2px #f4d4b0');
              $('.RAControlBtn').css('border','solid 3px #f4d4b0');
              $('.RAControlBtn').css('color','#f4d4b0');
              // 録音ボタンのクリック禁止
              $('#recorder').css('pointer-events','none');
            }, 300);

          },550);
      }
      // リザルトメッセージの非表示
      $('#resultMsg').slideUp();
    }
  });


  // ログアウトボタン押下時の処理
  $(document).on("click", ".logoutBtnBg", function () {
    axios.get('./php/logout.php')
      .then(function (response) {

        // html要素の追加
        $('.logRegMsg p').html('You have logged out successfully.');
        $('#resultMsg').css('border-color','#a165a8');
        $('.logRegMsg').css('color','#a165a8');

        // columnの非表示
        $('.column').css('display', 'none');
        // please loginの表示
        $('#please_login').css('display', 'flex');

        // MyPage書き換え
        loginCheck();

        // login/registerフォームの入力内容を初期化
        $('input').val('');
        $('select').each(function() {
          $(this).children('option').removeAttr('selected'); //optionのselected要素の削除
          this.selectedIndex= 0; //selectIndexを0に設定。
        });

        // 質問要素の削除

        container();

        // リザルトメッセージの表示
        $('#resultMsg').slideDown();
        rsltflg = 3;
      })
      .catch(function (error) {
          console.log(error);
      });
  });


  // ボタンのEnterを禁止
  // Tabでフォーカスを合わせてEnter長押しにすると発生するバグを防止
  $('button').on('keydown', function(e) {
    if ((e.which && e.which === 13) ||
        (e.keyCode && e.keyCode === 13)) {
      return false;
    } else {
      return true;
    }
  });





  //閉じるボタンホバー時のcss処理
  $('.formClose div, .AskQuestionClose div').hover( ()=>{
    $('.formClose div, .AskQuestionClose div').css('background','#363636');
  }, () => {
    $('.formClose div, .AskQuestionClose div').css('background','#8a8a8a');
  });


  //AskQuestionボタン押下時処理
  $('#GlobalNavi :nth-of-type(3)').click(function(){
    // ログイン状態のチェック
    axios.get('./php/loginCheck.php')
      .then(function (response) {
        console.log(response.data.result);

        // ログイン時の処理
        if(response.data.result == 'session exists') {
          container();
          $('#AskQuestion').css('left', 'calc(10% - 5px)');
          setTimeout(function(){
            $('#AskQuestion').css('transition','all 500ms 0ms cubic-bezier(.48,1.21,.77,1.01)');
            $('#whitefilter').css('transition','all 700ms 300ms ease');
            // AskQuestionフォームが開かれている状態を示すフラグ
            AskQuestionCloseFlg = 1;
            setTimeout(function(){

            }, 300);
          }, 700);

        //ログアウト時の処理
        } else {
          // html要素の追加
          $('.logRegMsg p').html('Please login or register!');
          $('#resultMsg').css('border-color','#ffad36');
          $('.logRegMsg').css('color','#ffad36');

          container();
          // リザルトメッセージの表示
          $('#resultMsg').slideDown();
          // AskQuestion押下時のエラーを示すフラグ
          AskQuestionCloseFlg = -1;
        }
      })
      .catch(function (error) {
          console.log(error);
      });
  })

  // AskQuestionを閉じる関数
  let AskQuestionCloseFunction = () => {
    if(AskQuestionCloseFlg == 1) {
      AskQuestionCloseFlg = 0; // フラグを通常時に戻す
      $('#AskQuestion').css('left', 'calc(-80% - 10px)');

      setTimeout(function(){
        $('#AskQuestion').css('transition','all 500ms 100ms cubic-bezier(.48,1.21,.77,1.01)');
        containerOK();
        $('#whitefilter').css('transition','all 700ms 0ms ease');
      }, 300);
    }
  }

  // AskQuestionフォーム内で閉じるボタン押下時
  $('.AskQuestionClose div').click( ()=>{
    AskQuestionCloseFunction();
  })






  /********** AskQuestionフォームの処理 **********/
  // メディアデバイスの有無を確認
  if (!navigator.mediaDevices) {
   alert("メディアデバイスが利用できません。");
  }

  var mediaRecorder = null; //なぜnullに?
  var localstream;
  var request = new XMLHttpRequest();
  var formData = new FormData();
  let recorderID = document.getElementById('recorder');
  let RecSound = document.getElementById('player');
  let isAnimate = 0, AnimateFlg = 0, recordTime = 0, audioTime = 0;
  let start = 0; stop = 0;

  // 録音開始処理
  var rec_start = function(){
    // getUserMediaでマイクの使用許可を求める
    navigator.mediaDevices.getUserMedia({audio:true})
      .then(function(stream) {
        localstream = stream;

        //音声のストリームを MediaRecorder に渡す
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(); // 録音開始

        // 円状プログレスバーのCSSアニメーションを変更
        // animationのcssを遅らせないためstart();の直後に処理を記述
        // AnimateFlgの数値からhead内にid=animateのstyleが存在するかどうか判定
        if(AnimateFlg == 0) {
          $('head').append('<style id="animate"> .progressCircle::before { animation: rotate-circle-left 30s linear forwards; } .progressCircle::after {animation: rotate-circle-right 30s linear forwards;} </style>');
          $('head').append('<style id="progressColor"> #progressBar::before { background: #f4d4b0; } </style>');
        } else {
          $('#animate').html('.progressCircle::before { animation: rotate-circle-left 30s linear forwards; } .progressCircle::after {animation: rotate-circle-right 30s linear forwards;}');
          $('#progressColor').html('#progressBar::before { background: #f4d4b0; }');
        }
        // プログレスバーとボタンのカラーを変更
        $('#progressBar').css('border-top','solid 2px #f4d4b0');
        $('.RAControlBtn').css('border','solid 3px #f4d4b0');
        $('.RAControlBtn').css('color','#f4d4b0');
        // 録音ボタンのクリック禁止を解除
        $('#recorder').css('pointer-events','auto');

        AnimateFlg = 1; // <style id="animate">の存在を示す

        // 録音時間の測定開始
        // →Because 通常の音声ファイルではなくblobであるため、音声の合計時間がRecSound.duration等で取得できない
        start = new Date(); // 録音開始時の時間を記録

        // 30秒を超えた時に録音を強制終了
        isAnimate = setInterval(function(){
          clearInterval(isAnimate);
          rec_stop();
          console.log("30秒経ったで！時間切れ&強制終了や！");
        }, 30100); // 実際の録音時間と若干のズレがあるため、30100sに録音を停止すると丁度実際の録音時間も

         // ファイル形式の指定
        mediaRecorder.mimeType = 'audio/wav';

        // ondataavailableはdataavailableを操作するイベントハンドラ
        // dataavailableは読み取り対象のデータがあるかどうかを示す
        // dataavailableで音声データ拾える
        mediaRecorder.ondataavailable = function(blob) {
          // append()はFormDataオブジェクトにデータを追加するメソッド
          // 第一引数でフィールドを作成
          // 第二引数で属性またはBlobファイルを指定
          formData.append('filename', 'test.wav');
          formData.append('blob', blob.data);

          // 現在ページURLとレスポンスデータをコンソールに出力
          xhr('./php/SaveRecordData.php', formData, function (data) {
            console.log(data);
          });
        }


      })
      // マイクの使用許可を得られなかった場合
      .catch(function(e){
        console.log(e); //エラー出力
        // 録音ボタンのCSSを録音前の状態に戻す
        recorderID.style.background = '';
        recorderID.innerHTML = '<i class="fas fa-microphone-alt font-record"></i>';
        $('#recorder').css('pointer-events','auto');
      });
  }


  // 録音停止処理
  var rec_stop = function(){
    mediaRecorder.stop(); // 録音停止
    stop = new Date(); // 現在時刻を取得

    // 録音時間の取得とコンソール出力
    // -82は実際の録音時間との誤差埋め用
    recordTime = stop.getTime() - start.getTime() -82;
    console.log("recordTimeResult: "+recordTime);

    $('#animate').html(''); // 円状プログレスバーを停止
    clearInterval(isAnimate); // 録音強制終了を解除

    // 録音ボタンとオーディオコントロールのCSS処理
    recorderID.style.background = '';
    recorderID.innerHTML = '<i class="fas fa-microphone-alt font-record"></i>';
    $('#recording_audio_wrap').css('pointer-events','auto');
    $('#progressBar').css('border-top','solid 2px #ffad36');
    $('.RAControlBtn').css('border','solid 3px #ffad36');
    $('.RAControlBtn').css('color','#ffad36');
    $('#progressColor').html('#progressBar::before { background: #ffad36; }');


    //mediaRecorder.ondataavailable = function(e)・・・でも可能
    //ondataavailableはdataavailableを操作するイベントハンドラ
    //mediaRecorder の BlobEvent を取得する
    mediaRecorder.addEventListener('dataavailable', function(e) {
      // audioタグにsourceを記述
      document.getElementById('player').src = URL.createObjectURL(e.data);
      console.log(e.data);
      console.log(e);
    }, false);

    //getTracks()でストリームのトラックリストを取得
    //forEach()でリストから各トラックを呼び出し、それぞれにstop()メソッドを呼出す
    localstream.getTracks().forEach(track => track.stop());


    //問題点: blobで取得した音声データがRecSound.durationで取得できない
    //原因: MediaStreamは本質的にいつ停止するか事前にわからない
    //解決策: currentTimeに大きな値を入れ最後までシークさせ、シークが終わった後に再生時間を取得すると上手くいく
    // 新たな問題点: 一回目は動くが、複数回やると動かなくなる→ボツ
    // 結局recordTimeで時間を計測することになったが、実際の時間と比べるときに役立つのでコードはそのまま載せておく↓
    // RecSound.currentTime += 1000;
    //
    // RecSound.onseeked = ()=> {
    //   alert("after-seeked: "+RecSound.duration);
    //   audioTime = RecSound.duration;
    //   console.log("audioTime: "+audioTime);
    //   RecSound.onseeked = undefined;
    // };

    // プログレスバーのアニメーション処理
    if(document.getElementById("progressBarAnimation") != null) {
      $('#progressBarAnimation').html('#progressBar::before { animation: progress '+recordTime+'ms linear 0s forwards paused; } ');
    } else {
      $('head').append('<style id="progressBarAnimation"> #progressBar::before { animation: progress '+recordTime+'ms linear 0s forwards paused; } </style>');
    }
  }

  // 録音ボタン押下時の処理
  recorderID.onclick = function(){
    // ボタンの色で録音開始、停止を切り替える
    // js内のbackgroundの色指定は#FFFといった16進数表記だと作動しないため注意
    // console.log(this.style.background);　←参考
    if (this.style.background == '' || this.style.background == 'rgb(255, 230, 194)' || this.style.background == 'rgb(255, 255, 255)'){
      // 録音ボタンのクリック禁止
      // マイクの使用許可を求めている最中のボタンの連打を防止
      $('#recorder').css('pointer-events','none');
      $('#recording_audio_wrap').css('pointer-events','none');
      rec_start();    // 開始
      this.style.background = '#ffad36';
      this.innerHTML = '<i class="fas fa-microphone-alt change-font-record"></i>';
    } else {
      rec_stop();     // 停止
    }
  }

  function xhr(url, data, callback) {
    // readyStateの値が更新されるたびに呼び出される
    request.onreadystatechange = function () {
      // readyStateの値は以下の状態を表す
      // 0: リクエストが初期化されていない
      // 1: サーバとの接続が確立された
      // 2: リクエストを受け付けた
      // 3. リクエストを処理しています.
      // 4: リクエストが終了し、レスポンスの準備が完了した
      // statusはステータス番号を返す。(例えば "Not Found" を示す "404" か "OK" を示す "200")
      if (request.readyState == 4 && request.status == 200) {
        callback(location.href + request.responseText);
      }
    };
  }

  //ボタンhover時のcss処理
  // recorderボタンホバー
  $(document).on("mouseover", "#recorder", function () {
    if(recorderID.style.background != 'rgb(255, 173, 54)'){
      $(this).css('background','#FFE6C2');
    }
  });
  $(document).on("mouseout", "#recorder", function () {
    if(recorderID.style.background != 'rgb(255, 173, 54)'){
      $(this).css('background','#FFF');
    }
  });

  // mousedown時と競合するためcssではなくjsで処理
  // 質問ボタンhover
  $(document).on("mouseover", ".AQBtnBg", function () {
    $(this).css('background','#FFE6C2');
  });
  $(document).on("mouseout", ".AQBtnBg", function () {
    $(this).css('background','#FFF');
  });

  // AskQuestionボタン押下時の処理
  $('.AQBtnBg').mousedown(function(){
    $('.AQBtn').css('border-bottom','dashed 2px #fff');
    $('.AQBtn').css('color','#fff');
    $(this).css('background', '#ffad36');
    $(this).css('top', '2px');
    $(this).css('left', '2px');
  })
  .mouseup(function(){
    //マウス操作禁止
    $('#AskQuestion').css('pointer-events', 'none');
    // アニメーション中のみどこを押してもフォームを消えなくする
    AskQuestionCloseFlg = -2;

    $('.AQBtn').css('border-bottom', 'dashed 2px #ffad36');
    $('.AQBtn').css('color', '#f49d00');
    $(this).css('background', '#fff');
    $(this).css('top', '0');
    $(this).css('left', '0');


    let ask_adviserLevel = $('select[name="learningLevel"] option:selected').val();
    let ask_rewardForAdviser = $('#AQLBottom input').val();
    let ask_script = $('#AQRTop textarea').val();
    let ask_scriptLanguege = $('select[name="scriptLanguege"] option:selected').val();
    // 改行文字に<br/>を加える
    // '\n'はtextarea内のみでしか効かず、<p>タグの中でも反映させるのに<br/>が必要
    ask_script = ask_script.replace(/\n/g, '\n<br/>');

    let questionPost = {
      adviserLevel : ask_adviserLevel,
      rewardForAdviser : ask_rewardForAdviser,
      script : ask_script,
      scriptLanguege : ask_scriptLanguege,
    };

    function requestPost() {
      return new Promise((resolve) => {
        // SaveRecordData.phpにblobデータを送信し、blobFilesフォルダ内にwav形式で保存する
        request.open('POST', './php/SaveRecordData.php');
        request.send(formData);
        // 受け取る値が無いため、200ms後にresolveを返す
        // request.openが完了するまでに200ms以上かかった
        setTimeout(function() { resolve(); }, 300);
      })
    }

    async function req_axios() {
      // requestpostの完了を待つ
      await requestPost();
      axios.get('./php/SaveRecordData.php')
      .then(function (response) {
        console.log(response.data);

        // html要素の追加
        $('.logRegMsg p').html(response.data.msg);
        $('#resultMsg').css('border-color','#ffad36');
        $('.logRegMsg').css('color','#ffad36');

        // リザルトメッセージの表示
        $('#resultMsg').slideDown();

        // フォームに白いフィルターをかける
        $('#AskQuestionFilter').css('z-index', '3');

        setTimeout(
          function(){
            $('#AskQuestionFilter').css('transition', 'all 550ms 0s ease');
            $('#AskQuestionFilter').css('opacity', '0.5');
          },0
        );

        setTimeout(
          function(){
            // アップロード成功時
            if(response.data.result == 'success') {
              AskQuestionCloseFlg = -4;
            // 失敗時
            } else {
              AskQuestionCloseFlg = -3;
            }
            console.log(AskQuestionCloseFlg);
          }, 550
        );

      })
      .catch(function (error) {
        console.log(error);
      })
    }

    axios.post('./php/SaveRecordData.php', questionPost)
      .then(function(){
        req_axios();
      });
  });



  // 録音音声のコントロールボタン押下時の処理
  // RecSound は document.getElementById('player') が格納
  let flg = 0, animeStart = 0, animeStop = 0, changeAnimationFlg = 0, AnimationTimeMeasure = 0, AnimationMs = 0, AnimationPauseMs = 0, newAnimationDuration = 0, newAnimationLeftPer = 0, RunPause = 0;

  // 録音した音声の最初にスキップする関数
  let skipFirst = () => {
    AnimationPauseMs = 0;
    AnimationMs = 0;
    newAnimationLeftPer = 23.7;
    newAnimationDuration = recordTime - AnimationMs;
  }

  // 録音した音声の最後にスキップする関数
  let skipLast = () => {
    clearInterval(AnimationTimeMeasure);
    RecSound.currentTime = recordTime;
    $('.pause').html('<i class="fas fa-play"></i>');
    flg = -1;
    AnimationPauseMs = 0;
    AnimationMs = recordTime;
    newAnimationLeftPer = 42.8;
    newAnimationDuration = 0;
    RunPause = 'paused';
  }

  // プログレスバーのcssアニメーションを変更する関数
  // animation-nameをその都度変えないと「今自分が何%の位置にいるか」を保存してしまうらしくうまくいかない
  let ChangeProgressBarAnimation = () => {
    $('#progressBarAnimation').html('#progressBar::before { left: '+newAnimationLeftPer+'%; animation: changedProgress'+changeAnimationFlg+' '+newAnimationDuration+'ms linear 0s forwards '+RunPause+'; } @keyframes changedProgress'+changeAnimationFlg+' {  0% {    left: '+newAnimationLeftPer+'%;  }  100% {    left: 42.8%;  }} ');
  }


  // 再生ボタン押下時処理
  $('.pause').click( ()=> {
    // flgの値に応じて再生・一時停止の処理を切り替え
    if(flg <= 0) {
      // flgが-1の時は最初から再生する
      if(flg == -1) {
        changeAnimationFlg++;
        AnimationMs = 0;
        newAnimationLeftPer = 23.7;
        newAnimationDuration = recordTime;
      }
      RunPause = 'running';
      // 再生ボタンのアイコンを切り替え
      $('.pause').html('<i class="fas fa-pause"></i>');
      RecSound.play(); // 録音音声を再生
      animeStart = new Date(); // 再生開始時の時間を記録


      // 1msごとに現在時刻を取得し、再生開始時刻と今の時刻の差から現在の再生時間を求める関数
      AnimationTimeMeasure = setInterval(function(){
        animeStop = new Date(); // 現在時刻の取得
        AnimationMs = AnimationPauseMs + animeStop.getTime() - animeStart.getTime(); // 現在の再生時間の取得

        // 再生時間が合計再生時間を超えた時の処理
        if(AnimationMs >= recordTime) {
          skipLast();
          changeAnimationFlg++;
        }
      }, 1);

      // changeAnimationFlgの値に応じて書き換えるhtmlを分岐
      if(changeAnimationFlg == 0) {
        $('#progressBarAnimation').html('#progressBar::before { animation: progress '+recordTime+'ms linear 0s forwards running; } ');
      } else {
        ChangeProgressBarAnimation();
      }
      flg = 1; // 再生中フラグを立てる
    } else {
      RunPause = 'paused';
      // 再生時間の取得を停止
      clearInterval(AnimationTimeMeasure);
      RecSound.pause(); // 録音音声を一時停止

      // 一時停止時点の再生時間を保存
      AnimationPauseMs = AnimationMs;
      console.log('経過時間: '+AnimationMs);

      // 再生ボタンのアイコンを切り替え
      $('.pause').html('<i class="fas fa-play"></i>');

      if(changeAnimationFlg == 0) {
        $('#progressBarAnimation').html('#progressBar::before { animation: progress '+recordTime+'ms linear 0s forwards paused; } ');
      } else {
        ChangeProgressBarAnimation();
      }
      flg = 0;
    }
  });


  $('.RACreset').click( () => {
    changeAnimationFlg++;
    RecSound.currentTime = 0;
    animeStart = new Date();
    animeStop = new Date();
    skipFirst();
    ChangeProgressBarAnimation();
  });


  $('.RACrewind5s').click( () => {
    changeAnimationFlg++;
    RecSound.currentTime -= 5; // 5s巻き戻す

    // 記録してる時間も5s巻き戻し、プログレスバーにも反映させる
    AnimationPauseMs = AnimationMs - 5000;
    animeStart = new Date();
    animeStop = new Date(); // 現在時刻の取得

    // 巻き戻した時間が0を下回ったとき
    if (AnimationPauseMs >= 0) {
      AnimationMs = AnimationPauseMs;
      newAnimationLeftPer = (AnimationMs/recordTime*100) *0.191+23.7;

      // newAnimationDurationは残りの再生時間
      // これが新たに生成されるanimationの所要時間になる
      newAnimationDuration = recordTime - AnimationMs;
    } else {
      skipFirst();
    }

    // flgの有無でアニメーションのrunning/pausedを切り替え
    if(flg <= 0) {
      flg = 0; // flg == -1を回避
      RunPause = 'paused';
    } else {
      RunPause = 'running';
    }
    // プログレスバーのcssアニメーションを変更
    // animation-nameをその都度変えないと「今自分が何%の位置にいるか」を保存してしまうらしくうまくいかない
    ChangeProgressBarAnimation();

  })


  $('.RACskip5s').click( () => {
    changeAnimationFlg++;
    RecSound.currentTime += 5; // 5sスキップする

    AnimationPauseMs = AnimationMs + 5000;
    animeStart = new Date();
    animeStop = new Date(); // 現在時刻の取得

    if (AnimationPauseMs <= recordTime) {
      AnimationMs = AnimationPauseMs;
      newAnimationLeftPer = (AnimationMs/recordTime*100) *0.191+23.7;

      // newAnimationDurationは残りの再生時間
      // これが新たに生成されるanimationの所要時間になる
      newAnimationDuration = recordTime - AnimationMs;
    } else {
      skipLast();
    }

    // flgの有無でアニメーションのrunning/pausedを切り替え
    if(flg <= 0) {
      RunPause = 'paused';
    } else {
      RunPause = 'running';
    }
    ChangeProgressBarAnimation();
  })


  $('.RACskipNext').click( () => {
    RecSound.pause();
    animeStart = new Date();
    animeStop = new Date();
    skipLast();
    ChangeProgressBarAnimation();
  })










  /********** MyPage内の処理 **********/
  let $saveHTML = '';
  let first_cer = [];

  // editボタン押下時の処理
  $(document).on('click', '.modeEdit', function () {
    $saveHTML = $('#userInfo').html();
    $('#editContain').removeClass('modeEdit').addClass('modeUndo');
    $('.edit').html('<i class="fas fa-undo-alt fa-2x"></i>');
    $('#userImageFormWrap').prepend('<form id="userImageForm" enctype="multipart/form-data" method="post">');
    $('#userImageFormWrap p').after('<label for="file_photo">\n＋Choose a photo');
    $('#userImageFormWrap').append('</label></form>');

    let profileValue = '';
    let tableValue = [];

    // profile内の項目を入力欄に変更
    // gender
    profileValue = $('#profile table tr:nth-of-type(1) td:nth-of-type(2)').text();
    $('#profile table tr:nth-of-type(1) td:nth-of-type(2)').html('<select id="gender_select" name="gender_select">'+
      '<option value="">select your gender!</option>'+
      '<option value="Man">Man</option>'+
      '<option value="Woman">Woman</option>'+
      '<option value="Other">Other</option>'+
    '</select>');
    $('#gender_select').val(profileValue);

    // age
    profileValue = $('#profile table tr:nth-of-type(2) td:nth-of-type(2)').text();
    $('#profile table tr:nth-of-type(2) td:nth-of-type(2)').html('<input type="tel" maxlength="3" value="'+profileValue+'"/>');


    let $olLength = $('#otherLanguages table').length;
    let $olnameValue = '', $olname = '';
    let $cer_length_array = [];
    console.log($olLength);

    for(let i=1; i<=$olLength; i++) {
      $olname = $('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-of-type(1) th');
      $olnameValue = $olname.text();
      selectOL = '<select id="ol'+i+'" name="otherLanguages'+i+'">'+
        '<option value="">select a language!</option>'+
        '<option value="German">Deutsch</option>'+
        '<option value="English">English</option>'+
        '<option value="Spanish">español</option>'+
        '<option value="French">français</option>'+
        '<option value="Croatian">hrvatski</option>'+
        '<option value="Italian">italiano</option>'+
        '<option value="Dutch">Nederlands</option>'+
        '<option value="Polish">polski</option>'+
        '<option value="Portuguese">português</option>'+
        '<option value="Vietnamese">Tiếng Việt</option>'+
        '<option value="Turkish">Türkçe</option>'+
        '<option value="Russian">русский</option>'+
        '<option value="Arabic">العربية</option>'+
        '<option value="Thai">ไทย</option>'+
        '<option value="Korean">한국어</option>'+
        '<option value="simplified_Chinese">中文 (简体)</option>'+
        '<option value="traditional_Chinese">中文 (繁體)</option>'+
        '<option value="Japanese">日本語</option>'+
      '</select>';

      // 2番目以降のテーブルにデリートボタンを付ける
      if(i>=2) {
        $olname.html('<button class="table_delete resetBtn TD'+i+'"><i class="fas fa-times fa-lg"></i></button>' +selectOL);
      } else {
        $olname.html(selectOL);
      }

      $('#ol'+i).val($olnameValue);

      $olname = $('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-of-type(2) td:nth-of-type(2)');
      $olnameValue = $olname.text();
      $olname.html('<select id="LL'+i+'" name="LearningLevel'+i+'">'+
        '<option value="">select your level!</option>'+
        '<option value="Beginner">1(Beginner)</option>'+
        '<option value="Elementary">2(Elementary)</option>'+
        '<option value="Pre-Intermediate">3(Pre-Intermediate)</option>'+
        '<option value="Intermediate">4(Intermediate)</option>'+
        '<option value="Upper-Intermediate">5(Upper-Intermediate)</option>'+
        '<option value="Advanced">6(Advanced)</option>'+
      '</select>');
      $('#LL'+i).val($olnameValue);


      let $cerLength = $('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-of-type(n+3)').length;
      let $cerValue = '', $cer = '';

      i_minus = i-1;
      first_cer[i_minus] = [];
      for(let j=3; j<=$cerLength+2; j++) {
        $cer = $('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-of-type('+j+') td:nth-of-type(2)');
        $cerValue = $cer.text();
        $cer.html('<input type="text" value="'+$cerValue+'"/>');
        let j_minus = j-3;
        first_cer[i_minus][j_minus] = $cerValue;
      }
    }

    // 資格情報追加ボタンの追加
    $('#otherLanguages .language_table table tr:nth-last-of-type(1) td:nth-of-type(2)').append('<button class="cer_plus resetBtn"><i class="fas fa-plus"></i></button>');


    for(let i=1; i<=$olLength; i++) {
      console.log(i);
      // certificationの数をotherlanguageごとに配列に保存
      $cer_length_array.push($('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-of-type(n+3)').length);
      let i_minus = i-1;
      if($cer_length_array[i_minus] >= 2) {
        // 資格情報削除ボタンの追加
        $('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-last-of-type(1) td:nth-of-type(2)').append('<button class="cer_minus resetBtn"><i class="fas fa-times"></i></button>');
      }

      console.log($cer_length_array);
      console.log(first_cer);
    }


    // テーブルプラスボタンの追加
    $('.language').append('<button class="table_plus resetBtn"><i class="fas fa-plus-circle fa-2x"></i></button>');


    $olnameValue = $('#introText p').text();
    $('#introText').html('<textarea id="introduceEdit" maxlength="250">'+$olnameValue+'</textarea>');

    $('#userInfo').append('<div class="BtnBg updateBtnBg">'+
      '<ul>'+
        '<li class="Btn updateBtn">Update</li>'+
      '</ul>'+
    '</div>');
  });






  // テーブルプラスボタン押下時の処理
  $(document).on('click', '.table_plus', function(){
    let $olLength = $('#otherLanguages table').length + 1;

    // add_tableクラスを追加しておく
    $('#otherLanguages .language_table:nth-last-of-type(1)').after('<div class="language_table add_table">'+
      '<table><tr><th colspan="3" class="lanName">'+
      '<button class="table_delete resetBtn TD'+$olLength+'"><i class="fas fa-times fa-lg"></i></button>' +
      '<select id="ol'+$olLength+'" name="otherLanguages'+$olLength+'">'+
        '<option value="">select a language!</option>'+
        '<option value="German">Deutsch</option>'+
        '<option value="English">English</option>'+
        '<option value="Spanish">español</option>'+
        '<option value="French">français</option>'+
        '<option value="Croatian">hrvatski</option>'+
        '<option value="Italian">italiano</option>'+
        '<option value="Dutch">Nederlands</option>'+
        '<option value="Polish">polski</option>'+
        '<option value="Portuguese">português</option>'+
        '<option value="Vietnamese">Tiếng Việt</option>'+
        '<option value="Turkish">Türkçe</option>'+
        '<option value="Russian">русский</option>'+
        '<option value="Arabic">العربية</option>'+
        '<option value="Thai">ไทย</option>'+
        '<option value="Korean">한국어</option>'+
        '<option value="simplified_Chinese">中文 (简体)</option>'+
        '<option value="traditional_Chinese">中文 (繁體)</option>'+
        '<option value="Japanese">日本語</option>'+
      '</select>'+
      '</th></tr><tr><th>Learning Level</th><td>:</td><td>'+
      '<select id="LL'+$olLength+'" name="LearningLevel'+$olLength+'">'+
        '<option value="">select your level!</option>'+
        '<option value="Beginner">1(Beginner)</option>'+
        '<option value="Elementary">2(Elementary)</option>'+
        '<option value="Pre-Intermediate">3(Pre-Intermediate)</option>'+
        '<option value="Intermediate">4(Intermediate)</option>'+
        '<option value="Upper-Intermediate">5(Upper-Intermediate)</option>'+
        '<option value="Advanced">6(Advanced)</option>'+
      '</select>'+
      '</td></tr>'+
      '<tr><th>Certification</th><td>:</td><td>'+
      '<input type="text"/><button class="cer_plus resetBtn"><i class="fas fa-plus"></i></button>'+
      '</td></tr>'+
      '</table></div>'
    );
  });



  let dlt_olname = [];

  // テーブルデリートボタン押下時の処理
  $(document).on('click', '.table_delete', function(){
    let $olLength = $('#otherLanguages .language_table').length;
    // クリックしたテーブルデリートボタンのクラス名を取得
    let td_class = this.getAttribute('class');
    let td_num = 0;
    console.log(td_class);

    // テーブル数が10未満の時
    if($olLength < 10) {
      // クラス名の25文字目から1文字抜き取る
      // table_delete resetBtn TD3のように、25文字目には数値が入っている
      td_num = td_class.substr(24,1);
      console.log(td_num);
    // テーブル数が10以上の時
    } else {
      // クラス名の25文字目から2文字抜き取る
      td_num = td_class.substr(24,2);
      console.log(td_num);
    }

    // テーブルが追加されたものかどうかチェック
    let $delete_check =
    $('#otherLanguages .language_table:nth-of-type('+td_num+')').hasClass('add_table');
    console.log($delete_check);
    // 削除する個所のテーブルが追加されたものでない場合
    if($delete_check == false) {
      // 削除するother languageデータをphpで送る時用に保存
      dlt_olname.push($('#otherLanguages .language_table:nth-of-type('+td_num+') table tr:nth-of-type(1) th option:selected').val());
      console.log(dlt_olname);
    }

    let saveData = '';

    console.log(td_num);
    console.log($olLength);

    td_num = Number(td_num);


    for(let i=td_num+1; i<=$olLength; i++) {
      let i_mns = i-1;
      console.log(i);

      // otherLanguagesを削除した分動かす
      saveData = $('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-of-type(1) th option:selected').val();
      console.log(saveData);
      $('#ol'+i_mns).val(saveData);

      // Learning Levelを削除した分動かす
      saveData = $('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-of-type(2) td:nth-of-type(2) option:selected').val();
      console.log(saveData);
      $('#LL'+i_mns).val(saveData);

      // certificationを削除した分動かす
      // n番目(削除するテーブルのあった個所)certificationの長さ取得
      let $tableDelete_cerLength = $('#otherLanguages .language_table:nth-of-type('+i_mns+') table tr:nth-of-type(n+3)').length;
      // n+1番目のcertificationの長さ取得
      let $tableMove_cerLength = $('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-of-type(n+3)').length;

      // n個目のテーブルよりもn+1個目のテーブルのcertificationの方が長かった時
      if($tableMove_cerLength > $tableDelete_cerLength) {
        // 資格情報ボタンの削除
        $('#otherLanguages .language_table:nth-of-type('+i_mns+') table tr:nth-last-of-type(1) button').remove();
        // certificationの項目を増やす
        $('#otherLanguages .language_table:nth-of-type('+i_mns+') table tr:nth-last-of-type(1)').after('<tr><th></th><td>:</td><td><input type="text"/></td>');
        // 資格情報追加ボタンの追加
        $('#otherLanguages .language_table:nth-of-type('+i_mns+') table tr:nth-last-of-type(1) td:nth-of-type(2)').append('<button class="cer_plus resetBtn"><i class="fas fa-plus"></i></button>');
        // 資格情報削除ボタンの追加
        $('#otherLanguages .language_table:nth-of-type('+i_mns+') table tr:nth-last-of-type(1) td:nth-of-type(2)').append('<button class="cer_minus resetBtn"><i class="fas fa-times"></i></button>');
        console.log('certification add ok');
      // n個目のテーブルよりもn+1個目のテーブルのcertificationの方が短かった時
      } else if ($tableMove_cerLength < $tableDelete_cerLength) {
        let difference = $tableDelete_cerLength - $tableMove_cerLength;
        for(let i=0; i<difference; i++) {
          // certificationの項目を減らす
          $('#otherLanguages .language_table:nth-of-type('+i_mns+') table tr:nth-last-of-type(1)').remove();
        }
        // 資格情報追加ボタンの追加
        $('#otherLanguages .language_table:nth-of-type('+i_mns+') table tr:nth-last-of-type(1) td:nth-of-type(2)').append('<button class="cer_plus resetBtn"><i class="fas fa-plus"></i></button>');

        if($tableMove_cerLength >= 2) {
          // 資格情報削除ボタンの追加
          $('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-last-of-type(1) td:nth-of-type(2)').append('<button class="cer_minus resetBtn"><i class="fas fa-times"></i></button>');
        }

        console.log('certification delete ok');
      }

      let tableMove_certification = '';
      for(let j=0; j<=$tableMove_cerLength-1; j++) {
        let j_plus = j+3;
        tableMove_certification = $('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-of-type('+j_plus+') td:nth-of-type(2) input').val();

        // 上に移動させるcertificationが新たに追加されたものだった場合
        if($('#otherLanguages .language_table:nth-of-type('+i+') table tr:nth-of-type('+j_plus+') td:nth-of-type(2) input').hasClass('add_cer')) {
          // add_cerクラスを追加
          $('#otherLanguages .language_table:nth-of-type('+i_mns+') table tr:nth-of-type('+j_plus+') td:nth-of-type(2) input').addClass('add_cer');
        // 追加されたものではなく既存のものだった場合
        } else {
          // add_cerクラスを削除
          $('#otherLanguages .language_table:nth-of-type('+i_mns+') table tr:nth-of-type('+j_plus+') td:nth-of-type(2) input').removeClass('add_cer');
        }

        $('#otherLanguages .language_table:nth-of-type('+i_mns+') table tr:nth-of-type('+j_plus+') td:nth-of-type(2) input').val(tableMove_certification);
      }
    }

    // 最後のテーブルを削除
    $('#otherLanguages .language_table:nth-last-of-type(1)').remove();
  });




  // 資格情報追加ボタン押下時の処理
  $(document).on('click','.cer_plus', function(){
    let cer_index = $('.cer_plus').index(this);
    cer_index += 1;
    console.log(cer_index);

    // 資格情報ボタンの削除
    $('#otherLanguages .language_table:nth-of-type('+cer_index+') table tr:nth-last-of-type(1) button').remove();
    // certificationの項目を増やす
    $('#otherLanguages .language_table:nth-of-type('+cer_index+') table tr:nth-last-of-type(1)').after('<tr><th></th><td>:</td><td><input type="text" class="add_cer"/></td>');
    // ボタンの追加
    $('#otherLanguages .language_table:nth-of-type('+cer_index+') table tr:nth-last-of-type(1) td:nth-of-type(2)').append('<button class="cer_plus resetBtn"><i class="fas fa-plus"></i></button><button class="cer_minus resetBtn"><i class="fas fa-times"></i></button>');
  });

  let $cer_length_js = 0;

  // 資格情報削除ボタン押下時の処理
  $(document).on('click','.cer_minus', function(){
    let cer_m_index = $(this).parents('.language_table').index();

    // let cer_m_index = $('.cer_minus').index(this);
    cer_m_index += 1;
    console.log(cer_m_index);

    // そのボタンが押された時のcertificationの数を取得
    // PHPにも同じ名前があるため分かりやすくするように語末にjsを付けた
    $cer_length_js = $('#otherLanguages .language_table:nth-of-type('+cer_m_index+') table tr:nth-of-type(n+3)').length;

    // certificationの削除
    $('#otherLanguages .language_table:nth-of-type('+cer_m_index+') table tr:nth-last-of-type(1)').remove();

    // 資格情報追加ボタンの追加
    $('#otherLanguages .language_table:nth-of-type('+cer_m_index+') table tr:nth-last-of-type(1) td:nth-of-type(2)').append('<button class="cer_plus resetBtn"><i class="fas fa-plus"></i></button>');

    // 資格情報削除ボタンの追加
    if($cer_length_js >= 3) {
      $('#otherLanguages .language_table:nth-of-type('+cer_m_index+') table tr:nth-last-of-type(1) td:nth-of-type(2)').append('<button class="cer_minus resetBtn"><i class="fas fa-times"></i></button>');
    }
  });




  // 戻るボタン押下時の処理
  $(document).on('click', '.modeUndo', function () {
    $('#userInfo').html($saveHTML);
    $('#editContain').removeClass('modeUndo').addClass('modeEdit');
    $('.edit').html('<i class="fas fa-edit fa-2x">');
  });


  // Updateボタンホバーの処理
  $(document).on("mouseover", ".updateBtnBg", function () {
    $(this).css('background','#f2e6b8');
  });
  $(document).on("mouseout", ".updateBtnBg", function () {
    $(this).css('background','#FFF');
  });


  // Updateボタンマウスダウン時の処理
  $(document).on('mousedown', '.updateBtnBg', function () {
    $('.updateBtn').css('border-bottom', 'dashed 2px #fff');
    $('.updateBtn').css('color', '#fff');
    $(this).css('background', '#debc03');
    $(this).css('top', '2px');
    $(this).css('left', '2px');
  });




  // updateボタン押下時の処理
  $(document).on('mouseup', '.updateBtnBg', function () {
    $('.updateBtn').css('border-bottom', 'dashed 2px #debc03');
    $('.updateBtn').css('color', '#debc03');
    $(this).css('background', '#fff');
    $(this).css('top', '0');
    $(this).css('left', '0');

    let upd_profile = [];

    // profile内の入力データを取得
    upd_profile[0] = $('#profile table tr:nth-of-type(1) td:nth-of-type(2) option:selected').val();
    upd_profile[1] = $('#profile table tr:nth-of-type(2) td:nth-of-type(2) input').val();

    let upd_otherLanguageName = [];
    let upd_learningLevel = [];
    let upd_certification = [];

    let $olLength = $('#otherLanguages .language_table').length;

    for(let i=0; i<$olLength; i++) {
      let plus = i+1;
      upd_otherLanguageName[i] = $('#otherLanguages .language_table:nth-of-type('+plus+') table tr:nth-of-type(1) th option:selected').val();

      upd_learningLevel[i] = $('#otherLanguages .language_table:nth-of-type('+plus+') table tr:nth-of-type(2) td:nth-of-type(2) option:selected').val();

      let $cerLength = $('#otherLanguages .language_table:nth-of-type('+plus+') table tr:nth-of-type(n+3)').length;

      upd_certification[i] = [];
      for(let j=0; j<=$cerLength-1; j++) {
        let j_plus = j+3;
        upd_certification[i][j] = $('#otherLanguages .language_table:nth-of-type('+plus+') table tr:nth-of-type('+j_plus+') td:nth-of-type(2) input').val();
      }

      // textarea内の改行を<br>に変換
      upd_profile[2] = $('#introText textarea').val();
      // 改行文字に<br/>を加える
      // '\n'はtextarea内のみでしか効かず、<p>タグの中でも反映させるのに<br/>が必要
      upd_profile[2] = upd_profile[2].replace(/\n/g, '\n<br/>');
      console.log(upd_profile[2]);
    }

    let dlt_cer = [];
    let cer_length = 0;

    // dlt_cerの取得
    for(i=0; i<first_cer.length; i++) {
      i_plus = i+1;
      cer_length = $('#otherLanguages .language_table:nth-of-type('+i_plus+') table tr:nth-of-type(n+3)').length;
      if(cer_length < first_cer[i].length) {
        dlt_cer[i] = [];
        cer_different = first_cer[i].length - cer_length;
        for(j=0; j<cer_different; j++) {
          let reverse = first_cer[i].length - j -1;
          console.log(first_cer[i].length);
          dlt_cer[i][j] = first_cer[i][reverse];
        }
      }
    }

    let motherTongue = $('#profile tr:nth-of-type(3) td:nth-of-type(2)').text();


    // 後でGETの後に移動させておくこと
    // 画像の送信
    if(file != '') {
      $.ajax({
        url: "./php/SaveImageData.php", // 送信先
        type: 'POST',
        dataType: 'json',
        data: fd,
        processData: false,
        contentType: false
      })
      .done(function( data, textStatus, jqXHR ) {
        // 送信成功
      })
      .fail(function( jqXHR, textStatus, errorThrown ) {
        // 送信失敗
      });
    }

    let updPost = {
      profile : upd_profile,
      otherLanguageName : upd_otherLanguageName,
      learningLevel : upd_learningLevel,
      certification : upd_certification,
      deletedata : dlt_olname,
      deletedata_certification : dlt_cer,
      motherTongue : motherTongue
    };

    console.log(updPost);


    axios.post('./php/mypage_update.php', updPost)
      .then(function(){
        axios.get('./php/mypage_update.php')
          .then(function (response) {
            console.log(response.data);

            // html要素の追加
            $('.logRegMsg p').html(response.data.msg);
            $('#resultMsg').css('border-color','#ffad36');
            $('.logRegMsg').css('color','#ffad36');
            container();

            // アップデートに成功したとき
            if(response.data.result == "success") {
              // フォームとホワイトフィルターを閉じなくする
              AskQuestionCloseFlg = -2;
              setTimeout(function(){
                location.reload();
              }, 5000)

            // エラー時
            } else {
              AskQuestionCloseFlg = -1;
            }

            //マウス操作禁止
            $('.form').css('pointer-events', 'none');

            // リザルトメッセージの表示
            $('#resultMsg').slideDown();
          })
          .catch(function (error) {
              console.log(error);
          })
      });


  });


  // 数値入力欄の数字以外の不要な文字を削除
  $(document).on('keypress','input[type="tel"]',function(event){return leaveOnlyNumber(event);});

  let leaveOnlyNumber = (e) => {
    // 数字以外の不要な文字を削除
    var st = String.fromCharCode(e.which);
    if ("0123456789".indexOf(st,0) < 0) { return false; }
    return true;
  }

  let file=''. blob='', fd='';

  // アップロードするファイルを選択
  $(document).on('change', 'input[type=file]', function () {
    file = $(this).prop('files')[0];

    // jpeg画像以外は処理を停止
    if (! file.type.match('image/jpeg')) {
      // クリア
      $(this).val('');
      $('p.userImage').html('');
      return;
    }

    // 画像表示
    var reader = new FileReader();
    reader.onload = function() {
      var img_src = $('<img>').attr('src', reader.result);
      $('p.userImage').html(img_src);
    }
    reader.readAsDataURL(file);

    blob = new Blob([file], {type: 'image/jpeg'});
    fd = new FormData();
    fd.append('file', blob);
  });




  // 投票ボタン押下時の処理
  $(document).on('mousedown', '.vote_submit', function () {
    $(this).css('color', '#fff');
    $(this).css('background', '#7574bc');
    $(this).css('top', '2px');
    $(this).css('left', '2px');
  });

  $(document).on('mouseup', '.vote_submit', function () {
    $(this).css('color', '#7574bc');
    $(this).css('background', '#fff');
    $(this).css('top', '0');
    $(this).css('left', '0');

    // 押下した投票ボタンの親要素columnを取得
    // columnが何番目の要素か取得
    $column_index = $(this).parents('.column').index();
    // 初期値が0なので+1する
    $column_index++;
    // columnのidを取得し、そのidの9文字目からを切り取りaudioIdを取得する
    $audioID = $(this).parents('.column').attr('id').slice(8);;
    console.log($column_index);
    console.log($audioID);

    // column内のチェックされている
    $yourVote = $('input[name=vote'+$column_index+']:checked').val();
    console.log($yourVote);

    let voteInfo = {
      audioID : $audioID,
      yourVote : $yourVote
    };

    axios.post('./php/vote.php', voteInfo)
      .then(function(){
        axios.get('./php/vote.php')
          .then(function (response) {
            console.log(response.data);

            vote1 = response.data.vote1['count(*)'];
            vote2 = response.data.vote2['count(*)'];
            vote3 = response.data.vote3['count(*)'];
            vote4 = response.data.vote4['count(*)'];
            vote5 = response.data.vote5['count(*)'];
            allVote = response.data.allVote['count(*)'];

            let innerVote =
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

            $('.column:nth-of-type('+$column_index+') .vote').html(innerVote);


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

            setTimeout(function(){
              // vote1～vote5のcss処理
              $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(1) p:nth-of-type(1)').css('width', vote1_width1_per+'%');
              $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(1) p:nth-of-type(2)').css('width', vote1_width2_per+'%');

              $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(2) p:nth-of-type(1)').css('width', vote2_width1_per+'%');
              $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(2) p:nth-of-type(2)').css('width', vote2_width2_per+'%');

              $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(3) p:nth-of-type(1)').css('width', vote3_width1_per+'%');
              $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(3) p:nth-of-type(2)').css('width', vote3_width2_per+'%');

              $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(4) p:nth-of-type(1)').css('width', vote4_width1_per+'%');
              $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(4) p:nth-of-type(2)').css('width', vote4_width2_per+'%');

              $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(5) p:nth-of-type(1)').css('width', vote5_width1_per+'%');
              $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(5) p:nth-of-type(2)').css('width', vote5_width2_per+'%');
            }, 200);

            // 右端のp要素にパーセント表示の文字を加える
            $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(1) p:nth-of-type(3)').text(vote1_per+'%');
            $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(2) p:nth-of-type(3)').text(vote2_per+'%');
            $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(3) p:nth-of-type(3)').text(vote3_per+'%');
            $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(4) p:nth-of-type(3)').text(vote4_per+'%');
            $('.column:nth-of-type('+$column_index+') .vote label:nth-of-type(5) p:nth-of-type(3)').text(vote5_per+'%');

            // voteボックスのpadding変更
            $('.column:nth-of-type('+$column_index+') .vote').css('padding', '40px 0');
          })
          .catch(function (error) {
              console.log(error);
          })
      });




  });

});
