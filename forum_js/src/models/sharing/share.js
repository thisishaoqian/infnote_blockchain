import {
    Sentence,
    Info
} from './sentence'
import {
    SentenceFactory as Factory
} from './factory'
import {
    Peer,
    PeerManager,
    Message
} from '../networking'

class ShareManager {

    constructor() {
        this.maxPeers = 10
        this.peers = [] //list of Peer object
        this.spreadCache = [] // list of string
    }

    refresh() {

    }

    connect() {

    }

    sendInfo() {
        
    }

}

export default ShareManager