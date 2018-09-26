#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao


import time
import hashlib
import json
import ecdsa
import codecs
import pymongo

from forum.utilities.utilities import *
from forum.blocks.block import Block
from forum.blocks.key import Key
from forum.blocks.storage import *
'''
server_sk_string = 'a31fc297be78f5eb37d3d87f3194d3' \
                   'fd241a647b9025b59de1c61b566113d428'
server_sk = ecdsa.SigningKey.from_string(
    codecs.decode(server_sk_string, 'hex'),
    curve=ecdsa.SECP256k1)
server_vk = server_sk.get_verifying_key()
'''


class Blockchain:

    def __init__(self, key):
        self.__key = key
        # key_id 与 chain_id 一致
        self.__chain_id = key.key_id
        # one chain on storageDatabase
        self.__chain_storage = ChainStorageDatabase(self.__chain_id)
        self.__keys_storage = KeyStorageDatabase()
        self.__height = 0

    @property
    def key(self):
        """
        get id
        """
        return self.__key

    @key.setter
    def key(self, key):
        '''
        set chain_id
        :param id:
        :return:
        '''
        self.__key = key

    @property
    def chain_id(self):
        """
        get id
        """
        return self.__chain_id

    @chain_id.setter
    def chain_id(self, chain_id):
        '''
        set chain_id
        :param id:
        :return:
        '''
        self.__chain_id = chain_id

    @property
    def chain_storage(self):
        """
        get id
        """
        return self.__chain_storage

    @chain_storage.setter
    def chain_storage(self, chain_storage):
        '''
        set chain_id
        :param id:
        :return:
        '''
        self.__chain_storage = chain_storage

    @property
    def key_storage(self):
        """
        get id
        """
        return self.__keys_storage

    @key_storage.setter
    def key_storage(self, keys_storage):
        '''
        set chain_id
        :param id:
        :return:
        '''
        self.__keys_storage = keys_storage

    @property
    def height(self):
        return self.__height

    @height.setter
    def height(self, height):
        self.__height = height

    @property
    def storage(self):
        return self.__chain_storage

    @storage.setter
    def storage(self, chain_storage):
        self.__chain_storage = chain_storage

    def is_valid(self, block_from_db):
        signature_db = block_from_db['signature']
        tmp_list = []
        tmp_list.append(block_from_db['data'].decode('utf-8'))
        tmp_list.append(str(block_from_db['timestamp']))
        tmp_list.append(str(block_from_db['prev_hash']))
        tmp_list.append(str(block_from_db['height']))
        tmp_list.append(str(block_from_db['version']))
        data = str(''.join(tmp_list))
        return self.key.public_key.verify(
           from_base58(signature_db),
           codecs.decode(get_data_hash(data), 'hex'))
        #   return server_vk.verify(
        #    from_base58(signature_db),
        #   codecs.decode(get_data_hash(data), 'hex'))

    def drop_messages(self, block_dict):
        newblock = Block()
        newblock.set_block_by_dict(block_dict)
        newblock.data = bytes('', 'utf-8')
        newblock.set_signature(self.key.secret_key)
        newblock.set_hash_value()
        self.updat_block(newblock)

    # message type is byte
    def add_messages(self, block_dict, message):
        newblock = Block()
        newblock.set_block_by_dict(block_dict)
        data = block_dict['data'].decode('utf-8') + message.decode('utf-8')
        newblock.data = bytes(data, 'utf-8')
        newblock.set_signature(self.key.secret_key)
        newblock.set_hash_value()
        self.updat_block(newblock)

    def add_block(self, block):
        self.__height += 1
        self.__chain_storage.add_block(block)

    def updat_block(self, block):
        self.__chain_storage.update_block(block)

    def get_block_by_height(self, height):
        return self.__chain_storage.get_block_by_height(height)

    def get_block_by_hash(self, hash):
        return self.__chain_storage.get_block_by_hash(hash)

    def create__block(self, version, data, prev_hash, timestamp, height):
        block = Block()
        block.version = version
        block.data = data
        block.prev_hash = prev_hash
        block.timestamp = timestamp
        block.height = height
        block.set_signature(self.key.secret_key)
        block.set_hash_value()
        return block

    def create_genesis_block(self):
        genesis_block = Block()
        genesis_block.version(1)
        genesis_block.data = bytes('Talk is cheap', encoding='utf-8')
        genesis_block.prev_hash = '0'
        genesis_block.timestamp = 1537016400
        genesis_block.height = 1
        genesis_block.set_signature(self.key.secret_key)
        genesis_block.set_hash_value()
        return genesis_block

    def print_block(self, block):
        print('version: ', block.version, '\n')
        print('data: \n', block.data.decode("utf-8"), '\n')
        print('prev_hash: ', block.prev_hash, '\n')
        print('timestamp: ', block.timestamp, '\n')
        print('height: ', block.height, '\n')
        print('signature: ', block.get_signature(), '\n')
        print('hash_value: ', block.get_hash_value(), '\n')


def get_keys_num_from_db():
    keys_storage = KeyStorageDatabase()
    keys_num_db = keys_storage.get_key_num()
    print('keys_num_db:', keys_num_db)
    for k in range(keys_num_db+1, keys_num_db+5):
        key = Key(k)
        keys_storage.add_key(key)
        key_dic = keys_storage.get_key(k)
        print(key_dic)


# add and drop block message
def create_multi_chain():
    # store all the pk and sk
    keys_storage = KeyStorageDatabase()
    keys_num_db = keys_storage.get_key_num()
    print('keys_num_db:', keys_num_db)
    for j in range(1, keys_num_db+1):
        key_dict = keys_storage.get_key(j)
        print('key_dict', key_dict)
        key = Key(j)
        key.set_key_by_dict(key_dict)
        blockchain = Blockchain(key)
        largest_heigth = blockchain.storage.get_largest_heigth()
        # print('largest_heigth', largest_heigth)
        blockchain.height = largest_heigth
        pre_hash_value = ''
        genesis_block = Block()
        dic_db_genesis_block = {}
        if (largest_heigth == 0):
            genesis_block = blockchain.create_genesis_block()
            blockchain.add_block(genesis_block)
            pre_hash_value = genesis_block.get_hash_value()
        else:
            dic_db_genesis_block = blockchain.storage.get_block_by_height(1)
            genesis_block.set_block_by_dict(dic_db_genesis_block)
            pre_hash_value = genesis_block.get_hash_value()
            blockchain.print_block(genesis_block)
        print(blockchain.is_valid(dic_db_genesis_block))

        for i in range(10):
            data = str(blockchain.height + 1) + \
                   '  zhaoccai czhaoaw@connnect.ust.hk'
            block = blockchain.create__block(
                1,
                bytes(data, encoding='utf-8'),
                pre_hash_value,
                int(time.time()),
                blockchain.height + 1)
            blockchain.add_block(block)
            pre_hash_value = block.get_hash_value()
        print('get by hash')
        block_from_db3 = blockchain.storage.get_block_by_height(3)
        block_from_db4 = blockchain.storage.get_block_by_height(4)
        assert(blockchain.is_valid(block_from_db3))
        assert(blockchain.is_valid(block_from_db4))
        # drop message from block
        blockchain.drop_messages(block_from_db4)
        block_from_db4 = blockchain.storage.get_block_by_height(4)
        # add message to block
        blockchain.add_messages(
            block_from_db3,
            bytes('add_message test', 'utf-8'))
        # verified
        block_from_db3 = blockchain.storage.get_block_by_height(3)
        block_from_db = blockchain.storage.get_block_by_hash(
            genesis_block.get_hash_value())
        print('after_db', genesis_block.get_hash_value())
        assert(blockchain.is_valid(block_from_db3))
        assert(blockchain.is_valid(block_from_db4))
        blockchain.storage.all_blocks()


# get_keys_num_from_db()
create_multi_chain()
