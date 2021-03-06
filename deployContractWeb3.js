const fs = require('fs');
const solc = require('solc');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let source = fs.readFileSync('test.sol', 'utf8');// solc file source decided by yourself
let compiledContract = solc.compile(source, 1);
let abi = compiledContract.contracts[':helloWorld'].interface;
let bytecode = compiledContract.contracts[':helloWorld'].bytecode;

let gasEstimate = web3.eth.estimateGas({data: bytecode});
let MyContract = web3.eth.contract(JSON.parse(abi));

let myContractReturned = MyContract.new({
	    from: '0x24ea8b9c8d286264ad28f2afbf3fac84926931f8', // account address decided by yourself
	    data: bytecode,
	    gas: gasEstimate
    }, function(err, myContract){
	    if(!err) {
	        console.log('abi: ', JSON.parse(abi))
	       if(!myContract.address) {
	           console.log('txHash: ', myContract.transactionHash)
	       } else {
	           console.log('contractAddress: ', myContract.address) 
	       }
	    }
  	}
);