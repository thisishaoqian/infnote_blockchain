
// import {default as Key} from './key'
import {default as Block} from './block'
import {default as Storage} from './storage'
import {getDataHash} from './utilities/utilities'


class Blockchain {

    constructor(keyObj) {

        this.id = keyObj.id
        this.key = keyObj
        this.storage = new Storage(this.id, keyObj)
        this.height = 0
        this.lastBlockHash = null
    }

    // generateGenesisBlock(data){
    //     // time = new Date().getTime().toString()
    //     let genesisBlock = new Block(this.id, data, null, 1)
    //     let signature = this.key.sign(genesisBlock.genSelfHash())
    //     genesisBlock.sign(signature)
    //     this.height += 1
    //     this.lastBlockHash = genesisBlock.hash
    //     this.storage.addBlock(genesisBlock)

    //     return genesisBlock
    // }

    generateBlock(data) {
        let newBlock = null
        if(this.height === 0)   // generage genesis block
            newBlock = new Block(this.id, data, null, 1)
        else 
            newBlock = new Block(this.id, data, this.lastBlockHash, this.height+1)
        let signature = this.key.sign(newBlock.genSelfHash())
        newBlock.sign(signature)
        this.height += 1
        this.lastBlockHash = newBlock.hash
        this.storage.addBlock(newBlock)

        return newBlock
    }

    isValid(comingBlock) {
        let unknownSig = comingBlock.signature
        // let blockHash = getDataHash(comingBlock.getBlockForHashing())
        return this.key.verify(comingBlock.getBlockForHashing(), unknownSig)
    }

    getBlockByHeight(height) {
        return this.storage.getBlockByHeight(height)
    }

    getBlockByHash(hash) {
        return this.storage.getBlockByHash(hash)
    }

    resetChainHeight() {
        this.height = this.storage.blocks.length - 1
    }

    resetChainLastHash() {
        this.lastBlockHash = this.storage.blocks[this.height].hash
    }

    
}

export default Blockchain