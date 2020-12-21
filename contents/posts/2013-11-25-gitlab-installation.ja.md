---
title: GitLab 6.0をインストールする
category: 'development'
keywords: ['GitLab', 'Git', 'インストール', 'セットアップ']
---

[GitLab](http://gitlab.org/)とはGitHubクローンのひとつで、ソースコードの管理やコードレビュー、複数人でのプロジェクト開発を円滑にするツールです。[GitHub](https://github.com/)との違いは、無料でプライベート(非公開の)リポジトリをいくつでも作ることができる点と、社外・学外のサーバーに機密情報を含むデータを預ける必要がない点にあります。(GitHub Enterpriseとの比較は割愛)

今回は大学の計算機にGit/GitLab環境を構築したので、その手順メモを記しました。[インストールガイド](https://github.com/gitlabhq/gitlabhq/blob/6-0-stable/doc/install/installation.md)を参考に、redisの起動など足りないところを補完してあります。<br/>GitLabのインストール方法はバージョンによって少しずつ異なります。6.1, 6.2はsidekiqの立ち上げに問題があるので、2013年11月現在は6.0を導入するのが最善かと思われます。

## <span class="lsf">setup</span> 環境
* Debian 6.0.8
* GitLab 6.0
* git 1.8.4
* python 2.6.6
* ruby 2.0.0
* redis 2.6.10
* mysql 14.14
* nginx 0.7.67

## 1. 導入準備 (必要に応じて)
GitLabを導入する前に、sudoコマンド、エディタ(Vim)、Git、Python、Ruby、MySQLをインストールします。既にインストールしている場合は<strong>手順2</strong>まで読み飛ばしてください。

```bash
# run as root!
apt-get update -y
apt-get upgrade -y
apt-get install sudo -y
```

## 1.1. Vimインストール

Vimをインストールして、標準のエディタとして設定。

```bash
# Install Vim
sudo apt-get install -y vim
sudo update-alternatives --set editor /usr/bin/vim.basic
```

## 1.2. Gitインストール

```bash
# Install git
sudo apt-get install -y git-core

# Make sure Git is version 1.7.10 or higher, for example 1.7.12 or 1.8.4
git --version
```

Gitのバージョンが1.7.10より小さい場合は以下の手順でアップデート

```bash
# Remove packaged Git
sudo apt-get remove git-core

# Install dependencies
sudo apt-get install -y libcurl4-openssl-dev libexpat1-dev gettext libz-dev libssl-dev build-essential

# Download and compile from source
cd /tmp
curl --progress https://git-core.googlecode.com/files/git-1.8.4.1.tar.gz | tar xz
cd git-1.8.4.1/
make prefix=/usr/local all

# Install into /usr/local/bin
sudo make prefix=/usr/local install
```

※Gitを/usr/local/bin/gitにインストールしたので、<strong>手順8</strong>でconfig/gitlab.ymlを編集するときにbin_pathを/usr/local/bin/gitに書き換えること。

## 1.3. Pythonインストール

"python2"でpython2.xが起動するように設定する。

```bash
# Install python
sudo apt-get install -y python

# Make sure that Python is 2.5+ (3.x is not supported at the moment)
python --version

# If it's Python 3 you might need to install Python 2 separately
sudo apt-get install -y python2.7

# Make sure you can access Python via python2
python2 --version

# If you get a "command not found" error create a link to the python binary
sudo ln -s /usr/bin/python /usr/bin/python2

# For reStructuredText markup language support install required package:
sudo apt-get install -y python-docutils
```

## 1.4. Ruby インストール

システムデフォルトのRubyは1.9.3より古い可能性大なのでアップデート。

```bash
# Remove the old Ruby 1.8 if present
sudo apt-get remove ruby1.8

# Download and compile from source
mkdir /tmp/ruby && cd /tmp/ruby
curl --progress ftp://ftp.ruby-lang.org/pub/ruby/2.0/ruby-2.0.0-p353.tar.gz | tar xz
cd ruby-2.0.0-p353
./configure --disable-install-rdoc

# Install ruby
make
sudo make install
```

Bandlerインストール

```bash
sudo gem install bundler --no-ri --no-rdoc
```

## 1.5 MySQLインストール

```bash
# Install the database packages
sudo apt-get install -y mysql-server mysql-client libmysqlclient-dev

# Secure your installation.
sudo mysql_secure_installation
```

GitLab用にユーザとデータベースを作成

```bash
# Login to MySQL
mysql -u root -p

# do not type the 'mysql>', this is part of the prompt
# change $password in the command below to a real password you pick
mysql> CREATE USER 'gitlab'@'localhost' IDENTIFIED BY '$password';

# Create the GitLab production database
mysql> CREATE DATABASE IF NOT EXISTS `gitlabhq_production` DEFAULT CHARACTER SET `utf8` COLLATE `utf8_unicode_ci`;

# Grant the GitLab user necessary permissions on the table.
mysql> GRANT SELECT, LOCK TABLES, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON `gitlabhq_production`.* TO 'gitlab'@'localhost';

# Quit the database session
mysql> \q
```

## 2. Gitユーザの作成

```bash
sudo adduser --disabled-login --gecos 'GitLab' git
```

以降の手順はGitユーザで行います。

## 3. 必要パッケージのインストール

```bash
sudo apt-get install -y build-essential zlib1g-dev libyaml-dev libssl-dev libgdbm-dev libreadline-dev libncurses5-dev libffi-dev curl openssh-server redis-server checkinstall libxml2-dev libxslt-dev libcurl4-openssl-dev libicu-dev logrotate
```

## 4. GitLab shellインストール

```bash
cd /home/git

# Clone gitlab shell
sudo -u git -H git clone https://github.com/gitlabhq/gitlab-shell.git

# Go to gitlab-shell dir
cd gitlab-shell

# switch to right version
sudo -u git -H git checkout v1.7.0
```

config.yml.exampleをもとにconfig.ymlを作成して、http://localhost/のところをGitLabをセットアップするURL(例: http://YOUR_DOMAIN.COM)に書き換える。

```bash
# Copy config.yml from config.yml.example
sudo -u git -H cp config.yml.example config.yml

# Edit config and replace gitlab_url
# with something like 'http://YOUR_DOMAIN.COM/'
sudo -u git -H editor config.yml
```

hostsのlocalhostにYOUR_DMAIN.COMを追記する。

```bash
# Edit hosts
sudo vim /etc/hosts

# Add a new hosts setting like this
127.0.0.1    YOUR_DOMAIN.COM
```

インストール

```bash
sudo -u git -H ./bin/install
```

## 5. GitLabインストール

```bash
cd /home/git

# Clone GitLab repository
sudo -u git -H git clone https://github.com/gitlabhq/gitlabhq.git gitlab

# Go to gitlab dir
cd /home/git/gitlab

# Checkout to stable release
sudo -u git -H git checkout 6-0-stable

# Make sure GitLab can write to the log/ and tmp/ directories
sudo chown -R git log/
sudo chown -R git tmp/
sudo chmod -R u+rwX log/
sudo chmod -R u+rwX tmp/

# Create directory for satellites
sudo -u git -H mkdir /home/git/gitlab-satellites

# Create directories for sockets/pids and make sure GitLab can write to them
sudo -u git -H mkdir tmp/pids/
sudo -u git -H mkdir tmp/sockets/
sudo chmod -R u+rwX  tmp/pids/
sudo chmod -R u+rwX  tmp/sockets/

# Create public/uploads directory otherwise backup will fail
sudo -u git -H mkdir public/uploads
sudo chmod -R u+rwX  public/uploads

# Configure Git global settings for git user, useful when editing via web
# Edit user.email according to what is set in gitlab.yml
sudo -u git -H git config --global user.name "GitLab"
sudo -u git -H git config --global user.email "gitlab@localhost"
sudo -u git -H git config --global core.autocrlf input
```

config/gitlab.yml.exampleをもとにconfig/gitlab.ymlを作成して、localhostのところをGitLabをセットアップするURLに編集する。gitのインストール先をusr/local/bin/gitに変更した場合はgit bin_pathも書き換える。

```bash
# Copy the example GitLab config
sudo -u git -H cp config/gitlab.yml.example config/gitlab.yml

# Make sure to change "localhost" to the fully-qualified domain name of your
# host serving GitLab where necessary
sudo -u git -H editor config/gitlab.yml
```

config/unicorn.rb.example config/unicorn.rbを作成して編集する。
```bash
# Copy the example Unicorn config
sudo -u git -H cp config/unicorn.rb.example config/unicorn.rb

# Enable cluster mode if you expect to have a high load instance
# Ex. change amount of workers to 3 for 2GB RAM server
sudo -u git -H editor config/unicorn.rb
```

## 6. MySQLとの接続確認
```bash
# Mysql
sudo -u git cp config/database.yml.mysql config/database.yml

# Make sure to update username/password in config/database.yml.
# You only need to adapt the production settings (first part).
# If you followed the database guide then please do as follows:
# Change 'secure password' with the value you have given to $password
# You can keep the double quotes around the password
sudo -u git -H editor config/database.yml

# Make config/database.yml readable to git only
sudo -u git -H chmod o-rwx config/database.yml
```

## 7. Gemインストール
```bash
cd /home/git/gitlab

sudo -u git -H bundle install --deployment --without development test postgres aws
```

## 8. データベース初期化

```bash
# Type 'yes' to create the database.
sudo -u git -H bundle exec rake gitlab:setup RAILS_ENV=production
```

## 9. 起動ファイル導入

```bash
sudo rm /etc/init.d/gitlab
sudo curl --output /etc/init.d/gitlab https://raw.github.com/gitlabhq/gitlabhq/6-0-stable/lib/support/init.d/gitlab
sudo chmod +x /etc/init.d/gitlab
```

サーバー起動時にGitLabが自動起動するよう設定

```bash
sudo update-rc.d gitlab defaults 21
```

## 10. Redis起動

```bash
sudo /etc/init.d/redis-server start
```

## 11. GitLabの起動

```bash
/etc/init.d/gitlab start
```

停止と再起動は下記の通り。

```bash
/etc/init.d/gitlab stop
/etc/init.d/gitlab restart
```

## 12. Nginx(リバースプロキシ)の設定
```bash
# Install nginx
sudo apt-get install -y nginx
```

gitlab用設定ファイルの導入

```bash
sudo cp lib/support/nginx/gitlab /etc/nginx/sites-available/gitlab
sudo ln -s /etc/nginx/sites-available/gitlab /etc/nginx/sites-enabled/gitlab

# Change YOUR_SERVER_FQDN to the fully-qualified
# domain name of your host serving GitLab.
sudo editor /etc/nginx/sites-available/gitlab
```

Nginx再起動

```bash
sudo /etc/init.d/nginx restart
```

![ ](/img/blog_gitlab_ss.png)

以上の設定でhttp://YOUR_DOMAIN.COM/でGitLabへアクセスできます。
管理者アカウントの初期設定は下記のとおりです。
<pre>
User: admin@local.host
Pass: 5iveL!fe
</pre>

## トラブルシューティング

## <span class="lsf">check</span> httpsプロトコルでgit cloneできない

```bash
git config –global http.sslVerify false
```
を実行して、証明書チェックを外す。<br/>
参考：[GIT:リポジトリにHTTPSでアクセスしてみる - 自転車で通勤しましょ♪ブログ](http://319ring.net/blog/archives/1164)

## <span class="lsf">check</span> Can't save project. Please try again later

redis-serverをアップデートする
```bash
echo "deb http://backports.debian.org/debian-backports squeeze-backports main" >> /etc/apt/sources.list
apt-get update
apt-get -t squeeze-backports install redis-server
```
参考：["Can't save project. Please try again later" - GitHub issues](https://github.com/gitlabhq/gitlabhq/issues/3328)

## <span class="lsf">check</span> 502 Bad Gateway ページが見つからない

タイムアウト値を30から180くらいに変更する
```bash
sudo -u git -H editor config/unicorn.rb
```
参考：[502 Bad Gateway from Nginx for large GitLab fork - stackoverflow](http://stackoverflow.com/questions/18501406/502-bad-gateway-from-nginx-for-large-gitlab-fork)

## <span class="lsf">check</span> gitlab-shell self-check failed

virtual hostsの設定を取りこぼしてないか確認する

```bash
# Edit hosts
sudo vim /etc/hosts

# Add a new hosts setting like this
127.0.0.1    YOUR_DOMAIN.COM
```

## <span class="lsf">check</span> その他の問題解決

おかしいなと思ったら、以下のコマンドを実行。<br/>
エラーメッセージから原因を見つけて修復する。

<strong>・インストール情報の表示</strong>
```bash
sudo -u git -H bundle exec rake gitlab:env:info RAILS_ENV=production
```

成功例
<pre>
System information
System:         Debian 6.0.8
Current User:   git
Using RVM:      yes
RVM Version:    1.24.4
Ruby Version:   2.0.0p353
Gem Version:    2.0.14
Bundler Version:1.3.5
Rake Version:   10.1.0

GitLab information
Version:        6.0.2
Revision:       10b0b8f
Directory:      /home/git/gitlab
DB Adapter:     mysql2
URL:            http://YOUR_DOMAIN.COM
HTTP Clone URL: http://YOUR_DOMAIN.COM/some-project.git
SSH Clone URL:  git@YOUR_DOMAIN.COM:some-project.git
Using LDAP:     no
Using Omniauth: no

GitLab Shell
Version:        1.7.0
Repositories:   /home/git/repositories/
Hooks:          /home/git/gitlab-shell/hooks/
Git:            /usr/bin/git
</pre>

<strong>・起動確認</strong>

```bash
sudo -u git -H bundle exec rake gitlab:check RAILS_ENV=production
```

成功例
```
Checking Environment ...

Git configured for git user? ... yes
Has python2? ... yes
python2 is supported version? ... yes

Checking Environment ... Finished

Checking GitLab Shell ...

GitLab Shell version >= 1.7.9 ? ... OK (1.7.9)
Repo base directory exists? ... yes
Repo base directory is a symlink? ... no
Repo base owned by git:git? ... yes
Repo base access is drwxrws---? ... yes
update hook up-to-date? ... yes
update hooks in repos are links: ... can't check, you have no projects
Running /home/git/gitlab-shell/bin/check
Check GitLab API access: OK
Check directories and files:
        /home/git/repositories: OK
        /home/git/.ssh/authorized_keys: OK
        /usr/bin/redis-cli: OK
gitlab-shell self-check successful

Checking GitLab Shell ... Finished

Checking Sidekiq ...

Running? ... yes
Number of Sidekiq processes ... 1

Checking Sidekiq ... Finished

Checking GitLab ...

Database config exists? ... yes
Database is SQLite ... no
All migrations up? ... yes
GitLab config exists? ... yes
GitLab config outdated? ... no
Log directory writable? ... yes
Tmp directory writable? ... yes
Init script exists? ... yes
Init script up-to-date? ... yes
projects have namespace: ... can't check, you have no projects
Projects have satellites? ... can't check, you have no projects
Redis version >= 2.0.0? ... yes
Your git bin path is "/usr/bin/git"
Git version >= 1.7.10 ? ... yes (1.8.3)

Checking GitLab ... Finished
```

6.2で転けて、6.1で転けて、ここまで設定するのに3日かかった...