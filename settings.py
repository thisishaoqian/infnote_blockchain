import codecs
import ecdsa
from mongoengine import connect
# import mongoengine

# MongoDB connection settings
mongodb_settings = {
    'db': 'BlockchainForum',
    'host': 'mongodb://localhost:27017'
}
mongo_connection = connect(**mongodb_settings)

# Blockchain Server settings
genesistime = 1531482840

server_sk_str = 'a31fc297be78f5eb37d3d87f3194d3fd241a647b9025b59de1c61b566113d428'
server_sk = ecdsa.SigningKey.from_string(codecs.decode(server_sk_str, 'hex'), curve=ecdsa.SECP256k1)

server_vk_str = '27a505f67abd3f61882d7840af25346661fe96582af181351cb2e088d2d2c909ffdbc406be350da657974df0fc3dcbc47cb0ecccc459aed41269dd7b39f6dc59'
server_vk = ecdsa.VerifyingKey.from_string(codecs.decode(server_vk_str, 'hex'), curve=ecdsa.SECP256k1)

#
# # Encryption Key
# cipher_key = 'test' # a proper way to generate and store the cipher key need to be decided
