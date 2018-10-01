#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao


import time

from forum.utilities.utilities import *
from forum.blocks.block import Block
from forum.blocks.key import Key
from forum.blocks.storage import *


class Blockchain:

    def __init__(self, key):
        self.key = key
        self.chain_id = key.key_id
        # one chain on storageDatabase
        self.chain_storage = ChainStorageDatabase(self.chain_id)
        self.keys_storage = KeyStorageDatabase()
        self.height = 0
        self.last_block_hash = ''
        # to avoid passing peremeters
        # just for temporarily store the block
        self.block = Block()
        self.block_dic = {}

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
    '''
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
    '''
    def add_block(self, data):
        self.create_block(data)
        self.last_block_hash = self.block.hash_value
        self.chain_storage.add_block(self.block)

    def get_block_by_height(self, height):
        return self.chain_storage.get_block_by_height(height)

    def get_block_by_hash(self, hash):
        return self.chain_storage.get_block_by_hash(hash)

    def set_last_block_hash_from_db(self):
        block_dic = self.chain_storage.get_block_by_height(self.height)
        self.last_block_hash = block_dic['hash_value']

    def set_chain_hight_from_db(self):
        self.height = self.chain_storage.get_largest_heigth()

    def get_all_blocks_from_db(self):
        self.chain_storage.all_blocks()

    def create_block(self, data):
        """
        data is bytes
        just set the block
        :param data:
        :return:
        """
        self.block.version = 1
        self.block.data = data
        self.block.prev_hash = self.last_block_hash
        self.block.timestamp = int(time.time())
        self.height += 1
        self.block.height = self.height
        self.block.set_signature(self.key.secret_key)
        self.block.set_hash_value()
        self.block_dic = self.block.dict()

    def add_genesis_block(self):
        genesis_block = Block()
        genesis_block.version = 1
        genesis_block.data = bytes(
            'chain_id: ' +
            str(self.chain_id) +
            ' Talk is cheap', encoding='utf-8')
        genesis_block.prev_hash = '0'
        genesis_block.timestamp = 1537016400
        genesis_block.height = 1
        genesis_block.set_signature(self.key.secret_key)
        genesis_block.set_hash_value()
        self.height += 1
        self.last_block_hash = genesis_block.hash_value
        self.chain_storage.add_block(genesis_block)
        return genesis_block

    def print_block(self, block):
        print('version: ', block.version, '\n')
        print('data: \n', block.data.decode("utf-8"), '\n')
        print('prev_hash: ', block.prev_hash, '\n')
        print('timestamp: ', block.timestamp, '\n')
        print('height: ', block.height, '\n')
        print('signature: ', block.signature, '\n')
        print('hash_value: ', block.hash_value, '\n')
