.PHONY: api-config api-deploy api-install api-serve contract-compile contract-deploy \
	contract-install contract-migrate contract-test dapp-build dapp-deploy dapp-install \
	dapp-start dapp-test help infra-kill infra-restart infra-up sandbox-deploy-FA2 \
	sandbox-run

SHELL := /bin/bash

FIREBASE = firebase
YARN = yarn --cwd
API_DIR = api
CONTRACT_DIR = contract
DAPP_DIR = dapp
NETWORK ?= development

DOCKER_START_BCD = docker run --rm --name bcd --detach -p 9000:80 bakingbad/better-call-dev
DOCKER_START_SANDBOX = docker run --rm --name flextesa-sandbox -v $(shell pwd)/$(CONTRACT_DIR)/contracts:/contracts --detach -p 8732:20000 stovelabs/image-carthagebox-run-archive:latest sandbox-archive start
DOCKER_RUN_SANDBOX = docker exec -it flextesa-sandbox sh -c


default: help


#
# read environment variables from .env file
#
define read_env
	set -o allexport && source .env && set +o allexport
endef

#
# set a json key in a file
#
# $(1) the file
# $(2) the key
# $(3) the value
#
define set_json_key
	jq '$(2) |= $$v' $(1) --arg v $(3) | sponge $(1)
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
	@$(call read_env) ; pytest -v $(CONTRACT_DIR)/tests

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
	@docker kill flextesa-sandbox
	@docker kill bcd

infra-restart: ## to restart containers
	$(MAKE) infra-kill
	$(MAKE) infra-up

infra-up: ## to create and start all the containers
	@echo "Starting sandbox..."
	@$(DOCKER_START_SANDBOX)
	@$(DOCKER_RUN_SANDBOX) 'tezos-client -P 20000 config update'
	@$(call read_env) && \
		alice=$$(echo $$SANDBOX_ACCOUNT_ALICE | jq .sk) && \
		bob=$$(echo $$SANDBOX_ACCOUNT_BOB | jq .sk) && \
		$(DOCKER_RUN_SANDBOX) "tezos-client import secret key alice unencrypted:$$alice" && \
		$(DOCKER_RUN_SANDBOX) "tezos-client import secret key bob unencrypted:$$bob"
	@echo "Starting BCD..."
	@$(DOCKER_START_BCD)


#######################################
#             SANDBOX                 #
#######################################
sandbox-run: ## run client command in sandbox (make sandbox-client-run CMD=bootstrapped)
	@$(DOCKER_RUN_SANDBOX) 'tezos-client $(CMD)'

sandbox-FA2-deploy: ## deploy FA2 Michelson
	@storage=$$(cat $(CONTRACT_DIR)/contracts/nft_mutran_storage.tz) ; \
	$(DOCKER_RUN_SANDBOX) "tezos-client originate contract FA2 transferring 0 from alice running /contracts/nft_mutran_contract.tz --init '""$$storage""' -f --burn-cap 6.405"

sandbox-FA2-mint: ## mint 
	@$(DOCKER_RUN_SANDBOX) "tezos-client transfer 0.000000 from tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb to KT1EyY5Wj6P9Mvp4tnqWEMm773Ho2tvwf2gS --entrypoint 'mint' --arg 'Pair (Pair \"tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb\" 1) (Pair \"TOK\" 1)' --burn-cap 0.166"

#######################################
#               MISC                  #
#######################################
help:
	@grep -E '^[ a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

