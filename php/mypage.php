<?php
  // セッション開始
  session_start();


  if(isset($_SESSION['NAME'])) {
    //Windows環境はlocalhostよりもIPアドレス指定のほうが早く動く
    $db['host'] = "mariadb";  // DBサーバのURL
    $db['user'] = "root";  // ユーザー名
    $db['pass'] = "password";  // ユーザー名のパスワード
    $db['dbname'] = "logovoice";  // データベース名

    $dsn = sprintf('mysql:host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);

    // エラー処理
    try {
      $pdo = new PDO($dsn, $db['user'], $db['pass'],
        array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_EMULATE_PREPARES => false
        ));

      // セッションに保存されているnameに一致したuser_dataとuser_profileデータを取り出すSQL文
      $stmt = $pdo->prepare('SELECT A.USERID, A.name, A.motherTongue, B.gender, B.age, B.introduce, B.thumbnailURL FROM user_data AS A JOIN user_profile AS B ON A.USERID = B.USERID WHERE A.name = ?');
      $stmt->bindValue(1,$_SESSION["NAME"],PDO::PARAM_STR);
      $stmt->execute();
      // bindValueを省略する場合↓
        // $stmt->execute(array($_SESSION["NAME"])); 引数は配列にする
        // array($_SESSION["NAME"])はバインドする値
        // 型は自動的にPDO::PARAM_STRになる

      // fetchメソッドで該当配列を受け取る
      // PHPにおけるif文は、0ならfalse、それ以外はtrueになる
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      // print_r($row);

      // 入力したデータを取得
      $id = $row['USERID']; // ユーザーID
      $name = $row['name']; // ユーザー名
      $motherTongue = $row['motherTongue']; // 母国語
      $gender = $row['gender']; // 性別
      $age = $row['age']; // 年齢
      $introduce = $row['introduce']; // 自己紹介
      $thumbnailURL = $row['thumbnailURL']; // プロフィール画像

      $sql = "SELECT DISTINCT otherlanguages, learningLevel FROM learninglanguage WHERE USERID = $id";
      $stmt = $pdo->query($sql);
      // OLはother languagesの略
      $OLrow = $stmt->fetchALL(PDO::FETCH_ASSOC);
      $OLlength = count($OLrow);
      // echo "\n↓　\$OLrow　↓\n";
      // print_r($OLrow);

      for($i=0; $i<$OLlength; $i++) {
        $otherlanguages = $OLrow[$i]['otherlanguages'];
        $sql = "SELECT certification FROM learninglanguage where otherlanguages = \"$otherlanguages\" AND USERID = $id";
        $stmt = $pdo->query($sql);
        $certification[$i] = $stmt->fetchALL(PDO::FETCH_ASSOC);
      }
      // echo "\n↓　\$certification　↓\n";
      // print_r($certification);

      $mypageContent = [
        "result" => "session exists",
        "name" => $name,
        "gender" => $gender,
        "age" => $age,
        "motherTongue" => $motherTongue,
        "otherANDlevel" => $OLrow,
        "certification" => $certification,
        "introduce" => $introduce,
        "thumbnailURL" => $thumbnailURL
      ];

      echo "\n\n\n";

    } catch (PDOException $e) {
      $errorMessage = 'データベースエラー';
      //$errorMessage = $sql;
      // $e->getMessage() でエラー内容を参照可能（デバッグ時の）
      echo $e->getMessage();
    }
  } else {
    $mypageContent = [
      "result" => "session none",
    ];
  }

  // Origin null is not allowed by Access-Control-Allow-Origin.とかのエラー回避の為、ヘッダー付与
  // header("Access-Control-Allow-Origin: *");

  echo json_encode($mypageContent, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>