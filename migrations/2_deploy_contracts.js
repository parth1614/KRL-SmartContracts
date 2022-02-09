const KRL = artifacts.require('KRL.sol');
const BMC = artifacts.require('BlueMonsterCoin.sol');
const TokenSwap = artifacts.require('TokenSwap.sol');

module.exports = async function(deployer){
    let KRLaddress;
    let BMCaddress;
    await deployer.deploy(KRL).then(() => {
        KRLaddress = KRL.address;
        console.log("KRL address: " + KRLaddress);
    });
    await deployer.deploy(BMC).then(() => {
        BMCaddress = BMC.address;
        console.log("BMC address: " + BMCaddress);
    });
    await deployer.deploy(TokenSwap, KRLaddress, BMCaddress);
};