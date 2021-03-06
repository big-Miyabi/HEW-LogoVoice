# LogoVoice

## 概要

一年次に HAL EVENT WEEKS という学内イベントで金賞を頂いた作品です。JavaScript の知識ゼロの状態から一ヶ月半で作成しました。

よく日本語を学んでいる外国の方が、「日本人はカタコトでそこまで上手くない日本語でも、お世辞で "日本語上手ですね！" "日本人より日本語上手いんじゃない？" と褒めてくるので、自分の発音がどれくらいの実力なのか分からない」と言っているのを耳にしたことがあります。

また、私も高校時代に中国語の勉強をしていて、「自分の中国語の発音はネイティブの人から聞くとどれくらいの出来なんだろうか？」という疑問を持ったことがありました。しかし、身近に中国人の友人はいませんし、かと言って発音もままならないのに海外の人と会話できるサービスを使うのはあまりにもハードルが高く、どうすることもできませんでした。

そういった経験から、「**自分の発音が客観的にどれくらい良いのか簡単に分かるサービス**」があったらいいなと思い作成しました。

<br/>

## 使用技術

- HTML
- CSS
- JavaScript
- JQuery
- axios
- Web Audio API
- PHP
- MySQL

<br/>

## こだわった点

### デザイン面

自分はデザインがあまり得意ではないので、そこを補うために色が与える印象に気を遣い、トーンマップを用いて配色を考えました。

今回作成したサービスはジャンルで言うと「学習」ですが、なるべく学習に対してマイナスなイメージを持って欲しくなかったので、「明るい」「幸福」といったイメージを持つ黄色を主に使い、「知性」「信頼」のイメージを持ち、かつ丁度黄色の補色に当たる青をアクセントカラーとして使用しました。

また、ロゴに関しては、「発音」を主軸にしたサービスであるため、口と耳を取り入れたデザインにしたいなと思い、"L"を口、"e"を耳に見立ててデザインしました。

### 技術面

PHP は授業でやっていたので若干の知識はあったものの、javascriptに関しては本当に知識ゼロスタートだったので、がむしゃらに「どうすればこれができるのか」を調べて作り上げました。

例えば、録音した音声を再生する時にシークバーを表示させたかったのですが、この時にjsを用いてCSSアニメーションを生成するのにも苦労しました。blob 形式の音声データの長さを取得して、その長さからシークバーが右に進む速さを計算してアニメーションをつけなければならなかったので、そういった細かいアニメーションを動的に生成するのがかなり大変でした。

他にも様々ありますが、一番こだわった点は非同期処理です。<br/>
ログインや会員登録をする時にページが切り替わるのが嫌だという拘りがあったのですが、当時は Vue や React についてほとんど知らず、JQuery で強引に中身を書き換えていたのでそこが本当に苦労しました。<br/>
他にも、マイページ画面のプロフィール編集は画面を切り替えずにその場で編集できるようにしたのですが、JQuery で中身を書き換える処理に加えて PHP の操作も行わなければならなかったので非常に苦労しました。

<br/>

## 画面一覧

- トップページ
  ![トップ1](https://i.gyazo.com/bc0e7e32feae5ec6dbd10ee05d939ae3.png)![トップ2](https://i.gyazo.com/66e91997ede3b77e41de1ee362d2174b.png)
- ログイン、登録画面
  ![ログイン画面](https://i.gyazo.com/c684afedc7c3020618542341d5234372.png)![登録画面](https://i.gyazo.com/e63736f5fe6c4acf78dd40e232a2f527.png)
- 投稿された質問一覧
  - 登録時に母国語として選択した言語、もしくはマイページで学習中の言語として選択した言語のレベルに応じて質問が表示される
  - 上から順に「ネイティブスピーカー並みの上手さ」「違和感なく聞き取れる」「少し違和感はあるが問題なく聞き取れる」「若干聞き取りづらい」「聞き取るのが難しい」の 5 段階で投票できる
  - 投票ボタンを押すとページは切り替わらずにすぐに投票結果が表示される
    ![投票画面](https://i.gyazo.com/d9ad61ba54c63eb5ef14e47eddd83630.png)![投票結果](https://i.gyazo.com/96b7d332b8b3be0880471809aafeb2ec.png)
- 質問投稿画面
  - 左のナビゲーションから"AskQuestion"を押下すると表示される
  - 30 秒まで録音できる
  - 回答者の語学レベル(ネイティブのみ、上級者以上、中級者以上など)を選択でき、選択したレベルのユーザーにしか質問は表示されない
  - 録音した内容の原稿、その言語を選択する
    ![投稿画面1](https://i.gyazo.com/09b165ac454f21aec2999d52e2e307ce.png)![投稿画面2](https://i.gyazo.com/a22cbbfa622a517a1f1f16f12c7fb11f.png)
- マイページ
  - 自分の名前やアイコン、プロフィール、学習中の言語などを編集できる
    ![マイページ](https://i.gyazo.com/33f72417a3123a5cc4af9835ad15f35e.png)
