<?php
//パスワードのハッシュ化
require 'password.php';

// セッション開始
session_start();

// axios.postとaxios.getの処理分け
// axios.post
if (!isset($_SESSION["register_axios"])) {

  //Windows環境はlocalhostよりもIPアドレス指定のほうが早く動く
  $db['host'] = "mariadb";  // DBサーバのURL
  $db['user'] = "root";  // ユーザー名
  $db['pass'] = "password";  // ユーザー名のパスワード
  $db['dbname'] = "logovoice";  // データベース名


  // php://inputはPOSTの生データの読み込みを許可
  $json_string = file_get_contents('php://input');

  // json_encodeでオブジェクト形式に変換
  $obj = json_decode($json_string);

  // 1. ユーザIDの入力チェック
  if (empty($obj->registerUN)) {
    $_SESSION["register_axios"] = -1;
  } else if (empty($obj->motherTongue)) {
    $_SESSION["register_axios"] = -2;
  } else if (empty($obj->newPW->registerPW)) {
    $_SESSION["register_axios"] = -3;
  } else if (empty($obj->newPW->Re_enterPW)) {
    $_SESSION["register_axios"] = -4;
  } else if ($obj->newPW->registerPW != $obj->newPW->Re_enterPW) {
    $_SESSION["register_axios"] = -5;
  } else {
    // 入力したユーザIDとパスワードを格納
    $registerUN = $obj->registerUN;
    $motherTongue = $obj->motherTongue;
    $registerPW = $obj->newPW->registerPW;
    // $Re_enterPW = $obj->Re_enterPW;

    // 2. ユーザIDとパスワードが入力されていたら認証する
    //sprintf関数は「あるフォーマットに従った文字列を返す」関数
    //%s→文字列、%d→数値
    $dsn = sprintf('mysql:host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);

    // 3. エラー処理
    try {
      $pdo = new PDO($dsn, $db['user'], $db['pass'],
        array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
        ));

      // ユーザーネームの重複チェック
      $stmt = $pdo->prepare('SELECT * FROM user_data WHERE name = ?');
      $stmt->bindValue(1,$registerUN,PDO::PARAM_STR);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      var_dump($row);

      // 重複していない時
      if(empty($row)) {
        $stmt = $pdo->prepare("INSERT INTO user_data(name, motherTongue, password) VALUES (?, ?, ?)");

        $stmt->execute(array($registerUN, $motherTongue, password_hash($registerPW, PASSWORD_DEFAULT)));  // パスワードのハッシュ化を行う（今回は文字列のみなのでbindValue(変数の内容が変わらない)を使用せず、直接excuteに渡しても問題ない）

        $userid = $pdo->lastinsertid();  // 登録した(DB側でauto_incrementした)IDを$useridに入れる

        // user_profileテーブルにデータを追加
        // 今の段階ではMyPageは未設定なので、初期値として"NOT SET"を入れる
        $notset = "NOT SET";
        $stmt = $pdo->prepare("INSERT INTO user_profile(USERID, gender, age, introduce) VALUES (?, ?, ?, ?)");
        $stmt->execute(array($userid, $notset, $notset, $notset));

        // learninglanguageテーブルにデータを追加
        $stmt = $pdo->prepare("INSERT INTO learninglanguage(USERID, otherLanguages, learningLevel, certification) VALUES (?, ?, ?, ?)");
        $stmt->execute(array($userid, $notset, $notset, $notset));

        $registerMsg = 'You have successfully registered! Your user ID is No.'. $userid.'.<br/>If you have trouble, please click the upper right help button.';

        $_SESSION["registerMsg"] = $registerMsg;
        $_SESSION["register_axios"] = 0;
        // セッションにユーザーネームを保存
        $_SESSION["NAME"] = $registerUN;
      } else {
        // 重複しているとき
        $_SESSION["register_axios"] = -6;
      }



    } catch (PDOException $e) {
      // $e->getMessage() でエラー内容を参照可能（デバッグ時のみ表示）
      echo $e->getMessage();
      $_SESSION["register_axios"] = -7;
    }
  }
} else {
  if($_SESSION["register_axios"] == 0) {
    $registerMsg = $_SESSION["registerMsg"];
    $msg = [
      "result" => "success",
      "msg" => $registerMsg
    ];
  } else if($_SESSION["register_axios"] == -1) {
    $msg = [
      "result" => "false",
      "msg" => "Enter your name!"
    ];
  } else if($_SESSION["register_axios"] == -2) {
    $msg = [
      "result" => "false",
      "msg" => "The mother tongue is unselected!"
    ];
  } else if($_SESSION["register_axios"] == -3) {
    $msg = [
      "result" => "false",
      "msg" => "Enter your password!"
    ];
  } else if($_SESSION["register_axios"] == -4) {
    $msg = [
      "result" => "false",
      "msg" => "Please re-enter password!"
    ];
  } else if($_SESSION["register_axios"] == -5) {
    $msg = [
      "result" => "false",
      "msg" => "Passwords must match!"
    ];
  } else if($_SESSION["register_axios"] == -6) {
    $msg = [
      "result" => "false",
      "msg" => "This username already exists.<br>Please enter another username."
    ];
  } else {
    $msg = [
      "result" => "false",
      "msg" => "Database Error."
    ];
  }

  // メッセージを格納したセッションを削除
  unset($_SESSION["register_axios"]);
  unset($_SESSION["registerMsg"]);

  // Origin null is not allowed by Access-Control-Allow-Origin.とかのエラー回避の為、ヘッダー付与
  header("Access-Control-Allow-Origin: *");

  echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
?>