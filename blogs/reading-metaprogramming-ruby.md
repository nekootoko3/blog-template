---
title: "メタプログラミングRubyを読んだ.md"
slug: reading-metaprogramming-ruby
createdAt: "2020-04-26"
updatedAt: "2020-04-26"
canPublish: true
tags: ruby
---

## メタプログラミング Ruby

- メタプログラミング

  - コードを書くためのコードを書く => 言語要素を実行時に操作するコードを記述すること

- 基本的なメタプログラミングについて。Ruby のクラス、メソッド探索、メソッドの発見と実行のプロセスについて
- メソッドを扱うための技法
- ブロック や lambda の技法。DSL についても扱う
- クラス定義のスコープ。特異クラス
- コードを記述するコード。eval とコールバックメソッド

### メタプログラミング

- Ruby では言語要素(クラス、メソッド、変数などプログラミング言語に存在している各要素)に対して、実行時に読み書きを行うことができる
  - `ActiveRecord::Base` などは、テーブルとカラムからアクセサメソッドを実行時に定義している
    - C++ など静的言語では変数やメソッドは機械語としてメモリに配置されているだけの存在になるのでできない
  - `イントロスペクション`といって、オブジェクトに対して持っているインスタンスメソッドやクラス名などについて問い合わせることができる
    - #instance_methods, #class, #instance_variables など

### オブジェクトモデル

- `オープンクラス` (`モンキーパッチ`)
  - Ruby の class 宣言では後から定義を追加することができる
    - メリット: String, Numeric といった標準クラスでも容易にメソッドを追加できるという
    - デメリット: 既存のクラスが持つメソッドを意図せずオーバーライドしてしまうという
    - Refinements を利用することでオープンクラスを適用する範囲を局所化することができる
      - 再定義を行うモジュール内で `refine` の第一引数に再定義したいクラス名、第二引数に再定義したいメソッドを含むブロックを渡す
      - `using <<module>>` を呼び出したところから、ファイルやモジュールの定義が終わるところまで再定義が有効になる
- オブジェクトモデルの中身
  - `インスタンス変数はオブジェクトの持ち物`、`インスタンスメソッドはクラスの持ち物`
    - インスタンス変数は`値が代入されたときに初めて出現する`
      - 同じクラスのインスタンスでもインスタンス変数が異なるということが起こりうる
      - オブジェクトはインスタンス変数の集まりにクラスへのリンクがついたもの
- `クラスはオブジェクト`
  - クラスはオブジェクトなので、インスタンスに当てはまることはクラスにも当てはまる
    - ex) Kernel.class を実行すると Module が返ってくる！なので Kernel.send とか実行できる
  - クラスはオブジェクトにインスタンスメソッドの一覧とスーパークラスへのリンクがついたもの
  - Ruby の Class は Module を継承している(Class は Module である)ので、両者は同じ役割を担うものとされている
    - どちらとも基本的にはメソッドをまとめたもの
    - Class では、[:new, :allocate, :superclass]がインスタンスメソッドとして追加されている
    - インスタンスの生成や継承では Class、インクルードするときはモジュールといった使い分けることでコードの意図が明確になることが期待されているが両者は根本的には同じもの

```ruby
irb(main):021:0> "hello".class # "hello" は String クラスのインスタンス
=> String
irb(main):022:0> String.class # String は Class クラスのインスタンス
=> Class
irb(main):023:0> Class.class # Class はクラスそのもの
=> Class
irb(main):024:0> Class.instance_methods(false)
=> [:allocate, :superclass, :new]
irb(main):025:0> Array.superclass # Object クラスは to_s など便利なメソッドを多数持っている
=> Object
irb(main):026:0> Object.superclas # BasicObject は基本的なメソッドをいくつか持っている
=> BasicObject
irb(main):028:0> BasicObject.superclass # BasicObject は Ruby のクラス階層のルート
=> nil
irb(main):001:0> Class.superclass # Class は Module を継承している！
=> Module
```

- Ruby の定数(大文字で始まる参照)は変数と似ている点が多い
  - 変数から参照することができる
  - 上書きすることができる
  - 違いは`スコープ`。module でネストすることによって異なるスコープに同じ名前の定数を複数作ることができる
- メソッド探索: メソッドを探すこと
  - レシーバ: 呼び出すメソッドが属するオブジェクトのこと
  - 継承チェーン: メソッド探索を行う順序
    - `Module#ancestors`で聞くことができる
    - one step to the right, then up
      - レシーバであるオブジェクトのクラスに向かって一歩右に進み、メソッドが見つかるまで継承チェーンを上に上がる
    - Module が `include された場合`、include した Class のすぐ上の継承チェーンに挿入される(後で探索される)
    - Module が `prepend された場合`、prepend した Class のすぐ下の継承チェーンに挿入される(先に探索される)
- メソッドの実行
  - Ruby のコードはオブジェクト(カレントオブジェクト)の内部で実行される。
  - カレントオブジェクトは、`self` キーワードでアクセスできる
    - メソッドを呼び出すと、そのメソッドのレシーバが self になる
    - トップレベルでの self は `main` オブジェクト。Object クラスのオブジェクト
  - クラスやモジュールの内側では、self の役割はクラスやモジュールそのもの
  - private メソッドのルール: 明示的なレシーバをつけて private メソッドを呼び出すことができないということ
    - 同じクラスの別オブジェクトの private メソッドは呼び出せないが(レシーバが必須になる)、継承したメソッドは呼び出せる

### メソッド

`動的メソッド` や `method_missing` を使ってコードの重複を排除する。
動的メソッドで足りるなら動的メソッドで済ませよう。

- `動的メソッド`
  - `動的ディスパッチ`
    - `#send`: コード実行時に呼び出すメソッドを決めることができる
      - private メソッドの呼び出しもできる
  - `動的メソッド`
    - `#define_method`: コード実行時にインスタンスメソッドを定義できる
- `#method_missing`
  - BasicObject が持つプライベートメソッド。メソッド探索が失敗(BasicObject まで上がってもメソッドが存在しなかった)した時に呼ばれる。
    この method_missing をオーバーライドすることでメソッドを実行することができる。
    - 例えば下記例だと、Neko クラスは #wanwan, #uho の場合には文字列を返し、そうでない場合には継承チェーンが上の #method_missing を呼び出す
    - #method_missing をオーバーライドしただけでは、#respond_to? に対して嘘をついてしまうので、#respond_to_missing? を定義している
  - `Module#const_missing`: 定数が見つからなかった時の挙動を定義していて、モンキーパッチを当てて特定の定数の呼び出しに反応させられる
- ブランクスレート: 必要最小限のメソッドしかないクラスのこと
  - 普通にクラスを作ると Object クラスを継承するので、Object と Kernel のメソッドが含まれる。
    `#method_missing` を使ったコードを書こうと思った時に、Object や Kernel のメソッドが見つかると不都合になるときがある。
    `BasicObjectを直接継承`することで解決する(#unded_method を使う方法もある)

```ruby
class Neko
  def method_missing(nakigoe)
    [:wanwan, :uho].include?(nakigoe) ? nakigoe.to_s : super
  end

  private

  def respond_to_missing?(method, include_private = false)
    [:wanwan, :uho].include?(method)
  end
end
```

### ブロック

- Ruby のブロックは、コードとその時点での束縛を保持するためクロージャとも呼ばれる
- Ruby のスコープは`スコープゲート`によって切り替わり、その前後で変数は共有されない
  - スコープゲートは 3 種類: `クラス定義`、`モジュール定義`、`メソッド定義`
- スコープゲートを超えて束縛を横断する方法
  - `フラットスコープ`: クラス定義、メソッド定義にブロックを利用してスコープをフラットにする
    - クラス定義: class キーワードを使わず、`Class.new` にブロックを渡す
    - メソッド定義: def キーワードを使わず、`define_method` にブロックを渡す
  - `共有スコープ`: 特定の範囲内でのみ束縛を共有するために、メソッドやブロック内で束縛とフラットスコープを行う
- instance_eval はレシーバーのコンテキストでブロックを実行する
  - `クリーンルーム`: 束縛を共有する範囲を限定する方法
    - ブロックを実行す環境を予め作り、その環境で instance_eval を実行することで束縛をその環境内に閉じ込める
- ブロックと Proc オブジェクトは & を介して相互に変換できる。メソッドに渡されたブロックは自動的に Proc オブジェクトに変換される
- メソッドは method によって Method オブジェクトに変換できる
  - また、Method#unbind or Object#instance_method によって、UnboundMethod に変換できる
- ブロック、Proc、lambda、Method の違い
  - ブロック
    - オブジェクトではない
    - 定義されたスコープで評価される(クロージャ)
  - Proc
    - 引数が多ければ無視され、少なければ nil になる
    - 定義されたスコープで評価される(クロージャ)
  - lambda
    - 渡した引数の数が定義した引数の数と違っていると ArgumentError を発生する
    - 定義されたスコープで評価される(クロージャ)
  - Method
    - オブジェクトのスコープで評価される
    - オブジェクトのスコープから引き離して、他のオブジェクトに束縛することもできる

### クラス定義

- Ruby のプログラムは常に`カレントオブジェクト`を持っていて、 self で参照を獲得できる
  - クラス定義内での self はクラス自身になる
- Ruby のプログラムは`カレントクラス`も持っていて、メソッドを定義するとカレントクラスのインスタンスメソッドになる
  - カレントクラスを参照を獲得するキーワードはないが、下記 3 点から簡単に追跡できる
    - プログラムのトップレベルでは、カレントオブジェクト main のクラス Object がカレントクラス
    - class キーワードでクラスをオープンすると、そのクラスがカレントクラスになる
    - メソッドの中では、カレントオブジェクトのクラスがカレントクラスになる
- 単一のオブジェクトに特化したメソッドを`特異メソッド`と呼ぶ
  - `クラスメソッド`は特異メソッドの一種(クラスもオブジェクトなので)
- クラス定義の中で使えるクラスメソッドのことを`クラスマクロ`と呼ぶ
  - ex. Module#attr_accessor は
- クラスは `Object#class` で返すクラス以外にも`特異クラス`という特別なクラスを持っている
  - 特異メソッドを特異クラスに存在している
  - 継承チェーンは、特異メソッドが存在していればまずは特異クラスを探す
- Ruby のオブジェクトモデルのまとめ

1. オブジェクトは 1 種類しかない。それが通常のオブジェクトかモジュールになる
2. モジュールは 1 種類しかない。それが通常のモジュール、クラス、特異クラスになる
3. メソッドは 1 種類しかない。それはモジュール(モジュール、クラス、特異クラス)に存在している
4. すべてのオブジェクトは(クラスも含めて)「本物のクラス」を持っている。それが通常のクラスか特異クラス
5. すべてのクラスは BasicObject に向けて 1 本の継承チェーンを持っている
6. オブジェクトの特異クラスのスーパークラスはクラス。クラスの特異クラスのスーパークラスは、クラスのスーパークラスの特異クラス。
7. メソッドを呼び出すときは「本物のクラス」に向かって右へ進み継承チェーンを上に進む。

- クラスがモジュールを Module#include すると、クラスの定数・インスタンスメソッド・モジュール変数が手に入るがクラスメソッドは手に入らない
  - モジュールのメソッドをクラスメソッドとして取り込みたいときは、特異クラスにモジュールのインスタンスメソッドを取り込む
    - 特異クラスをオープンして、Module#include するか Object#extend を行う(`クラス拡張`)
- `メソッドラッパー`: メソッドの中にメソッドをラップして、対象のメソッドを変更せず、前後に処理を行わせる方法
  - Module#prepend、Module#alias_method、Refinements を利用する方法がある

### コードを記述するためのコード

- Kernel#eval は、文字列をコードとして評価できる
  - `コードインジェクション` に注意。
    - e.g. 外部からの文字列をそのまま評価した場合、eval('1; Dir.glob("\*")') といったコードが実行されうる
    - 対策
      - 潜在的に危険なオブジェクトかどうか Object#tainted? で確認
      - 実行できる操作を限定するセーフレベルを設定
  - コードインジェクションやシンタックスハイライトが効かないということもあるので基本使わない
  - Kernel#eval は、2 番目の引数に Binding オブジェクトを渡すことでスコープを利用してコードを評価する
    - Kernel#binding で Binding オブジェクトを取得できる
- `フックメソッド`: 特定のイベントの発生時に実行されるメソッド
  - `Module#included` が一番良く利用される
    - 下記例では include したクラスにクラスメソッドが追加される

```rb
module Neko
  # このモジュールが include されたときに、include したクラス(モジュール)が引数に渡される
  def self.included(klass)
    # クラスメソッドを追加
    klass.extend ClassMethods
  end

  module ClassMethods
    def nyaa; "miaumiau"; end
  end
end

module Inu
  include Neko
end

irb(main):001:0> Inu.nyaa
=> "miaumiau"
```
