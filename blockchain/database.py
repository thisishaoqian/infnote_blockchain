
from settings import mongo_connection as mongo
from utilities import Serialize
from mongoengine import *
from mongoengine.queryset.visitor import Q
import time


# database models

# class PayLoad(EmbeddedDocument):
#
#     data = StringField(db='data')
#     signature = StringField(db='signature')
#     public_key = StringField(db='public_key')


class Blocks(Document):
    
    payload = ListField(DictField(), db_field='payload', required=True)
    signature = StringField(db='signature', required=True)
    prev_hash = StringField(db='prev_hash', required=True)
    curr_hash = StringField(db='curr_hash', required=True)
    time = StringField(db='time', default=time.time(), required=True)
    position = IntField(db='position', required=True)


class Users(Document):

    user_name = StringField(db_field='name')
    public_key =StringField(db_field='public_key', required=True, unique=True)
    private_key =StringField(db_field='private_key', required=True, unique=True)


# database I/O interface:
class BaseIO(Serialize):

    SERIALIZE_FIELD = []    # fields to be serialized
    NE_FIELDS = []          # necessary fileds: required fields in models
    MODEL = None

    def insert(self, item_info):
        
        return self.MODEL(**item_info).save()
    
    def __construct_conditions(self, conditions, pre_key=None, query=None):
        for key, value in conditions.items():
            if pre_key:
                key = pre_key + '__' + key
            if isinstance(value, list):
                key = key + '__in'
            if query:
                query = query & Q(**{key: value})
            else:
                query = Q(**{key: value})
        return query

    # single query
    def search(self, conditions, serialize=False):

        query_conditions = self.__construct_conditions(conditions)
        query_result = self.MODEL.objects(query_conditions).first()

        return query_result if serialize is False else self.serialize(query_result)

    def delete(self, conditions):

        item = self.query(conditions)
        if item:
            item.delete()
        else:
            raise Exception(f'{self.MODEL.__name__} object does not exist.')


class BlocksIO(BaseIO):

    MODEL = Blocks
    NE_FIELDS = {'payload', 'signature', 'prev_hash', 'curr_hash', 'time', 'position'}
    SERIALIZE_FIELD = {'payload', 'signature', 'prev_hash', 'curr_hash', 'time', 'position'}
    

class UsersIO(BaseIO):

    MODEL = Users
    NE_FIELDS = {'public_key', 'private_key'}
    SERIALIZE_FIELD = {'user_name', 'public_key', 'private_key'}
    
