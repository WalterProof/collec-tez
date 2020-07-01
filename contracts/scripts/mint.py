import os
import sys
from pytezos import pytezos
from pytezos.crypto import Key

rpc_cnf = {
    'sandbox': 'http://sandbox:20000',
    'testnet': 'https://testnet-tezos.giganode.io'
}

rpc = rpc_cnf[sys.argv[1]]

FA2_ADDRESS = os.environ.get('FA2_ADDRESS')
ALICE_SK = os.environ.get('SANDBOX_ALICE_SK')

alice = Key.from_encoded_key(ALICE_SK)

sandbox = pytezos.using(key=alice, shell=rpc)
ci = sandbox.contract(FA2_ADDRESS)

op = ci.mint({'address': alice.public_key_hash(),
              'amount': 1, 'symbol': 'TOK', 'token_id': 0}).inject()
print(op)
