
from cryptography.fernet import Fernet
from settings import cipher_key
import base64

# Using this class to enctypt those public key and private key stored in database
# The philosophy of generating cipher key should be considered
class Enctyption(object):

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
        return str(self.__fencrypter.encrypt(text), encoding = "utf8")

    def decrypt(self, token):
        if not isinstance(token, bytes):
            if not isinstance(token, str):
                raise TypeError("Token must be bytes type or str type!")
            token = bytes(token, encoding="utf8")
        return self.__fencrypter.decrypt(token).decode('utf8')


# if __name__ == '__main__':

#     e = Enctyption()
#     print(e.encrypt('111'))