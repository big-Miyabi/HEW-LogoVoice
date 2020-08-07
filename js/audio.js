$(function(){
  let target='';

  $(document).on('click', '.play', function(e) {
    target = $(this).parents('.row').find('.sound').get(0);
    // audioの背景色で処理を分岐(audioは非表示なので見た目の変化はない)
    if(target.style.background == 'red') {
      target.pause();
      target.style.background = 'white';
      $(this).children('.audioCircle').html('<i class="fas fa-play soundicon small"></i>');
    } else {
      target.play();
      target.style.background = 'red';
      $(this).children('.audioCircle').html('<i class="fas fa-pause soundicon small"></i>');
    }
  });

  $(document).on('click', '.reset', function() {
    target = $(this).parents('.row').find('.sound').get(0);
    target.pause();
    target.currentTime = 0;
    // 再生中だった時
    if(target.style.background == 'red') {
      target.play();
      $(this).parents('.row').find('.audioCircle').html('<i class="fas fa-pause soundicon small"></i>');
    } else {
      $(this).parents('.row').find('.audioCircle').html('<i class="fas fa-play soundicon small"></i>');
    }
  });

  $(document).on('click', '.rewind5s', function() {
    $(this).parents('.row').find('.sound').get(0).currentTime -= 5;
  });

  $(document).on('click', '.skip5s', function() {
    $(this).parents('.row').find('.sound').get(0).currentTime += 5;
  });

  $(document).on('click', '.skipNext', function() {
    target = $(this).parents('.row').find('.sound').get(0);
    target.style.background = 'white';
    target.currentTime += 32;
    $(this).parents('.row').find('.audioCircle').html('<i class="fas fa-play soundicon small"></i>');
  });

});
