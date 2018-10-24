import {
    PeerManager
} from '../networking'
import {
    Info,
    Error,
    WantPeers,
    Peers,
    WantBlocks,
    Blocks,
    NewBlock
} from './sentence'
import {
    Blockchain
} from '../blockchain'
import {
    formatedTime
} from '../utils'


class SentenceFactory {

    static load(message) {
        // message: Message object
        let content = message.content
        let ctype = content['type']
        if (ctype == null) {
            return null
        }

        let result = null
        switch (ctype) {
        case 'info':
            result = Info.load(content)
            break
        case 'error':
            result = Error.load(content)
            break
        case 'want_peers':
            result = WantPeers.load(content)
            break
        case 'peers':
            result = Peers.load(content)
            break
        case 'want_blocks':
            result = WantBlocks.load(content)
            break
        case 'blocks':
            result = Blocks.load(content)
            break
        case 'new_block':
            result = NewBlock.load(content)
            break
        }

        if (result != null) {
            result.message = message
        }
        return result
    }

    static wantBlocks(chainId, start, end) {
        let request = new WantBlocks(chainId, start, end)
        return request
    }

    static wantBlocksForNewBlock(newBlock) {
        //newBlock: NewBlock object
        let chain = Blockchain.load(newBlock.chainId)
        if (chain != null) {
            if (chain.height < newBlock.height) {
                return SentenceFactory.wantBlocks(newBlock.chainId, chain.height, newBlock.height)
            }
        } else if (newBlock.height > 0) {
            return SentenceFactory.wantBlocks(newBlock.chainId, 0, newBlock.height)
        }
        return null
    }

    static wantBlocksForInfo(info) {
        let result = []
        for (let id of Object.keys(info.chains)) {
            let chain = Blockchain.load(id)
            if (chain == null) {
                if (info.chains[id] > 0) {
                    result.push(SentenceFactory.wantBlocks(id, 0, info.chains[id]))
                }
            } else if (chain.height < info.chains['id']) {
                result.push(SentenceFactory.wantBlocks(id, info.chains[id], chain.height))
            }
        }
        return result
    }

    static wantPeersForInfo(info) {
        if (info.peers > 0) {
            return new WantPeers(info.peers)
        }
        return null
    }

    static sendBlocks(wantBlocks) {
        let chain = Blockchain.load(wantBlocks.chainId)

        if (chain == null) {
            return null
        }
        let blocks = chain.getBlocks(wantBlocks.fromHeight, wantBlocks.toHeight)

        if (blocks == null) {
            return null
        }
        return new Blocks(blocks)
    }

    static sendPeers(wantPeers) {
        let peers = (new PeerManager()).peers(wantPeers.count)
        if (peers.length <= 0) {
            return null
        }
        return new Peers(peers)
    }

    static newBlock(chain) {
        // chain: Blockchain object
        return NewBlock(chain.chainId, chain.height)
    }

    static handlePeers(peers) {
        // peers: Peers object
        if (peers == null) {
            return
        }
        let pm = new PeerManager()
        for (let peer of peers.peers) {
            pm.addOrUpdatePeer(peer)
            console.log('[' + formatedTime() + '] Peer updated:\n' + JSON.stringify(peer))
        }
    }

    static handleBlocks(blocks) {
        // blocks: Blocks object
        if (blocks == null) {
            return
        }
        for (let block of blocks.blocks) {
            if (Blockchain.remoteChain(block.chainId).saveBlock(block)) {
                console.log('[' + formatedTime() + '] Block saved:\n' + JSON.stringify(block))
            }
        }

    }
}

export default SentenceFactory