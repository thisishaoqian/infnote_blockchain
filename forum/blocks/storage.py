#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao
import pymongo
from interface import implements, Interface


class Storage(Interface):

    def save(self):
        pass

    def get_largest_heigth(self):
        pass

    def add_block(self, block):
        pass

    def all_blocks(self):
        pass

    def get_block_by_height(self, height):
        pass

    def get_block_by_hash(self, hash):
        pass


class ChainStorageDatabase(implements(Storage)):

    def __init__(self, chian_id):
        self.myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        self.mydb = self.myclient["blockchainDB"]
        self.blocks = self.mydb["chain"+str(chian_id)]
        # self.blocks.drop()
        # print(self.mydb.collection_names())

    def save(self):
        pass

    def get_largest_heigth(self):
        largest_heigth = self.blocks.find().count()
        print(largest_heigth)
        return largest_heigth

    def add_block(self, block):
        self.blocks.insert_one(block.dict())

    def update_block(self, block):
        dict = block.dict()
        self.blocks.update({'height': dict['height']},
                           {'$set': dict})

    def all_blocks(self):
        list_bloks = []
        for x in self.blocks.find():
            print(x)
            list_bloks.append(x)
        return list_bloks

    def get_block_by_height(self, height):
        query = {"height": height}
        block = self.blocks.find_one(query)
        # print(block)
        return block

    def get_block_by_hash(self, hash):
        query = {"hash_value": hash}
        block = self.blocks.find_one(query)
        # print(block)
        return block


class ChainStorageFile(implements(Storage)):
    def save(self):
        pass

    def get_largest_heigth(self):
        pass

    def add_block(self, block):
        pass

    def all_blocks(self):
        pass

    def get_block_by_height(self, height):
        pass

    def get_block_by_hash(self, hash):
        pass


class KeyStorageDatabase:
    def __init__(self):
        self.myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        self.mydb = self.myclient["keysDB"]
        self.keys = self.mydb["keys"]
        # self.keys.drop()
        # print(self.mydb.collection_names())

    def get_key_num(self):
        key_nums = self.keys.find().count()
        print(key_nums)
        return key_nums

    def get_key(self, chain_id):
        # key_id is chain id
        query = {'key_id': chain_id}
        key = self.keys.find_one(query)
        print(key)
        return key

    def add_key(self, key):
        print(key.dict())
        self.keys.insert_one(key.dict())
