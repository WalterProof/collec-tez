import os
import json
from os.path import dirname, join
from unittest import TestCase
from decimal import Decimal

from pytezos.crypto import Key
from pytezos import ContractInterface, pytezos, format_timestamp, MichelsonRuntimeError


alice = Key.from_encoded_key(os.environ.get('SANDBOX_ALICE_SK'))
bob = Key.from_encoded_key(os.environ.get('SANDBOX_BOB_SK'))

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
            join(dirname(__file__), '../nft_mutran.tz'))

    def test_mint(self):
        res = self.nft_mutran \
            .mint({'address': alice.public_key_hash(), 'amount': 1, 'symbol': 'TOK', 'token_id': 0}) \
            .result(storage=initial_storage, source=alice.public_key_hash())

        self.assertEqual(
            1, res.big_map_diff['ledger'][alice.public_key_hash(), 0])

    # def test_transfer(self):
    #     res = self.nft_mutran \
    #         .transfer([
    #             {'from_': alice.public_key_hash(), 'txs': [
    #                 {
    #                     'to': bob.public_key_hash(),
    #                     'token_id': 0,
    #                     'amount': 1
    #                 }
    #             ]}
    #         ]).result(storage={
    #             **initial_storage,
    #             'all_tokens': 1,
    #             'ledger': {
    #                 (alice.public_key_hash(), 0): 1
    #             },
    #             'tokens': {
    #                 0: {
    #                     'token_id': 0,
    #                     'symbol': 'TOK',
    #                     'name': '',
    #                     'decimals': 0,
    #                     'extras': {},
    #                     'total_supply': 1
    #                 }
    #             }
    #         },
    #             source=alice.public_key_hash()
    #         )

        # self.assertEqual(
        #     1, res.big_map_diff['ledger'][bob.public_key_hash(), 0])

