import {
    default as Dispatcher
} from './dispatcher'

const prefixP = 'p'


class Peer {

    constructor(address = '', port = 80, rank = 100, socket = null, dispatcher = new Dispatcher()) {
        this.address = address
        this.port = port
        this.rank = rank
        this.socket = socket
        this.dispatcher = dispatcher
        this.retryCount = 0
    }

    get isConnected() {
        return this.socket != null &&
            this.socket.readyState !== this.socket.CLOSED &&
            this.socket.readyState !== this.socket.CLOSING
    }

    get dict() {
        return {
            'address': this.address,
            'port': this.port
        }
    }

    send(message, callback) {
        // message: stringified Message object
        if (callback != null) {
            this.dispatcher.register(message.identifier, callback)
        }

        this.socket.send(message)
        // console.log('Peer sending message: \n' + message)
    }


    save() {
        let index = prefixP + '+' + this.address + '+' + this.port
        localStorage.setItem(index, this.rank.toString())
    }
}


class PeerManager {

    constructor() {
        this.peersMap = {} // {address: list Of Port}
        // peer in localstorage is {'p+address+port': 'rank'}
        for (let i = 0; i < localStorage.length; i++) {
            let indexes = localStorage.key(i).split('+')
            if (indexes[0] !== prefixP) {
                continue
            }
            if (!(this.peersMap.hasOwnProperty(indexes[1]))) {
                this.peersMap[indexes[1]] = []
            }
            this.peersMap[indexes[1]].push(indexes[2])
        }
    }

    get count() {
        let count = 0
        for (let address of Object.keys(this.peersMap)) {
            count += this.peersMap[address].length
        }
        return count
    }

    allPeers() {
        let peers = []
        for (let address of Object.keys(this.peersMap)) {
            for (let port of this.peersMap[address]) {
                let index = prefixP + '+' + address + '+' + port
                peers.push(Peer(address, port, parseInt(localStorage.getItem(index))))
            }
        }
        return peers
    }

    peers(count = 10, minRank = 0) {
        let peerCollection = {} // {index: rank}
        for (let addr of Object.keys(this.peersMap)) {
            let index = ''
            for (let port of this.peersMap[addr]) {
                index = prefixP + '+' + addr + '+' + port
                let rank = localStorage.getItem(index)
                if (rank <= minRank) {
                    continue
                }
                peerCollection[index] = rank
            }
        }

        let indexes = Object.keys(peerCollection)
        indexes.sort((first, second) => {
            return peerCollection(first) - peerCollection(second)
        })

        let peerList = []
        for (let index of indexes.slice(0, count)) {
            let [_, addr, port] = index.split('+')
            peerList.push(new Peer(addr, port, peerCollection[index]))
        }
        return peerList
    }

    addOrUpdatePeer(peer) {
        // peer: Peer object
        let index = prefixP + '+' + peer.address + '+' + peer.port
        localStorage.setItem(index, peer.rank.toString())

        // update peerMap
        if (this.peersMap.hasOwnProperty(peer.address)) {
            if (!(this.peersMap[peer.address].indexOf(peer.port) > -1)) {
                this.peersMap[peer.address].push(peer.port)
            }
        } else {
            this.peersMap[peer.address] = [peer.port]
        }
    }

    _refresher() {
        // update object's peer map from local storage
        for (let i = 0; i < localStorage.length; i++) {
            let indexes = localStorage.key(i).split('+')
            if (indexes[0] !== prefixP) {
                continue
            }
            if (this.peersMap.hasOwnProperty(indexes[1])) {
                if (!(this.peersMap[indexes[1]].indexOf(indexes[2]) > -1)) {
                    this.peersMap[indexes[1]].push(indexes[2])
                }
            } else {
                this.peersMap[indexes[1]] = [indexes[2]]
            }

        }
    }

    // migrate() {}

    // repr() {

    // }

}

export {
    Peer,
    PeerManager
}