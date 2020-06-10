.PHONY: contract-compile contract-deploy contract-install contract-migrate contract-test \
	dapp-build dapp-deploy dapp-install dapp-start dapp-test help infra-kill infra-restart infra-up

SHELL := /bin/bash

FIREBASE = firebase
YARN = yarn --cwd
CONTRACT_DIR = contract
DAPP_DIR = dapp

default: help

define read_env
	set -o allexport && source .env && set +o allexport
endef

#######################################
#            COMMON                   #
#######################################
install: # to install all dependencies
	@if [ ! -f .env -a -f .env.dist ]; then cp .env.dist .env; fi
	@$(MAKE) contract-install
	@$(MAKE) dapp-install

#######################################
#             CONTRACT                #
#######################################
contract-compile: ## to run contract compilation
	@$(YARN) $(CONTRACT_DIR) compile

contract-deploy: ## to deploy contract 
	@$(YARN) $(CONTRACT_DIR) deploy

contract-install: ## to install contract dependencies
	@$(YARN) $(CONTRACT_DIR) install

contract-test: ## to run the contract tests
	@$(YARN) $(CONTRACT_DIR) test

contract-migrate: ## to run contract migrations
	@$(YARN) $(CONTRACT_DIR) migrate


#######################################
#              DAPP                   #
#######################################
dapp-build: ## to build dapp
	@$(YARN) $(DAPP_DIR) build

dapp-deploy: ## to deploy dapp
	@$(FIREBASE) deploy --only hosting

dapp-install: ## to install dapp dependencies
	@$(YARN) $(DAPP_DIR) install

dapp-start: ## to start dapp in watch mode
	@$(call read_env) && $(YARN) $(DAPP_DIR) start

dapp-test: ## to run dapp tests
	@$(YARN) $(DAPP_DIR) test


########################################
#              INFRA                   #
########################################
infra-kill: ## to kill all containers
	@$(YARN) $(CONTRACT_DIR) kill-sandbox
	@docker kill bcd

infra-restart: ## to restart containers
	@$(YARN) $(CONTRACT_DIR) restart-sandbox
	@docker kill bcd
	@docker run --rm --name bcd --detach -p 8000:80 bakingbad/better-call-dev

infra-up: ## to create and start all the containers
	@$(YARN) $(CONTRACT_DIR) start-sandbox
	@docker run --rm --name bcd --detach -p 8000:80 bakingbad/better-call-dev


#######################################
#               MISC                  #
#######################################
help:
	@grep -E '^[ a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
