---
title: SlackのIncoming WebhooksをHubotで拾う
category: 'development'
keywords: ['Slack', 'Webhook', 'hubot']
---

Hubotがチャット上の投稿を拾うにはhear(全てに反応)とrespond(呼ばれたら反応)という2つの方法があるのだけれど、無限ループを防ぐためか、どちらもbotの投稿を拾うことができない。botの投稿にも反応させたいときはcatchAllを使う。catchAllで投稿を一旦受け取り、正規表現で発言が必要か判断すれば良い。

```coffeescript
module.exports = (robot) ->
  robot.catchAll (msg) ->
    r = new RegExp "(.*)(どーなつ|ドーナツ)(.*)", "i"
    matches = msg.message.text.match(r)
    if matches == null or matches.length == 0
      return
    msg.send "どーんといこう！"
```

この方法はIncoming Webhooksをトリガーに発言させたい時に役に立つ。例えばうちのbotには下記の仕組みで夜になったら日報を作成してもらっている。

1. [日が沈む](https://ifttt.com/channels/weather/triggers/131-sunset)とIFTTTが「今日も一日お疲れさまです」と投稿する
2. 「お疲れさまです」というキーワードに反応して、botが[todoist](https://developer.todoist.com/)から今日一日に完了したタスクを取得して投稿する

他にもテストの結果に応じて一喜一憂させてみるなど、合いの手をひとつ入れるだけで会話が盛り上がって楽しいと思う。