import React, { Component } from 'react'
// import logo from './logo.svg'
import './App.css'
import {default as chainManager} from './models/actions/chainmanager'


import {default as Key} from './models/key'
import {default as Blockchain} from './models/blockchain'


let chainmanager = new chainManager()

chainmanager.createNewChain()

for(let i=0; i < chainmanager.chainsNum; i++) {
    let id = chainmanager.ids[i]
    // let chain = chainmanager.chains[i]
    for(let j=0; j < 3; j++) {
        chainmanager.addBlockToChain(id, 'test message')
    }
}

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
                    <p>option + command + i to check local storage</p>
                </div>
            </div>
            
        )
    }
}

export default App
