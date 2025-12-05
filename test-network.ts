import hre from "hardhat";

console.log("Available networks:", Object.keys(hre.config.networks || {}));
console.log("Current network name:", hre.network.name);
console.log("Current network config:", hre.network.config);
