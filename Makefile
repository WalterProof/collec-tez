.PHONY: api-config api-deploy api-install api-serve contract-compile contract-deploy \
	contract-install contract-migrate contract-test dapp-build dapp-deploy dapp-install \
	dapp-start dapp-test help infra-kill infra-restart infra-up

SHELL := /bin/bash

FIREBASE = firebase
YARN = yarn --cwd
API_DIR = api
CONTRACT_DIR = contract
DAPP_DIR = dapp
NETWORK ?= development

default: help

#
# set json key with value in file
#
# $(1) the file
# $(2) the key
# $(3) the value
#
define set_json_key
	jq '$(2) |= $$v' $(1) --arg v $(3) | sponge $(1)
endef

define read_env
	set -o allexport && source .env && set +o allexport
endef

#######################################
#            COMMON                   #
#######################################
install: # install all dependencies
	@if [ ! -f .env -a -f .env.dist ]; then cp .env.dist .env; fi
	@$(MAKE) api-install
	@$(MAKE) contract-install
	@$(MAKE) dapp-install


#######################################
#               API                   #
#######################################
api-config: ## override firebase config
	@firebase functions:config:get > .runtimeconfig.json
	@$(call read_env) && \
	$(call set_json_key,.runtimeconfig.json,.contract.address,$$REACT_APP_CONTRACT_ADDRESS) && \
	$(call set_json_key,.runtimeconfig.json,.node.url,$$REACT_APP_RPC) && \
	$(call set_json_key,.runtimeconfig.json,.tzstats.api,$$TZSTATS_API) && \
	$(call set_json_key,.runtimeconfig.json,.ipfs.gateway,$$IPFS_GATEWAY) 

api-deploy: ## deploy the api 
	@firebase deploy --only functions

api-install: ## install api dependencies
	@$(YARN) $(API_DIR) install

api-serve: ## start the local server
	@firebase emulators:start --only firestore,functions

#######################################
#             CONTRACT                #
#######################################
contract-compile: ## run contract compilation
	@$(YARN) $(CONTRACT_DIR) compile

contract-deploy: ## deploy contract (make contract-deploy NETWORK=<network>)
	@$(YARN) $(CONTRACT_DIR) deploy --network $(NETWORK)

contract-install: ## install contract dependencies
	@$(YARN) $(CONTRACT_DIR) install

contract-test: ## run the contract tests
	@$(YARN) $(CONTRACT_DIR) test

contract-migrate: ## run contract migrations
	@$(YARN) $(CONTRACT_DIR) migrate


#######################################
#              DAPP                   #
#######################################
dapp-build: ## build dapp
	@$(YARN) $(DAPP_DIR) build

dapp-deploy: ## deploy dapp
	@$(FIREBASE) deploy --only hosting

dapp-install: ## install dapp dependencies
	@$(YARN) $(DAPP_DIR) install

dapp-start: ## start dapp in watch mode
	@$(call read_env) && $(YARN) $(DAPP_DIR) start

dapp-test: ## run dapp tests
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
	@docker run --rm --name bcd --detach -p 9000:80 bakingbad/better-call-dev

infra-up: ## to create and start all the containers
	@$(YARN) $(CONTRACT_DIR) start-sandbox
	@docker run --rm --name bcd --detach -p 8000:80 bakingbad/better-call-dev


#######################################
#               MISC                  #
#######################################
help:
	@grep -E '^[ a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
