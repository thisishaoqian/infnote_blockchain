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
        this.broadcastCache = {} // dict of string
    }

    refresh() {
        // to be done
    }

    connect() {

        function initSocket(peer) {
            let url = 'ws://' + peer.address + ':' + peer.port
            peer.socket = new WebSocket(url)

            // init socket
            peer.socket.onopen = function () {
                let url = peer.socket.url
                peer.dispatcher.globalHandler = this.handle
                peer.socket.send(new Info())
                console.info('Peer: [' + url + '] connected.')
            }
            peer.socket.onerror = function (err) {
                let url = peer.socket.url
                console.error('Peer: [' + url + '] error: \n' + JSON.stringify(err))
            }
            peer.socket.onclose = function () {
                let url = peer.socket.url
                peer.rank -= 1
                peer.retryCount += 1
                peer.save()
                if (peer.retryCount >= 5) {
                    this.peers.splice(this.peers.indexOf(peer), 1)
                    console.info('Peer: [' + url + '] disconnected.')
                } else {
                    setTimeout(function() {
                        peer.socket = new WebSocket(url)
                    }, 1000*(peer.retryCount+1)**4)
                }
            }
            peer.socket.onmessage = function (msgs) {
                for (let msg of msgs) {
                    let message = Message.load(msg)
                    if (message != null) {
                        peer.dispatcher.dispatch(message, peer)
                    } else {
                        console.warn('Bad message: \n' + JSON.stringify(msg))
                        peer.rank -= 1
                    }
                }
            }
        }

        for (let peer of (new PeerManager()).peers(this.maxPeers)) {
            initSocket(peer)
            this.peers.push(peer)
        }
    }

    handle(message, peer) {
        let sentence = Factory.load(message)
        if (sentence == null) {
            console.warn('Bad Sentence: ' + JSON.stringify(message.content))
        }

        console.debug('Peer: handle a message')
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

    handleQuestion(question, peer) {
        let answer = null
        // if (question.type === Sentence.Type.INFO) {
        //     answer = new Info()
        //     this.infoActions(question, peer)
        // } else if (question.type === Sentence.Type.WANT_BLOCKS) {
        //     answer = Factory.sendBlocks(question)
        // } else if (question.type === Sentence.Typr.WANT_PEERS) {
        //     answer = Factory.sendPeers(question)
        // }
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

    handleAnswer(answer, peer) {
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

    handleBroadcast(sentence, peer) {
        let lastBC = this.broadcastCache[sentence.message.identifier]
        if (sentence.type == Sentence.Type.NEW_BLOCK && lastBC == null) {
            this.broadcastCache[sentence.message.identifier] == sentence
        }
        let wb = Factory.wantBlocksForNewBlock(sentence)
        if (wb != null) {
            broadcast(msg, p) {
                this.handle(msg, p)
                this.broadcast(sentence, peer)
            }
            this.sendQuestion(wb, peer, broadcast)
        }
    }

    broadcast(sentence, ignoredPeer = null) {
        this.broadcastCache[sentence.message.identifier] = sentence

        console.debug('Broadcasting...')
        for (let p of this.peers) {
            if (ignoredPeer != null && p.address === ignoredPeer.address && p.port === ignoredPeer.port) {
                continue
            }
            p.send(sentence.message)
            console.debug('Broadcast to peer[' + p.address + ':' + p.port + ']')
        }
    }

    infoActions(info, sourcePeer) {

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
        if (true) {
            // conditions should be specified in settings
            let wp = Factory.wantPeersForInfo(info)
            if (wp != null) {
                this.sendQuestion(wp, sourcePeer)
            }
        }

    }


    sendQuestion(question, targetPeer, callback = null) {
        targetPeer.send(question.questionWrapper(), callback)
    }

    sendAnswer(answer, question, targetPeer) {
        // console.debug('Reply to ' + targetPeer.dict + '\n' + answer)
        targetPeer.send(answer.answerWrapper(question))
    }

}

export default ShareManager