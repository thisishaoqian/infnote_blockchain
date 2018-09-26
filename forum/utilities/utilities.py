#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao

import hashlib
import base58
import codecs


import ecdsa

def to_base58(s):
    return base58.b58encode_check(s).decode('ascii')


def from_base58(s):
    return base58.b58decode_check(s)


def generate_userid(vk_byte):
    ripemd160 = hashlib.new('ripemd160')
    ripemd160.update(hashlib.sha256(vk_byte).digest())
    return base58.b58encode_check(ripemd160.digest()).decode('ascii')


def get_data_hash(data):
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def get_signature(data,sk):
    return to_base58(sk.sign(codecs.decode(get_data_hash(data), 'hex')))



    '''
    block.set_version(0)
    self.assertEqual(0, block.get_version())

    block.set_payload(['D7JRxt4Gr5hPKXequ7zYfyuv56xj3sqY6', ])
    self.assertEqual(['D7JRxt4Gr5hPKXequ7zYfyuv56xj3sqY6', ], block.get_payload())

    block.set_prev_hash('GKud7tATKAtSkfVEeLA9PHcTMeJ9K51Uv')
    self.assertEqual('GKud7tATKAtSkfVEeLA9PHcTMeJ9K51Uv', block.get_prev_hash())

    block.set_timestamp(12345678)
    self.assertEqual(12345678, block.get_timestamp())

    block.set_signature('D7JRxt4Gr5hPKXequ7zYfyuv56xj3sqY8')
    self.assertEqual('D7JRxt4Gr5hPKXequ7zYfyuv56xj3sqY8', block.get_signature())

    block.set_height(10)
    self.assertEqual(10, block.get_height())

    block.set_hash_value()
    print(block.get_hash_value())
    self.assertNotEqual('', block.get_hash_value())
    '''