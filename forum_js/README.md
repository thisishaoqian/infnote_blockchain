# Infnote Blockchain in JavaScript

#### What have been done this week:

##### Finish the first version of Infnote Blockchain part in JavaScript:

* Copied most functions from python platform to javascript

* Tried several encryption libs following `Primes256v1`/`Secp256r1`/`Nist p-256`, finnally chose `EC-Key`.

  <https://github.com/relocately/ec-key>

* Use `uuid()` to generate uuid to combine and store blockchain into browser local storage.

  <https://www.npmjs.com/package/uuid>

#### Problems need to be discussed:

* Coherence among three platforms

  * Naming standards in JSON package
  * Timestamp format

  * keys:

    ```javascript
    // JavaScript
    serialize() {
        let keyInJson = {}
        keyInJson['privateKey'] = toBase58(this.privateKey.toString('pkcs8'))
        keyInJson['publicKey'] = toBase58(this.publicKey.toString('spki'))
        keyInJson['id'] = this.id
    
        return keyInJson
    }
    
    static deserialize(keyInJson) {
        let keyInDict = keyInJson
        if(typeof keyInJson === 'string')
            keyInDict = JSON.parse(keyInJson)
    
        let privateKey = new ECKey(fromBase58(keyInDict['privateKey']), 'pkcs8')
        let publicKey = new ECKey(fromBase58(keyInDict['publicKey']), 'spki')
    
        return new Key(keyInDict['id'], privateKey, publicKey)
    }
    ```

    ```python
    # Python
    def dict(self):
        dict_key = {
            'key_id': self.key_id,
            'pk': bytes(to_base58(self.public_key.to_string()), 'utf-8'),
            'sk': bytes(to_base58(self.secret_key.to_string()), 'utf-8'),
        }
        return dict_key
    
    def set_key_by_dict(self, dict={}):
        pk_string = from_base58(dict['pk'].decode('utf-8'))
        self.public_key = ecdsa.VerifyingKey.from_string(
            pk_string,
            curve=ecdsa.SECP256k1)
        sk_string = from_base58(dict['sk'].decode('utf-8'))
        self.secret_key = ecdsa.SigningKey.from_string(
            sk_string,
            curve=ecdsa.SECP256k1)
        self.key_id = dict['key_id']
    ```

  * Signature

    ```javascript
    // JavaScript
    function getDataHash(dataString) {
        if(typeof dataString !== 'string') {
            dataString = JSON.stringify(dataString)
        }
        let dataHashBuffer = crypto.sha256(Buffer.from(dataString, 'utf8'))
        let dataHash = bigi.fromBuffer(dataHashBuffer)
        return dataHash
    }
    sign(message) {
        if(typeof message !== 'string'){
            message = getDataHash(message)
        }
        let signature = this.privateKey.createSign('SHA256')
        					.update(message)
        					.sign('base64') //cannot find base58 in its package
        return toBase58(signature)
    }
    ```

    ```python
    # Python
    def get_data_hash(data):
        return hashlib.sha256(data.encode('utf-8')).hexdigest()
    def get_signature(data, sk):
        return to_base58(sk.sign(codecs.decode(get_data_hash(data), 'hex')))
    ```

* Strategy on how to store Chains and Keys into local storage

  * Key-Value pairs 
  * Private key & public key

* Some other points ......

