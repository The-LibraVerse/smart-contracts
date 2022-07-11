const { ethers } = require('hardhat');
const { expect } = require("chai");
const { faker } = require('@faker-js/faker');
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {ZERO_ADDRESS: zeroAddress} = require('./constants');

describe("Libraverse Tokens", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    let libraverse, accounts;

    beforeEach(async() => {
        accounts = await ethers.getSigners();
        const Libraverse = await ethers.getContractFactory('Libraverse');
        libraverse = await Libraverse.deploy(faker.internet.url());
    });

    it('Create: should mint new token', async function() {
        const creator = accounts[5];
        const name = faker.lorem.words(), amount=500;

        const createTx = libraverse.connect(creator).create(name, amount)
        await expect(createTx).to.emit(libraverse, 'TransferSingle')
            .withArgs(creator.address, zeroAddress, creator.address, anyValue, anyValue);

        // await libraverse.connect(creator).create(name, amount)
        expect(await libraverse.balanceOf(creator.address, 1)).to.equal(amount);
    });

    it('Create: should not overwrite previously created/minted tokens', function() {
        let promiseChain = Promise.resolve();

        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 5, 3].forEach(async (accountsIndex, i) => {
            accountsIndex = accountsIndex % 10;
            const creator = accounts[accountsIndex];
            const name = faker.lorem.words(), amount=faker.datatype.number();

            const tokenID = i + 1;

            promiseChain = promiseChain
                .then(() => libraverse.connect(creator).create(name, amount))
                .then(async () => expect(await
                    libraverse.balanceOf(creator.address, tokenID), 'Token ID:' + tokenID).to.equal(amount));
        });

        return promiseChain;
    });

    it('Allow token creators mint extra copies of their tokens', async function() {
        const creator = accounts[5];
        const name = faker.lorem.words(), amount=500, amount2=faker.datatype.number();
        const tokenID = 1;

        await libraverse.connect(creator).create(name, amount)

        await expect(libraverse.connect(creator).mint(tokenID, amount2))
            .to.emit(libraverse, 'TransferSingle')
            .withArgs(creator.address, zeroAddress, creator.address, anyValue, anyValue);

        expect(await libraverse.balanceOf(creator.address, tokenID),
            'Token ID:' + tokenID).to.equal(amount + amount2);
    });

    it('Do not allow wallets mint copies of tokens they did not create', async function() {
        const creator = accounts[5], badActor = accounts[7];
        const name = faker.lorem.words(), amount=500, amount2=faker.datatype.number();
        const tokenID = 1;

        await libraverse.connect(creator).create(name, amount)

        await expect(libraverse.connect(badActor).mint(tokenID, amount2))
            .to.be.reverted;

        expect(await libraverse.balanceOf(creator.address, tokenID),
            'Token ID:' + tokenID).to.equal(amount);

        expect(await libraverse.balanceOf(badActor.address, tokenID),
            'Token ID:' + tokenID).to.equal(0);
    })

    it('Create token with metadata URI', function() {
        let promiseChain = Promise.resolve();

        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 5, 3].forEach(async (accountsIndex, i) => {
            accountsIndex = accountsIndex % 10;
            const creator = accounts[accountsIndex];
            const metadataURI = faker.internet.url(), amount=faker.datatype.number();

            const tokenID = i + 1;

            promiseChain = promiseChain
                .then(() => libraverse.connect(creator).create(metadataURI, amount))
                .then(() => libraverse.uri(tokenID))
                .then(res => expect(res, 'Token ID:' + tokenID).to.equal(metadataURI));
        });

        return promiseChain;
    });
});
