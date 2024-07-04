import { useState, useEffect } from "react";
import { ethers } from "ethers";
import vinceCharityDonationABI from "../artifacts/contracts/VinceCharityDonation.sol/VinceCharityDonation.json";

export default function HomePage() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const vinceCharityDonation_ABI = vinceCharityDonationABI.abi;

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, vinceCharityDonation_ABI, signer);
      setContract(contractInstance);

      provider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });

      contractInstance.totalContribution().then(balance => {
        setBalance(ethers.utils.formatEther(balance));
      });
    }
  }, []);

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  const contribute = async (amount) => {
    if (contract) {
      try {
        const tx = await contract.contribute({
          value: ethers.utils.parseEther(amount.toString())
        });
        await tx.wait();
        const newBalance = await contract.totalContribution();
        setBalance(ethers.utils.formatEther(newBalance));
      } catch (error) {
        console.error("Error contributing:", error);
      }
    }
  };

  const extractFunds = async () => {
    if (contract) {
      try {
        const tx = await contract.extractFunds();
        await tx.wait();
        const newBalance = await contract.totalContribution();
        setBalance(ethers.utils.formatEther(newBalance));
      } catch (error) {
        console.error("Error extracting funds:", error);
      }
    }
  };

  return (
    <main className="container">
      <header>
        <h1>Vince Charity Donation DApp</h1>
      </header>
      {!account && (
        <button className="connect-button" onClick={connectWallet}>Connect to MetaMask</button>
      )}
      {account && (
        <div className="account-info">
          <p>Your Account: {account}</p>
          <p>Total Contribution: {balance} ETH</p>
          <div className="buttons">
            <button className="contribute-button" onClick={() => contribute(1)}>Contribute 1 ETH</button>
            <button className="extract-button" onClick={extractFunds}>Extract Funds</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Arial', sans-serif;
        }
        header {
          margin-bottom: 2rem;
          text-align: center;
        }
        h1 {
          font-size: 3rem;
          color: #333;
          margin-bottom: 0.5rem;
        }
        .connect-button,
        .contribute-button,
        .extract-button {
          padding: 1rem 2rem;
          margin: 0.5rem;
          font-size: 1.2rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .connect-button {
          background-color: #6c63ff;
          color: #fff;
        }
        .connect-button:hover {
          background-color: #5a54d8;
        }
        .account-info {
          text-align: center;
        }
        .buttons {
          margin-top: 1rem;
        }
        .contribute-button {
          background-color: #28a745;
          color: #fff;
        }
        .contribute-button:hover {
          background-color: #218838;
        }
        .extract-button {
          background-color: #dc3545;
          color: #fff;
        }
        .extract-button:hover {
          background-color: #c82333;
        }
        p {
          font-size: 1.2rem;
          color: #555;
          margin: 0.5rem 0;
        }
      `}</style>
    </main>
  );
  
}
