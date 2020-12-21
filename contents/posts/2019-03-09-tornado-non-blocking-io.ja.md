---
title: Tornadoでマルチスレッド・マルチプロセス・非同期I/O
category: 'development'
keywords: ["Python", "Tornado", "ノンブロッキング", "マルチスレッド", "マルチプロセス", "非同期"]
description: "機械学習を組み込んだWebアプリを開発するにあたり、重い処理を行っている間もリクエストを受けられるノンブロッキングなアプリケーションを構築する方法について調査した。"
---

機械学習を組み込んだWebアプリを開発するにあたり、重い処理を行っている間もリクエストを受けられるノンブロッキングなアプリケーションを構築する方法について調査した。scikit-learnなどの便利なライブラリを使いたいために言語はPythonを選択し、Webフレームワークは軽量で高速なTornadoを使うことにした。[Tornadoのドキュメント](https://www.tornadoweb.org/en/stable/guide/async.html)を読んだところ3 (+1) 通りの方法があると分かったので、それらを実装して性能を評価した。

``` python
# coding: utf-8

from tornado import web, ioloop, httpserver, httpclient
from concurrent.futures import ProcessPoolExecutor


def heavy_func(arg):
    count = 0
    for i in range(100000000):
        count += 1
    return arg


class IndexRequestHandler(web.RequestHandler):
    def get(self):
        self.write("hello, world")


# ブロッキング (処理が終わるまで他のリクエストを受け付けない)
class BlockingRequestHandler(web.RequestHandler):
    def get(self):
        res = heavy_func("done")
        self.write(res)


# 1) マルチスレッド (1つのCPUで並行処理)
class ThreadingRequestHandler(web.RequestHandler):
    async def get(self):
        loop = ioloop.IOLoop.current()
        res = await loop.run_in_executor(None, heavy_func, "done")
        self.write(res)


# 2) マルチプロセス (複数のCPUで並列処理)
class ProcessingRequestHandler(web.RequestHandler):
    async def get(self):
        loop = ioloop.IOLoop.current()
        res = await loop.run_in_executor(ProcessPoolExecutor(), heavy_func, "done")
        self.write(res)


# 3) 非同期I/O (シングルプロレス・シングルスレッドで非同期処理)
class AsyncRequestHandler(web.RequestHandler):
    async def get(self):
        client = httpclient.AsyncHTTPClient()
        res = await client.fetch("https://google.com")
        self.write(res.body)


def main():
    handlers = [
        (r"/?", IndexRequestHandler),
        (r"/blocking/?", BlockingRequestHandler),
        (r"/threading/?", ThreadingRequestHandler),
        (r"/processing/?", ProcessingRequestHandler),
        (r"/async/?", AsyncRequestHandler),
    ]
    app = web.Application(handlers)
    server = httpserver.HTTPServer(app)

    # シングルプロセスでTornadoを起動
    server.listen(8000)

    # マルチプロセスでTornadoを起動
    # server.bind(8000)
    # server.start(0)

    ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
```

多くのWebフレームワークは1つのリクエストに対して処理を行っている間は他のリクエストを処理することができない。これを**ブロッキング**であるという。Tornadoも特別な記述をしない限りブロッキングである。`IndexRequestHandler`のように処理に時間がかからないものについては問題にならないが、`BlockingRequestHandler`のように完了するまでに時間のかかる処理の場合、リクエストを受けるたびにアプリケーションが止まり、次第に応答が遅くなる。

## マルチスレッドとマルチプロセス

この問題を解決するひとつめの方法は、リクエストに応じて新しくスレッドを作り、その上で重たい処理を実行することである。この状態を**マルチスレッド**という。Pythonのマルチスレッドでは、処理を細切れにすることで1つのCPU・メモリ上で複数同時に進めるため[^1]、重い処理を行っている間も他のリクエストを受け付けて処理することができる。

もう一つの方法として、数コアのCPUを搭載しているサーバでアプリケーションを実行しているのであれば、他のCPUに処理を分散させることもできる。これを**マルチプロセス**という。

マルチスレッドが1つのCPUで理論的に同時処理する**並行処理**であるのに対して、マルチプロセスは複数のCPUで物理的に同時処理する**並列処理**である。処理時間のボトルネックが重い計算にある場合 (これを**CPU bound**という) は、マルチプロセスの方が効率的である。しかし、CPUのコア数以上のプロセスを同時に走らせることはパフォーマンスを低下させるので注意が必要である。また、プロセスの起動自体にも時間がかかるので、プロセスを頻繁に作成することも遅くなる要因となる。重い処理がネットワークやディスクへのアクセスによるものである場合 (これを**I/O bound**という) は、マルチスレッドを選択するのが良い。

## 非同期I/O

一方で、マルチスレッドやマルチプロセスといった方法では、リクエストごとにメモリを消費するため、同時に処理できるリクエストの数がサーバのリソースの上限に依存する (**C10K問題**)。Tornadoにはその問題を回避できる**非同期I/O**という機能が備わっている。非同期I/Oでは、時間のかかる処理はそこで「待ち」の状態にして他の処理に取りかかり、完了次第続きから再開することで、1つのCPU上で複数処理を進める。例えば上記のコードのようにPython 3.4から導入されたasync/awaitを使用する実装がある。古いバージョンのPythonでは、代わりにTornadoの`@gen.coroutine`を使う。[async/await (native coroutine) の方が早いらしい](https://www.tornadoweb.org/en/stable/guide/coroutines.html)。

非同期I/Oはスレッド・プロセス自体はひとつなので、[CPU boundな処理が走ると他の処理も止まってしまう](https://www.tornadoweb.org/en/stable/faq.html)。マルチスレッドのスイッチングにかかるオーバーヘッドを考えると、I/O boundでリクエストが多いときに非同期I/Oを選択すると良さそうである。

## 他のレイヤでの解決

`server.listen()`を`server.bind()`と`server.start(0)`に置き換えるとマルチプロセスでTornadoが起動する (引数はプロセス数; 0で上限まで)。あるいは、複数のポートやサーバでTornadoを立ち上げてNginxなどでリクエストを割り振る方法 (**ロードバランシング**) もある。

## 性能評価

4コアのMacBook Pro上でのCPU boundな処理について性能評価を行った。

```bash
In [1]: import multiprocessing

In [2]: multiprocessing.cpu_count()
Out[2]: 4
```

`siege`を使って、同時に受けた10リクエストの処理にかかる時間を計測する。

```bash
$ siege http://localhost:8000/blocking/ -c 10 -r 1
HTTP/1.1 200   4.54 secs:  4 bytes ==> GET  /blocking/
HTTP/1.1 200   9.13 secs:  4 bytes ==> GET  /blocking/
HTTP/1.1 200  13.70 secs:  4 bytes ==> GET  /blocking/
HTTP/1.1 200  18.24 secs:  4 bytes ==> GET  /blocking/
HTTP/1.1 200  22.79 secs:  4 bytes ==> GET  /blocking/
HTTP/1.1 200  27.31 secs:  4 bytes ==> GET  /blocking/
HTTP/1.1 200  31.85 secs:  4 bytes ==> GET  /blocking/
HTTP/1.1 200  36.37 secs:  4 bytes ==> GET  /blocking/
HTTP/1.1 200  40.90 secs:  4 bytes ==> GET  /blocking/
HTTP/1.1 200  45.40 secs:  4 bytes ==> GET  /blocking/

Response time:		       25.02 secs
```

まずブロッキングなWebアプリケーションの結果。最初のリクエストに対する待ち時間はとても短い。しかし、ひとつの処理を行っている間は他のリクエストに対応できないので、待ち時間が線形に増加しているのが分かる。

```bash
$ siege http://localhost:8000/threading/ -c 10 -r 1
HTTP/1.1 200  43.99 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  44.06 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  44.62 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  44.72 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  44.96 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  45.23 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  45.31 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  45.46 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  45.48 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  45.48 secs:  4 bytes ==> GET  /threading/

Response time:		       44.93 secs
```

次にマルチスレッドの場合。10のリクエストを同時に処理しているので全体的に遅く、45秒後に10リクエスト分まとめて返ってくる。この結果だけを見ると無駄に思えるかもしれないが、アプリケーション自体はブロッキングではないので、`IndexRequestHandler`など時間のかからないリクエストに対しては処理中でもすぐに応答することができる。

```bash
$ siege http://localhost:8000/processing/ -c 10 -r 1
HTTP/1.1 200  22.53 secs:  4 bytes ==> GET  /processing/
HTTP/1.1 200  22.59 secs:  4 bytes ==> GET  /processing/
HTTP/1.1 200  22.63 secs:  4 bytes ==> GET  /processing/
HTTP/1.1 200  22.64 secs:  4 bytes ==> GET  /processing/
HTTP/1.1 200  22.65 secs:  4 bytes ==> GET  /processing/
HTTP/1.1 200  22.66 secs:  4 bytes ==> GET  /processing/
HTTP/1.1 200  22.67 secs:  4 bytes ==> GET  /processing/
HTTP/1.1 200  22.68 secs:  4 bytes ==> GET  /processing/
HTTP/1.1 200  22.68 secs:  4 bytes ==> GET  /processing/
HTTP/1.1 200  22.90 secs:  4 bytes ==> GET  /processing/

Response time:		       22.66 secs
```

こちらはマルチプロセスの結果。確かにCPU boundなケースではマルチスレッドよりも効果的にリクエストを処理しているのが分かる。この結果だけから読み取ることはできないが、4リクエストまでは5秒ほどで応答できるがそこからはリクエスト数が増えるごとに時間が増えていったのではないかと予想できる。

```bash
$ siege http://localhost:8000/threading/ -c 10 -r 1
HTTP/1.1 200  17.83 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  17.98 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  18.02 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  18.09 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  18.11 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  18.11 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  26.62 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  26.72 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  26.76 secs:  4 bytes ==> GET  /threading/
HTTP/1.1 200  26.76 secs:  4 bytes ==> GET  /threading/

Response time:		       21.50 secs
```

最後にマルチプロセスとマルチスレッドを併用した結果。Tornadoを4つ立てて`ThreadingRequestHandler`にアクセスしてみた。各プロセスで走っているスレッドの数が異なり、応答時間が異なる。平均するとマルチプロセスと大差ないように思える。

## まとめ

Tornadoを使ってノンブロッキングなWebサーバを構築する方法を調査し、マルチスレッド・マルチプロセス・非同期I/Oという3つの方法があることが分かった。CPU boundな処理にはマルチプロセス、I/O boundには非同期I/O、どちらともいえる処理にはマルチスレッドを選択するのが良さそうである。検証の結果からも、 (今回の目的である) CPU boundな処理についてはマルチプロセスの方が高いパフォーマンスを発揮することが確認できた。今後はロードバランシングをはじめとする他のレイヤでの解決策についても試してみたい。

内容に間違いがありましたら[@shoya140](https://twitter.com/shoya140)までご指摘いただけると嬉しいです。

[^1]: 一度にPythonを実行するスレッドは一つだけであることを保証する仕組み (Global Interpreter Lock, GIL) のため。複数のスレッドが別のCPUで並列に実行されることを許可する言語もある。