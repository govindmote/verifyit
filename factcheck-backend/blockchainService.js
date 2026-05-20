const { ethers } = require("ethers");
const contract = require("./blockchain/VerifyIt.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const verifyItContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contract.abi,
  wallet
);

const storeVerdictOnChain = async (claimId, title, verdict, trueVotes, falseVotes) => {
  try {
    console.log(`â›“ Storing verdict on chain for claim: ${claimId}`);
    const tx = await verifyItContract.storeVerdict(
      claimId,
      title,
      verdict,
      BigInt(Math.round(trueVotes)),
      BigInt(Math.round(falseVotes)),
      { gasPrice: ethers.parseUnits("30", "gwei"), gasLimit: 500000 }
    );
    console.log(`â›“ Transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`âœ… Confirmed in block: ${receipt.blockNumber}`);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      network: "polygon-amoy"
    };
  } catch (err) {
    console.error("Blockchain error:", err.message);
    return null;
  }
};

const getVerdictFromChain = async (claimId) => {
  try {
    const result = await verifyItContract.getVerdict(claimId);
    return {
      title: result[0],
      verdict: result[1],
      trueVotes: Number(result[2]),
      falseVotes: Number(result[3]),
      timestamp: Number(result[4])
    };
  } catch (err) {
    return null;
  }
};

module.exports = { storeVerdictOnChain, getVerdictFromChain };
