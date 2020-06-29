SHELL := /bin/bash

FIREBASE = firebase
YARN = yarn --cwd
API_DIR = api
CONTRACT_DIR = contract
DAPP_DIR = dapp
NETWORK ?= development

# name of the ganache-cli created container sandbox
SANDBOX_CONTAINER_NAME = flextesa-sandbox
TOOLS_CONTAINER_NAME = tools

DOCKER_START_SANDBOX = docker run --rm --detach --name $(SANDBOX_CONTAINER_NAME) \
					   -v $(shell pwd)/$(CONTRACT_DIR)/contracts:/contracts \
					   -p 8732:20000 -e block_time=4 \
					   registry.gitlab.com/tezos/flextesa:image-tutobox-run carthagebox start

DOCKER_RUN_SANDBOX = docker exec -it $(SANDBOX_CONTAINER_NAME) sh -c

DOCKER_RUN_TOOLS = docker run -it -e SANDBOX_ACCOUNT_ALICE -e SANDBOX_ACCOUNT_BOB \
				   -u `id -u`:`id -g` --rm -v $(shell pwd)/$(CONTRACT_DIR):/contract \
				   ekino/ci-tezosqa:0.1-latest   



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
contract-test: ## run the contract tests
	@$(call read_env) && $(DOCKER_RUN_TOOLS) pytest -v /contract/tests


#######################################
#              DAPP                   #
#######################################
dapp-build: ## build dapp
	@$(YARN) $(DAPP_DIR) build

dapp-deploy: ## deploy dapp
	@$(FIREBASE) deploy --only hosting

dapp-install: ## install dapp
	@$(YARN) $(DAPP_DIR) install

dapp-start: ## start dapp
	@$(call read_env) && $(YARN) $(DAPP_DIR) start

dapp-test: ## test dapp
	@$(YARN) $(DAPP_DIR) test


#######################################
#             INFRA                   #
#######################################
infra-up: ## launch sandbox and tools containers
	@$(DOCKER_START_SANDBOX)
	@$(DOCKER_START_TOOLS)

infra-kill: ## kill sandbox and tools containers
	@docker kill $(SANDBOX_CONTAINER_NAME)
	@docker kill $(TOOLS_CONTAINER_NAME)


#######################################
#             SANDBOX                 #
#######################################
sandbox-config: ## configure sandbox
	@$(DOCKER_RUN_SANDBOX) 'tezos-client -P 20000 config update'
	@$(call read_env) && \
		alice=$$(echo $$SANDBOX_ACCOUNT_ALICE | jq .sk) && \
		bob=$$(echo $$SANDBOX_ACCOUNT_BOB | jq .sk) && \
		$(DOCKER_RUN_SANDBOX) "tezos-client import secret key alice unencrypted:$$alice" && \
		$(DOCKER_RUN_SANDBOX) "tezos-client import secret key bob unencrypted:$$bob"

sandbox-info: ## display sandbox info 
	@$(DOCKER_RUN_SANDBOX) 'carthagebox info'

sandbox-deploy-FA2: ## deploy FA2 contract 
	@storage=$$(cat $(CONTRACT_DIR)/contracts/nft_mutran_storage.tz) ; \
	$(DOCKER_RUN_SANDBOX) "tezos-client originate contract FA2 transferring 0 from alice running /contracts/nft_mutran_contract.tz --init '""$$storage""' -f --burn-cap 6.405"

sandbox-FA2-mint:   
	@$(DOCKER_RUN_SANDBOX) "tezos-client transfer 0.000000 from tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb to KT1EyY5Wj6P9Mvp4tnqWEMm773Ho2tvwf2gS --entrypoint 'mint' --arg 'Pair (Pair \"tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb\" 1) (Pair \"TOK\" 1)' --burn-cap 0.166"


#######################################
#               MISC                  #
#######################################
help:
	@grep -E '^[ a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

