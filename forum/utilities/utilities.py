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


def get_signature(data, sk):
    return to_base58(sk.sign(codecs.decode(get_data_hash(data), 'hex')))
