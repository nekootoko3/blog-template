---
title: "pipelining でコマンド実行を速くしよう with Ruby"
createdAt: "2019-10-31"
updatedAt: "2019-10-31"
canPublish: true
tag: redis, ruby
---

# devise gem で生成されるもの・できること

devise gem は色々勝手にできるらしいと聞いたしチュートリアルを見ると実際にそうらしいので自分でもやってみる
devise の導入手順とそれぞれの概要は以下

## 目次

1. devise を rails に導入する
2. 認証に利用する model を生成するための generator を生成する
3. 2 で生成した generator を利用して認証用の model を生成する。同時に認証に利用できるいろんな path も追加する
4. もうちょっとなんかやる

## 1. devise を rails に導入する

Gemfile に devise を追加して bundle

## 2. 認証に利用する model を生成するための generator を生成する

`rails g devise:install` を叩く

- ファイルが生成される
  - `config/initializers/devise.rb`
    - 認証に利用する model を生成するための generator
  - config/locales/devise.en.yml
    - locale ファイル

## 3. 2 で生成した generator を利用して認証用の model を生成する。同時に認証に利用できるいろんな path も追加する

`rails g generate devise user` を実行すると、認証に利用する model と認証をハンドリングする path が追加される

### 生成されるモデル

```ruby
# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
end
```

### 追加される path

- 例えば /users/sign_up では登録フォームが既に存在する

```ruby
#                                Prefix Verb   URI Pattern                                                                              Controller#Action
#                      new_user_session GET    /users/sign_in(.:format)                                                                 devise/sessions#new
#                          user_session POST   /users/sign_in(.:format)                                                                 devise/sessions#create
#                  destroy_user_session DELETE /users/sign_out(.:format)                                                                devise/sessions#destroy
#                     new_user_password GET    /users/password/new(.:format)                                                            devise/passwords#new
#                    edit_user_password GET    /users/password/edit(.:format)                                                           devise/passwords#edit
#                         user_password PATCH  /users/password(.:format)                                                                devise/passwords#update
#                                       PUT    /users/password(.:format)                                                                devise/passwords#update
#                                       POST   /users/password(.:format)                                                                devise/passwords#create
#              cancel_user_registration GET    /users/cancel(.:format)                                                                  devise/registrations#cancel
#                 new_user_registration GET    /users/sign_up(.:format)                                                                 devise/registrations#new
#                edit_user_registration GET    /users/edit(.:format)                                                                    devise/registrations#edit
#                     user_registration PATCH  /users(.:format)                                                                         devise/registrations#update
#                                       PUT    /users(.:format)                                                                         devise/registrations#update
#                                       DELETE /users(.:format)                                                                         devise/registrations#destroy
#                                       POST   /users(.:format)                                                                         devise/registrations#create
...
Rails.application.routes.draw do
  devise_for :users
...
end
```

### その他

- 認証に関わる様々なメソッドが利用可能になる。一部を下記
  - authenticate_user!
    - ユーザーが sign in しているか判定。してなければ root に redirect
  - user_signed_in?
    - ユーザーがログイン済みかを bool で返す
  - current_user
    - ログインしているユーザーのインスタンス

## 4. もうちょっとなんかやる

- デフォルトの view が plain 過ぎるのでカスタマイズしたい
  - `rails generate devise:views`
- controller をカスタマイズしたい
  - `rails generate devise:controllers`
- oauth を利用したい
  - omniauth 編に続く（？）

## 参照

- https://github.com/plataformatec/devise#starting-with-rails
- [Rails deviseで使えるようになるヘルパーメソッド一覧](https://qiita.com/tobita0000/items/866de191635e6d74e392)
- https://github.com/plataformatec/devise/blob/master/lib/devise/controllers/helpers.rb
