import os
import sys
from pytezos import pytezos
from config import config

conf = config()
pt = pytezos.using(key=conf['alice'], shell=conf['rpc'])

FA2_ADDRESS = os.environ.get('FA2_ADDRESS')
ci = pt.contract(FA2_ADDRESS)

op = ci.mint({'address': conf['alice'].public_key_hash(),
              'amount': 1, 'symbol': 'TOK', 'token_id': 0}).inject()
print(op)
