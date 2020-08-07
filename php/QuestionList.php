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

    // セッションに保存されているnameに一致したuser_dataのIDと母国語を取得
    $stmt = $pdo->prepare('SELECT USERID, motherTongue FROM user_data WHERE name = ?');
    $stmt->bindValue(1,$_SESSION["NAME"],PDO::PARAM_STR);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // 取り出したデータを取得
    $id = $row['USERID']; // ユーザーID
    $motherTongue = $row['motherTongue']; // 母国語

    // 取得したIDから学習中の言語を重複を排除して取得
    $sql = "SELECT DISTINCT otherLanguages, learningLevel FROM learninglanguage WHERE USERID = $id";
    $stmt = $pdo->query($sql);
    // OLはother languagesの略
    $OLrow = $stmt->fetchALL(PDO::FETCH_ASSOC);
    $OLlength = count($OLrow);


    $questions = [];
    // 母国語に一致した質問を取得
    $sql = "SELECT A.*, B.thumbnailURL FROM question_data AS A JOIN user_profile AS B ON A.USERID = B.USERID where A.scriptlanguage = \"$motherTongue\" AND (A.adviserLevel = \"NativeSpeaker\" OR A.adviserLevel = \"Advanced\" OR A.adviserLevel = \"Upper-Intermediate\" OR A.adviserLevel = \"Intermediate\") AND A.USERID NOT IN ('$id')";
    $stmt = $pdo->query($sql);
    $questions[0] = $stmt->fetchALL(PDO::FETCH_ASSOC);



    // 学習中の言語の習熟度に合った質問を取得
    for($i=0; $i<$OLlength; $i++) {
      $otherlanguages = $OLrow[$i]['otherLanguages'];
      $learningLevel = $OLrow[$i]['learningLevel'];

      // ユーザの習熟度6の時
      if($learningLevel == "Advanced") {
        $sql = "SELECT A.*, B.thumbnailURL FROM question_data AS A JOIN user_profile AS B ON A.USERID = B.USERID where A.scriptlanguage = \"$otherlanguages\" AND (A.adviserLevel = \"Advanced\" OR A.adviserLevel = \"Upper-Intermediate\" OR A.adviserLevel = \"Intermediate\") AND A.USERID NOT IN ('$id')";
        $stmt = $pdo->query($sql);
        $question_LL = $stmt->fetchALL(PDO::FETCH_ASSOC);
        array_push($questions,$question_LL);
      // ユーザー習熟度5の時
      } else if($learningLevel == "Upper-Intermediate") {
        $sql = "SELECT A.*, B.thumbnailURL FROM question_data AS A JOIN user_profile AS B ON A.USERID = B.USERID where A.scriptlanguage = \"$otherlanguages\" AND (A.adviserLevel = \"Upper-Intermediate\" OR A.adviserLevel = \"Intermediate\") AND A.USERID NOT IN ('$id')";
        $stmt = $pdo->query($sql);
        $question_LL = $stmt->fetchALL(PDO::FETCH_ASSOC);
        array_push($questions,$question_LL);
        // ユーザー習熟度4の時
      } else if($learningLevel == "Intermediate") {
        $sql = "SELECT A.*, B.thumbnailURL FROM question_data AS A JOIN user_profile AS B ON A.USERID = B.USERID where A.scriptlanguage = \"$otherlanguages\" AND (A.adviserLevel = \"Intermediate\") AND A.USERID NOT IN ('$id')";
        $stmt = $pdo->query($sql);
        $question_LL = $stmt->fetchALL(PDO::FETCH_ASSOC);
        array_push($questions,$question_LL);
      } // 習熟度4以上でない時は何もしない
    }

    //配列の中の空要素を削除する
    $questions = array_filter($questions);
    // 配列を採番する
    $questions = array_merge($questions);

    $questions_length = count($questions);
    $question_simple = [];

    // 二次元配列を一次元に直す
    for($i = 0; $i < $questions_length; $i++) {
      $inner_q_length = count($questions[$i]);
      for ($j=0; $j < $inner_q_length; $j++) {
        array_push($question_simple,$questions[$i][$j]);
      }
    }

    // 配列をdateで新着順に並び替え
    foreach ((array) $question_simple as $key => $value) {
      $sort[$key] = $value['date'];
    }
    array_multisort($sort, SORT_DESC, $question_simple);
    // var_dump($question_simple);

    // 取得した質問に対して既に投票済みかどうかを確認
    // 投票済みであれば結果を取得
    $vote_exists = [];
    $vote1 = [];
    $vote2 = [];
    $vote3 = [];
    $vote4 = [];
    $vote5 = [];
    $allVote = [];
    $question_simple_length = count($question_simple);

    for($i=0; $i < $question_simple_length; $i++) {
      // それぞれの質問のaudioIDを取得
      $question_audioID = $question_simple[$i]['audioID'];

      // 投票しているかどうか確認
      $sql = "SELECT B.USERID FROM question_data AS A JOIN vote_data AS B ON A.audioID = B.audioID where A.audioID = $question_audioID AND B.USERID = $id";
      $stmt = $pdo->query($sql);
      $vote_exists[$i] = $stmt->fetch(PDO::FETCH_ASSOC);

      // 投票済みだった場合は投票結果も取得
      if($vote_exists[$i]['USERID']) {
        // vote1
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ? AND vote = 1');
        $stmt->bindValue(1,$question_audioID,PDO::PARAM_STR);
        $stmt->execute();
        $vote1[$i] = $stmt->fetch(PDO::FETCH_ASSOC);

        // vote2
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ? AND vote = 2');
        $stmt->bindValue(1,$question_audioID,PDO::PARAM_STR);
        $stmt->execute();
        $vote2[$i] = $stmt->fetch(PDO::FETCH_ASSOC);

        // vote3
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ? AND vote = 3');
        $stmt->bindValue(1,$question_audioID,PDO::PARAM_STR);
        $stmt->execute();
        $vote3[$i] = $stmt->fetch(PDO::FETCH_ASSOC);

        // vote4
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ? AND vote = 4');
        $stmt->bindValue(1,$question_audioID,PDO::PARAM_STR);
        $stmt->execute();
        $vote4[$i] = $stmt->fetch(PDO::FETCH_ASSOC);

        // vote5
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ? AND vote = 5');
        $stmt->bindValue(1,$question_audioID,PDO::PARAM_STR);
        $stmt->execute();
        $vote5[$i] = $stmt->fetch(PDO::FETCH_ASSOC);

        // 全投票数
        $stmt = $pdo->prepare('SELECT count(*) FROM vote_data WHERE audioID = ?');
        $stmt->bindValue(1,$question_audioID,PDO::PARAM_STR);
        $stmt->execute();
        $allVote[$i] = $stmt->fetch(PDO::FETCH_ASSOC);
      }
    }


    $questionsForYou = [
      "result" => "session exists",
      "questions" => $question_simple,
      "vote_exists" => $vote_exists,
      "vote1" => $vote1,
      "vote2" => $vote2,
      "vote3" => $vote3,
      "vote4" => $vote4,
      "vote5" => $vote5,
      "allVote" => $allVote
    ];


  } catch (PDOException $e) {
    $errorMessage = 'データベースエラー';
    //$errorMessage = $sql;
    // $e->getMessage() でエラー内容を参照可能（デバッグ時の）
    // echo $e->getMessage();
  }
} else {
  $questionsForYou = [
    "result" => "session none",
  ];
}

// Origin null is not allowed by Access-Control-Allow-Origin.とかのエラー回避の為、ヘッダー付与
header("Access-Control-Allow-Origin: *");

echo json_encode($questionsForYou, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>