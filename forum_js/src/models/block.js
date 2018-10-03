
// const ECDSA = require('ecdsa-secp256r1')
// const ECDSA = require('ecdsa-secp256r1/browser')
// import {crypto} from 'bitcoinjs-lib'
import {toBase58, getDataHash} from './utilities/utilities'
// import { getHashes } from 'crypto'

class Block {

    static getMembers() {
        return ['data', 'prev_hash', 'timestamp', 'signature', 'hash_value', 'height']
    }

    static menberForHashing() {
        return ['chainId', 'prevHash', 'timestamp', 'height', 'payload']
    }

    constructor(chainId, data, prevHash, height=0) {
        
        this.id = chainId
        this.payload = data
        this.prevHash = prevHash
        this.height = height
        this.timestamp = new Date().getTime().toString() // 13 bits while it's 16 bits on python currently
        // this.version = version
        this.signature = null
        this.hash = getDataHash(this.getBlockForHashing())
    }

    getBlockDict(fields=null) {
        let blockDict = {}
        let keysOfDict = []
        if (!fields) {
            keysOfDict = fields
        }
        else {
            keysOfDict = Block.getMembers()
        }
        keysOfDict.forEach(name => blockDict[name] = this[name])
        return blockDict
    }

    getBlockForHashing() {
        let blockDict = this.getBlockDict(Block.menberForHashing())
        if(!blockDict['prevHash']) {
            delete blockDict['prevHash']
        }
        let sortedBlockDict = Object.keys(blockDict).sort()
        return JSON.stringify(sortedBlockDict)
    }

    genSelfHash() {
        // this.hash = getDataHash(this.getBlockForHashing())
        return this.hash
    }

    sign(signature) {
        // this signature has been base58 encoded
        this.signature = signature
    }
}


export default Block