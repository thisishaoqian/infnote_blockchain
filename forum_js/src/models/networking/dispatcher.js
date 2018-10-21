class Dispatcher {

    constructor(socket, handlers = {}, globalHandler = null) {
        this.socket = socket
        this.handlers = handlers
        this.globalHandler = globalHandler

        // init socket
        this.socket.onopen = function () {
            let url = this.socket.url
            console.info('Peer: [' + url + '] connected.')
        }
        this.socket.onerror = function () {
            let url = this.socket.url
            console.error('Error happened -> Peer: [' + url + '] disconnected ')
            this.socket.close()
        }
        this.socket.onclose = function () {
            let url = this.socket.url
            console.info('Peer: [' + url + '] disconnected.')
        }
        this.socket.onmessage = function () {
            let url = this.socket.url
            console.info('Peer: [' + url + '] -> new message.')
            // do something
        }
    }

    send(message) {
        this.socket.send(message.dump())
    }

    register(identifier, handler) {
        this.handlers[identifier] = handler
    }

    dispatch(message, peer) {
        /*
        :param: message: Message
         */
        let callback = this.handlers[message.identifier]
        if (callback != null) {
            callback(message, peer)
            delete this.handlers[message.identifier]
        } else if (this.globalHandler != null) {
            await this.globalHandler(message, peer)
        } else {
            console.log('Missing gloabel handler for receiving messages.')
        }
    }
}

export default Dispatcher