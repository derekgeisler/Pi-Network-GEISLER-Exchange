import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PiSwapABI from './PiSwapABI.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          setWeb3(web3Instance);

          const contractAddress = '0x...'; // Your deployed contract address
          const contractInstance = new web3Instance.eth.Contract(PiSwapABI, contractAddress);
          setContract(contractInstance);
        } catch (error) {
          console.error("User denied account access");
        }
      }
    }
    initWeb3();
  }, []);

  async function addLiquidity(token, amount) {
    await contract.methods.addLiquidity(token, amount).send({ from: account });
  }

  async function swap(fromToken, toToken, amount) {
    await contract.methods.swap(fromToken, toToken, amount).send({ from: account });
  }

  return (
    <div>
      <h1>Pi Network DeFi Exchange</h1>
      <p>Connected Account: {account}</p>
      {/* Add your UI components here */}
    </div>
  );
}

export default App;
