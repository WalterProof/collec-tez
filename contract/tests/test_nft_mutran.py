import os
import json
from os.path import dirname, join
from unittest import TestCase
from decimal import Decimal

from pytezos.crypto import Key
from pytezos import ContractInterface, pytezos, format_timestamp, MichelsonRuntimeError


def key_from_env(varname):
    account = json.loads(os.environ.get(varname))
    return Key.from_encoded_key(account['sk'])


alice = key_from_env('SANDBOX_ACCOUNT_ALICE')
bob = key_from_env('SANDBOX_ACCOUNT_BOB')

initial_storage = {
    'administrator': alice.public_key_hash(),
    'all_tokens': 0,
    'ledger': {},
    'version_20200615_tzip_a57dfe86_nft_mutran_contract': None,
    'operators': {},
    'paused': False,
    'tokens': {}
}


class NFTMutranTest(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.nft_mutran = ContractInterface.create_from(
            join(dirname(__file__), '../contracts/nft_mutran_contract.tz'))

    def test_mint(self):
        res = self.nft_mutran \
            .mint({'address': alice.public_key_hash(), 'amount': 1, 'symbol': 'TOK', 'token_id': 0}) \
            .result(storage=initial_storage, source=alice.public_key_hash())

        self.assertEqual(
            1, res.big_map_diff['ledger'][alice.public_key_hash(), 0])
