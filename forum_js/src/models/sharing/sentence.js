import {
    Block,
    Blockchain
} from '../blockchain'
import {
    Peer,
    PeerManager,
    Message
} from '../networking'

class Sentence {

    static Type = {
        EMPTY: '',
        INFO: 'info',
        ERROR: 'error',
        WANT_PEERS: 'want_peers',
        PEERS: 'peers',
        WANT_BLOCKS: 'want_blocks',
        BLOCKS: 'blocks',
        NEW_BLOCK: 'new_block'
    }

    constructor(message = null, type = Sentence.Type.EMPTY) {
        this.message = null
        this.type = type
    }

    static load() {

    }

    get dict() {
        return {
            'type': this.type
        }
    }

    get question() {
        return new Message({
            'type': this.type
        })
    }

    to(question) {
        // Message Object
        return new Message({
            'type': this.type
        },
        this.type === Sentence.Type.ERROR ? Sentence.type.ERROR : Sentence.Type.ANSWER,
        question.message.identifier
        )
    }

    static flatDict(value, initial = '', indent = 0) {
        if (typeof value !== 'object') {
            return value
        }

        function max_width_cal(r, x) {
            return r > x.length ? r : x.length
        }

        let maxWidth = value.reduce(max_width_cal, 0)
        let result = initial

        for (let k in Object.keys(value)) {
            if (value[k] instanceof Object) {
                value[k] = Sentence.flatDict(value[k], '\n', 4)
            }
            result += (' '.repeat(indent) + '[' + k + ' '.repeat(maxWidth - k.length) + '] ' + value[k] + '\n')
        }
        return result
    }

    // repr() {
    // }
}

class Info extends Sentence {

    constructor(version = '0.1', peers = 0, chains = {}, platform = {}, isFullNode = false) {
        super(Sentence.Type.INFO)
        // this.type = Sentence.Type.INFO
        this.version = version
        this.peers = peers
        this.chains = chains
        this.platform = platform
        this.isFullNode = isFullNode

        function getBrowserInfo() {
            let info = {
                'system': navigator.platform,
                'user_agent': navigator.userAgent,
                'connection_type': navigator.connection.effectiveType
            }
            return info
        }

        this.platform = getBrowserInfo()
        let allChains = Blockchain.allChains()
        for (let chain of allChains) {
            this.chains[chain.id] = chain.height
        }

        if (this.peers === 0) {
            this.peers = PeerManager().count()
        }
    }

    static load(d) {
        let info = new Info()
        try {
            info.version = d['version']
            info.peers = d['peers']
            info.chains = d['chains']
            info.platform = d['platform']
            info.isFullNode = d['full_node']
            return info
        } catch (e) {
            console.log(e)
            return null
        }
    }

    get dict() {
        return {
            'type': super.type,
            'version': this.version,
            'peers': this.peers,
            'chains': this.chains,
            'platform': this.platform,
            'full_node': this.isFullNode
        }
    }
}

class Error extends Sentence {

    constructor(code = 0, desc = '') {
        super(Sentence.Type.ERROR)
        this.code = code
        this.desc = desc
    }

    static load(d) {
        let error = new Error()
        try {
            error.code = d['code']
            error.desc = d['desc']
            return error
        } catch (e) {
            console.log(e)
            return null
        }
    }

    get dict() {
        return {
            'type': super.type,
            'code': self.code,
            'desc': self.desc
        }
    }
}

class WantPeers extends Sentence {

    constructor(count = 0) {
        super(Sentence.Type.WANT_PEERS)
        this.count = count
    }

    static load(d) {
        let wantPeers = new WantPeers()
        try{
            wantPeers.count = d['count']
            return wantPeers
        } catch(e){
            console.log(e)
            return null
        }
    }

    get dict() {
        return {
            'type': super.type,
            'count': this.count
        }
    }
}

class Peers extends Sentence {

    constructor(peerList=[]) {
        super(Sentence.Type.PEERS)
        this.peers = peerList       // list of Peer objects
    }

    static load(d) {
        let peers = new Peers()
        try{
            for (let peer of d['peers']) {
                peers.peers.push(new Peer(peer['address'], peer['port']))
            }
            return peers
        } catch(e) {
            console.log(e)
            return null
        }
    }

    get dict() {
        let peers = []
        for (let peer of this.peers) {
            peers.push(peer.dict)
        }
        return {
            'type': super.type,
            'peers': peers
        }
    }
}

class WantBlocks extends Sentence {

    constructor(chainId='', fromHeight=0, toHeight=0) {
        super(Sentence.Type.WANT_BLOCKS)
        this.chainId = chainId
        this.fromHeight = fromHeight
        this.toHeight = toHeight
    }

    static load(d) {
        let wantBlocks = new WantBlocks()
        try{
            wantBlocks.chainId = d['chainId']
            wantBlocks.fromHeight = d['fromHeight']
            wantBlocks.toHeight = d['toHeight']

            return wantBlocks
        } catch(e) {
            console.log(e)
            return null
        }
    }

    get dict() {
        return {
            'type': super.type,
            'chain_id': this.chainId,
            'from_height': this.fromHeight,
            'to_height': this.toHeight
        }
    }
}

class Blocks extends Sentence {

    constructor(blockList=[]) {
        super(Sentence.Type.BLOCKS)
        this.blocks = blockList
    }

    static load(d) {
        let blocks = new Blocks()
        try{
            for (let data of d['blocks']) {
                blocks.blocks.push(new Block(data))
            }
            return blocks
        } catch(e) {
            console.log(e)
            return null
        }
    }

    get dict() {
        let blocks = []
        for (let block of this.blocks) {
            blocks.push(block.dict)
        }
        return {
            'type': super.type,
            'blocks': blocks
        }
    }
}

class NewBlock extends Sentence {

    constructor(chainId='', height=0) {
        super(Sentence.Type.NEW_BLOCK)
        this.chainId = chainId
        this.height = height
    }

    static load(d) {
        let newBlock = new NewBlock()
        try{
            newBlock.chianId = d['chain_id']
            newBlock.height = d['height']
            return newBlock
        } catch(e) {
            console.log(e)
            return null
        }
    }

    get dict() {
        return {
            'type': super.type,
            'chain_id': this.chainId,
            'height': this.height
        }
    }
}

export {Info, Error, WantPeers, Peers, WantBlocks, Blocks, NewBlock}
