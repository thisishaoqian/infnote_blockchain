
// import ECDSA from 'ecdsa-secp256r1'
import ECKey from 'ec-key'
import {toBase58, fromBase58, getDataHash} from './utilities/utilities'


class Key {

    static getMenbers() {
        return ['secret_key', 'public_key', 'id']
    }

    constructor(id, privateKey=null, publicKey=null) {
        if(privateKey&&publicKey){
            // maybe types checking is needed here
            this.privateKey = privateKey
            this.publicKey = publicKey
        }
        else{
            // this.privateKey = ECDSA.generateKey(),
            // this.publicKey = this.privateKey.asPublic()
            this.privateKey = ECKey.createECKey('P-256')
            this.publicKey = this.privateKey.asPublicECKey()
        }
        this.id = id
    }

    serializie() {
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

        // let privateKey = ECDSA.fromJWK(JSON.parse(fromBase58(keyInDict['privateKey'])))
        // let publicKey = ECDSA.fromJWK(JSON.parse(fromBase58(keyInDict['publicKey'])))
        let privateKey = new ECKey(fromBase58(keyInDict['privateKey']), 'pkcs8')
        let publicKey = new ECKey(fromBase58(keyInDict['publicKey']), 'spki')
        
        return new Key(keyInDict['id'], privateKey, publicKey)
    }

    sign(message) {
        // let msgHash = getDataHash(JSON.stringify(message))
        // return toBase58(this.privateKey.sign(msgHash))
        if(typeof message !== 'string'){
            message = JSON.stringify(message)
        }
        let signature = this.privateKey.createSign('SHA256').update(message).sign('base64') //cannot find base58 in its library
        return toBase58(signature)
    }

    verify(message, signature) {
        // let msgHash = getDataHash(JSON.stringify(message))
        // return this.publicKey.verify(msgHash, fromBase58(signature))
        if(typeof message !== 'string'){
            message = JSON.stringify(message)
        }
        signature = fromBase58(signature)
        return this.publicKey.createVerify('SHA256').update(message).verify(signature, 'base64')
    }

    getPublicKey() {
        return this.publicKey.toString('spki')
    }
}

export default Key