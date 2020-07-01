import os
from pytezos import pytezos
from pytezos.crypto import Key

FA2_ADDRESS = os.environ.get('FA2_ADDRESS')
ALICE_SK = os.environ.get('SANDBOX_ALICE_SK')

alice = Key.from_encoded_key(ALICE_SK)

sandbox = pytezos.using(key=alice, shell='http://sandbox:20000')
ci = sandbox.contract(FA2_ADDRESS)

op = ci.mint({'address': alice.public_key_hash(),
              'amount': 1, 'symbol': 'TOK', 'token_id': 0}).inject()
print(op)
