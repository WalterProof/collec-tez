import os
from pytezos import pytezos
from pytezos.crypto import Key
from pytezos import Contract

alice = Key.from_encoded_key(os.environ.get('SANDBOX_ALICE_SK'))
sandbox = pytezos.using(key=alice, shell='http://sandbox:20000')

contract = Contract.from_file('~/contracts/nft_mutran_contract.tz')

initial_storage = {
    'administrator': alice.public_key_hash(),
    'all_tokens': 0,
    'ledger': {},
    'version_20200615_tzip_a57dfe86_nft_mutran_contract': None,
    'operators': {},
    'paused': False,
    'tokens': {}
}

script = contract.script(storage=initial_storage)

op = sandbox.origination(script=script).autofill().sign().inject()

while True:
    try:
        opg = sandbox.shell.blocks[-5:].find_operation(op['hash'])
        break
    except StopIteration:
        print('waiting for the operation to be baked...')

contract_id = opg['contents'][0]['metadata']['operation_result']['originated_contracts'][0]
print("\n"+contract_id)
