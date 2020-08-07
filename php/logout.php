<?php
session_start();
echo "ログアウトできたよ！";

// セッションの変数のクリア
$_SESSION = [];

// セッションクリア
@session_destroy();

// session_start();しないとセッションは消えない
// session_start();しないとセッションは消えない
?>