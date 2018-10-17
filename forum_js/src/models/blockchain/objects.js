import bs58 from 'bs58'
import {
    crypto
} from 'bitcoinjs-lib'
import Key from './key'
import Storage from './storage'

class Block {

    constructor(data = null) {

        this.blockHash = ''
        this.prevHash = ''
        this.time = new Date()
        this.signature = ''
        this.chainId = '',
        this.height = 0,
        this.payload = ''

        if (data != null) {
            this.blockHash = data['hash']
            this.prevHash = data['prev_hash']
            this.time = new Date(data['time'] * 1000) // utc time ignored millisecond part
            this.signature = data['signature']
            this.height = data['height']
            this.chainId = data['chain_id']
            this.payload = data['payload']
        }
    }

    get isGenesis() {
        return this.height === 0
    }

    get utctime() {
        /*
        return utctime: string
        */
        let utcTimeStr = this.time.getTime().toString()
        return utcTimeStr.slice(0, 10) // ignore millisecond
    }

    get dict() {
        let data = {
            'hash': this.blockHash,
            'time': parseInt(this.utctime),
            'signature': this.signature,
            'chain_id': this.chainId,
            'height': this.height,
            'payload': this.payload
        }
        if (this.prevHash != null && this.prevHash.length > 0)
            data['prev_hash'] = this.prevHash
        return data
    }

    get dataForHashing() {
        let data = this.dict
        delete data['hash']
        delete data['signature']
        let dataStr = JSON.stringify(data, Object.keys(data).sort())
        return Buffer.from(dataStr, 'utf8')
    }

    get data() {
        let dataStr = JSON.stringify(this.dict, Object.keys(this.dict).sort())
        return Buffer.from(dataStr, 'utf8')
    }

    get isValid() {
        let key = new Key(this.chainId)
        return (
            this.height === 0 ||
            ((this.prevHash != null && this.prevHash.length > 0) &&
            bs58.encode(crypto.sha256(this.dataForHashing)) === this.blockHash &&
            key.verify(this.signature, this.dataForHashing))
        )
    }

    str() {
        return JSON.stringify(
            this.dict,
            Object.keys(this.dict).sort()
        )
    }
}


class Blockchain {

    static allChains() {
        let objects = (new Storage()).allChains()
        let chains = []
        for (let key of objects) {
            chains.push(new Blockchain(new Key(key['publick_key'], key['private_key'])))
        }
        return chains
    }

    static load(chainId) {
        let info = (new Storage()).getChain(chainId)
        if (info != null) {
            if (info['private_key'] != null && info['private_key'].length > 0) { //undefined == null -> true, undefined == null -> false
                return new Blockchain(new Key(chainId, info['private_key']))
            }
            return new Blockchain(new Key(chainId))
        }
        return null
    }

    // browser cannot create blocks or chains, this function is not needed
    static create(blockInfo) {
        /*
        blockInfo should contains genisis block info
        There should be 6 fields:
        name, version, author, website, email, desc
        */
        let chain = new Blockchain(new Key())
        let block = chain.createBlock(JSON.stringify(blockInfo, Object.keys(blockInfo)).sort())
        chain.save()
        chain.saveBlock(block)

        return chain
    }

    constructor(keyObj) {
        this.key = keyObj
        this.storage = new Storage()

        let genesis = this.getBlock(0)
        this.info = this.genesis != null ? JSON.parse(genesis.payload) : null
    }

    get id() {
        return this.key.publicKey
    }

    get isOwner() {
        return this.key.canSign
    }

    get height() {
        return this.storage.getHeight(this.id)
    }

    getBlock(height = null, blockHash = null) {
        // height: int; blockHash: String
        let info = this.storage.getBlock(this.id, height, blockHash)
        return info != null ? new Block(info) : null
    }

    createBlock(payload) {

        if (typeof payload !== 'string') {
            throw 'Payload should be in string type'
        }

        let block = new Block()
        block.payload = payload
        block.chainId = this.id
        block.height = this.height
        if (block.height > 0) {
            block.prev_hash = this.storage.getBlock(this.id, block.height - 1).blockHash
        }
        block.blockHash = bs58.encode(crypto.sha256(block.dataForHashing, 'utf8'))
        block.signature = bs58.encode(this.key.sign(block.dataForHashing))
    }

    saveBlock(block) {
        if (block.isValid && this.getBlock(block.height) == null) {
            if (this.storage.getHeight(this.id) === 0) {
                this.storage.saveBlock(block.dict)
                return true
            } else if (block.height > 0) {
                let prevBlock = this.getBlock(block.height - 1)
                if (prevBlock.blockHash === block.prevHash) {
                    this.storage.saveBlock(block.dict)
                    return true
                }
            }
        }
        return false
    }

    save() {
        if (Blockchain.load(this.id) == null) {
            this.storage.saveChain({
                'public_key': this.key.publicKey,
                'private_key': this.key.privateKey
            })
            return true
        }
        return false
    }

    getItem(key) {
        if (typeof key === 'number') {
            return new Block(this.storage.getBlock(this.id, key, null))
        } else if (typeof key === 'string') {
            return new Block(this.storage.getBlock(this.id, null, key))
        }
        return null
    }
}


export {
    Block,
    Blockchain
}