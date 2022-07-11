const { ethers } = require('hardhat');
const hh = require('hardhat');
const { expect } = require("chai");
const { faker } = require('@faker-js/faker');

describe("Libraverse Tokens", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
    let libraverse;

    beforeEach(async() => {
        const Libraverse = await ethers.getContractFactory('Libraverse');
        libraverse = await Libraverse.deploy();
    });

    it('Create book token', async function() {
        const name = faker.lorem.words();
        await libraverse.create(name)
    });

    it('Fix', async function() {
        // console.log('libraverse:', libraverse);
        // libraverse.
    });
});
