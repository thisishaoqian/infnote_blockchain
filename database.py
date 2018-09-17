from settings import mongo_connection as mongo
from time import datetime
# from mongoengine import *


# database modules
class PayLoad(mongo.EmbeddedDocument):
    
    data = mongo.StringField(db='data')
    signature = mongo.StringField(db='signature')
    public_key = mongo.StringField(db='public_key')


class Block(mongo.Document):
    
    payload = mongo.ListField(PayLoad, db_field='payload', required=True)
    signature = mongo.StringField(db='signature', required=True)
    prev_hash = mongo.StringField(db='prev_hash', required=True)
    self_hash = mongo.StringField(db='self_hash', required=True)
    time = mongo.DateTimeField(db='time', default=datetime.now, required=True)
    position = mongo.IntField(db='position', required=True)

    meta = {
        'db_alias': "blocks"
    }


class User(mongo.Document):

    user_name = mongo.StringField(db_field='name')
    public_key = mongo.StringField(db_field='public_key', required=True)
    private_key = mongo.StringField(db_field='private_key', required=True)

    meta = {
        'db_alias': 'users'
    }


# database I/O interface:
class BlocksIO():
    pass
