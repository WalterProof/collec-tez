import os
import sys
from pytezos.crypto import Key


def config():
    network = sys.argv[1]
    print(network)

    if network == 'sandbox':
        rpc = 'http://sandbox:20000'
        alice_sk = os.environ.get('SANDBOX_ALICE_SK')
        bob_sk = os.environ.get('SANDBOX_BOB_SK')
    else:
        rpc = 'https://testnet-tezos.giganode.io'
        alice_sk = os.environ.get('TESTNET_ALICE_SK')
        bob_sk = os.environ.get('TESTNET_BOB_SK')

    return {
        'rpc': rpc,
        'alice': Key.from_encoded_key(alice_sk),
        'bob': Key.from_encoded_key(bob_sk)
    }
