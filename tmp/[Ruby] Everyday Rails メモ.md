### 2. Rspec のセットアップ

- `binstub` を利用することで、[spring](https://github.com/rails/spring) の恩恵を受けてテストを高速化できる
- TODO: https://techracho.bpsinc.jp/hachi8833/2016_08_24/25037

### 3. モデルスペック

- 期待する結果は能動系で明示的に記述すること
  - e.g. it "returns true"
- 正常系だけでなく異常系もテストすること
- before や after を使ってスペックを整理しつつも DRY にし過ぎない
  - テストの事前条件を確認するためのスクロールが頻繁に発生するようなら重複増やしてもいいかも
- マッチャについては[ここ](https://github.com/rspec/rspec-expectations)を見ると良さそう

### 4. 意味のあるテストデータの作成

[factory_bot](https://github.com/thoughtbot/factory_bot)について

- DB へのデータの読み込みの際に[Fixture](https://railsguides.jp/testing.html#%E3%83%86%E3%82%B9%E3%83%88%E7%94%A8%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9)では直接 insert されるが factory_bot では ActiveRecord を利用するのでバリデーションが有効になりテストデータの妥当性が担保される。
- モデルのインスタンス化は必要がなければ、`create` ではなく `build` を利用する
  - DB にデータを保存しないのでちょっと早そう
  - 妥当性の検証には build した インスタンスに `be_valid` を使う
- モデルに真偽値を返す属性やメソッドが定義されていれば、`be_{attr or method}` がマッチャとして使える
- 1 つのモデルに対して、複数の factory・trait・callback を定義して必要なデータを準備する
- attributes_for(:user) で factory に定義したパラメータをもつオブジェクトを取得できる
- @joker1007 さんの[FactoryGirl の transient と trait を活用する](https://qiita.com/joker1007/items/da63b8630351c1f3fe1d)も参考にするとよい
- `class` オプションを利用して明示的にクラスを指定することができる
  - これで嬉しいのは、あるクラスを継承したクラスに特定のメソッドを生やしたケースとか

### 5. コントローラースペック

- コントローラースペックは実際の UI とは一致しないといったことも発生しうるので `deprecated`
- 対象となる機能の単体テストとして最も有効活用できるときのみ使うべき
  - 著者はアクセス制御が正しく機能しているかだけに使っているらしい
    - e.g. Devise gem の authenticate_user! など

### 6. フィーチャースペックで UI をテストする

- 統合テストを行う
  - アプリケーションの利用者が実際に利用するフォームやリンクなどの UI を擬似的に利用してテストをできる
- Rails 5.1+ では feature spec ではなく、`system spec` が推奨されている
  - @junchito さんによると [こういう違い](https://qiita.com/jnchito/items/c7e6e7abf83598a6516d#feature-spec%E3%81%A8%E4%BD%95%E3%81%8C%E9%81%95%E3%81%86%E3%81%AE%E3%81%A9%E3%81%A3%E3%81%A1%E3%82%92%E4%BD%BF%E3%81%88%E3%81%B0%E3%81%84%E3%81%84%E3%81%AE)があるとのこと
  - `bin/rails g rspec:system users` を叩くと、 `spec/system/users_spec.rb` が生成される
- [capybara](https://github.com/teamcapybara/capybara)を利用する
  - rpsec や ヘッドレスブラウザと組み合わせることによって下記のようなことが行える
    - フォームの入力
    - ページに表示されている内容のチェック( js の実行を待つこともできる)
      - expect で異なって場合、その画面のスクリーンショットも見ることができる

### 7. リクエストスペックで API をテストする

- コントローラースペックではなくリクエストスペックをできるだけ利用しよう。
- リクエストスペックはコントローラー単体のテストではなく、外部に公開された API の統合テストの役割を担っている。

### 8. スペックを DRY に保つ

- ログインフローなど複数箇所で利用するワークフローはサポートモジュールに切り出す
- 複数の箇所で利用しているテストのセットアップがあれば、`shared_context` に切り出す
  - mock などでよく使いそう
- `aggregate_failures` を使うことで、 ブロック内で失敗しても全ての expectation を実行してくれる
  - rspec_rails.rb の設定で、全てのテストに適用することもできる
    - https://qiita.com/jnchito/items/3a590480ee291a70027c#%E5%BF%9C%E7%94%A8aggregate_failures-%E3%81%99%E3%81%B9%E3%81%A6%E3%81%AE%E3%83%86%E3%82%B9%E3%83%88%E3%81%AB%E9%81%A9%E7%94%A8%E3%81%99%E3%82%8B
- test を [Single Level of Abstraction Principal](https://www.ibm.com/developerworks/jp/java/library/j-eaed4.html) に則って行う
  - https://thoughtbot.com/blog/acceptance-tests-at-a-single-level-of-abstraction

### 9. 速くテストを書き、速いテストを書く

