import sys

rpc = {
    'sandbox': 'http://sandbox:20000',
    'testnet': 'https://testnet-tezos.giganode.io'
}

print(rpc[sys.argv[1]])

