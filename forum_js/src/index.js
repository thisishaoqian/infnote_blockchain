// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// import Key from 'models/key'
import ECDSA from 'ecdsa-secp256r1'

// const ECDSA = require('ecdsa-secp256r1')
    
class Key extends React.Component {

    constructor(props) {
        super(props)
        this.privateKey = ECDSA.generateKey()
        this.publicKey = this.privateKey.asPublic()
    }

    parsePrivateKey() {
        let keyDict = this.privateKey.toJWK() // key object
        this.publicKey1 = keyDict.x
        this.publicKey2 = keyDict.y
        return JSON.stringify(keyDict)
    }

    sign(messege) {
        let msg = JSON.stringify(messege)
        return this.privateKey.sign(msg)
    }

    verify(signature, message) {
        let msg = JSON.stringify(message)
        return this.publicKey.verify(msg, signature)
    }
}
  
// ========================================

let mykey = new Key()
let pk = mykey.parsePrivateKey()
let mess = {key:'fork'}
let signature = mykey.sign(mess, 'base58')

ReactDOM.render(
    <div>
        <p>private key: {pk}</p>,
        <p>public key: {mykey.privateKey.x}</p>,
        <p>signature: {signature}</p>
        <p>verify? {mykey.verify(JSON.stringify(mess), signature)}</p>
    </div>,
    document.getElementById('root')
)
  