#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao


import time
import hashlib
import json
import ecdsa
from forum.utilities.utilities import *
from .payload import Payload


class Block:
    '''
    __version = 0
    payload = []
    prev_hash = ''
    timestamp = int(time.time())
    signature = ''
    hash_value = ''
    height=0

    '''

    def __init__(self, version=0, data='', prev_hash='',
                 timestamp=0, signature='', hash_value='', height=0):
        self.__version = version
        self.__data = data
        self.__prev_hash = prev_hash
        self.__timestamp = timestamp
        self.__signature = signature
        self.__hash_value = hash_value
        self.__height = height

    @property
    def version(self):
        return self.__version

    @version.setter
    def version(self, version):

        self.__version = version

    @property
    def data(self):
        return self.__data

    @data.setter
    def data(self, data):
        self.__data = data

    @property
    def prev_hash(self):
        return self.__prev_hash

    @prev_hash.setter
    def prev_hash(self, prev_hash):
        self.__prev_hash = prev_hash

    @property
    def timestamp(self):
        return self.__timestamp

    @timestamp.setter
    def timestamp(self, timestamp):
        self.__timestamp = timestamp

    def get_signature_string(self):
        tmp_list = []
        tmp_list.append(self.data.decode('utf-8'))
        tmp_list.append(str(self.timestamp))
        tmp_list.append(str(self.prev_hash))
        tmp_list.append(str(self.height))
        tmp_list.append(str(self.version))
        return str(''.join(tmp_list))

    @property
    def height(self):
        return self.__height

    @height.setter
    def height(self, height):
        self.__height = height

    def get_hash_value_string(self):

        return str(self.get_signature_string())

    def set_signature(self, sk):

        self.__signature = get_signature(self.get_signature_string(), sk)

    def set_hash_value(self):
        self.__hash_value = get_data_hash(str(self.get_hash_value_string()))

    def get_signature(self):
        return self.__signature

    def get_hash_value(self):
        return self.__hash_value

    def dict(self):
        dict_block = {
            'height': self.height,
            'timestamp': self.timestamp,
            'data': self.data,
            'prev_hash': self.prev_hash,
            'signature': self.get_signature(),
            'hash_value': self.get_hash_value(),
            'version': self.version,
                    }
        return dict_block

    def set_block_by_dict(self, dict_block):
        self.__height = dict_block['height']
        self.__timestamp = dict_block['timestamp']
        self.__data = dict_block['data']
        self.__prev_hash = dict_block['prev_hash']
        self.__signature = dict_block['signature']
        self.__hash_value = dict_block['hash_value']
        self.__version = dict_block['version']
