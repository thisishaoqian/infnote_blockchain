from mongoengine import connect


mongodb_settings = {
    'db': 'BlockchainForum',
    'host': 'mongodb://localhost:27017'
}
# mongodb = MongoClient(mongodb_settings)
mongo_connection = connect(**mongodb_settings)

# Encryption Key
cipher_key = 'test' # a proper way to generate and store the cipher key need to be decided

if __name__ == '__main__':

    print('ok')