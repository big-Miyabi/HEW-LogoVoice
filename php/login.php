<?php

//パスワードのハッシュ化
require 'password.php';

// セッション開始
session_start();

// axios.postとaxios.getの処理分け
// axios.post
if (!isset($_SESSION["login_axios"])) {

  //Windows環境はlocalhostよりもIPアドレス指定のほうが早く動く
  $db['host'] = "mariadb";  // DBサーバのURL
  $db['user'] = "root";  // ユーザー名
  $db['pass'] = "password";  // ユーザー名のパスワード
  $db['dbname'] = "logovoice";  // データベース名


  // php://inputはPOSTの生データの読み込みを許可
  $json_string = file_get_contents('php://input');

  echo $json_string;
  // json_encodeでオブジェクト形式に変換
  $obj = json_decode($json_string);

  // 1. ユーザネームの入力チェック
  // オブジェクトのプロパティを指定する場合は"->"のアロー演算子を用いる
  if (empty($obj->loginUN)) {
    $_SESSION["login_axios"] = -1;
  } else if (empty($obj->loginPW)) {
    $_SESSION["login_axios"] = -2;
  } else {
    // 入力したユーザネームを格納
    $loginUN = $obj->loginUN;

    // 2. ユーザネームとパスワードが入力されていたら認証する
    //sprintf関数は「あるフォーマットに従った文字列を返す」関数
    //%s→文字列、%d→数値
    $dsn = sprintf('mysql:host=%s; dbname=%s; charset=utf8mb4', $db['host'], $db['dbname']);

    // 3. エラー処理
    try {
      $pdo = new PDO($dsn, $db['user'], $db['pass'],
        array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
        ));

      $stmt = $pdo->prepare('SELECT * FROM user_data WHERE name = ?');
      $stmt->bindValue(1,$loginUN,PDO::PARAM_STR);
      $stmt->execute();
      // bindValueを省略する場合↓
        // $stmt->execute(array($loginUN)); 引数は配列にする
        // array($loginUN)はバインドする値
        // 型は自動的にPDO::PARAM_STRになる

      $loginPW = $obj->loginPW;

      // fetchメソッドで該当配列を受け取る
      // PHPにおけるif文は、0ならfalse、それ以外はtrueになる
      if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // パスワードがハッシュにマッチするかどうかを調べる

        if (password_verify($loginPW, $row['password'])) {

          // 現在のセッションIDを新しく生成したものと置き換える
          // この関数の第1引数は、元のセッションIDに紐づくセッションを破棄することを指定するもので、過去のセッションを破棄したほうが安全方向に倒れる
          // session_regenerate_id(true); // セッションアダプション対策

          // セッションにユーザーネームを保存
          $_SESSION["NAME"] = $row['name'];

          // セッションにJSからログイン処理が送られてきた記録を残す
          $_SESSION["login_axios"] = 0;
        } else {
          // 認証失敗
          // $errorMessage = 'ユーザーIDあるいはパスワードに誤りがあります。';
          $_SESSION["login_axios"] = -3;
        }
      } else {
        // 4. 認証成功なら、セッションIDを新規に発行する
        // 該当データなし
        // $errorMessage = 'ユーザーIDあるいはパスワードに誤りがあります。';
        $_SESSION["login_axios"] = -3;
      }
    } catch (PDOException $e) {
      // $errorMessage = 'データベースエラー';
      $_SESSION["login_axios"] = -4;
      //$errorMessage = $sql;
      // $e->getMessage() でエラー内容を参照可能（デバッグ時の）
      // echo $e->getMessage();
    }

  }
// axios.get
} else {
  if ($_SESSION["login_axios"] == 0) {
    $msg = [
      "result" => "success",
      "msg" => $_SESSION["NAME"].", welcome to LogoVoice!"
    ];
  } else if ($_SESSION["login_axios"] == -1) {
    $msg = [
      "result" => "false",
      "msg" => "Enter your name!"
    ];
  }  else if ($_SESSION["login_axios"] == -2) {
    $msg = [
      "result" => "false",
      "msg" => "Enter your password!"
    ];
  }  else if ($_SESSION["login_axios"] == -3) {
    $msg = [
      "result" => "false",
      "msg" => "The user name or password is incorrect."
    ];
  } else {
    $msg = [
      "result" => "false",
      "msg" => "Database Error."
    ];
  }

  // メッセージを格納したセッションを削除
  unset($_SESSION["login_axios"]);

  // Origin null is not allowed by Access-Control-Allow-Origin.とかのエラー回避の為、ヘッダー付与
  header("Access-Control-Allow-Origin: *");

  echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

}
?>