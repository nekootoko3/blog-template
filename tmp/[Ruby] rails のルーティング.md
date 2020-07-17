rails の `config/routes.rb` で使えるメソッドとそれによって作成される path について。
重要だと思うメソッドを上に列挙し、それから他のメソッドを追記する。
resources, resource,

### resources

id を参照するリソースベースのルーティングの場合に使う。
index、show、new、edit、create、update、destroy に対応するルーティングを 1 行で書ける。
`only` で対象とするアクションを絞ることもできる。

```rb
resources :users
```

```rb
#                                Prefix Verb   URI Pattern                                                                              Controller#Action
#                                 users GET    /users(.:format)                                                                         users#index
#                                       POST   /users(.:format)                                                                         users#create
#                              new_user GET    /users/new(.:format)                                                                     users#new
#                             edit_user GET    /users/:id/edit(.:format)                                                                users#edit
#                                  user GET    /users/:id(.:format)                                                                     users#show
#                                       PATCH  /users/:id(.:format)                                                                     users#update
#                                       PUT    /users/:id(.:format)                                                                     users#update
#                                       DELETE /users/:id(.:format)                                                                     users#destroy
#
```

### resource

`resoureces` とほとんど同じだが id を参照しないリソースベースのルーティングの場合に使う。
ログイン済みで自身のプロフィール情報の表示などに使う。

```rb
namespace :accounts do # 後述。path の戦闘に accounts を追加している。
  resource :profile
end
```

```rb
#                                Prefix Verb   URI Pattern                                                                              Controller#Action
#                  new_accounts_profile GET    /accounts/profile/new(.:format)                                                          accounts/profiles#new
#                 edit_accounts_profile GET    /accounts/profile/edit(.:format)                                                         accounts/profiles#edit
#                      accounts_profile GET    /accounts/profile(.:format)                                                              accounts/profiles#show
#                                       PATCH  /accounts/profile(.:format)                                                              accounts/profiles#update
#                                       PUT    /accounts/profile(.:format)                                                              accounts/profiles#update
#                                       DELETE /accounts/profile(.:format)                                                              accounts/profiles#destroy
#                                       POST   /accounts/profile(.:format)                                                              accounts/profiles#create
```

### namespace

### member と collection

7 つの RESTful なルーティングに path を追加する `member` と `collection`。
`member` は id を参照するルーティングで `collection` は id を参照しないルーティング。

```rb
resources :users, only: [] do
  member do
    post 'connection_request'
  end
  # こちらの記法でもよい
  # post 'connection_request', on: :member
  # この場合、user の id の取得が params[:id] ではなく、params[:user_id] になる
  collection do
    get 'search'
  end
  # こちらの記法でもよい
  # get 'search', on: :collection
end
```

```rb
#                                Prefix Verb   URI Pattern                                                                              Controller#Action
#               connection_request_uesr POST   /users/:id/connection_request(.:format)                                                  users#connection_request
#                          search_users GET    /users/search(.:format)                                                                  users#search
```

```rb

```

## その他メソッド

- 単純な path の割当
  - get 'pathに割り当てる単語', to: '割り当てるcontroller#割り当てるメソッド' という形式で path と contrller・action を対応付けられる
    - get の箇所には patch, put, post, delete が利用できる
    - e.g. `get 'user/profile', to: 'users#show'` は、`user/profile` に get リクエスト を受けると UsersController の show メソッドが呼び出される
- `constraints`
  - parameter や subdomain を制限できる


### tips

- resources を利用したネストは 1 回に留めるべき
  - ref. [rails ガイド中でも参照している記事](http://weblog.jamisbuck.org/2007/2/5/nesting-resources)
  - ref. https://railsguides.jp/routing.html#%E3%80%8C%E6%B5%85%E3%81%84%E3%80%8D%E3%83%8D%E3%82%B9%E3%83%88
  - `shallow` オプション

> コレクション (index/new/create のような、id を持たないアクション) だけを親のスコープの下で生成するという手法があります。
> このとき、メンバー (show/edit/update/destroy のような、id を必要とするアクション) をネストに含めないのがポイントです。

```rb
resources :articles do
  # article の id が分からないと articles に紐付いた comments の index, new, create はできない
  resources :comments, only: [:index, :new, :create]
end
# article の id がなくても comments の id さえ分かれば一意になる
resources :comments, only: [:show, :edit, :update, :destroy]
```

```rb
resources :articles do
  resources :comments, shallow: true
end
```

- リソースフルなルーティングにアクションが多数追加されていたら別のリソースが隠れている可能性が高い。

## 参照

- [Rails のルーティング](https://railsguides.jp/routing.html)
