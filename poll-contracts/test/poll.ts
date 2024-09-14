import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

const hashedMessage =
  "0x7a32319cef71b26160542c98ae926eff5c43c36439186cbf0f07a6131e7d4b21";
const r = "0x67a74e5282fb03e63a90a7a5341d9ebdc4f9a630addf7fdb5095ab8c1cb633cb";
const s = "0x1456e25f8e66bfc0a0ae7db35b52d23f10967fb3c17c20639c474249faf7eaa2";
const v = 27;
const originalSigner = "0x999";

describe("Poll", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPollFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const poll = await hre.viem.deployContract("Poll");

    const publicClient = await hre.viem.getPublicClient();

    return {
      poll,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { poll, owner } = await loadFixture(deployPollFixture);

      expect(await poll.read.owner()).to.equal(
        getAddress(owner.account.address)
      );
    });
  });
  describe("Create Event", function () {
    it("should create a poll event", async function () {
      const { poll, owner } = await loadFixture(deployPollFixture);
      await poll.write.createPollEvent(["1", ["kroos", "muller", "nuer"]]);
      const candidate1 = await poll.read.eventList(["1", BigInt(0)]);
      const candidate2 = await poll.read.eventList(["1", BigInt(1)]);
      const candidate3 = await poll.read.eventList(["1", BigInt(2)]);
      expect(candidate1.toString()).to.equal(`1,kroos,0`);
      expect(candidate2.toString()).to.equal(`2,muller,0`);
      expect(candidate3.toString()).to.equal(`3,nuer,0`);
    });
  });
  describe("Verify", function () {
    it("should verify the same address", async function () {
      const { poll, owner } = await loadFixture(deployPollFixture);
      expect(
        await poll.read.verify([hashedMessage, v, r, s, originalSigner])
      ).to.equal(true);
    });
  });

  describe("vote", function () {
    it("Should vote the candidate successfully", async function () {
      const { poll, owner } = await loadFixture(deployPollFixture);

      await poll.write.createPollEvent(["1", ["kroos", "muller", "nuer"]]);
      await poll.write.vote([
        "1",
        BigInt(1),
        hashedMessage,
        v,
        r,
        s,
        originalSigner,
      ]);
      const candidate1 = await poll.read.eventList(["1", BigInt(0)]);
      expect(candidate1[2].toString()).to.equal("1");
    });
  });
});
