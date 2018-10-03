
import {default as chainManager} from '../models/actions/chainmanager'


let TopicData = [
    {title: 'Why choose to go to the moon', author: 'Vergil', replies: 12324215, last: 'Hao Qian'},
    {title: 'We choose to build this!', author: 'Hao Qian', replies: 45234561, last: 'Vergil'},
    {title: 'Something that so cool!', author: 'Anonymous', replies: 12324215, last: 'Anonymous'},
    {title: 'Bitcoin Core 16.0 Released', author: 'Hao Qian', replies: 12324215, last: 'Hao Qian'},
    {title: 'How to find a good programmer to do custom development in my exchange ?', author: 'David', replies: 12324215, last: 'Jack'},
    {title: 'How does margin trade settlement work?', author: 'Vergil', replies: 12324215, last: 'Haoqian'},
]

let chainmanager = new chainManager()

chainmanager.createNewChain()

for(let i=0; i < chainmanager.chainsNum; i++) {
    let id = chainmanager.ids[i]
    for(let j=0; j < 3; j++) {
        chainmanager.addBlockToChain(id, TopicData[j])
    }
}
