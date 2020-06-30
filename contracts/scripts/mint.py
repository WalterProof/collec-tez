import os
from pytezos import pytezos
from pytezos.crypto import Key

alice = Key.from_encoded_key(os.environ.get('SANDBOX_ALICE_SK'))
bob = Key.from_encoded_key(os.environ.get('SANDBOX_BOB_SK'))

c = pytezos.using(
    key=alice, shell='http://sandbox:20000').contract('KT19xx7aT86m2e57Q7yBrpuHqBW36w2NcsgF')
