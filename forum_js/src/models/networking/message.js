
class Message {

    // how to make Type be constant...
    static Type = {
        BROADCAST: 'broadcast',
        QUESTION: 'question',
        ANSWER: 'answer',
        ERROR: 'error',
    }

    constructor(content = {}, type = Message.Type.QUESTION, identifier = '') {
        
        let identifierGenerator = () => {
            let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
                'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
            ]
            let str = ''
            for (let i = 0; i < 10; i++) {
                let pos = Math.round(Math.random() * (arr.length - 1))
                str += arr[pos]
            }
            return str
        }

        this.content = content
        this.type = type
        this.identifier = identifier !== '' ? identifier : identifierGenerator()
    }

    static load(jsonString) {
        try {
            let json = JSON.parse(jsonString)
            let msg = new Message()
            msg.identifier = json['identifier']
            msg.type = json['type']
            msg.content = json['content']
            return msg
        } catch (e) {
            // console.log(e)
            return null
        }
    }

    dump() {
        let json = {
            'identifier': this.identifier,
            'type': this.type,
            'content': this.content
        }
        return JSON.stringify(json)
    }

    // repr() {
    //     return '<Message: ' + this.identifier + ' - ' + this.type.name + '>'
    // }
}

export default Message 