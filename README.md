# CollecTez

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

Now, run `make install`, this will install both `contract` and `dapp` projects

### Faucet

You can get a testnet faucet wallet [here](https://faucet.tzalpha.net/)  
Then save your faucet as `faucet.json` in the root of this project

### Infra

Run `make infra-up` to lauch the infra

### Dapp Dev

Run `make dapp-start`

Local URLs:

- dapp: http://localhost:3000
- explorer: http://localhost:8000
