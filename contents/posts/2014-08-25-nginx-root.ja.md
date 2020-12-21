---
title: Nginxの静的ファイル配信でハマった
category: 'development'
keywords: ['Nginx', 'location', 'root', 'static']
---

静的ファイルに限った話ではないけれど、Nginxのlocationに応じたrootの設定でつまずいたのでメモ。[概説Tornado](http://www.oreilly.co.jp/books/9784873115764/)の中に「静的リソースはアプリケーションにリクエストをプロキシするのではなくNginxに捌かせるほうがアプリケーションの不要な負担を取り除けて有用」という説明があったので、staticディレクトリへのルーティング設定を書いた。

```nginx
location /static/ {
    root /path/to/app/static;
}
```

上記のように書きたいところだがこれは間違いで

```nginx
location /static/ {
    root /path/to/app;
}
```

正しくはこちら。

rootはstaticディレクトリのrootを指すのではなく、アプリケーションのroot。/static/はURLとして生きているので/static/を含むパスでファイルへ届くように書く必要がある。

(備考)アプリケーション全体のnginx設定ファイルはこんな感じ。各アプリケーションごとに設定ファイルを分けてconf.d/以下に保存しておき、nginx.confでそれらをインポートしている。

```nginx
upstream paletta{
    server 127.0.0.1:8011;
    server 127.0.0.1:8012;
    server 127.0.0.1:8013;
    server 127.0.0.1:8014;
}

server {
    listen 80;
    server_name paletta.mrk1869.com;

    access_log  /home/web/log/nginx/paletta.mrk1869.com/access.log ltsv;
    location /static/ {
        root /home/web/paletta/app;
    }
    location / {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
        proxy_pass http://paletta;
    }
}
```
