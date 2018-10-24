class Dispatcher {

    constructor(handlers = {}, globalHandler = null) {
        // this.socket = socket
        this.handlers = handlers
        this.globalHandler = globalHandler
    }
    
    register(identifier, handler) {
        this.handlers[identifier] = handler
    }

    dispatch(message, peer) {
        /*
        :param: message: Message
         */
        let handler = this.handlers[message.identifier]
        if (handler != null) {
            handler(message, peer)
            delete this.handlers[message.identifier]
        } else if (this.globalHandler != null) {
            this.globalHandler(message, peer)
        } else {
            console.error('Missing global handler for receiving messages.')
        }
    }
}

export default Dispatcher