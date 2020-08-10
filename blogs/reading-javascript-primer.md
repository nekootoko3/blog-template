---
title: "JavaScript Primer を読んだ"
slug: reading-javascript-primer
createdAt: "2020-07-11"
updatedAt: "2020-07-11"
canPublish: true
tags: javascript
---

#jsprimer

最近 js をちょくちょく書くようになったけど、js についてちゃんと勉強したことなかった。
そこで https://jsprimer.net/ を読んだ。とても分かりやすかった。
非同期処理は分かった気がしているだけなので、自分で書いてみて [Promise 本](https://azu.github.io/promises-book/) も読みたい。
第一部では Javascript の言語自体についての説明。
第二部は実際に使ってみよう、という趣旨。
第二部の Todo アプリでの、リファクタ、Model・View の流れの方向を決めるのは勉強になった。
以下個人的なポイント列挙。

- `var` は使っちゃダメ。
  - for 文でのスコープを作らなかったり、巻き上げをするのでびっくりする。
- データ型は `プリミティブ型` とオブジェクトがある。
  - プリミティブ型は本当にデータだけを持つんじゃなくて、いくつかメソッドを呼び出すことができる。
    - その時には暗黙的に型変換する。
- 比較する時には `==` じゃなくて `===` を使おう。
  - `==` は暗黙的な型変換後の値比較。
  - `===` は型の同一性と値を比較する。
- [分割代入](https://jsprimer.net/basic/operator/#destructuring-assignment)便利。
- 真偽値の判定をする時、暗黙的な型変換はされないようにしよう。
- 関数
  - ファーストクラスなので、関数の引数に渡せる。
  - 同一名称の関数は引数の数が違っても上書きされる。
  - 関数定義と呼び出し時の引数は違っても良くて、少ない分は undefined になる（よくなさそう）
  - js の関数はクロージャー。
- switch 文は break しないと該当 case 全て実行されちゃう。
- Object の merge は `Object.assign({}, objA, objB)` が典型的な方法
- javascript の clone は shallow copy。
- 全てのオブジェクトの祖先は `Object`。
- プロパティの存在確認で祖先まで見に行ってほしくない場合には、`Object#hasOwnProperty`
- 配列
  - Array かどうかの判定は `Array.isArray` を使おう。
    - `typeof arrayInstance` は "object" を返す。
  - for 文は基本使わず `forEach`・`map`・`filter`・`reduce` で処理しよう。
  - 分割代入できる。
- 文字列
  - JavaScript は文字コードは `Unicode`、エンコード方式は `UTF-16` を採用している。
  - Unicode で定義されている文字列の中には 16 ビットに収まらないものがあるので、絵文字を扱ったり文字数を数える場合には注意。
    - 文字列を配列に変化して処理するなどの工夫が必要なケースも
- this
  - this の参照先は条件によって変わる
    - `実行コンテキスト`・`コンストラクタ`・`関数とメソッド`・`ArrowFunction`
    - いくつか使い方はあるけど、基本的なユースケースは関数内で使うこと
  - ArrowFunction 以外の関数では実行時に this が決定される。
    - 関数内の this はベースオブジェクトになる。
      - ベースオブジェクトとは、`メソッドを呼ぶ際に、そのメソッドのドット演算子またはブラケット演算子のひとつ左にあるオブジェクト`（書籍から引用）
        - 関数単体で呼び出した時ベースオブジェクトは存在しないので this は undefined を返す
    - これはいくつかのケースで問題になる
      - this を含むメソッドが変数に代入された場合 => call, apply, bind によって、this を指定してメソッドを実行する。
      - コールバック関数 => this を一時変数に代入する or `Arrow Function`
  - Arrow Function における this は実行時に決定される
    - `Arrow Function自身の外側のスコープに定義されたもっとも近い関数のthisの値`（書籍から引用）
  - コンストラクタにおける this はインスタンスオブジェクトになるので、プロパティ定義などできる
  - this はメソッド以外では使うべきではない
- クラス
  - ES2015 から新しくできた。それ以前は同等のものが関数で表現されていた。
  - コンストラクタ内では return しない。インスタンス以外が返ってしまう
  - クラス内に定義されたメソッドは`プロトタイプメソッド`と呼ばれ、インスタンス間で共有される。
  - コンストラクタ内で定義されたメソッドはインスタンス固有のメソッドとなり、プロトタイプメソッドより優先して呼び出される（ruby だと 特異メソッドとインスタンスメソッド）
    - 同名のプロトタイプメソッドとインスタンスオブジェクトのメソッドがあっても上書きされない
  - アクセッサプロパティがある
  - `static` キーワードをプロパティの前につけることで、静的メソッド（クラスメソッド）になる
    - 静的メソッド内の this はクラス自身を参照するので、factory やクラス自身の処理に使われる
  - インスタンス（オブジェクト）は、インスタンスの生成元や継承元への参照を `prototype` に持っている
    - Javascript のクラスは`プロトタイプベース`と言われるのはこれか
    - メソッドやプロパティの探索は prototype が undefined になるまで行われる
  - `extends` でクラスを実行できる
    - 静的メソッドもプロトタイプメソッドも継承される
    - 継承した場合には最初に `super()` を呼び出して親クラスのコンストラクタを実行する
      - コンストラクタの処理順が親クラス -> 子クラスという順番で無ければならないので
- `try`...`catch`...`finally` が ruby でいうところの begin...rescue...ensure
  - catch は全ての例外を補足するので error の種類によって処理を変える場合は catch 内でやる
  - TypeError などのビルトインエラーがいくつかある
  - throw で自分で例外を発生させられる
- 非同期処理
  - Javascript の非同期処理は基本的には並行処理。Web Worker API など一部は並列で実行される
  - 非同期処理の外からは非同期処理の中で発生した例外を知ることはできない。
  - 非同期処理を上手く扱うための主要な 3 つのパターン
    - `エラーファーストコールバック`・`Promise`・`Async Function`
  - `エラーファーストコールバック`
    - 非同期処理の中で例外が起きた場合に実行するコールバック関数を非同期処理の引数の最初に渡すというルール
      - 仕様ではなくルール
  - `Promise`
    - 非同期処理を扱うためのオブジェクトでありインターフェイス
    - Promise はインスタンス作成時に `resolve` と `reject` の 2 つの引数を持つ関数を引数に取る
    - Promise の処理内で `resolve` が呼び出されると `Prmise#then` でチェーンされた関数が呼び出される
    - Promise の処理内で `reject` が呼び出される、または例外が発生すると `Promise#catch` でチェーンされた関数が呼び出される
    - Promise は内部的に 3 つの状態を持っている
      - `Fullfilled`: resolve したときの状態。`Settled` な状態で、ここから状態が変化することはない
      - `Rejected`: reject または例外が発生した状態。`Settled` な状態で、ここから状態が変化することはない
      - `Pending`: Fullfilled でも Rejected でもない状態。インスタンスを作成したときの状態
    - Promise の処理内では一度だけ resolve が呼べる。
    - Fullfilled の状態になった Promise インスタンスに対して、then メソッドでコールバック関数を登録できる
    - Promise#resolve、Promise#reject で Fullfilled、Rejected な状態の Promise オブジェクトを作れる
      - テストでよく使われる
    - `Promise#then` や `Promise#catch` は Fullfilled な状態の Promise オブジェクトを作成して返すのでチェーンすることができる
    - `Promise.all` には Promise インスタンスの配列を受け取って、新しい Promise オブジェクトを返す。
      - 引数で受け取った全ての Promise インスタンスの状態が Fullfilled になったら返り値も Fullfilled になる。
    - `Promise.race` は 1 つでも Settled になったらその Promise オブジェクトの状態と同じ状態の新しい Promise オブジェクトを返す
  - `Async Function`
    - 関数の前に `async` キーワードをつけることで常に Promise インスタンスを返すようになる（以下引用）
      - Async Function が値を return した場合、その返り値を持つ Fulfilled な Promise を返す
      - Async Function が Promise を return した場合、その返り値の Promise をそのまま返す
      - Async Function 内で例外が発生した場合は、そのエラーを持つ Rejected な Promise を返す
    - Async Function 内では `await` 式を利用できる
      - await 式は右辺の Promise インスタンスが Settled になるまで待つ
        - Fullfilled なら await 式は resolve された値を返す
        - Rejcted ならその場でエラーを throw するので、同じ try...catch 構文で例外処理をできる
    - Async Function は Promise API(Promise.all など)と組み合わせて使うと効果的
- Map や Set があって、どちらも Iterable。Iterate ようの Map#keys などもメソッドもある
- オブジェクトは JSON を使って文字列とオブジェクトを行き来させられる
  - JSON 形式にシリアライズできないオブジェクトもある
- Date オブジェクトは使いにくいので既存のライブラリと組み合わせて使ったほうがよさそう

次は MDN の Javascript を読むかな。(順序が逆かもしれない)
https://developer.mozilla.org/ja/docs/Web/JavaScript
