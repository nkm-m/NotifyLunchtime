# 概要

お昼の 12 時に Lambda から Slack に通知を飛ばすプログラムです。

# 使用方法

## 1. GCP で API キーを作成

[API キーの使用 ](https://developers.google.com/calendar/api)

![picture 2](images/527f7ff20863f9921d0332c0d758c189bb6d60a6eb83b1622d4fcba41198d17a.png)

## 2. Google Calendar API を有効化

![picture 3](images/9bf83f2b9442fd41b0ffd3d3c2bc16dd9e2f70a01f1dd37b92ba1b74b6555738.png)

## 3. Slack の Incoming WebHook を有効化

Slack の Incoming WebHook を有効化し、URL を取得します。

![picture 9](images/67738e4a00ffe3f18245e3022a6f438ddfcc32864023526dc1251d645706f736.png)

![picture 10](images/3c3fd2271ed9ba7fb16f009c65cac93c1e00d8f257cabee2b9cf6c1a1bd7a71a.png)

## 4. AWS で Lambda 用の IAM ロールを作成

`AWSLambdaBasicExecutionRole`ポリシーをアタッチします。

![picture 4](images/6cb50c2bd43812b4e2fe909c3eadf09d7e7a43b7e87d703643190cb959d8305a.png)

## 5. Lambda 関数を作成

- ランタイム： `Node.js 14.x`
- 実行ロール : 3 で作成した IAM ロール

![picture 5](images/07154b944127559761f3314a291e7b18395f0aba662e0d1059063eee469d6400.png)

## 6. 環境変数に API キーを登録

- `APIKEY` : `GCPで作成したAPIキーID`

![picture 6](images/05bf242c72969629c160b0e4ac2de7daffe7da28ab6a8372746abbce43fde5e0.png)

## 7. index.js を編集

- Slack の Incoming WebHook の URL

  ![picture 11](images/93e14f78d22fb8528ff0be53759cb55b69e0aa9edf86ef0600a22d96631c034d.png)

- 任意の休日

  ![picture 12](images/ef6b89bead46ad0627adf32804a93b719362594deaf7d68782b11ee8232fc3ff.png)

## 8. index.js をアップロード

index.js を Lambda にアップロードするか、コードをコピーして貼り付けます。

![picture 7](images/d6c51311be26ac51d7111d25e6745d6226021be7642f8f96ae2bf470bde94ec2.png)

## 9. node_modules を登録

ローカルで`nodejs`という名前のフォルダを作成し、フォルダ内でモジュールをインストールします。

`npm i request request-promise-native moment moment-timezone`

![picture 14](images/2c4a1789f7efeb057ea6f6611fe4857bcf3ac21ed1a54ee5eb929078839e8d97.png)

`nodejs`フォルダを zip 化し、Lambda レイヤーにアップロードします。

![picture 15](images/faca2f594917a176fdc25222470967b265f6cd61947cd827f038a7316b4ed238.png)

## 10. Lambda 関数のトリガーを作成

トリガーで EventBridge を選択し、スケジュール式に、`cron(0 3 ? * MON-FRI *)`を設定します。
日本時間で、月曜日～金曜日のお昼の 12 時という設定です。

![picture 8](images/34d13ed49009c61d006b077abcc2c74771c5772437b8f18130550481cb2bb851.png)

## 11. テスト

必要であれば Lambda でテストしてください。
![picture 13](images/c75af16fd6593d8dbde396dc94651e9de77539795b868d6ab06d65218d9673ee.png)
