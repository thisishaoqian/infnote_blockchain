import React, { Component } from 'react'
// import logo from './logo.svg'
import './App.css'
// import {default as chainManager} from './models/actions/chainmanager'
// import {default as Key} from './models/key'
// import {default as Blockchain} from './models/blockchain'

import {Block, Blockchain} from './models/blockchain/objects'
import {default as Key} from './models/blockchain/key' 


// let block = new Block({
//     'chain_id': 'QvCAeP8b6oGYwc5EGmUdnSwN2wLuGBFcm3DN1RADC87KjLstZigsVDkvz3YsjfBkqxcVQRTir6aiTnvg2ssc4Qxi',
//     'hash': '25r7uNHrXHNPmT8hNH5cmDCVdv2TqTvW4aGYWQQps7MX',
//     'height': 0,
//     'payload': '{"author":"Vergil Choi","desc":"Created on iOS.","email":"vergil@infnote.com","name":"Swift Chain","version":"0.1","website":"infnote.com"}',
//     'signature': '381yXYiPHmgFM2wLXx3MrSxzso4hWsnRYub7hdzi18agv1eLNvLz2mQ7C91d1Ktw3hyDUFjBjssEdgkJDTjkazvfc5TWW1AX',
//     'time': 1538562151
// })

// // Check the block
// if (block.isValid) {
//     console.log('Valid block received.')
// }
// else{
//     console.log('Invalid block received')
// }

// // Create a instance for exist chain
// let key = new Key(block.chainId)
// let chain = new Blockchain(key)
// console.log('Chain ID: ' + chain.id)
// let result = ''
// if (chain.isOwner)
//     result = 'YES'
// else
//     result = 'NO'
// console.log('Owner: ' + result)


// // Save chain (only public key and private key if valid) into database
// // It will check if the chain is already database
// let isSaved = chain.save()
// if (isSaved)
//     console.log('Chain saved.')
// else
//     console.log('Chain is already in database.')


// // Save block into database, it will check if the block is valid for this chain before saving
// isSaved = chain.saveBlock(block)
// if (isSaved) 
//     console.log('Block saved')
// else
//     console.log('Failed to save the block')

// // Load a block from database by height in specific chain
// block = chain.getBlock(0)
// // Or by block hash
// // block = chain.get_block(block_hash='25r7uNHrXHNPmT8hNH5cmDCVdv2TqTvW4aGYWQQps7MX')


// Get encoded data of a block
if (block != null)
    console.log(block.data)

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
                    <p>button above is fake</p>
                    <p>option + command + i to check local storage</p>
                </div>
            </div>
            
        )
    }
}

export default App
