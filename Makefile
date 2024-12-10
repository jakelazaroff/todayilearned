.DEFAULT_GOAL = help

##@ Development
.PHONY: clean link dev build

clean:
	@rm -rf dist

dev:  ## Run the development webserver
	@bun dev

build: clean  ## Build for production
	@bun run build

link: ## Create symlinks for the `til` submodule in `src/content/til`
	@git submodule foreach git pull --rebase origin main
	@rm -rf ./src/content/til
	@mkdir -p ./src/content/til
	@for md in til/**/*.md; do \
		dir=$$(dirname "$$md"); \
		ln -sf "../../../$$dir" "./src/content/til"; \
	done

##@ Help

help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[.a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
