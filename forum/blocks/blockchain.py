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
from forum.blocks.payload import Payload
from forum.blocks.key import Key
from forum.blocks.storage import *

server_sk_string = 'a31fc297be78f5eb37d3d87f3194d3fd241a647b9025b59de1c61b566113d428'
server_sk = ecdsa.SigningKey.from_string(codecs.decode(server_sk_string, 'hex'), curve=ecdsa.SECP256k1)
server_vk=server_sk.get_verifying_key()

class Blockchain:


    def __init__(self, key = Key(server_vk,server_sk)):


        self.__key = key
        self.__storage = StorageDatabase()
        self.__height = 0

    def set_height(self, height):
        self.__height = height

    def get_height(self):
        return self.__height

    def get_storage(self):

        return self.__storage

    def is_valid(self, block_from_db):
        signature_db=block_from_db['signature']
        list=[]
        list.append(block_from_db['data'])
        list.append(str(block_from_db['timestamp']))
        list.append(str(block_from_db['prev_hash']))
        list.append(str(block_from_db['height']))
        list.append(str(block_from_db['version']))
        data=str(''.join(list))
        return server_vk.verify(from_base58(signature_db), codecs.decode(get_data_hash(data), 'hex'))

    def add_block(self, block):
        self.__height += 1
        self.__storage.add_block(block)

    def get_block_by_height(self, height):
        return self.__storage.get_block_by_height(height)

    def get_block_by_hash(self, hash):
        return self.__storage.get_block_by_hash(hash)


def create_payload(data, signature, publick_key):
    payload = Payload()
    payload.set_data(data)
    # print(to_base58(sk.to_string()))
    #user_sk_string = '2YPag2K7smFqMaU7mwmMpprHP5YuM1wWxtEv25bufuQWmjz5Zj'
    #user_vk_string = 'YRkLJ69vmAg8619JfcLD786CCAJ7APZueiDAdgaXwAHyToLfVfemah54VSLHPr3GVNn1KwUMb6Lm4QPtu5b8zMpMeAVi'
    #user_vk_byte = from_base58(user_vk_string)
    #user_vk = ecdsa.VerifyingKey.from_string(user_vk_byte, curve=ecdsa.SECP256k1)
    #user_sk_byte = from_base58(user_sk_string)
    #user_sk = ecdsa.SigningKey.from_string(user_sk_byte, curve=ecdsa.SECP256k1)
    payload.set_public_key(publick_key)
    payload.set_signature(signature)
    assert payload.is_valid()
    return payload

def create__block(version, payload, prev_hash, timestamp, height):
    block = Block()
    block.set_version(version)
    block.set_payload([payload, ])
    block.set_prev_hash(prev_hash)
    block.set_timestamp(timestamp)
    block.set_height(height)
    block.set_signature()
    block.set_hash_value()
    return block


def create_genesis_payload():
        genesis_payload = Payload()
        genesis_payload.set_data('Talk is cheap')
        # print(to_base58(sk.to_string()))
        user_sk_string = '2YPag2K7smFqMaU7mwmMpprHP5YuM1wWxtEv25bufuQWmjz5Zj'
        user_vk_string = 'YRkLJ69vmAg8619JfcLD786CCAJ7APZueiDAdgaXwAHyToLfVfemah54VSLHPr3GVNn1KwUMb6Lm4QPtu5b8zMpMeAVi'
        user_vk_byte = from_base58(user_vk_string)
        user_vk = ecdsa.VerifyingKey.from_string(user_vk_byte, curve=ecdsa.SECP256k1)
        user_sk_byte = from_base58(user_sk_string)
        user_sk = ecdsa.SigningKey.from_string(user_sk_byte, curve=ecdsa.SECP256k1)
        genesis_payload.set_public_key(user_vk)
        signature = get_signature(genesis_payload.get_data(), user_sk)
        genesis_payload.set_signature(signature)
        assert genesis_payload.is_valid()
        return genesis_payload


def create_genesis_block():
    genesis_block = Block()
    genesis_block.set_version(1)
    genesis_payload = create_genesis_payload()
    genesis_block.set_payload([genesis_payload, ])
    genesis_block.set_prev_hash('0')
    genesis_block.set_timestamp(1537016400)
    genesis_block.set_height(1)
    genesis_block.set_signature()
    genesis_block.set_hash_value()
    return genesis_block

def print_block(block):
    print('version: ', block.get_version(),'\n')
    print('payload: \n')
    list_payload= block.get_payload_string()
    print(list_payload)
    #it = iter(list_payload)
    # 循环
    '''while True:
        try:
            payload = next(it)
            print('  public_key: ', payload.get_publick_key())
            print('  signature: ', payload.get_signature())
            print('  signature: ', payload.get_data())
        except StopIteration:
            break
    '''
    #for i in playload_list:
    #    print('  public_key: ',i.get_publick_key())
    #    print('  signature: ', i.get_signature())
    #    print('  signature: ', i.get_data())
    print('prev_hash: ',block.get_prev_hash(), '\n')
    print('timestamp: ',block.get_timestamp(), '\n')
    print('height: ',block.get_height(), '\n')
    print('signature: ',block.get_signature(), '\n')
    print('hash_value: ',block.get_hash_value(), '\n')





blockchain = Blockchain()
largest_heigth = blockchain.get_storage().get_largest_heigth()
blockchain.set_height(largest_heigth)
genesis_block = Block()
if (largest_heigth == 0) :
    genesis_block = create_genesis_block()
    blockchain.add_block(genesis_block)
else:
    genesis_block = blockchain.get_storage().get_block_by_height(1)

#print_block(genesis_block)
pre_hash_value = genesis_block.get_hash_value()
print('first db ',pre_hash_value)
for i in range(10):
    key= Key()
    key.set_key_pairs_by_generate()
    data=str(blockchain.get_height()+1)+'  zhaoccai czhaoaw@connnect.ust.hk'
    #tmp_data = ['username', 'zc', 'email', 'czhaoaw@connect.ust.hk', ]
    #data = ''.join(tmp_data)
    #data = json.dumps(tmp_data, sort_keys=True)
    payload = create_payload(data,get_signature(data,key.get_secret_key()), key.get_public_key())
    block = create__block(1,payload,pre_hash_value,int(time.time()),blockchain.get_height()+1 )
    blockchain.add_block(block)
    pre_hash_value = block.get_hash_value()

blockchain.get_storage().all_blocks()
print('get by hash')
block_from_db1 =blockchain.get_storage().get_block_by_height(1)
block_from_db2 =blockchain.get_storage().get_block_by_height(2)
block_from_db = blockchain.get_storage().get_block_by_hash(genesis_block.get_hash_value())
print('after_db', genesis_block.get_hash_value())
print(blockchain.is_valid(block_from_db))
print(blockchain.is_valid(block_from_db2))

#print_block(block)


#blocks.insert_one(genesis_block.dict())
#blocks.insert_one(block.dict())
#print(mydb.collection_names())
#for x in blocks.find():
#    print(x)
#blockchain = Blockchain(genesis_block)








