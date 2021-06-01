const Token = artifacts.require("MyToken");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require('dotenv').config({path: '../.env'});

contract("Token Test",  function(accounts) {
    const [initialHolder, recipient, anotherAccount] = accounts;

    beforeEach(async () => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })

    it("All token should be in my account", async() => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("I can send tokens from Account 1 to Account 2", async() => {
        const sendTokens = new BN(1);
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);

        await instance.transfer(recipient, sendTokens);
        expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(sendTokens));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(sendTokens);
    });

    it("It's not possible to send more tokens than available in total", async () => {
        let instance = this.myToken;
        let accountBalance = await instance.balanceOf(initialHolder);

        expect(instance.transfer(recipient, new BN(accountBalance+1))).to.eventually.be.rejected;

        //check if the balance is still the same
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(accountBalance);
    });
})
