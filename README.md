# CollecTez

![api](https://github.com/catsoap/collec-tez/workflows/api/badge.svg)
![dapp](https://github.com/catsoap/collec-tez/workflows/dapp/badge.svg)

## Requirements

You need to have the following tools installed:

- yarn
- firebase-tools (optional, used for deployment)
- docker (used for contract development)

## How it works?

A **Makefile** provides some shortcuts to help you. Just run

```bash
$ make
```

to see a help menu.

### Installation

Run `make install`, this will install `api`, `contract` and `dapp` projects

### Faucet

You can get a testnet faucet wallet [here](https://faucet.tzalpha.net/)  
Then save your faucet as `faucet.json` in the root of the repository

### Infra

Run `make infra-up` to lauch the infra

### Dapp Dev

Run `make dapp-start`

### Local URLs:

- dapp: http://localhost:3000
- explorer: http://localhost:9000

## Useful links

https://forum.tezosagora.org/t/implementing-fa2-an-update-on-the-fa2-specification-and-smartpy-implementation-release/1870
