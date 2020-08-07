<?php
// セッション開始
session_start();

// 配列内の全ての値が一意かチェックする関数
function isUniqueArray ($target_array) {
  $unique_array = array_unique($target_array);
  if (count($unique_array) === count($target_array)) {
    return true;
  }
  else {
    return false;
  }
}

// 配列の中身が空かチェックする関数
// 空の時falseを返す
function arrayEmptyJudge ($target_array) {
  foreach($target_array as &$value) {
    echo $value;
    if (empty($value)) {
      $value = "NOT SET";
      return true;
    }
  }
  return false;
}

// otherlanguages配列の中身が母国語と被っていないかチェックする関数
// 被っていた時trueを返す
function motherTongueJudge ($target_array, $motherTongue) {
  foreach($target_array as &$value) {
    echo $value;
    if ($value == $motherTongue) {
      $value = "NOT SET";
      return true;
    }
  }
  return false;
}

// axios.postとaxios.getの処理分け
// axios.post
if (!isset($_SESSION["update_axios"])) {

  //Windows環境はlocalhostよりもIPアドレス指定のほうが早く動く
  $db['host'] = "mariadb";  // DBサーバのURL
  $db['user'] = "root";  // ユーザー名
  $db['pass'] = "password";  // ユーザー名のパスワード
  $db['dbname'] = "logovoice";  // データベース名


  // php://inputはPOSTの生データの読み込みを許可
  $json_string = file_get_contents('php://input');
  print_r($json_string);

  // json_encodeでオブジェクト形式に変換
  $obj = json_decode($json_string);

  // 入力した更新希望データを格納
  $profile = $obj->profile;
  $otherLanguageName = $obj->otherLanguageName;
  $learningLevel = $obj->learningLevel;
  $certification = $obj->certification;
  $deletedata = $obj->deletedata;
  $deletedata_certification = $obj->deletedata_certification;
  $motherTongue = $obj->motherTongue;
  var_dump($obj);

  // other languageの重複チェック
  // trueの時配列内に重複要素はない
  $ol_check = isUniqueArray($otherLanguageName);

  // other languageごとのcertificationに対して重複チェック
  // 結果(true,false)を配列に格納
  for ($i=0; $i < count($certification); $i++) {
    $certification_check_array[$i] = isUniqueArray($certification[$i]);
  }
  print_r($certification_check_array);

  // 重複チェックの結果falseが存在したか検索する
  $certification_check = in_array(0, $certification_check_array);

  if(arrayEmptyJudge($otherLanguageName)) {
    $_SESSION["update_axios"] = -1;
    echo "otherlanguages 未選択エラー";
  } else if(arrayEmptyJudge($learningLevel)) {
    $_SESSION["update_axios"] = -2;
    echo "learningLevel 未選択エラー";
  // other languagesに重複があるとき
  } else if($ol_check == false) {
    $_SESSION["update_axios"] = -3;
    echo "otherlanguages重複エラー";
  // other languagesごとのcertificationに重複があるとき
  } else if($certification_check) {
    $_SESSION["update_axios"] = -4;
    echo "certification重複エラー";
  }  else if(motherTongueJudge($otherLanguageName, $motherTongue)) {
    $_SESSION["update_axios"] = -5;
    echo "エラー: motherTongueとotherlanguageが被っています";
  } else {
    //sprintf関数は「あるフォーマットに従った文字列を返す」関数
    //%s→文字列、%d→数値
    $dsn = sprintf('mysql:host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);

    // エラー処理
    try {
      $pdo = new PDO($dsn, $db['user'], $db['pass'],
        array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
        ));

      // セッションに保存されているユーザーネームからID取得
      $stmt = $pdo->prepare('SELECT userid FROM user_data WHERE name = ?');
      $stmt->bindValue(1,$_SESSION["NAME"],PDO::PARAM_STR);
      $stmt->execute();
      $id = $stmt->fetch(PDO::FETCH_ASSOC);
      $id = $id['userid'];
      print_r($id);

      if(empty($profile[0])) { $profile[0] = "NOT SET"; }
      if(empty($profile[1])) { $profile[1] = "NOT SET"; }

      // profileデータのアップデート
      $stmt = $pdo->prepare('UPDATE user_profile SET gender = ?, age = ?, introduce = ? WHERE USERID = ?');
      $stmt->bindValue(1,$profile[0],PDO::PARAM_STR);
      $stmt->bindValue(2,$profile[1],PDO::PARAM_STR);
      $stmt->bindValue(3,$profile[2],PDO::PARAM_STR);
      $stmt->bindValue(4,$id,PDO::PARAM_STR);
      $stmt->execute();


      // 削除するデータの数取得
      $deletedata_length = count($deletedata);
      // 選択したother languagesデータを削除
      for ($i=0; $i<$deletedata_length ; $i++) {
        $stmt = $pdo->prepare('DELETE FROM learninglanguage WHERE USERID = ? AND otherlanguages = ?;');
        $stmt->bindValue(1,$id,PDO::PARAM_STR);
        $stmt->bindValue(2,$deletedata[$i],PDO::PARAM_STR);
        $stmt->execute();
      }

      // DB内のOther Languagesを取得
      $stmt = $pdo->prepare('SELECT DISTINCT otherlanguages, learningLevel FROM learninglanguage WHERE USERID = ?');
      $stmt->bindValue(1,$id,PDO::PARAM_STR);
      $stmt->execute();
      $ol_row = $stmt->fetchALL(PDO::FETCH_ASSOC);
      $ol_row_length = count($ol_row);
      print_r($ol_row);
      // +----------------+---------------+
      // | otherlanguages | learningLevel |
      // +----------------+---------------+
      // | Japanese       | dafadfdfa     |
      // | English        | god           |
      // +----------------+---------------+


      // DBに入っているOther Languagesの数分だけデータをアップデートする
      for ($i=0; $i < $ol_row_length; $i++) {
        // otherlanguagesの更新
        $stmt = $pdo->prepare('UPDATE learninglanguage SET otherlanguages = ? WHERE USERID = ? AND otherLanguages = ?');
        $stmt->bindValue(1,$otherLanguageName[$i],PDO::PARAM_STR);
        $stmt->bindValue(2,$id,PDO::PARAM_STR);
        $stmt->bindValue(3,$ol_row[$i]['otherlanguages'],PDO::PARAM_STR);
        $stmt->execute();

        // 更新後のother languageを取得
        $stmt = $pdo->prepare('SELECT DISTINCT otherlanguages FROM learninglanguage WHERE USERID = ? AND otherLanguages = ?');
        $stmt->bindValue(1,$id,PDO::PARAM_STR);
        $stmt->bindValue(2,$otherLanguageName[$i],PDO::PARAM_STR);
        $stmt->execute();
        $new_ol_row = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $new_ol_row_length = count($new_ol_row);
        print_r($new_ol_row);
        // +----------------+
        // | otherlanguages |
        // +----------------+
        // | Japanese       |
        // +----------------+

        // learninglevelの更新
        $stmt = $pdo->prepare('UPDATE learninglanguage SET learningLevel = ? WHERE USERID = ? AND learningLevel = ? AND otherLanguages = ?');
        $stmt->bindValue(1,$learningLevel[$i],PDO::PARAM_STR);
        $stmt->bindValue(2,$id,PDO::PARAM_STR);
        $stmt->bindValue(3,$ol_row[$i]['learningLevel'],PDO::PARAM_STR);
        $stmt->bindValue(4,$otherLanguageName[$i],PDO::PARAM_STR);
        $stmt->execute();

        // 更新後のother languageごとにcertificationを取得
        $stmt = $pdo->prepare('SELECT DISTINCT certification FROM learninglanguage WHERE USERID = ? AND otherlanguages = ?');
        $stmt->bindValue(1,$id,PDO::PARAM_STR);
        $stmt->bindValue(2,$otherLanguageName[$i],PDO::PARAM_STR);
        $stmt->execute();
        $cer_row = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $cer_row_length = count($cer_row);

        // 更新後のother languageごとにcertificationを削除
        for ($j=0; $j < $cer_row_length; $j++) {
          $stmt = $pdo->prepare('DELETE FROM learninglanguage WHERE USERID = ? AND otherlanguages = ? AND certification = ?;');
          $stmt->bindValue(1,$id,PDO::PARAM_STR);
          $stmt->bindValue(2,$otherLanguageName[$i],PDO::PARAM_STR);
          $stmt->bindValue(3,$deletedata_certification[$i][$j],PDO::PARAM_STR);
          $stmt->execute();
        }

        // certification削除後のother languageごとにcertificationを取得
        $stmt = $pdo->prepare('SELECT DISTINCT certification FROM learninglanguage WHERE USERID = ? AND otherlanguages = ?');
        $stmt->bindValue(1,$id,PDO::PARAM_STR);
        $stmt->bindValue(2,$otherLanguageName[$i],PDO::PARAM_STR);
        $stmt->execute();
        $cer_row = $stmt->fetchALL(PDO::FETCH_ASSOC);
        $cer_row_length = count($cer_row);

        print_r($cer_row);
        print_r($cer_row_length);
        // +---------------+
        // | certification |
        // +---------------+
        // | TOEIC999999   |
        // | God of French |
        // +---------------+

        // certificationの更新
        for ($j=0; $j < $cer_row_length; $j++) {
          echo "\$j = ";
          print_r($j);
          $stmt = $pdo->prepare('UPDATE learninglanguage SET certification = ? WHERE USERID = ? AND certification = ? AND otherlanguages = ?');
          $stmt->bindValue(1,$certification[$i][$j],PDO::PARAM_STR);
          $stmt->bindValue(2,$id,PDO::PARAM_STR);
          $stmt->bindValue(3,$cer_row[$j]['certification'],PDO::PARAM_STR);
          $stmt->bindValue(4,$otherLanguageName[$i],PDO::PARAM_STR);
          $stmt->execute();

          print_r($cer_row[$j]['certification']);
        }

        // 入力したother language内のcertificationの数を取得
        $cer_length = count($certification[$i]);

        for ($j=$j; $j < $cer_length; $j++) {
          echo "\n\ninsert \$j = ";
          print_r($j);
          $stmt = $pdo->prepare('INSERT INTO learninglanguage(USERID, otherLanguages, learningLevel, certification) VALUES (?, ?, ?, ?)');
          $stmt->bindValue(1,$id,PDO::PARAM_STR);
          $stmt->bindValue(2,$otherLanguageName[$i],PDO::PARAM_STR);
          $stmt->bindValue(3,$learningLevel[$i],PDO::PARAM_STR);
          $stmt->bindValue(4,$certification[$i][$j],PDO::PARAM_STR);
          $stmt->execute();
        }

      }


      // アップロードするデータの数取得
      $otherLanguageName_length = count($otherLanguageName);

      // DBに入っていないデータは新たに生成
      for ($i=$ol_row_length; $i < $otherLanguageName_length; $i++) {

        // 入力したother language内のcertificationの数を取得
        $cer_length = count($certification[$i]);

        // 追加した入力データをアップロード
        for ($j=0; $j < $cer_length; $j++) {
          $stmt = $pdo->prepare('INSERT INTO learninglanguage(USERID, otherLanguages, learningLevel, certification) VALUES (?, ?, ?, ?)');
          $stmt->bindValue(1,$id,PDO::PARAM_STR);
          $stmt->bindValue(2,$otherLanguageName[$i],PDO::PARAM_STR);
          $stmt->bindValue(3,$learningLevel[$i],PDO::PARAM_STR);
          $stmt->bindValue(4,$certification[$i][$j],PDO::PARAM_STR);
          $stmt->execute();
        }
      }

      $_SESSION["update_axios"] = 0;
    } catch (PDOException $e) {
      $_SESSION["update_axios"] = -6;
      // $e->getMessage() でエラー内容を参照可能（デバッグ時のみ表示）
      echo $e->getMessage();
    }
  }
} else {
  if($_SESSION["update_axios"] == 0) {
    $msg = [
      "result" => "success",
      "msg" => "Your page has successfully updated!<br>Reload the page in 5 seconds.<br>If your information has not been updated, delete the cache."
    ];
  } else if($_SESSION["update_axios"] == -1) {
    $msg = [
      "result" => "false",
      "msg" => "Other languages is unselected!"
    ];
  } else if($_SESSION["update_axios"] == -2) {
    $msg = [
      "result" => "false",
      "msg" => "Learning level is unselected!"
    ];
  } else if($_SESSION["update_axios"] == -3) {
    $msg = [
      "result" => "false",
      "msg" => "Other languages is duplicated!"
    ];
  } else if($_SESSION["update_axios"] == -4) {
    $msg = [
      "result" => "false",
      "msg" => "Certification is duplicated!"
    ];
  } else if($_SESSION["update_axios"] == -5) {
    $msg = [
      "result" => "false",
      "msg" => "Please select an item other than \"Mother tongue\" for \"Other languages\"!"
    ];
  } else {
    $msg = [
      "result" => "false",
      "msg" => "Database Error."
    ];
  }

  // メッセージを格納したセッションを削除
  unset($_SESSION["update_axios"]);

  // Origin null is not allowed by Access-Control-Allow-Origin.とかのエラー回避の為、ヘッダー付与
  header("Access-Control-Allow-Origin: *");

  echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

?>