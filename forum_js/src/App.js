import React, { Component } from 'react'
// import logo from './logo.svg'
import './App.css'
import {default as chainManager} from './models/actions/chainmanager'


import {default as Key} from './models/key'
import {default as Blockchain} from './models/blockchain'


// let TopicData = [
//     {title: 'Why choose to go to the moon', author: 'Vergil', replies: 12324215, last: 'Hao Qian'},
//     {title: 'We choose to build this!', author: 'Hao Qian', replies: 45234561, last: 'Vergil'},
//     {title: 'Something that so cool!', author: 'Anonymous', replies: 12324215, last: 'Anonymous'},
//     {title: 'Bitcoin Core 16.0 Released', author: 'Hao Qian', replies: 12324215, last: 'Hao Qian'},
//     {title: 'How to find a good programmer to do custom development in my exchange ?', author: 'David', replies: 12324215, last: 'Jack'},
//     {title: 'How does margin trade settlement work?', author: 'Vergil', replies: 12324215, last: 'Haoqian'},
// ]

let chainmanager = new chainManager()

chainmanager.createNewChain()

for(let i=0; i < chainmanager.chainsNum; i++) {
    let id = chainmanager.ids[i]
    // let chain = chainmanager.chains[i]
    for(let j=0; j < 3; j++) {
        chainmanager.addBlockToChain(id, 'test message')
    }
}
// let mykey = new Key('111')
// let mypk = mykey.getPublicKey()
// let key = {}
// key['111'] = mykey

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    {/* <img src={logo} className="App-logo" alt="logo" /> */}
                    <h1 className="App-title">Blockchain Test</h1>
                </header>
                <div id="data_input">
                    <input id="Text1" type="text" />
                    <input id="btnAddInput" type="button" value="create" onclick="add()" />
                    <br />
                    <p>test</p>
                    <p>111</p>
                </div>
            </div>
            
        )
    }
}

export default App
