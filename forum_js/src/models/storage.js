
// use block chain as storage unit, 
class Storage {

    static idsInLocalStorage() {
        let ids = new Array()
        for(let i=localStorage.length-1; i>=0; i--)
            ids.push(localStorage.key(i))
        return ids
    }

    static allChainsInStorage() {
        let chains = {}
        // Which way is more efficient? read all Storage once: localStorage.valueOf() OR one by one
        for(let i=localStorage.length-1; i>=0; i--) {
            let key = localStorage.key(i)
            chains[key] = JSON.parse(localStorage.getItem[key])
        }
        return chains
    }

    static chainsNumInStorage() {
        return localStorage.length
    }
    
    static clearLocalStorage() {
        localStorage.clear()
    }

    constructor(id, key){
        this.id = id
        this.key = key
        let dataInStorage = localStorage.getItem(id)
        if(dataInStorage) {
            let value = JSON.parse(dataInStorage)
            this.blocks = value.slice(1, value.length)
        }
        else{
            this.blocks = new Array()
        }
        this.blocks.unshift(this.key)
    }

    addBlock(blockObj) {
        let currLength = this.blocks.push(blockObj)
        localStorage.setItem(this.id, JSON.stringify(this.blocks))
        return currLength
    }

    allBlocks() {
        return this.blocks.slice(1, this.blocks.length)
    }

    getBlockByHeight(height) {
        // first element is the key
        return this.blocks[height]
    }

    getBlockByHash(hash) {
        // This method should be rewrite
        // build extra-dict or do a loop
        for(let i=0; i<this.blocks.length; i++) {
            if(this.blocks[i].hash == hash)
                return this.blocks[i]
        }
        return null
    }

    save(key, value) {
        // localStorage.setItem(key, value)
        // this 
    }

}

export default Storage