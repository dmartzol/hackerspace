PROJECT_NAME := hmm
MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PROJECT_ROOT_DIR := $(patsubst %/,%,$(dir $(MAKEFILE_PATH)))
CONTAINER_DIR := /go/src/github.com/dmartzol/$(PROJECT_NAME)

.PHONY: up
up:
	docker compose up --remove-orphans --detach

.PHONY: down
down:
	docker compose -p hmm down

.PHONY: build
build:
	docker compose up --remove-orphans --detach --build

.PHONY: lint-ci
lint-ci:
	echo $(PROJECT_ROOT_DIR) && \
	docker run \
	-v $(PROJECT_ROOT_DIR):$(CONTAINER_DIR) \
	-w $(CONTAINER_DIR)/ \
	--rm \
	-t golangci/golangci-lint:v1.50 \
	golangci-lint run -v --timeout 5m0s ./...

.PHONY: install_deps
install_deps:
	go get -u github.com/dmartzol/go-sdk
	go mod download

.PHONY: ngrok
ngrok:
	docker run \
	--rm \
	-it \
	-v ~/.config/ngrok/ngrok.yml:/etc/ngrok.yml \
	-e NGROK_CONFIG=/etc/ngrok.yml \
	ngrok/ngrok:latest http host.docker.internal:80

.PHONY: gitleaks
gitleaks:
	docker run \
		-v $(PROJECT_ROOT_DIR):/path \
		--rm \
		zricethezav/gitleaks:latest detect -v --source="/path"

.PHONY: mocks
mocks:
	docker run \
		--rm \
		-e GOPRIVATE=$GOPRIVATE \
		-v "$(HOME)/.gitconfig:/root/.gitconfig" \
		--volume "$(PROJECT_ROOT_DIR):/$(PROJECT_NAME)" \
		--workdir /$(PROJECT_NAME) \
		vektra/mockery:v2.35

-include e2e.mk
