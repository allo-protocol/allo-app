import { expect } from "chai";
import { ethers } from "hardhat";
import { Strategy } from "../typechain-types";

describe("Strategy", function () {
  let strategy: Strategy;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const strategyFactory = await ethers.getContractFactory("Strategy");
    strategy = (await strategyFactory.deploy(owner.address)) as Strategy;
    await strategy.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const [owner] = await ethers.getSigners();
      expect(await strategy.owner()).to.equal(owner.address);
    });
  });
});
