<?php

// セッション開始
session_start();

// axios.postとaxios.getの処理分け
// axios.post
if(!isset($_SESSION['vote_axios'])) {

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

  // 入力したデータを格納
  $audioID = $obj->audioID;
  $yourVote = $obj->yourVote;
  var_dump($obj);

  if(empty($yourVote)) {
    $_SESSION['vote_axios'] = -1;
    echo "yourVote 未選択エラー";
  } else {
    $dsn = sprintf('mysql:host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);

    // エラー処理
    try {
      $pdo = new PDO($dsn, $db['user'], $db['pass'],
        array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
        ));

        // セッションに保存されているnameに一致したUSERIDを取得
        $stmt = $pdo->prepare('SELECT USERID FROM user_data WHERE name = ?');
        $stmt->bindValue(1,$_SESSION["NAME"],PDO::PARAM_STR);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $row['USERID']; // ユーザーIDを取得

        // 投票データをvote_dataテーブルに挿入
        $stmt = $pdo->prepare('INSERT INTO vote_data(USERID, audioID, vote) VALUES (?, ?, ?)');
        $stmt->bindValue(1,$id,PDO::PARAM_STR);
        $stmt->bindValue(2,$audioID,PDO::PARAM_STR);
        $stmt->bindValue(3,$yourVote,PDO::PARAM_STR);
        $stmt->execute();

        // 投票した質問のそれぞれの投票数を記録
        // vote1
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ? AND vote = 1');
        $stmt->bindValue(1,$audioID,PDO::PARAM_STR);
        $stmt->execute();
        $_SESSION['vote1'] = $stmt->fetch(PDO::FETCH_ASSOC);

        // vote2
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ? AND vote = 2');
        $stmt->bindValue(1,$audioID,PDO::PARAM_STR);
        $stmt->execute();
        $_SESSION['vote2'] = $stmt->fetch(PDO::FETCH_ASSOC);

        // vote3
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ? AND vote = 3');
        $stmt->bindValue(1,$audioID,PDO::PARAM_STR);
        $stmt->execute();
        $_SESSION['vote3'] = $stmt->fetch(PDO::FETCH_ASSOC);

        // vote4
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ? AND vote = 4');
        $stmt->bindValue(1,$audioID,PDO::PARAM_STR);
        $stmt->execute();
        $_SESSION['vote4'] = $stmt->fetch(PDO::FETCH_ASSOC);

        // vote5
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ? AND vote = 5');
        $stmt->bindValue(1,$audioID,PDO::PARAM_STR);
        $stmt->execute();
        $_SESSION['vote5'] = $stmt->fetch(PDO::FETCH_ASSOC);

        // 全投票数
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ?');
        $stmt->bindValue(1,$audioID,PDO::PARAM_STR);
        $stmt->execute();
        $_SESSION['allVote'] = $stmt->fetch(PDO::FETCH_ASSOC);

        $_SESSION['vote_axios'] = 0;
      } catch (PDOException $e) {
        $_SESSION['vote_axios'] = -2;
        $errorMessage = 'データベースエラー';
        //$errorMessage = $sql;
        // $e->getMessage() でエラー内容を参照可能（デバッグ時の）
        echo $e->getMessage();
      }
  }
} else {
  if($_SESSION["vote_axios"] == 0) {
    $msg = [
      "result" => "success",
      "vote1" => $_SESSION["vote1"],
      "vote2" => $_SESSION["vote2"],
      "vote3" => $_SESSION["vote3"],
      "vote4" => $_SESSION["vote4"],
      "vote5" => $_SESSION["vote5"],
      "allVote" => $_SESSION["allVote"]
    ];
  } else if($_SESSION["vote_axios"] == -1) {
    $msg = [
      "result" => "false",
      "msg" => "Your vote is unselected!"
    ];
  } else {
    $msg = [
      "result" => "false",
      "msg" => "Database Error."
    ];
  }
  // axios.post時に使用したセッションを削除
  unset($_SESSION["vote_axios"]);
  unset($_SESSION["vote1"]);
  unset($_SESSION["vote2"]);
  unset($_SESSION["vote3"]);
  unset($_SESSION["vote4"]);
  unset($_SESSION["vote5"]);
  unset($_SESSION["allVote"]);

  // Origin null is not allowed by Access-Control-Allow-Origin.とかのエラー回避の為、ヘッダー付与
  header("Access-Control-Allow-Origin: *");

  echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}


?>