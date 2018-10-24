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

    static load() {}

    get dict() {
        return {
            'type': this.type
        }
    }

    questionWrapper() {
        return new Message(this.dict)
    }

    anwserWrapper(question) {
        // return Message Object
        return new Message(this.dict,
            this.type === Sentence.Type.ERROR ? Sentence.type.ERROR : Message.Type.ANSWER,
            question.message.identifier
        )
    }

    // wrapper(sourceQuestion=null) {
    //     // wrap sentence into Message Object
    //     // sourceQuestion: Sentence Subclass object

    //     if (sourceQuestion == null){
    //         return new Message(this.dict)
    //     } else {
    //         new Message(this.dict,
    //             this.type === Sentence.Type.ERROR ? Sentence.type.ERROR : Message.Type.ANSWER,
    //             sourceQuestion.dict
    //         )
    //     }
    // }

    static flatDict(value, initial = '', indent = 0) {
        if (typeof value !== 'object') {
            return value
        }

        let max_width_cal = (r, x) => {
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
        super()
        this.type = Sentence.Type.INFO
        this.version = version
        this.peers = peers
        this.chains = chains
        this.platform = platform
        this.isFullNode = isFullNode

        // param platform will be overrided here
        this.platform = {
            'system': navigator.platform,
            'user_agent': navigator.userAgent,
            'connection_type': navigator.connection.effectiveType
        }
        let allChains = Blockchain.allChains()
        for (let chain of allChains) {
            this.chains[chain.id] = chain.height
        }

        if (this.peers === 0) {
            this.peers = (new PeerManager()).count
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
            'type': this.type,
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
        super()
        this.type = Sentence.Type.ERROR
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
            'type': this.type,
            'code': this.code,
            'desc': this.desc
        }
    }
}

class WantPeers extends Sentence {

    constructor(count = 0) {
        super()
        this.type = Sentence.Type.WANT_PEERS
        this.count = count
    }

    static load(d) {
        let wantPeers = new WantPeers()
        try {
            wantPeers.count = d['count']
            return wantPeers
        } catch (e) {
            console.log(e)
            return null
        }
    }

    get dict() {
        return {
            'type': this.type,
            'count': this.count
        }
    }
}

class Peers extends Sentence {

    constructor(peerList = []) {
        super()
        this.type = Sentence.Type.PEERS
        this.peers = peerList // list of Peer objects
    }

    static load(d) {
        let peers = new Peers()
        try {
            for (let peer of d['peers']) {
                peers.peers.push(new Peer(peer['address'], peer['port']))
            }
            return peers
        } catch (e) {
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
            'type': this.type,
            'peers': peers
        }
    }
}

class WantBlocks extends Sentence {

    constructor(chainId = '', fromHeight = 0, toHeight = 0) {
        super()
        this.type = Sentence.Type.WANT_BLOCKS
        this.chainId = chainId
        this.fromHeight = fromHeight
        this.toHeight = toHeight
    }

    static load(d) {
        let wantBlocks = new WantBlocks()
        try {
            wantBlocks.chainId = d['chainId']
            wantBlocks.fromHeight = d['fromHeight']
            wantBlocks.toHeight = d['toHeight']

            return wantBlocks
        } catch (e) {
            console.log(e)
            return null
        }
    }

    get dict() {
        return {
            'type': this.type,
            'chain_id': this.chainId,
            'from_height': this.fromHeight,
            'to_height': this.toHeight
        }
    }
}

class Blocks extends Sentence {

    constructor(blockList = []) {
        super()
        this.type = Sentence.Type.BLOCKS
        this.blocks = blockList
    }

    static load(d) {
        let blocks = new Blocks()
        try {
            for (let data of d['blocks']) {
                blocks.blocks.push(new Block(data))
            }
            return blocks
        } catch (e) {
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
            'type': this.type,
            'blocks': blocks
        }
    }
}

class NewBlock extends Sentence {

    constructor(chainId = '', height = 0) {
        super()
        this.type = Sentence.Type.NEW_BLOCK
        this.chainId = chainId
        this.height = height
    }

    static load(d) {
        let newBlock = new NewBlock()
        try {
            newBlock.chianId = d['chain_id']
            newBlock.height = d['height']
            return newBlock
        } catch (e) {
            console.log(e)
            return null
        }
    }

    get dict() {
        return {
            'type': this.type,
            'chain_id': this.chainId,
            'height': this.height
        }
    }

    get broadcast() {
        if (this.message == null) {
            this.message = new Message(this.dict, Message.Type.BROADCAST)
        }
        return new Message(this.dict, Message.Type.BROADCAST, this.message.identifer)
        // return this.message
    }
}

export {
    Sentence,
    Info,
    Error,
    WantPeers,
    Peers,
    WantBlocks,
    Blocks,
    NewBlock
}