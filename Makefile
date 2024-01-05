.DEFAULT_GOAL = help

##@ Development
.PHONY: dev build link

dev: link  ## Run the development webserver
	@bun dev

build: link  ## Build for production
	@bun run build

link: ## Create symlinks for the `til` submodule in `src/content/til`
	@git submodule update --remote
	@mkdir -p ./src/content/til
	@for dir in $(dir $(wildcard til/*/.)); do ln -sf "../../../$$dir" "./src/content/til"; done

##@ Help

help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[.a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
