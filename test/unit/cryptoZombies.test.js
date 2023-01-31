const chai = require("chai");
const eventemitter2 = require("chai-eventemitter2");

chai.use(eventemitter2());

const { expect, assert } = require("chai");
const { deployments, ethers } = require("hardhat");

describe("cryptoZombies", function () {
  let deployer, accounts, alice, bob;
  const zombieNames = ["Zombie 1", "Zombie 2"];

  beforeEach("CryptoZombies", async function () {
    //deployer = (await getNamedAccounts()).deployer;
    accounts = await ethers.getSigners();
    [deployer, alice, bob] = accounts;
    await deployments.fixture(["all"]);
    cryptoZombiesContract = await ethers.getContract("CryptoZombies");
  });

  describe("createRandomZombies", () => {
    it("should be able to create a new zombie", async () => {
      const aliceZombie = cryptoZombiesContract.connect(alice);
      const tx = await aliceZombie.createRandomZombie(zombieNames[0]);
      await tx.wait();
      const aliceZombieName = await aliceZombie.zombies(0);
      //console.log(aliceZombie);
      assert(tx);
      expect(tx).to.emit(aliceZombie, "NewZombie");
      assert.equal(aliceZombieName[0], zombieNames[0]);
    });
    it("should not allow two zombies", async () => {
      const aliceZombie = cryptoZombiesContract.connect(alice);
      await aliceZombie.createRandomZombie(zombieNames[0]);
      await expect(aliceZombie.createRandomZombie(zombieNames[0])).to.be
        .reverted;
    });
  });
  describe("with the single-step transfer scenario", () => {
    it("should transfer a zombie", async () => {});
  });
});
