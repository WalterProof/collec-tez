import os
import sys
from pytezos import pytezos
from pytezos.crypto import Key
from pytezos import Contract


rpc_cnf = {
    'sandbox': 'http://sandbox:20000',
    'testnet': 'https://testnet-tezos.giganode.io'
}

rpc = rpc_cnf[sys.argv[1]]

alice = Key.from_encoded_key(os.environ.get('SANDBOX_ALICE_SK'))
sandbox = pytezos.using(key=alice, shell=rpc)

contract = Contract.from_file('~/contracts/nft-tablespoon.tz')

initial_storage = {
    'tokenOperators': {},
    'token_metadata': {
        0: {
            'decimals': 0,
            'extras': {
                'c_id': 'QmcjPo1qwQqAyDz1AuvAnShvHZx8RFeMQvTxvGroz4Vfib',
            },
            'name': 'Fill Murray',
            'symbol': 'FMU',
            'token_id': 0,
        },
        1: {
            'decimals': 0,
            'extras': {
                'c_id': 'QmTgwCf1vvR9SFmGZ4GARuY2cN5BgU7NLsigp3gyssh91u',
            },
            'name': 'Kitten',
            'symbol': 'KIT',
            'token_id': 1,
        }
    },
    'tokensLedger': {
        0: alice.public_key_hash()
    },
    'u': None
}

script = contract.script(storage=initial_storage)

op = sandbox.origination(script=script).autofill().sign().inject()

while True:
    try:
        opg = sandbox.shell.blocks[-5:].find_operation(op['hash'])
        break
    except StopIteration:
        print('waiting for the operation to be baked...')

print(op)

contract_id = opg['contents'][0]['metadata']['operation_result']['originated_contracts'][0]
print("\n"+contract_id)
