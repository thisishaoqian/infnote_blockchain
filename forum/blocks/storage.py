#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author  : Leo Zhao
import pymongo
from interface import implements, Interface

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["blockchainDB"]
blocks = mydb["private_blocks"]
blocks.drop()
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


class StorageDatabase(implements(Storage)):

    def save(self):
        pass

    def get_largest_heigth(self):
        largest_heigth=blocks.find().count()
        print(largest_heigth)
        return largest_heigth

    def add_block(self, block):
        blocks.insert_one(block.dict())

    def all_blocks(self):
        list_bloks=[]
        for x in blocks.find():
            print(x)
            list_bloks.append(x)
        return list_bloks

    def get_block_by_height(self, height):


        query = {"height": height}
        block = blocks.find_one(query)
        print(block)
        return block

    def get_block_by_hash(self, hash):
        query = {"hash_value": hash}
        block = blocks.find_one(query)
        print(block)
        return block

class StorageFile(implements(Storage)):
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