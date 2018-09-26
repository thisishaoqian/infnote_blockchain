#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao
import unittest

import ecdsa

from forum.blocks.payload import Payload
from forum.utilities.utilities import *


class TestPayload(unittest.TestCase):

    def test_is_valid(self):
        genesis_payload = Payload()
        genesis_payload.set_data('Talk is cheap')
        # print(to_base58(sk.to_string()))
        user_sk_string = '2YPag2K7smFqMaU7mwmMpprHP5YuM1wWxtEv25bufuQWmjz5Zj'
        user_vk_string = 'YRkLJ69vmAg8619JfcLD786CCAJ7APZueiDAdgaXwAHyToL' \
                         'fVfemah54VSLHPr3GVNn1KwUMb6Lm4QPtu5b8zMpMeAVi'
        user_vk_byte = from_base58(user_vk_string)
        user_vk = ecdsa.VerifyingKey.from_string(user_vk_byte,
                                                 curve=ecdsa.SECP256k1)
        user_sk_byte = from_base58(user_sk_string)
        user_sk = ecdsa.SigningKey.from_string(user_sk_byte,
                                               curve=ecdsa.SECP256k1)
        genesis_payload.set_public_key(user_vk)
        signature = get_signature(genesis_payload.get_data(), user_sk)
        genesis_payload.set_signature(signature)

        assert genesis_payload.is_valid()

        data_string = 'HKUST'

        data_hash = get_data_hash(data_string)

        sk = ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1)
        vk = sk.get_verifying_key()
        print(to_base58(sk.to_string()))
        print(to_base58(vk.to_string()))
        signature = to_base58(sk.sign(codecs.decode(data_hash, 'hex')))

        assert vk.verify(from_base58(signature),
                         codecs.decode(data_hash, 'hex'))
        payload = Payload()

        payload.set_data(data_string)
        self.assertEqual(payload.get_data(), data_string)

        payload.set_public_key(vk)
        self.assertEqual(payload.get_public_key(), vk)

        payload.set_signature(signature)
        self.assertEqual(payload.get_signature(), signature)
        self.assertEqual(payload.is_valid(), True)
