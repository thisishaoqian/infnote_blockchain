
import {guid} from '../utilities/utilities'
import uuid from 'uuid/v1'
import Storage from '../storage'
import Blockchain from '../blockchain'
import Block from '../block'
import Key from '../key'


class ChainManager {

    constructor() {
        this.ids = Storage.idsInLocalStorage()
        this.chainsNum = Storage.chainsNumInStorage()
        this.keys = {}
        this.chains = {}
        this.recoverFromLS()
    }

    recoverFromLS() {
        let storage = Storage.allChainsInStorage()
        for(let i=0; i<this.chainNum; i++){
            let id = this.ids[i]
            this.keys[id] = storage[id].shift()
            this.chains[id] = new Blockchain(this.keys[id])
            this.chains[id].resetChainHeight()
            this.chains[id].resetChainLastHash()
        }
    }

    verifyChain(chainId) {
        // Is it necessary to verify chain by each node
        let chain = this.chains[chainId]
        let prevHash = null
        for(let i=0; i < chain.height; i++) {
            let block = chain.getBlockByHeight(i)

            // Check signature
            if(!chain.isValid(block)) {
                return false 
            }
            // Check hash
            if(block.prevHash !== prevHash) {
                return false
            }
            prevHash = block.prevHash
        }
        return true
    }

    addBlockToChain(chainId, data) {
        this.chains[chainId].addBlockToChain(data)
    }

    createNewChain() {

        let id = uuid()
        this.key[id] = new Key(id)
        this.chains[id] = new Blockchain(this.key[id])

        this.chainsNum += 1
        return this.chain[id]
    }

    getKeyById(id) {
        return this.keys[id]
    }
}


export default ChainManager