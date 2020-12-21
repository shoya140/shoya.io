---
title: MongoDBのObjectID型をJSONに変換する[pymongo]
category: 'development'
keywords: ['MongoDB', 'python', 'JSON']
---

MongoDBから条件に合うオブジェクトを取り出して, エンコードされたJSONを返すapiを作成しようとしたところ, つまずいたのでメモ.

## 問題

```python
# DB接続確立
conn = pymongo.Connection("localhost", 27017)
db = conn["restaurant"]

# 取り出しとエンコード
item = db.restaurant.menu.find_one({"date":"13.12.2013"})
json.dumps(item)
```

実行結果:エラー

```python
TypeError: ObjectId('52aa539a86d00a0fac59fb10') is not JSON serializable
```

MongoDBから得られたオブジェクトをjsonモジュールのdumpus関数に直接渡すとエラーが生じる.
この問題は, PythonのJSONモジュールがMongoDBの特殊なObjectID型をJSONに変換する方法を知らないことによる.

## 解決策

JSONエンコードする前にディクショナリから_idキーを削除する.

```python
# 取り出しとエンコード
item = db.restaurant.menu.find_one({"date":"13.12.2013"})
del item["_id"]
json.dumps(item)
```

実行結果:正しくエンコードされる.

## 参考文献

[O'Reilly Japan - 概説Tornado](http://www.oreilly.co.jp/books/9784873115764/) MongoDBドキュメントとJSON
