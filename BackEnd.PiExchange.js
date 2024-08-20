const express = require('express');
const Web3 = require('web3');
const PiSwapABI = require('./PiSwapABI.json');

const app = express();
const web3 = new Web3('https://your-pi-network-node-url');

const contractAddress = '0x...'; // Your deployed contract address
const contract = new web3.eth.Contract(PiSwapABI, contractAddress);

app.get('/liquidity/:token', async (req, res) => {
  try {
    const totalLiquidity = await contract.methods.totalLiquidity(req.params.token).call();
    res.json({ totalLiquidity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/swap', async (req, res) => {
  const { fromToken, toToken, amount, account } = req.body;
  try {
    const result = await contract.methods.swap(fromToken, toToken, amount).send({ from: account });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
