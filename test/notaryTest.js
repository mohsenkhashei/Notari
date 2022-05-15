var NotaryArtifact = artifacts.require('./Notary.sol');

contract('NotaryContract', function (accounts) {
	it('this is my testCase', function () {
		return NotaryArtifact.deployed().then(function (instance) {
			// console.log(instance);
		});
	});

	it('should not have an entry for a test-hash', async function () {
		return NotaryArtifact.deployed().then(async function (instance) {
			try {
				await instance.entrySet(
					'0x571AE3370F84D2C6C4F6CB857146F32BCDB3BDAF14D105F30B5DD93EFDE17A44'
				);
				assert.fail(
					true,
					true,
					'expected an exception, but it just went through. check entryset!'
				);
			} catch (err) {
				if (err.message.search('revert') >= 0) {
					assert.equal(
						err.message.search('revert') >= 0,
						true,
						'error message does not reflect expected exception message.'
					);
				} else {
					throw err;
				}
			}
		});
	});

	it('should be able to add and then read an entry', async () => {
		let instance = await NotaryArtifact.deployed();
		await instance.addEntry(
			'0x571ae3370f84d2c6c4f6cb857146f32bcdb3bdaf14d105f30b5dd93efde17a44',
			'test',
			'test'
		);
		let entry = await instance.entrySet(
			'0x571ae3370f84d2c6c4f6cb857146f32bcdb3bdaf14d105f30b5dd93efde17a44'
		);
		assert.equal(entry[0], 'test', 'filename should be test');
		assert.equal(
			entry[1].toNumber() >= 1,
			true,
			'timestamp should be bigger than 1'
		);
		assert.equal(entry[2], 'test', 'comment should be test');
		assert.equal(
			entry[3],
			accounts[0],
			'sending transaction should be from account 0'
		);
	});
});
