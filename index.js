const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
})
let blockNumber = web3.eth.blockNumber;


for(let i = 1; i <= blockNumber; i++){
    let res = web3.eth.getBlock(i);
        client.create({
            "index": 'blockchain', // DB
            "type": 'blockInformation', // table
            "id": 500+i,
            "body": res
        })
}




