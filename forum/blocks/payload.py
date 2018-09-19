#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao

from forum.utilities.utilities import *

class Payload:

    def __init__(self, data = [], signature = '',  public_key = ''):
        self.__data = data
        self.__signature = signature
        self.__public_key = public_key

    def set_data(self, data):
        self.__data = data

    def set_signature(self, signature):
        self.__signature = signature

    def set_public_key(self, public_key):
        self.__public_key = public_key

    def get_data(self):
        return self.__data

    def get_signature(self):
        return self.__signature

    def get_public_key(self):
        return self.__public_key

    def get_public_key_string_to_base58(self):
        return to_base58(self.__public_key.to_string())

    def is_valid(self):
        return self.__public_key.verify(from_base58(self.__signature), codecs.decode(get_data_hash(self.__data), 'hex'))
