.PHONY: build test release clean install help
CLJ ?= clj

build:
	@$(CLJ) -M:build 2>/dev/null || echo "ClojureScript build requires clj/clojure CLI"

test:
	@echo "Test placeholder (requires clojure.test)"

release:
	@tar czf dist/shae-clojurescript-interactive-dashboard-v0.1.0-src.tar.gz src/ scripts/ Makefile README.md DESIGN.md LICENSE docs/

install:
	@echo "Run with: shadow-cljs watch app"

clean:
	@rm -rf dist/ target/

help:
	@echo "Targets: build test release install clean help"
