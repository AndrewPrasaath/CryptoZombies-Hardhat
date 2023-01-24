const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  //const chainId = network.config.chainId;

  const cryptoZombies = await deploy("CryptoZombies", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(
    "-------------------------------------------------------------------------"
  );

  //verification
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(cryptoZombies.address);
  }
};

module.exports.tags = ["all", "cryptozombies"];
