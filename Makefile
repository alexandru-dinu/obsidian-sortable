PLUG=${HOME}/workspace/git/org.git/.obsidian/plugins/obsidian-sortable

.PHONY: format dev build

format:
	npx prettier --tab-width=4 --print-width=100 --write "**/*.ts"

install-symlinks: main.js manifest.json styles.css
	rm -rf ${PLUG} && mkdir -p ${PLUG}
	ln -s $(realpath main.js) ${PLUG}
	ln -s $(realpath manifest.json) ${PLUG}
	ln -s $(realpath styles.css) ${PLUG}

install-final: main.js manifest.json styles.css
	rm -rf ${PLUG} && mkdir -p ${PLUG}
	cp main.js ${PLUG}
	cp manifest.json ${PLUG}
	cp styles.css ${PLUG}

update-version:
	@for f in package.json manifest.json; do \
		jq --indent 4 ".version = \"$(NEW_VERSION)\"" $$f | sponge $$f; \
	done

build:
	npm run build

dev:
	npm run dev

remove:
	rm -rf ${PLUG}

clean:
	rm -rf main.js
	rm -rf node_modules
	rm -rf package-lock.json
