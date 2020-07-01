# CollecTez

![api](https://github.com/catsoap/collec-tez/workflows/api/badge.svg)
![dapp](https://github.com/catsoap/collec-tez/workflows/dapp/badge.svg)

## What is this ?

Project to play around tzip-12

See current status of implementations:

- https://gitlab.com/smondet/fa2-smartpy
- https://github.com/stove-labs/tzip-12

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

Run `make install`, this will install `api` and `dapp` projects

### Infra

Run `make infra-up` to lauch the sandbox and tools containers

### Sandbox

Some commands, like deploy requires the config to be changed from the default one, for this run `make sandbox-config`

### Contract

NFT contract is taken from https://gitlab.com/smondet/fa2-smartpy/-/tree/master/michelson
it can be deployed with `make contracts-originate-FA2`

Once deployed, fill the obtained contract address in the .env file.

### Dapp Dev

Launch api with `make api-serve`

Then run `make dapp-start`

### Local URLs:

- dapp: http://localhost:3000
- firebase admin: http://localhost:4000
- explorer: http://localhost:9000

## Useful links

https://smondet.gitlab.io/fa2-smartpy/
https://forum.tezosagora.org/t/implementing-fa2-an-update-on-the-fa2-specification-and-smartpy-implementation-release/1870
