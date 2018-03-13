const fs = require('fs');
const solc = require('solc');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let source = fs.readFileSync('test.sol', 'utf8');
let compiledContract = solc.compile(source, 1);
let abi = compiledContract.contracts[':helloWorld'].interface;
let bytecode = compiledContract.contracts[':helloWorld'].bytecode;

let gasEstimate = web3.eth.estimateGas({data: bytecode});
let MyContract = web3.eth.contract(JSON.parse(abi));

var myContractReturned = MyContract.new({
	    from: '0x24ea8b9c8d286264ad28f2afbf3fac84926931f8',
	    data: bytecode,
	    gas: gasEstimate
    }, function(err, myContract){
	    if(!err) {
	        console.log('abi: ', JSON.parse(abi))
	       // NOTE: The callback will fire twice!
	       // Once the contract has the transactionHash property set and once its deployed on an address.

	       // e.g. check tx hash on the first call (transaction send)
	       if(!myContract.address) {
	           console.log('txHash: ', myContract.transactionHash) // The hash of the transaction, which deploys the contract
	       
	       // check address on the second call (contract deployed)
	       } else {
	           console.log('contractAddress: ', myContract.address) // the contract address
	       }
	       // Note that the returned "myContractReturned" === "myContract",
	       // so the returned "myContractReturned" object will also get the address set.
	    }
  	}
);






