import bs58 from 'bs58'
// import bs58check from 'bs58check'
import bigi from 'bigi'
import {crypto} from 'bitcoinjs-lib'

function toBase58(dataString) {
    let encodedData =  bs58.encode(Buffer.from(dataString, 'utf8'))
    // let bigiHash =  bigi.fromBuffer(hashInBuffer)
    return encodedData
}

function fromBase58(encodedData) {
    return bs58.decode(encodedData).toString('utf8')
}

function getDataHash(dataString) {

    if(typeof dataString !== 'string') {
        dataString = JSON.stringify(dataString)
    }
    let dataHashBuffer = crypto.sha256(Buffer.from(dataString, 'utf8'))
    let dataHash = bigi.fromBuffer(dataHashBuffer)

    return dataHash
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
        return v.toString(16)
    })
}

export {toBase58, fromBase58, getDataHash, guid}