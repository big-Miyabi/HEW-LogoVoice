<?php
  // セッション開始
  session_start();

  if (!isset($_SESSION["NAME"])) {
    $loginCheck = [
      "result" => "session none",
      "html" => "<div class=\"BtnBg loginBtnBg\"><li class=\"Btn loginBtn\">Login</li></div><div class=\"BtnBg RegBtnBg\"><li class=\"Btn RegBtn\">Register</li></div>"
    ];
  } else {
    $loginCheck = [
      "result" => "session exists",
      "html" => "<div class=\"BtnBg logoutBtnBg\"><li class=\"Btn logoutBtn\">Logout</li></div></div>"
    ];
  }

  // Origin null is not allowed by Access-Control-Allow-Origin.とかのエラー回避の為、ヘッダー付与
  header("Access-Control-Allow-Origin: *");

  echo json_encode($loginCheck, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>