const TokenSwap = artifacts.require("TokenSwap");
const BMC = artifacts.require("BlueMonsterCoin");
const KRL = artifacts.require("KRL");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("TokenSwap", function (accounts) {
  let krlinstance;
  let bmcinstance;
  let tokenSwapinstance;
  it("Deployed and initialized KRL", async () => {
    krlinstance = await KRL.deployed();
    krlinstance.initialize();
    assert.ok(krlinstance);
  });
  it("Deployed BMC", async () => {
    bmcinstance = await BMC.deployed();
    assert.ok(bmcinstance);
  });
  it("Deployed TokenSwap", async function () {
    tokenSwapinstance = await TokenSwap.deployed();
    assert.ok(tokenSwapinstance);
  });
  it("Mint KRL for accounts[1]", async () => {
    await krlinstance.mint(accounts[1], 100 * 10**decimals());
    let balance = await krlinstance.balanceOf(accounts[1]);
    assert.equal(balance.toNumber(), 100 * 10**decimals());
  });
  it("Mint BMC for tokenSwap address", async () => {
    await bmcinstance.mint(tokenSwapinstance.address, 100 * 10**decimals());
    let balance = await bmcinstance.balanceOf(tokenSwapinstance.address);
    assert.equal(balance.toNumber(), 100 * 10**decimals());
  });
  it("Swap 40 KRL for 1 BMC", async () => {
    krlinstance.swapKRL(40 * 10**decimals())
    let krlbalance = await krlinstance.balanceOf(accounts[1]);
    let bmcbalance = await bmcinstance.balanceOf(accounts[1]);
    // assert.equal(krlbalance.toNumber(), 60 * 10**decimals());
    assert.equal(bmcbalance.toNumber(), 1 * 10**decimals());
  });
});
