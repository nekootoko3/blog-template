---
title: "pipelining でコマンド実行を速くしよう with Ruby"
createdAt: "2019-10-31"
updatedAt: "2019-10-31"
canPublish: true
tag: redis, ruby
---

## rails のアセットパイプラインの主な機能

### 主な機能

- 複数の js ファイルを1つのjsファイルに、複数の css ファイルを1つの css に連結する
  - これによってリソース取得のためのリクエスト数を削減できる
  - production 環境では、生成されたファイル名に SHA256 フィンガープリントを挿入することによって、ファイルに変更が生じた際にはブラウザでのキャッシュ破棄できる
- uglify することによってファイル容量を削減
- 生の css, js よりも扱いやすい言語を使える(ex. sass など)
