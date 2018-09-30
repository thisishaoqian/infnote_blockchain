#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao
import time

from forum.utilities.utilities import *
from forum.blocks.block import Block
from forum.blocks.key import Key
from forum.blocks.storage import *
from forum.blocks.blockchain import *


class ChainManager:
    def __init__(self):
        self.keys_storage = KeyStorageDatabase()
        self.key_num = self.keys_storage.get_key_num()
        self.chain_num = self.key_num
        # load keys and chains from db
        # and keep them in memory
        self.keys = {}
        self.chains = {}

    def set_keys_from_db(self):
        """
        :return:
        """
        if (self.key_num > 0):
            for i in range(1, self.key_num + 1):
                self.keys[i] = self.get_key_by_id(i)
        else:
            raise TypeError('no keys in db')

    def set_chains_form_db(self):
        for i in range(1, self.chain_num + 1):
            self.chains[i] = Blockchain(self.keys[i])
            self.chains[i].set_chain_hight_from_db()
            self.chains[i].set_last_block_hash_from_db()

    def get_key_by_id(self, key_id):
        if(key_id > self.key_num):
            raise TypeError("not valid key_id")
            return None
        key_dict = self.keys_storage.get_key(key_id)
        key = Key(key_id)
        key.set_key_by_dict(key_dict)
        return key

    def verify_chain(self, chain_id):
        """
        verify the whole chain if
        chain_id is valid
        :param chain_id:
        :return:
        """
        if(chain_id > self.chain_num):
            raise TypeError("not valid chain_id")
            return False
        blockchain = self.chains[chain_id]
        pre_hash_value = ''
        print('blockchain.height', blockchain.height)
        for i in range(1, blockchain.height+1):
            block_dic = blockchain.get_block_by_height(i)
            if blockchain.is_valid(block_dic) is not True:
                return False
            if(i == 1):
                pre_hash_value = block_dic['hash_value']
            elif(block_dic['prev_hash'] != pre_hash_value):
                return False
            pre_hash_value = block_dic['hash_value']
        return True

    def add_block_to_chain(self, chain_id, data):
        '''
        data should be bytes
        :param chain_id:
        :param data:
        :return:
        '''
        self.chains[chain_id].add_block(data)

    def create_new_chain(self):
        """
        a new chain will be created
        with a genesis_block
        :return:
        """
        self.key_num += 1
        self.chain_num += 1
        key = Key(self.key_num)
        self.keys_storage.add_key(key)
        blockchain = Blockchain(key)
        blockchain.add_genesis_block()
        blockchain.set_last_block_hash_from_db()
        return blockchain


def drop_db():
    """
    clear dirty data in db
    :return:
    """
    for i in range(0, 20):
        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        mydb = myclient["blockchainDB"]
        blocks = mydb["chain"+str(i)]
        blocks.drop()
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["keysDB"]
    keys = mydb["keys"]
    keys.drop()


def init_db():
    """
    create two chains and two pair-key
    each chain contains a block
    the number start from 1
    :return:
    """
    for i in range(1, 3):
        key = Key(i)
        keys_storage = KeyStorageDatabase()
        keys_storage.add_key(key)
        print('print key ', keys_storage.get_key(i))
        blockchain = Blockchain(key)
        blockchain.add_genesis_block()


drop_db()
init_db()
chain_manager = ChainManager()
chain_manager.create_new_chain()
print(chain_manager.chain_num)
chain_manager.set_keys_from_db()
chain_manager.set_chains_form_db()
# data = '  zhaoccai czhaoaw@connnect.ust.hk'
for i in range(1, chain_manager.chain_num + 1):
    chain = chain_manager.chains[i]
    # add block to chain
    for k in range(1, 5):
        print(chain_manager.chains[i].height)
        str_data = str(chain_manager.chains[i].height + 1) + \
            '  zhaoccai czhaoaw@connnect.ust.hk'
        data = bytes(str_data, encoding='utf-8')
        chain_manager.add_block_to_chain(i, data)
        chain_manager.chains[i].get_all_blocks_from_db()
    print(chain_manager.verify_chain(i))
    for j in range(1, chain.height + 1):
        print(chain.get_block_by_height(j))
