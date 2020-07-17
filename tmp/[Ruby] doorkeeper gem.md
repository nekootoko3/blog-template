[doorkeeper](https://github.com/doorkeeper-gem/doorkeeper)

## 目次

1. doorkeeper を rails に導入する
2. 認証に利用する model 生成するための generator(initializer?) を生成する
3. 2 で生成した generator を利用して doorkeeper の model・path を生成する

## 1. doorkeeper を rails に導入する

`rails g doorkeeper:install`

1. A new initializer in config/initializers/doorkeeper.rb

2. Add doorkeeper's routes to config/routes.rb

```rb
# == Route Map
#
#                                Prefix Verb   URI Pattern                                                                              Controller#Action
#            native_oauth_authorization GET    /oauth/authorize/native(.:format)                                                        doorkeeper/authorizations#show
#                   oauth_authorization GET    /oauth/authorize(.:format)                                                               doorkeeper/authorizations#new
#                                       DELETE /oauth/authorize(.:format)                                                               doorkeeper/authorizations#destroy
#                                       POST   /oauth/authorize(.:format)                                                               doorkeeper/authorizations#create
#                           oauth_token POST   /oauth/token(.:format)                                                                   doorkeeper/tokens#create
#                          oauth_revoke POST   /oauth/revoke(.:format)                                                                  doorkeeper/tokens#revoke
#                      oauth_introspect POST   /oauth/introspect(.:format)                                                              doorkeeper/tokens#introspect
#                    oauth_applications GET    /oauth/applications(.:format)                                                            doorkeeper/applications#index
#                                       POST   /oauth/applications(.:format)                                                            doorkeeper/applications#create
#                 new_oauth_application GET    /oauth/applications/new(.:format)                                                        doorkeeper/applications#new
#                edit_oauth_application GET    /oauth/applications/:id/edit(.:format)                                                   doorkeeper/applications#edit
#                     oauth_application GET    /oauth/applications/:id(.:format)                                                        doorkeeper/applications#show
#                                       PATCH  /oauth/applications/:id(.:format)                                                        doorkeeper/applications#update
#                                       PUT    /oauth/applications/:id(.:format)                                                        doorkeeper/applications#update
#                                       DELETE /oauth/applications/:id(.:format)                                                        doorkeeper/applications#destroy
#         oauth_authorized_applications GET    /oauth/authorized_applications(.:format)                                                 doorkeeper/authorized_applications#index
#          oauth_authorized_application DELETE /oauth/authorized_applications/:id(.:format)                                             doorkeeper/authorized_applications#destroy
#                      oauth_token_info GET    /oauth/token/info(.:format)                                                              doorkeeper/token_info#show
...
Rails.application.routes.draw do
  use_doorkeepern
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
```

3. Locale files in config/locales/doorkeeper.en.yml

## 2. 認証に利用する model 生成するための generator(initializer?) を生成する

`rails g doorkeeper:migration` を実行すると migration ファイルが生成される
migration 実行前に migration ファイル最下部のコメントアウトを外して、`<model>` となっている箇所を `:users` に変更する

```ruby
# Uncomment below to ensure a valid reference to the resource owner's table
add_foreign_key :oauth_access_grants, :users, column: :resource_owner_id
add_foreign_key :oauth_access_tokens, :users, column: :resource_owner_id
```

migration を実行すると下記 table が生成される
`Doorkeeper::AccessToken` などもファイルは作られないが使えるようになっている

```ruby
  create_table "oauth_access_grants", force: :cascade do |t|
    t.bigint "resource_owner_id", null: false
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.integer "expires_in", null: false
    t.text "redirect_uri", null: false
    t.datetime "created_at", null: false
    t.datetime "revoked_at"
    t.string "scopes", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_grants_on_application_id"
    t.index ["resource_owner_id"], name: "index_oauth_access_grants_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_grants_on_token", unique: true
  end

  create_table "oauth_access_tokens", force: :cascade do |t|
    t.bigint "resource_owner_id"
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.string "refresh_token"
    t.integer "expires_in"
    t.datetime "revoked_at"
    t.datetime "created_at", null: false
    t.string "scopes"
    t.string "previous_refresh_token", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_tokens_on_application_id"
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true
    t.index ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true
  end

  create_table "oauth_applications", force: :cascade do |t|
    t.string "name", null: false
    t.string "uid", null: false
    t.string "secret", null: false
    t.text "redirect_uri", null: false
    t.string "scopes", default: "", null: false
    t.boolean "confidential", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true
  end
```
