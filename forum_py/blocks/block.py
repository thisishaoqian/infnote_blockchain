#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao


import time
import hashlib
import json
import ecdsa
from forum.utilities.utilities import *


class Block:

    def __init__(self, version=0, data='', prev_hash='',
                 timestamp=0, signature='', hash_value='', height=0):
        self.version = version
        self.data = data
        self.prev_hash = prev_hash
        self.timestamp = timestamp
        self.signature = signature
        self.hash_value = hash_value
        self.height = height

    def get_signature_string(self):
        tmp_list = []
        tmp_list.append(self.data.decode('utf-8'))
        tmp_list.append(str(self.timestamp))
        tmp_list.append(str(self.prev_hash))
        tmp_list.append(str(self.height))
        tmp_list.append(str(self.version))
        return str(''.join(tmp_list))

    def get_hash_value_string(self):

        return str(self.get_signature_string())

    def set_signature(self, sk):

        self.signature = get_signature(self.get_signature_string(), sk)

    def set_hash_value(self):
        self.hash_value = get_data_hash(str(self.get_hash_value_string()))

    def dict(self):
        dict_block = {
            'height': self.height,
            'timestamp': self.timestamp,
            'data': self.data,
            'prev_hash': self.prev_hash,
            'signature': self.signature,
            'hash_value': self.hash_value,
            'version': self.version,
                    }
        return dict_block

    def set_block_by_dict(self, dict_block):
        self.height = dict_block['height']
        self.timestamp = dict_block['timestamp']
        self.data = dict_block['data']
        self.prev_hash = dict_block['prev_hash']
        self.signature = dict_block['signature']
        self.hash_value = dict_block['hash_value']
        self.version = dict_block['version']
