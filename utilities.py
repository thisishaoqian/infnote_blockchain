
from cryptography.fernet import Fernet
from settings import cipher_key
# from mongoengine import EmbeddedDocument
import base64
import base58
import ecdsa
import types
import hashlib


# Methods dealing with keys in blockchain
class KeyMethods(object):

    def __init__(self, key = cipher_key):

        if not isinstance(key, str):
            raise TypeError("Key must be in string type!")

        length = len(key)
        key = key.ljust(32, '0') if length < 32 else key[:32]

        key = bytes(key, encoding="utf8")
        self.__key = base64.urlsafe_b64encode(key)
        self.__fencrypter = Fernet(self.__key)

    def encrypt(self, text):
        text = bytes(text, encoding="utf8")
        return str(self.__fencrypter.encrypt(text), encoding="utf8")

    def decrypt(self, token):
        if not isinstance(token, bytes):
            if not isinstance(token, str):
                raise TypeError("Token must be bytes type or str type!")
            token = bytes(token, encoding="utf8")
        return self.__fencrypter.decrypt(token).decode('utf8')

    @classmethod
    def gen_private_key(cls):
        return ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1)

    @classmethod
    def gen_public_key(cls, public_key):
        """
        :param public_key: ecdsa.SigningKey object
        :return: String
        """
        return cls.base58_encode(public_key.get_verifying_key().to_string())

    @classmethod
    def gen_user_id(cls, public_key):
        """
        :param public_key: ecdsa.SigningKey object
        :return: String
        """
        ripemd160 = hashlib.new('ripemd160')
        ripemd160.update(hashlib.sha256(public_key.get_verifying_key()).digest())
        return base58.b58encode_check(ripemd160.digest()).decode('ascii')

    @classmethod
    def base58_encode(cls, text):
        return base58.b58encode_check(text).decode('ascii')

    @classmethod
    def base58_decode(cls, text):
        return base58.b58decode_check(text)

    @classmethod
    def sign(cls, private_key):
        pass


# serve as base class to arrange serialize function to each subclass
class Serialize(object):

    SERIALIZE_FIELD = []

    def serialize(self, fields=None):

        if fields is None:
            fields = set(self.SERIALIZE_FIELD)

        result = {}
        for field in fields:
            value = getattr(self, field, None)

            if value is None or isinstance(value, (types.MethodType, types.FunctionType)):
                continue

            result[field] = value

        return result

    def get_item(self, key):

        return getattr(self, key, None)