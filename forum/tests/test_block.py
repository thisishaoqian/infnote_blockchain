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
         block=Block()

         block.set_version(0)
         self.assertEqual(0,block.get_version())

         genesis_payload = Payload()
         genesis_payload.set_data('Talk is cheap')
         # print(to_base58(sk.to_string()))
         user_sk_string = '2YPag2K7smFqMaU7mwmMpprHP5YuM1wWxtEv25bufuQWmjz5Zj'
         user_vk_string = 'YRkLJ69vmAg8619JfcLD786CCAJ7APZueiDAdgaXwAHyToLfVfemah54VSLHPr3GVNn1KwUMb6Lm4QPtu5b8zMpMeAVi'
         user_vk_byte = from_base58(user_vk_string)
         user_vk = ecdsa.VerifyingKey.from_string(user_vk_byte, curve=ecdsa.SECP256k1)
         user_sk_byte = from_base58(user_sk_string)
         user_sk = ecdsa.SigningKey.from_string(user_sk_byte, curve=ecdsa.SECP256k1)
         genesis_payload.set_public_key(user_vk)
         signature = get_signature(genesis_payload.get_data(), user_sk)
         genesis_payload.set_signature(signature)
         assert genesis_payload.is_valid()


         '''
         payload=create_genesis_block()

         block.set_payload([payload,])
         self.assertEqual([payload,], block.get_payload())


         block.set_prev_hash('GKud7tATKAtSkfVEeLA9PHcTMeJ9K51Uv')
         self.assertEqual('GKud7tATKAtSkfVEeLA9PHcTMeJ9K51Uv', block.get_prev_hash())

         block.set_timestamp(12345678)
         self.assertEqual(12345678, block.get_timestamp())

         block.set_signature()
         print(block.get_signature())
         #self.assertEqual('D7JRxt4Gr5hPKXequ7zYfyuv56xj3sqY8', block.get_signature())

         block.set_height(10)
         self.assertEqual(10, block.get_height())

         block.set_hash_value()
         print(block.get_hash_value())
         #self.assertNotEqual('', block.get_hash_value())
         '''

         '''self.payload = payload  # payload store data
         self.prev_hash = prev_hash
         self.timestamp = timestamp
         self.signature = signature
         self.hash_value = hash_value
         self.height = height'''
         '''
         return Block(0,['D7JRxt4Gr5hPKXequ7zYfyuv56xj3sqY6',],'GKud7tATKAtSkfVEeLA9PHcTMeJ9K51Uv',time.time(),\
                       'D7JRxt4Gr5hPKXequ7zYfyuv56xj3sqY6','F9JZR433daa7n3wM1oqabqTZh2tdG67r1',1)
         '''

if __name__ == "__main__":
        unittest.main()

