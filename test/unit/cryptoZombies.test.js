// const chai = require("chai");
// const eventemitter2 = require("chai-eventemitter2");

// chai.use(eventemitter2());

const { expect, assert } = require("chai");
const { Signer } = require("ethers");
const { deployments, ethers } = require("hardhat");

describe("cryptoZombies", function () {
  let deployer, accounts, alice, bob, aliceZombie;
  const zombieNames = ["Zombie 1", "Zombie 2"];

  beforeEach("CryptoZombies", async function () {
    //deployer = (await getNamedAccounts()).deployer;
    accounts = await ethers.getSigners();
    [deployer, alice, bob] = accounts;
    await deployments.fixture(["all"]);
    cryptoZombiesContract = await ethers.getContract("CryptoZombies");
    aliceZombie = cryptoZombiesContract.connect(alice);
  });

  describe("createRandomZombies", () => {
    it("should be able to create a new zombie", async () => {
      //const aliceZombie = cryptoZombiesContract.connect(alice);
      const tx = await aliceZombie.createRandomZombie(zombieNames[0]);
      await tx.wait(1);
      const aliceZombieName = await aliceZombie.zombies(0);
      //console.log(aliceZombie);
      assert(tx);
      expect(tx).to.emit(aliceZombie, "NewZombie");
      assert.equal(aliceZombieName[0], zombieNames[0]);
    });
    it("should not allow to create two zombies", async () => {
      //const aliceZombie = cryptoZombiesContract.connect(alice);
      await aliceZombie.createRandomZombie(zombieNames[0]);
      await expect(aliceZombie.createRandomZombie(zombieNames[0])).to.be
        .reverted;
    });
  });

  describe("with the single-step transfer scenario", () => {
    it("should transfer a zombie", async () => {
      //const aliceZombie = cryptoZombiesContract.connect(alice);
      const txResponse = await aliceZombie.createRandomZombie(zombieNames[0]);
      const txReceipt = await txResponse.wait(1);
      const zombieId = txReceipt.events[0].args.zombieId;
      await aliceZombie.transferFrom(alice.address, bob.address, zombieId);
      const newOwner = await cryptoZombiesContract.ownerOf(zombieId);

      //expect(newOwner).to.equal(bob.address);
      assert.equal(newOwner.toString(), bob.address);
    });
  });

  describe("with the two-step transfer scenario", () => {
    let bobZombie, zombieId;
    beforeEach("two-step transfer", async () => {
      bobZombie = await cryptoZombiesContract.connect(bob);
      const txResponse = await aliceZombie.createRandomZombie(zombieNames[0]);
      const txReceipt = await txResponse.wait(1);
      zombieId = txReceipt.events[0].args.zombieId;
    });

    it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
      await aliceZombie.approve(bob.address, zombieId);
      await bobZombie.transferFrom(alice.address, bob.address, zombieId);
      const newOwner = await cryptoZombiesContract.ownerOf(zombieId);

      expect(newOwner).to.equal(bob.address);
    });
    it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
      await aliceZombie.approve(bob.address, zombieId);
      await aliceZombie.transferFrom(alice.address, bob.address, zombieId);
      const newOwner = await cryptoZombiesContract.ownerOf(zombieId);

      expect(newOwner).to.equal(bob.address);
    });
  });
});
