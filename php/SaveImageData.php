<?php
    var_dump($_FILES);
    date_default_timezone_set('Asia/Tokyo');

    //一時ファイルができているか（アップロードされているか）チェック
    if(is_uploaded_file($_FILES['file']['tmp_name'])){

      // セッション開始
      session_start();

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

        $imageName = "USERID".$id."_thumbnail.jpg";

        //一時ファイルを保存ファイルにコピーできたか
        if(move_uploaded_file($_FILES['file']['tmp_name'],
           "../img/".$imageName)){

         // DB内のサムネイルURLデータ更新
         $stmt = $pdo->prepare('UPDATE user_profile SET thumbnailURL = ? WHERE USERID = ?');
         $stmt->bindValue(1,$imageName,PDO::PARAM_STR);
         $stmt->bindValue(2,$id,PDO::PARAM_STR);
         $stmt->execute();

        //正常
        echo "uploaded";

        } else {
          //コピーに失敗（だいたい、ディレクトリがないか、パーミッションエラー）
          echo "error while saving.";
        }
      } catch (PDOException $e) {
        // $e->getMessage() でエラー内容を参照可能（デバッグ時のみ表示）
        echo $e->getMessage();
      }

    }else{

        //そもそもファイルが来ていない。
        echo "file not uploaded.";

    }
?>