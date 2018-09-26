#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao
import unittest

import ecdsa

from forum.blocks.block import Block
from forum.blocks.payload import Payload
from forum.utilities.utilities import *


class TestBlock(unittest.TestCase):

    def test_create_block(self):
        block = Block()
        block.version(0)
        self.assertEqual(0, block.get_version())
        genesis_payload = Payload()
        genesis_payload.set_data('Talk is cheap')
        user_sk_string = '2YPag2K7smFqMaU7mwmMpprHP5' \
                         'YuM1wWxtEv25bufuQWmjz5Zj'
        user_vk_string = 'YRkLJ69vmAg8619JfcLD786CCAJ7A' \
                         'PZueiDAdgaXwAHyToLfVfemah54VSLHPr' \
                         '3GVNn1KwUMb6Lm4QPtu5b8zMpMeAVi'
        user_vk_byte = from_base58(user_vk_string)
        user_vk = ecdsa.VerifyingKey.from_string(
            user_vk_byte,
            curve=ecdsa.SECP256k1)
        user_sk_byte = from_base58(user_sk_string)
        user_sk = ecdsa.SigningKey.from_string(
            user_sk_byte,
            curve=ecdsa.SECP256k1)
        genesis_payload.set_public_key(user_vk)
        signature = get_signature(genesis_payload.get_data(), user_sk)
        genesis_payload.set_signature(signature)
        assert genesis_payload.is_valid()


if __name__ == "__main__":
        unittest.main()
