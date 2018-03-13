const fs = require('fs');
const solc = require('solc');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let myContractAddress = '0xbe457c816bf0893cb3a152ce2d40d0c52bac2eb5'; // decided by your contract deployed

let abi = [ // abi decided by your contract compiled
    {
        "constant": false,
        "inputs": [],
        "name": "renderHelloWorld",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

let myContract = web3.eth.contract(abi).at(myContractAddress);

let data = myContract.renderHelloWorld.call(); // decided by your contract function

console.log(data);




