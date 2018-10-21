// import {StoragePrefixBlock as prefixB, StoragePrefixKey as prefixK} from './settings'

const prefixB = 'b'  // prefix of block index in localstorage
const prefixK = 'k'  // prefix of chain index in localstorage

class Storage {
    constructor() {
        this.chainBlockMap = {}     // {chianid: listOfHeight}
        for (let i = 0; i < localStorage.length; i++) {
            let indexes = localStorage.key(i).split('+')
            if (indexes[0] !== prefixB) {
                continue
            }
            if (!(this.chainBlockMap.hasOwnProperty(indexes[1]))) {
                this.chainBlockMap[indexes[1]] = []
            }
            this.chainBlockMap[indexes[1]].push(indexes[2])
        }
    }

    allChains() {
        let chains = []
        for (let publickey of Object.keys(this.chainBlockMap)) {
            let index = prefixK + '+' + publickey
            chains.push(JSON.parse(localStorage.getItem(index)))
        }
        return chains
    }

    saveChain(chain) {
        let index = prefixK + '+' + chain['public_key']
        localStorage.setItem(index, JSON.stringify(chain))
    }

    saveBlock(block) {
        let index = prefixB + '+' + block['chain_id'] + '+' + block['height'].toString()
        localStorage.setItem(index, JSON.stringify(block))
    }

    getChain(publicKey) {
        let index = prefixK + '+' + publicKey
        return JSON.parse(localStorage.getItem(index))
    }

    getBlock(chainId, height = null, blockHash = null) {
        if (height != null) {
            let index = prefixB + '+' + chainId + '+' + height.toString()
            return JSON.parse(localStorage.getItem(index))
        } else if (blockHash != null) {
            // this method may be have very low efficiency
            for (let height of this.chainBlockMap[chainId]) {
                let index = prefixB + '+' + chainId + '+' + height.toString()
                let block = JSON.parse(localStorage.getItem(index))
                if (block.hash === blockHash) {
                    return block
                }
            }
        } else {
            throw 'Height and BlockHash CANNOT be both empty when query a block!'
        }
    }

    getBlocks(chainId, start, end){
        if (start > end || this.chainBlockMap[chainId].indexOf(start) === -1) {
            return null
        }
        if (end > this.chainBlockMap[chainId].length) {
            end = this.chainBlockMap[chainId].length
        }
        let blockInfos = []
        for (let i=start; i<end; i++){
            let index = prefixB + '+' + chainId + '+' + i.toString()
            blockInfos.push(JSON.parse(localStorage.getItem(index)))
        }
        return blockInfos
    }

    getHeight(chainId) {
        return this.chainBlockMap[chainId] == null ? 0 : this.chainBlockMap[chainId].length
    }

    // migrate() {
    // }
}

export default Storage