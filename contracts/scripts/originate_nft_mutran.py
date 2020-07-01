import os
import sys
from pytezos import pytezos
from pytezos import Contract
from config import config

conf = config()
pt = pytezos.using(key=conf['alice'], shell=conf['rpc'])

contract = Contract.from_file('~/contracts/nft_mutran.tz')

initial_storage = {
    'administrator': conf['alice'].public_key_hash(),
    'all_tokens': 0,
    'ledger': {},
    'version_20200615_tzip_a57dfe86_nft_mutran_contract': None,
    'operators': {},
    'paused': False,
    'tokens': {}
}

script = contract.script(storage=initial_storage)

op = pt.origination(script=script).autofill().sign().inject()

while True:
    try:
        opg = pt.shell.blocks[-5:].find_operation(op['hash'])
        break
    except StopIteration:
        print('waiting for the operation to be baked...')

contract_id = opg['contents'][0]['metadata']['operation_result']['originated_contracts'][0]
print("\n"+contract_id)
