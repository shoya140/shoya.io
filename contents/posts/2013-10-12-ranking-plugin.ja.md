---
title: Jekyllの記事を人気順にソートする
category: 'development'
keywords: ['jekyll', 'はてな', 'facebook', 'twitter']
---

各記事のはてなブックマーク数・Facebookいいね数・tweet数を取得してスコアの高い順にソートするプラグインを書いた。

[ranking.rb](https://github.com/Mrk1869/source-mrk1869.github.com/blob/master/_plugins/ranking.rb)

それぞれ数値を取得するためのapiと取り出し方は以下のとおり。

```ruby
require 'net/http'
require 'json'

url = URL_OF_YOUR_ENTRY

# hatena 文字列で返ってくる. 0は"".
uri = "http://api.b.st-hatena.com/entry.count?url=#{url}"
body = Net::HTTP.get_response(URI.parse(uri)).body
score = body != "" ? body.to_i : 0

# facebook jsonで返ってくる. 0は0.
uri = "http://graph.facebook.com/#{url}"
body = Net::HTTP.get_response(URI.parse(uri)).body
json = JSON.parse(body)
score = json['shares'] ? json['shares'] : 0

# tweet jsonで返ってくる. 0は0.
uri = "http://urls.api.twitter.com/1/urls/count.json?url=#{url}"
body = Net::HTTP.get_response(URI.parse(uri)).body
json = JSON.parse(body)
score = json['count'] ? json['count'] : 0
```

buildの度に取得すると記事を書く際に不便なので、jekyll server に --drafts オプションをつけているときは評価をスキップする。--draftsオプションが付いているかどうかは

```ruby
site.config['show_drafts']
```

を確認すれば良い。
