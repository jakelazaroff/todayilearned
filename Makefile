.PHONY: dev build link

dev: link
	@bun dev

build: link
	@bun build

link:
	@for dir in $(dir $(wildcard til/*/.)); do ln -sf "../../../$$dir" "./src/content/til"; done
