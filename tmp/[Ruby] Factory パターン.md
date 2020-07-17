## Factory パターン

いくつかのライブラリで使われている Factory パターンを見ていく

### ActionDispatch::Routing::Mapper::Mapping

`ActionDispatch::Routing::Mapper::Mapping::build`
https://github.com/rails/rails/blob/v6.0.3.1/actionpack/lib/action_dispatch/routing/mapper.rb#L76-L84

```rb
module ActionDispatch
  module Routing
    class Mapper
      class Mapping #:nodoc:
        def self.build(scope, set, ast, controller, default_action, to, via, formatted, options_constraints, anchor, options)
          scope_params = {
            blocks: scope[:blocks] || [],
            constraints: scope[:constraints] || {},
            defaults: (scope[:defaults] || {}).dup,
            module: scope[:module],
            options: scope[:options] || {}
          }

          new set: set, ast: ast, controller: controller, default_action: default_action,
              to: to, formatted: formatted, via: via, options_constraints: options_constraints,
              anchor: anchor, scope_params: scope_params, options: scope_params[:options].merge(options)
        end

        def initialize(set:, ast:, controller:, default_action:, to:, formatted:, via:, options_constraints:, anchor:, scope_params:, options:)
          @defaults           = scope_params[:defaults]
          @set                = set
          @to                 = intern(to)
          @default_controller = intern(controller)
          @default_action     = intern(default_action)
          @ast                = ast
          @anchor             = anchor
          @via                = via
          @internal           = options.delete(:internal)
          @scope_options      = scope_params[:options]

          path_params = ast.find_all(&:symbol?).map(&:to_sym)

          options = add_wildcard_options(options, formatted, ast)

          options = normalize_options!(options, path_params, scope_params[:module])

          split_options = constraints(options, path_params)

          constraints = scope_params[:constraints].merge Hash[split_options[:constraints] || []]

          if options_constraints.is_a?(Hash)
            @defaults = Hash[options_constraints.find_all { |key, default|
              URL_OPTIONS.include?(key) && (String === default || Integer === default)
            }].merge @defaults
            @blocks = scope_params[:blocks]
            constraints.merge! options_constraints
          else
            @blocks = blocks(options_constraints)
          end

          requirements, conditions = split_constraints path_params, constraints
          verify_regexp_requirements requirements.map(&:last).grep(Regexp)

          formats = normalize_format(formatted)

          @requirements = formats[:requirements].merge Hash[requirements]
          @conditions = Hash[conditions]
          @defaults = formats[:defaults].merge(@defaults).merge(normalize_defaults(options))

          if path_params.include?(:action) && !@requirements.key?(:action)
            @defaults[:action] ||= "index"
          end

          @required_defaults = (split_options[:required_defaults] || []).map(&:first)
        end
      end
    end
  end
end
```


### ActionDispatch::Routing::RouteSet

`ActionDispatch::Routing::RouteSet::new_with_config`
https://github.com/rails/rails/blob/v6.0.3.1/actionpack/lib/action_dispatch/routing/route_set.rb#L346-L359

```rb
module ActionDispatch
  module Routing
    class RouteSet
      def self.new_with_config(config)
        route_set_config = DEFAULT_CONFIG

        # engines apparently don't have this set
        if config.respond_to? :relative_url_root
          route_set_config.relative_url_root = config.relative_url_root
        end

        if config.respond_to? :api_only
          route_set_config.api_only = config.api_only
        end

        new route_set_config
      end

      DEFAULT_CONFIG = Config.new(nil, false)

      def initialize(config = DEFAULT_CONFIG)
        self.named_routes = NamedRouteCollection.new
        self.resources_path_names = self.class.default_resources_path_names
        self.default_url_options = {}
        self.draw_paths = []

        @config                     = config
        @append                     = []
        @prepend                    = []
        @disable_clear_and_finalize = false
        @finalized                  = false
        @env_key                    = "ROUTES_#{object_id}_SCRIPT_NAME"

        @set    = Journey::Routes.new
        @router = Journey::Router.new @set
        @formatter = Journey::Formatter.new self
        @polymorphic_mappings = {}
      end
    end
  end
end
```

### Google::Cloud::BigQuery

`Google::Cloud::BigQuery::new`
https://github.com/googleapis/google-cloud-ruby/blob/google-cloud-vision/v1.0.0/google-cloud-bigquery/lib/google/cloud/bigquery.rb#L69-L90

特殊なパターン（アンチパターン...?
module のクラスメソッドとして `self.new` を定義しているので、呼び出し側は `#initialize` を利用しているかのように呼び出せる。
`#initialize` を呼び出したつもりだと、戻り値が `Google::Cloud::BigQuery` ではなく `Google::Bigquery::Project` なのでビックリする。
`self.build` であるとか `self.new_with_...` みたいに Factory Method であることが分かりやすいものを利用したほうがよさそう。

```rb
module Google
  module Cloud
    module Bigquery
      def self.new project_id: nil, credentials: nil, scope: nil, retries: nil, timeout: nil, endpoint: nil,
                   project: nil, keyfile: nil
        scope       ||= configure.scope
        retries     ||= configure.retries
        timeout     ||= configure.timeout
        endpoint    ||= configure.endpoint
        credentials ||= (keyfile || default_credentials(scope: scope))

        unless credentials.is_a? Google::Auth::Credentials
          credentials = Bigquery::Credentials.new credentials, scope: scope
        end

        project_id = resolve_project_id(project_id || project, credentials)
        raise ArgumentError, "project_id is missing" if project_id.empty?

        Bigquery::Project.new(
          Bigquery::Service.new(
            project_id, credentials,
            retries: retries, timeout: timeout, host: endpoint
          )
        )
      end
    end
  end
end
```
