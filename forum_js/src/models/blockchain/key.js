import bs58 from 'bs58'
import ECKey from 'ec-key'

class Key {

    constructor(publicKey = null, privateKey = null) {

        this._privateKey = null
        this._publicKey = null
        if (publicKey != null) {
            let pkBuffer = bs58.decode(publicKey).slice(1, bs58.decode(publicKey).length)
            this._publicKey = new ECKey({
                'cty': 'EC',
                'crv': 'P-256',
                'x': pkBuffer.slice(0, pkBuffer.length / 2),
                'y': pkBuffer.slice(pkBuffer.length / 2, pkBuffer.length)
            })
            if (privateKey != null) {
                this._privateKey = new ECKey({
                    'cty': 'EC',
                    'crv': 'P-256',
                    'x': pkBuffer.slice(0, pkBuffer.length / 2),
                    'y': pkBuffer.slice(pkBuffer.length / 2, pkBuffer.length),
                    'd': bs58.decode(privateKey)
                })
            }
        } else {
            this._privateKey = ECKey.createECKey('P-256')
            this._publicKey = this._privateKey.asPublicECKey()
        }
    }

    get publicKey() {
        let pk = this._publicKey
        return bs58.encode(Buffer.concat([Buffer.from([0x04]), pk.x, pk.y]))
    }

    get privateKey() {
        if (this._privateKey != null) {
            return bs58.encode(this._privateKey.d)
        }
        return null
    }

    get canSign() {
        return this._privateKey != null
    }

    sign(data) {
        // input should be Buffer type and return Buffer type signature
        if (!(data instanceof Buffer)) {
            throw 'Data to be signed should be Bytes type'
        }
        if (this.canSign) {
            return this._privateKey.createSign('SHA256').update(data).sign('buffer')
        } else {
            return null
        }
    }

    verify(signature, data) {
        // input should be Buffer type and return Boolean
        if (!(data instanceof Buffer)) {
            throw 'Data to be verified should be Bytes type'
        }
        try{
            return this._publicKey.createVerify('SHA256').update(data).verify(bs58.decode(signature), 'buffer')
        }
        catch(e) {
            console.log(e)
            return false
        }
    }
}

export default Key