SHELL := /bin/bash

NETWORK ?= sandbox

FIREBASE = firebase
YARN = yarn --cwd
API_DIR = api
DAPP_DIR = dapp

UID := $(shell id -u)
GID := $(shell id -g)

default: help

BCD_SANDBOX_URL = https://old.better-call.dev/sandbox
BCD_TESTNET_URL = https://better-call.dev/carthagenet

DOCKER_SERVICE_TOOLS = tools
DOCKER_SERVICE_SANDBOX = sandbox

DOCKER_CMD_TOOLS = docker-compose exec -u ek $(DOCKER_SERVICE_TOOLS)
DOCKER_CMD_SANDBOX = docker-compose exec $(DOCKER_SERVICE_SANDBOX)

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
	@if [ ! -f .env -a -f .env.dist ]; then sed "s,#UID#,$(UID),g;s,#GID#,$(GID),g" .env.dist > .env; fi
	@make api-install
	@make dapp-install


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
#            CONTRACTS                #
#######################################
contracts-test: ## run the contracts tests
	@$(DOCKER_CMD_TOOLS) pytest -v contracts/tests

contracts-interactive: ## open python console
	@$(DOCKER_CMD_TOOLS) python

contracts-run-script: ## run script from tools container (make contracts-run-script S=script [NETWORK=network])
	$(DOCKER_CMD_TOOLS) python contracts/scripts/$(S).py $(NETWORK)

contracts-FA2-originate: ## originate the FA2 contract
	@address=$(shell ./scripts/originate-FA2.sh $(NETWORK)) ; \
		if [[ $(NETWORK) == 'sandbox' ]]; \
			then echo "$(BCD_SANDBOX_URL)/$$address"; \
			else echo "$(BCD_TESTNET_URL)/$$address"; \
		fi

contracts-parameter: ## show FA2 parameter schema (make contracts-parameterC=contract)
	@$(DOCKER_CMD_TOOLS) pytezos parameter schema --path=contracts/$(C).tz

contracts-storage: ## show FA2 parameter schema (make contracts-storage C=contract)
	@$(DOCKER_CMD_TOOLS) pytezos storage schema --path=contracts/$(C).tz


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
	@$(call read_env) && \
		export REACT_APP_ALICE_SK=$$SANDBOX_ALICE_SK &&\
		$(YARN) $(DAPP_DIR) start

dapp-test: ## test dapp
	@$(YARN) $(DAPP_DIR) test


########################################
#              INFRA                   #
########################################
infra-clean: ## to stop and remove containers, networks, images
	@docker-compose down --rmi all

infra-rebuild: ## to clean and up all
	@make infra-clean infra-up

infra-shell-tools: ## to open a shell session in the tools container
	$(DOCKER_CMD_TOOLS) bash

infra-show-logs: ## to show logs from node
	@docker logs babylonnet_node_1 --follow

infra-stop: ## to stop all the containers
	@docker-compose stop

infra-up: ## to create and start all the containers
	@if [ ! -f .env -a -f .env.dist ]; then sed "s,#UID#,$(UID),g;s,#GID#,$(GID),g" .env.dist > .env; fi
	@docker-compose up --build -d


#######################################
#             SANDBOX                 #
#######################################
sandbox-config: ## configure sandbox
	@$(DOCKER_CMD_SANDBOX) tezos-client -P 20000 config update
	@$(call read_env) && \
		$(DOCKER_CMD_SANDBOX) tezos-client import secret key alice unencrypted:$$SANDBOX_ALICE_SK --force && \
		$(DOCKER_CMD_SANDBOX) tezos-client import secret key bob unencrypted:$$SANDBOX_BOB_SK --force

sandbox-info: ## display sandbox info 
	@$(DOCKER_CMD_SANDBOX) 'carthagebox info'

sandbox-deploy-FA2: ## deploy FA2 contract 
	storage=$$(cat contracts/nft_mutran_storage.tz) ; \
	$(DOCKER_CMD_SANDBOX) tezos-client originate contract FA2 transferring 0 from alice running /contracts/nft_mutran_contract.tz --init "$$storage" -f --burn-cap 6.405

sandbox-run-client: ## run client command on sandbox (make sandbox-run-client CMD=cmd)
	$(DOCKER_CMD_SANDBOX) tezos-client $(CMD)


#######################################
#              TOOLS                  #
#######################################
tools-update-rpc: ## update used rpc inside tools container (make tools-update-rpc RPC=rpc)
	sed -i -e "s/^TOOLS_RPC=.*$$/TOOLS_RPC=$(RPC)/g" .env
	docker-compose up --force-recreate --no-deps -d tools

#######################################
#               MISC                  #
#######################################
help:
	@grep -E '^[ a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

