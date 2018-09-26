from blockchain.database import UsersIO, BlocksIO
from utilities import Serialize, KeyMethods
import time
import json
import hashlib
import codecs


class Key(Serialize):

    SERIALIZE_FIELD = {'public_key', 'private_key'}

    def __init__(self):
        self.__private_key = KeyMethods.gen_private_key()
        self._public_key = KeyMethods.gen_public_key(self.__private_key)

    @property
    def public_key(self):
        return self._public_key

    # @property
    # def private_key(self):
    #     return self.__private_key

    def verify(self, signature, data_hash):
        """
        :return: Boolean
        """
        return self.public_key.verify

    def sign(self):
        pass


class PayLoad(Serialize):

    SERIALIZE_FIELD = {'data', 'signature', 'public_key'}

    def __init__(self, data, ):
        self.data = None
        self.signature = None
        self.public_key = None

    def is_valid(self):
        """
        :return: Boolean
        """
        pass


class Block(Serialize):

    SERIALIZE_FIELD = {'payloads', 'prev_hash', 'time', 'signature', 'position'}

    def __init__(self, payloads, height, prev_hash, timestamp=time.time()):
        """
        :param payload:
        :param height:
        :param signature:
        :param prev_hash:
        :param timestamp:
        """
        self.payloads = payloads
        self.position = height
        self.prev_hash = prev_hash
        self.time = timestamp
        self.signature = None
        self.curr_hash = None
        self.version = 0

    def hash(self, without_sig=False):

        block_dict = self.serialize(self.SERIALIZE_FIELD-{'signature'}) if without_sig else self.serialize()
        block_json = json.dumps(block_dict, sort_keys=True)
        return hashlib.sha256(block_json.encode('utf-8')).hexdigest()

    def sig_block(self, private_key):
        setattr(self, 'signature', KeyMethods.base58_encode(private_key.sign(codecs.decode(self.hash(), 'hex'))))


class User(Serialize):

    def __init__(self, username, email):
        self.private_key = KeyMethods.gen_private_key()
        self.public_key = KeyMethods.gen_public_key(self.private_key)
        self.id = KeyMethods.gen_user_id(self.private_key)
        self.user_info = {'user_name': username,
                          'email': email,
                          'id': self.id,
                          'public_key': self.public_key,
                          'type': 1
                          }


class BlockChain(Serialize):

    def __init__(self):

        self.key = None  # current Key Object
        self.height = None
