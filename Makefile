all: build link

build:
	@echo "Bundling client application with lerna"
	@lerna run build

link:
	@echo "Deleting web application current dist"
	@rm -rf ../../workspace/process-planner-web/WebContent/page/dist
	@echo "Linking client application bundle to webapp"
	@cp -r packages/process-simulator-web/dist ../../workspace/process-planner-web/WebContent/page/
