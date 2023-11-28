import Web3 from "web3";
import axios from "axios";

export async function mint() {
  const nextMint = localStorage.getItem("nextMint");
  if (nextMint && parseInt(nextMint) > Date.now()) {
    throw new Error("Please wait 24 hours before minting again");
  }

  if (!window.ethereum) throw new Error("Please install MetaMask");

  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.requestAccounts();
  if (!accounts || !accounts.length)
    throw new Error("Please connect to MetaMask");

  localStorage.setItem("wallet", accounts[0]);
  localStorage.setItem("nextMint", `${Date.now() + 1000 * 60 * 60 * 24}`);

  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/mint/${accounts[0]}`
  );

  return response.data;
}
