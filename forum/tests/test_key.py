#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao
import unittest

import ecdsa

from forum.blocks.key import Key


class TestBlock(unittest.TestCase):
    def test_create_key(self):
        key = Key()

        sk = ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1)
        pk = sk.get_verifying_key()
        #key.__public_key = pk
        key.set_public_key(pk)
        #key.set_public_key(pk)
        self.assertEqual(pk, key.get_public_key())

        key.set_secret_key(sk)
        self.assertEqual(sk, key.get_secret_key())