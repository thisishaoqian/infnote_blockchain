# Infnote Blockchain in JavaScript



#### Problems Remained：

* 用`static`代替了python class中所有`@staticmethod`和`@classmethod`声明，It works, but I am not sure weather it follows the standards.
* 缺少各种类型检查，以及对创建的对象的检查
* JS 支持 async 的方法，目前没用上
* 许多处判断为空后直接返回 null， 没有raise error，或输出log
* 需要注意传输的json，key用下划线间隔命名，js代码中用驼峰命名法命名，调用时不够注意，可能出问题
* 有时候需要调用某个函数的时候是直接创建临时类实例调用方法 `PeerManager().add_peer(peer)`，这样效率可能不高。



#### What have been done this week:

*2018 / 10 / 18*

***

* Reorganize infnote blockchain part in Javascript

  * JS codes basically are trasfered from latest python codes, some functions working for full-node could be removed then.
  * For dependencies, only `bs58`, `ec-key`, `bitcoinjs-lib` are actually used,  the rest of related packages are for trying.
  * Some details can be discussed to improve performance.
    * How to get block by hash
    * How to migrate 
    * Get block from height to height
    * ...

* P2P part has not finished yet

  * It seems a bit complicated to implement P2P on browser intuitively, because browser is not easy to open a port for a peer. 

  * `ws` may be not working for browser, native `websocket`, `isomorphic-ws` are recommended, but need testing.

  * Is server needed to act as an intermediary.


*2018 / 10 / 11*

***

##### Finish the first version of Infnote Blockchain part in JavaScript:

* Copied most functions from python platform to javascript

* Tried several encryption libs following `Primes256v1`/`Secp256r1`/`Nist p-256`, finnally chose `EC-Key`.

  <https://github.com/relocately/ec-key>

* Use `uuid()` to generate uuid to combine and store blockchain into browser local storage.

  <https://www.npmjs.com/package/uuid>

#####Problems need to be discussed:

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
    
        return new Key(keyInDict['id'], publicKey, privateKey)
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

