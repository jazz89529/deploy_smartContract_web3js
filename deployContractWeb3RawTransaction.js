const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const Tx = require('ethereumjs-tx');

let privateKey = new Buffer('7ffaf68ea91fa69d3f650cabba3d218816125bb867cd31b994ea00b79dda096e', 'hex');

let source = fs.readFileSync('test.sol', 'utf8');// solc file source decided by yourself
let compiledContract = solc.compile(source, 1);
let abi = compiledContract.contracts[':helloWorld'].interface;
let bytecode = compiledContract.contracts[':helloWorld'].bytecode;

// Contract object
const MyContract = web3.eth.contract(JSON.parse(abi));

// Get contract data
const contractData = MyContract.new.getData({
    data: '0x' + bytecode
});

const gasPrice = web3.eth.gasPrice;
const gasPriceHex = web3.toHex(gasPrice);
const gasLimitHex = web3.toHex(300000);

const nonce = web3.eth.getTransactionCount(web3.eth.coinbase);
const nonceHex = web3.toHex(nonce);

const rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    data: contractData,
    from: web3.eth.coinbase
};

const tx = new Tx(rawTx);
tx.sign(privateKey);
const serializedTx = tx.serialize();

web3.eth.sendRawTransaction(serializedTx.toString('hex'), (err, hash) => {
    if (err) { console.log(err); return; }

    // Log the tx, you can explore status manually with eth.getTransaction()
    console.log('contract creation tx: ' + hash);

    // Wait for the transaction to be mined
    waitForTransactionReceipt(hash);
});

function waitForTransactionReceipt(hash) {
    console.log('waiting for contract to be mined');
    const receipt = web3.eth.getTransactionReceipt(hash);
    // If no receipt, try again in 1s
    if (receipt == null) {
        setTimeout(() => {
            waitForTransactionReceipt(hash);
        }, 1000);
    } else {
        // The transaction was mined, we can retrieve the contract address
        console.log('contract address: ' + receipt.contractAddress);
        //testContract(receipt.contractAddress);
    }
}


