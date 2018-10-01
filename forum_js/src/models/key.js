
import ECDSA from 'ecdsa-secp256r1'
import 

// import {crypto} from 'bitcoinjs-lib'
// import base58 from 'bs58'
import {getDataHash} from 'utilities/utilities'


class Key {

    static getMenbers() {
        return ['secret_key', 'public_key', 'key_id']
    }

    constructor(id) {

        this.privateKey = ECDSA.generateKey(),
        this.publicKey = this.privateKey.asPublic()
        this.id = id
    }

    sign(message) {
        let msgHash = getDataHash(JSON.stringify(message))
        return this.privateKey.sign(msgHash)
    }

    verify(message, signature) {
        let msgHash = getDataHash(JSON.stringify(message))
        return this.publicKey.verify(msgHash, signature)
    }

    getPublicKey(outputFormat = 'COMPRESSED') {
        // only 'COMPRESSED' and 'JWK' are allowed
        if(outputFormat === 'COMPRESSED') {
            return this.privateKey.toCompressedPublicKey()
        }
        else if(outputFormat === 'JWK'){
            return this.publicKey.toJWK()
        }
    }

}

export default Key