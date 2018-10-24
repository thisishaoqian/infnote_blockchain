import {
    Sentence,
    Info
} from './sentence'
import {
    default as Factory
} from './factory'
import {
    Peer,
    PeerManager,
    Message
} from '../networking'
import {
    formatedTime
} from '../utils'

class ShareManager {

    constructor() {
        this.maxPeers = 10
        this.peers = [] //list of Peer object
        this.broadcastCache = {} // dict of string
    }

    refresh() {
        // to be done
    }

    connect(address = null, port = null) {

        let initSocket = (peer) => {
            let url = 'ws://' + peer.address + ':' + peer.port
            peer.socket = new WebSocket(url)

            let that = this
            // init socket
            peer.socket.onopen = () => {
                let url = peer.socket.url
                peer.dispatcher.globalHandler = that.handle
                peer.socket.send((new Info()).questionWrapper().dump())
                console.info('[' + formatedTime() + '] Peer:[' + url + '] connected.')
            }
            peer.socket.onerror = (err) => {
                let url = peer.socket.url
                console.error('[' + formatedTime() + '] Peer:[' + url + '] error: \n' + JSON.stringify(err))
            }
            peer.socket.onclose = () => {
                let url = peer.socket.url
                peer.rank -= 1
                peer.retryCount += 1
                peer.save()

                // need to refine retry mechanism
                if (peer.retryCount >= 5) {
                    that.peers.splice(that.peers.indexOf(peer), 1)
                    console.info('[' + formatedTime() + '] Peer:[' + url + '] disconnected.')
                } else {
                    setTimeout(() => {
                        peer.socket = new WebSocket(url)
                    }, 1000 * (peer.retryCount + 1) ** 4)
                }
            }
            peer.socket.onmessage = (msg) => {
                msg = msg.data
                console.log('[' + formatedTime() + '] Recv from peer:[' + peer.socket.url + ']\n' + msg)
                let message = Message.load(msg)
                if (message != null) {
                    peer.dispatcher.dispatch(message, peer)
                } else {
                    console.warn('Bad message: \n' + msg)
                    peer.rank -= 1
                }
            }
        }

        if (address !== '' && port !== '') {
            let pe = new Peer(address, port)
            initSocket(pe)
            this.peers.push(pe)
        }
        let pm = new PeerManager()
        for (let peer of pm.peers(this.maxPeers)) {
            initSocket(peer)
            this.peers.push(peer)
        }
    }

    handle = (message, peer) => {
        let sentence = Factory.load(message)
        if (sentence == null) {
            console.warn('Bad Sentence: ' + JSON.stringify(message.content))
        }

        switch (message.type) {
        case Message.Type.QUESTION:
            this.handleQuestion(sentence, peer)
            break
        case Message.Type.ANSWER:
            this.handleAnswer(sentence, peer)
            break
        case Message.Type.BROADCAST:
            this.handleBroadcast(sentence, peer)
            break
        }
    }

    handleQuestion = (question, peer) => {
        let answer = null

        switch (question.type) {
        case Sentence.Type.INFO:
            answer = new Info()
            this.infoActions(question, peer)
            break
        case Sentence.Type.WANT_BLOCKS:
            answer = Factory.sendBlocks(question)
            break
        case Sentence.Typr.WANT_PEERS:
            answer = Factory.sendPeers(question)
            break
        }

        if (answer != null) {
            this.sendAnswer(answer, question, peer)
        }
    }

    handleAnswer = (answer, peer) => {
        switch (answer.type) {
        case Sentence.Type.INFO:
            this.infoActions(answer, peer)
            break
        case Sentence.Type.BLOCKS:
            Factory.handleBlocks(answer)
            break
        case Sentence.Type.PEERS:
            Factory.handlePeers(answer)
        }
    }

    handleBroadcast = (sentence, peer) => {
        let lastBC = this.broadcastCache[sentence.message.identifier]
        if (sentence.type == Sentence.Type.NEW_BLOCK && lastBC == null) {
            this.broadcastCache[sentence.message.identifier] == sentence
        }
        let wb = Factory.wantBlocksForNewBlock(sentence)
        if (wb != null) {
            let handleBlocks = (msg, p) => {
                this.handle(msg, p)
                let sen = Factory.load(msg)
                if (sen.type === Sentence.Type.BLOCKS && sen.end){
                    this.broadcast(sentence, peer)
                    return true
                }
            }
            this.sendQuestion(wb, peer, handleBlocks)
        }
    }

    broadcast = (sentence, ignoredPeer = null) => {
        this.broadcastCache[sentence.broadcast.identifier] = sentence

        for (let p of this.peers) {
            if (ignoredPeer != null && p.address === ignoredPeer.address && p.port === ignoredPeer.port) {
                continue
            }
            p.send(sentence.broadcast)
            console.log('[' + formatedTime() + '] Broadcast to peer[' + p.socket.url + ']\n')
        }
    }

    infoActions = (info, sourcePeer) => {

        if (info instanceof Message) {
            info = Factory.load(info)
        }
        if (info == null) {
            return null
        }

        // want blocks
        for (let wb of Factory.wantBlocksForInfo(info)) {
            this.sendQuestion(wb, sourcePeer)
        }

        // want peers
        // conditions should be specified in settings
        let wp = Factory.wantPeersForInfo(info)
        if (wp != null) {
            this.sendQuestion(wp, sourcePeer)
        }
    }

    sendQuestion = (question, targetPeer, callback = null) => {
        targetPeer.send(question.questionWrapper().dump(), callback)
        console.log('[' + formatedTime() + '] Ask to Peer [' + targetPeer.socket.url +'] \n' + question.questionWrapper().dump())

    }

    sendAnswer = (answer, question, targetPeer) => {
        targetPeer.send(answer.answerWrapper(question).dump())
        console.log('[' + formatedTime() + '] Reply to Peer [' + targetPeer.socket.url +'] \n' + answer.answerWrapper(question).dump())
    }

}

export default ShareManager