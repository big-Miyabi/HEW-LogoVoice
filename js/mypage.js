$(function() {
  let userInfoTarget = document.getElementById('userInfo');
  let tableWidthChange = () => {

    // Other Languages内のテーブルタグの幅を全て取得し、最大幅のテーブル要素に他のテーブルタグのwidthを合わせるプログラム
    // tableタグの数を取得
    let $langTableLength = $('.language table').length;
    let $langTableWidth = [];
    // 配列にそれぞれのテーブルのwidthを代入する
    for(let i=1; $langTableLength >= i ; i++) {
      $langTableWidth[i-1] = $('.language .language_table:nth-of-type(' +i+') table').width();
      console.log($langTableWidth[i-1]);
    }
    // 取得した配列のwidthから最大のものだけを抜き出す
    let tableMaxWidth = Math.max.apply(null, $langTableWidth);
    // 最大幅の数値から計算し、テーブルタグの一番右端のデータのwidthを変更する
    $('.language tr td:nth-of-type(2)').css('width', tableMaxWidth - 157+'px');
  }
  let mo = new MutationObserver(tableWidthChange);
  mo.observe(userInfoTarget, {childList: true});

  // editボタンホバー時の処理
  $(document).on('mouseover', '#editContain', function () {
    $('.edit').css('filter','brightness(130%)');
  });
  $(document).on('mouseout', '#editContain', function () {
    $('.edit').css('filter','brightness(100%)');
  });

  // テーブルデリートボタンホバー時の処理
  $(document).on('mouseover', '.table_delete', function () {
    $(this).css('filter','brightness(130%)');
  });
  $(document).on('mouseout', '.table_delete', function () {
    $(this).css('filter','brightness(100%)');
  });

  // 資格情報付加ボタンホバー時の処理
  $(document).on('mouseover', '.cer_plus', function () {
    $(this).css('filter','brightness(130%)');
  });
  $(document).on('mouseout', '.cer_plus', function () {
    $(this).css('filter','brightness(100%)');
  });

  // 資格情報削除ボタンホバー時の処理
  $(document).on('mouseover', '.cer_minus', function () {
    $(this).css('filter','brightness(130%)');
  });
  $(document).on('mouseout', '.cer_minus', function () {
    $(this).css('filter','brightness(100%)');
  });

  // テーブルプラスボタンホバー時の処理
  $(document).on('mouseover', '.table_plus', function () {
    $(this).css('filter','brightness(130%)');
  });
  $(document).on('mouseout', '.table_plus', function () {
    $(this).css('filter','brightness(100%)');
  });
});
