#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao


import time
import hashlib
import json
import ecdsa
from forum.utilities.utilities import *


class Key:

    def __init__(self, key_id=1):
        self.__secret_key = ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1)
        self.__public_key = self.__secret_key.get_verifying_key()
        self.__key_id = key_id

    @property
    def key_id(self):
        """
        get id
        """
        return self.__key_id

    @key_id.setter
    def key_id(self, key_id):
        '''
        set chain_id
        :param id:
        :return:
        '''
        self.__key_id = key_id

    @property
    def public_key(self):
        return self.__public_key

    @public_key.setter
    def public_key(self, public_key):
        self.__public_key = public_key

    @property
    def secret_key(self):
        return self.__secret_key

    @secret_key.setter
    def secret_key(self, secret_key):
        self.__secret_key = secret_key

    def dict(self):
        dict_key = {
            'key_id': self.key_id,
            'pk': bytes(to_base58(self.public_key.to_string()), 'utf-8'),
            'sk': bytes(to_base58(self.secret_key.to_string()), 'utf-8'),
                    }
        return dict_key

    def set_key_by_dict(self, dict={}):
        pk_string = from_base58(dict['pk'].decode('utf-8'))
        self.public_key = ecdsa.VerifyingKey.from_string(
            pk_string,
            curve=ecdsa.SECP256k1)
        sk_string = from_base58(dict['sk'].decode('utf-8'))
        self.secret_key = ecdsa.SigningKey.from_string(
            sk_string,
            curve=ecdsa.SECP256k1)
        self.key_id = dict['key_id']
