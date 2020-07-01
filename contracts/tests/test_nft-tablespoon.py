import os
import json
from os.path import dirname, join
from unittest import TestCase
from decimal import Decimal

from pytezos.crypto import Key
from pytezos import ContractInterface, pytezos, format_timestamp, MichelsonRuntimeError


alice = Key.from_encoded_key(os.environ.get('SANDBOX_ALICE_SK'))
bob = Key.from_encoded_key(os.environ.get('SANDBOX_BOB_SK'))


class NFTTableSpoon(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.nft = ContractInterface.create_from(
            join(dirname(__file__), '../nft-tablespoon.tz'))

    def test_transfer(self):
        res = self.nft \
            .transfer([
                {'from_': alice.public_key_hash(), 'txs': [
                    {
                        'to_': bob.public_key_hash(),
                        'token_id': 0,
                        'amount': 1
                    }
                ]}
            ]).result(storage={
                'tokenOperators': {
                },
                'token_metadata': {},
                'tokensLedger': {
                    0: alice.public_key_hash()
                },
                'u': None
            },
                source=alice.public_key_hash()
            )

        self.assertEqual({0: bob.public_key_hash()},
                         res.big_map_diff['tokensLedger'])

