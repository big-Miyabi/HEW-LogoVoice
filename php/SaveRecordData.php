<?php
  // セッション開始
  session_start();

  // var_dump($_FILES);

  if (isset($_SESSION["test"])) {
    unset($_SESSION["test"]);
  }


  // axios.post(テキストデータ)→request.post(音声データ)→axios.getの順で処理
  // axios.post(テキストデータ)(1回目の通信時)
  if (!isset($_SESSION["question_axios"])) {
    // php://inputはPOSTの生データの読み込みを許可
    $json_string = file_get_contents('php://input');
    print_r($json_string);

    // json_encodeでオブジェクト形式に変換
    $obj = json_decode($json_string);

    // 入力した更新希望データを格納
    $_SESSION['adviserLevel'] = $obj->adviserLevel;
    $_SESSION['rewardForAdviser'] = $obj->rewardForAdviser;
    $_SESSION['script'] = $obj->script;
    $_SESSION['scriptLanguege'] = $obj->scriptLanguege;
    var_dump($obj);

    if(empty($_SESSION['adviserLevel'])) {
      $_SESSION["question_axios"] = -1;
      echo "adviserLevel 未選択エラー";
    } else if(empty($_SESSION['script'])) {
      $_SESSION["question_axios"] = -2;
      echo "script 未入力エラー";
    // other languagesに重複があるとき
    } else if(empty($_SESSION['scriptLanguege'])) {
      $_SESSION["question_axios"] = -3;
      echo "scriptLanguege 未選択エラー";
    } else {
      // アドバイザーへの報酬が未選択の時、自動的に0を格納
      if(empty($_SESSION['rewardForAdviser'])) {
        $_SESSION['rewardForAdviser'] = 0;
      }
      $_SESSION["question_axios"] = 0;
    }


  // request.post(音声データ)(2回目の通信時)
  } else if(isset($_SESSION["question_axios"]) && !isset($_SESSION["audio_request"])) {


    //一時ファイルができている（アップロードされている）かつ テキストデータ送信時にエラーがない場合
    if(is_uploaded_file($_FILES['blob']['tmp_name']) && $_SESSION["question_axios"] == 0) {
      date_default_timezone_set('Asia/Tokyo');

      //Windows環境はlocalhostよりもIPアドレス指定のほうが早く動く
      $db['host'] = "mariadb";  // DBサーバのURL
      $db['user'] = "root";  // ユーザー名
      $db['pass'] = "password";  // ユーザー名のパスワード
      $db['dbname'] = "logovoice";  // データベース名

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

        // 保存する音声ファイルの名前を決定
        $date = date('YmdHis');
        $audioName = "USERID".$id."_".$date."audio.wav";

        //一時ファイルを保存ファイルにコピーできたか
        if(move_uploaded_file($_FILES['blob']['tmp_name'],
           "../blobFiles/".$audioName)){

         // DB内のQuestion_dataテーブルにデータを挿入
         $stmt = $pdo->prepare('INSERT INTO question_data(	USERID, audioURL, script, scriptLanguage, rewardForAdviser, adviserLevel, date) VALUES (?, ?, ?, ?, ?, ?, ?)');
         $stmt->bindValue(1,$id,PDO::PARAM_STR);
         $stmt->bindValue(2,$audioName,PDO::PARAM_STR);
         $stmt->bindValue(3,$_SESSION['script'],PDO::PARAM_STR);
         $stmt->bindValue(4,$_SESSION['scriptLanguege'],PDO::PARAM_STR);
         $stmt->bindValue(5,$_SESSION['rewardForAdviser'],PDO::PARAM_STR);
         $stmt->bindValue(6,$_SESSION['adviserLevel'],PDO::PARAM_STR);
         $stmt->bindValue(7,$date,PDO::PARAM_STR);
         $stmt->execute();

          //正常
          echo "uploaded";
          $_SESSION["audio_request"] = 0;
        } else {
          $_SESSION["audio_request"] = -1;
          //コピーに失敗（だいたい、ディレクトリがないか、パーミッションエラー）
          echo "error while saving.";
        }
      } catch (PDOException $e) {
        $_SESSION["audio_request"] = -2;
        echo "データベースエラー";
        // $e->getMessage() でエラー内容を参照可能（デバッグ時のみ表示）
        echo $e->getMessage();
      }
    // ファイルがアップロードできていない時
    } else if (!(is_uploaded_file($_FILES['blob']['tmp_name']))) {
      $_SESSION["audio_request"] = -3;
      echo "録音した音声がないよ";
    }
    // echo "question_axios:".$_SESSION["question_axios"];
    // echo "audio_request".$_SESSION["audio_request"];

  } else if(isset($_SESSION["question_axios"]) && isset($_SESSION["audio_request"])) {
    // echo "question_axios:".$_SESSION["question_axios"];
    // echo "audio_request".$_SESSION["audio_request"];

    if($_SESSION["question_axios"] == 0 && $_SESSION["audio_request"] == 0) {
      $msg = [
        "result" => "success",
        "msg" => "Your question has successfully uploaded!"
      ];
    } else if ($_SESSION["question_axios"] == -1) {
      $msg = [
        "result" => "false",
        "msg" => "Adviser level is unselected!"
      ];
    } else if ($_SESSION["question_axios"] == -2) {
      $msg = [
        "result" => "false",
        "msg" => "Script is not entered!"
      ];
    } else if ($_SESSION["question_axios"] == -3) {
      $msg = [
        "result" => "false",
        "msg" => "Script languege is unselected!"
      ];
    } else if($_SESSION["audio_request"] == -1) {
      $msg = [
        "result" => "false",
        "msg" => "error while saving."
      ];
    } else if($_SESSION["audio_request"] == -2) {
      $msg = [
        "result" => "false",
        "msg" => "Database Error."
      ];
    } else {
      // else if($_SESSION["audio_request"] == -3)
      $msg = [
        "result" => "false",
        "msg" => "There is no recorded audio file."
      ];
    }

    // メッセージを格納したセッションを削除
    unset($_SESSION["question_axios"]);
    unset($_SESSION["audio_request"]);
    unset($_SESSION['adviserLevel']);
    unset($_SESSION['rewardForAdviser']);
    unset($_SESSION['script']);
    unset($_SESSION['scriptLanguege']);

    // Origin null is not allowed by Access-Control-Allow-Origin.とかのエラー回避の為、ヘッダー付与
    header("Access-Control-Allow-Origin: *");

    echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  }


  // 最後にセッション削除するのを忘れるな！

  /*
    $_FILES['blob']['tmp_name']

    array(1) {
      ["filename"]=> string(8) "test.wav"
    }
    array(1) {
      ["blob"]=> array(5) {
        ["name"]=> string(4) "blob"
        ["type"]=> string(10) "audio/webm"
        ["tmp_name"]=> string(24) "C:\xampp\tmp\php2A43.tmp"
        ["error"]=> int(0)
        ["size"]=> int(8131)
      }
    }
  */
?>