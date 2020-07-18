---
title: "pipelining でコマンド実行を速くしよう with Ruby"
createdAt: "2019-10-31"
updatedAt: "2019-10-31"
canPublish: true
tag: redis, ruby
---

ruby のパッケージ管理システムの gem についてまとめる。

## WHY

- gem の公開方法を知りたい
- gem が CLI として利用できる原理を知りたい
- gem の構成
- gem の convention

## WHAT

https://guides.rubygems.org/ を読み進めていく

### gem が CLI として利用できる原理

- `gem install <<gem>>` を実行すると、`bin` ディレクトリ内の実行可能ファイルがユーザーのパスに追加される

### gem の動作原理

- `require "<<gem>>"` を実行すると gem の `lib` ディレクトリを `$LOAD_PATH` 中に置く。That' it
  - https://guides.rubygems.org/rubygems-basics/#requiring-code
  - $LOAD_PATH とは

### gem の構成

- gem は name, version, platform を持つ
  - platform が ruby であれば、どの platform でも動くが、dx86_64-darwin-18 などの場合もありうる
- gem の主なコンポーネント
  - `lib`: gem のコードが入っているディレクトリ
  - `bin`: ユーザーのパスにロードされる実行可能ファイルを入れるディレクトリ

### gem の convention

- 依存関係は `Gemfile` には書かず `gemspec` に書く
- 実行可能ファイルと lib 直下のファイルの名前は合わせる
- Semantic Versioning を行う
- lib

## 参照

- https://rubygems.org/
