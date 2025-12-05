import hre from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Starting AidRoute deployment...");

  // Get network info
  const networkName = hre.network.name;
  console.log("📋 Deployment Configuration:");
  console.log(`  - Network: ${networkName}`);

  // PYUSD address on Sepolia
  const PYUSD_ADDRESS = process.env.PYUSD_ADDRESS || "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
  console.log(`  - PYUSD Address: ${PYUSD_ADDRESS}`);

  // Get wallet client and public client
  const walletClient = await hre.viem.getWalletClient();
  const publicClient = await hre.viem.getPublicClient();

  console.log(`  - Deployer: ${walletClient.account.address}`);

  // Get deployer balance
  const balance = await publicClient.getBalance({
    address: walletClient.account.address,
  });
  console.log(`  - Deployer Balance: ${(Number(balance) / 1e18).toFixed(4)} ETH`);

  if (balance === 0n) {
    throw new Error("❌ Deployer account has no ETH for gas fees");
  }

  // Deploy AidRouteMissions contract
  console.log("\n📦 Deploying AidRouteMissions contract...");
  
  const aidRouteMissions = await hre.viem.deployContract("AidRouteMissions", [PYUSD_ADDRESS]);

  console.log("\n✅ Deployment successful!");
  console.log(`📍 AidRouteMissions deployed to: ${aidRouteMissions.address}`);

  // Wait for a few block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  const deploymentTx = aidRouteMissions.deploymentTransaction();
  if (deploymentTx) {
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: deploymentTx.hash,
      confirmations: 3,
    });
    
    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

    // Display useful information
    console.log("\n📊 Deployment Summary:");
    console.log(`  - Contract Address: ${aidRouteMissions.address}`);
    console.log(`  - Transaction Hash: ${receipt.transactionHash}`);
    console.log(`  - Gas Used: ${receipt.gasUsed.toString()}`);
    console.log(`  - Block Number: ${receipt.blockNumber}`);
  }

  // Get initial contract stats
  console.log("\n📊 Initial Contract State:");
  try {
    const stats = await aidRouteMissions.read.getStats();
    console.log("  - Total Missions:", stats[0].toString());
    console.log("  - Total Donations:", stats[1].toString());
    console.log("  - Total Deployed:", stats[2].toString());
    console.log("  - General Fund:", stats[3].toString());
    console.log("  - Contract Balance:", stats[4].toString());

    const owner = await aidRouteMissions.read.owner();
    console.log("  - Owner:", owner);
  } catch (err) {
    console.log("  ⚠️  Couldn't fetch stats yet, contract may not be fully ready.");
  }
  // Verify contract on Etherscan (optional)
  if (networkName === "sepolia" && process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 Verifying contract on Etherscan...");
    console.log(`  npx hardhat verify --network sepolia ${aidRouteMissions.address} ${PYUSD_ADDRESS}`);
    try {
      await hre.run("verify:verify", {
        address: aidRouteMissions.address,
        constructorArguments: [PYUSD_ADDRESS],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ Contract already verified on Etherscan");
      } else {
        console.log("⚠️  Verification failed:", error.message);
      }
    }
  }

  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });