import Web3 from 'web3';
import { default as contract } from 'truffle-contract';

import notary_arrifact from '../../build/contracts/Notary.json';

var Notary = contract(notary_arrifact);

var accounts;
var account;

window.App = {
	start: function () {
		var self = this;

		Notary.setProvider(web3.currentProvider);

		web3.eth.getAccounts(function (err, accs) {
			if (err != null) {
				alert('There was an error fetching your accounts.');
				return;
			}

			if (accs.length == 0) {
				alert(
					"Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
				);
				return;
			}

			accounts = accs;
			account = accounts[0];
			Notary.defaults({ from: account });

			self.refreshBalance();
		});
	},
	processSend: function () {
		if (document.querySelector('#fileHash').value.length == 66) {
			var fileHash = document.querySelector('#fileHash').value;
			var fileName = document.querySelector('#fileName').value;
			var comment = document.querySelector('#comment').value;
			document.querySelector('#status').innerHTML = '';
			App.appendStatus('sending transaction ...');

			Notary.deployed()
				.then((instance) => {
					return instance.addFile(fileHash, fileName, comment, {
						from: account,
						gas: 3000000,
					});
				})
				.then((res) => {
					App.appendStatus(' [ok] <br />');
					App.appendStatus(' result- object in console!');
					console.log(res);
				})
				.catch((error) => {
					App.appendStatus(' [error] <br />');
					App.appendStatus(' error in console!');
					console.log(error);
				});
		}
		return false;
	},
};

window.addEventListener('load', function () {
	if (typeof web3 !== 'undefined') {
		console.warn(
			"using web3 detected from external source. if you find your accounts don't work, make sure you've configured that source properly. if you can't find that, you can switch to the testRPC below."
		);
		window.web3 = new Web3(Web3.currentProvider);
	} else {
		console.warn('no web3 detected');
		window.web3 = new Web3(
			new Web3.providers.HttpProvider('http://localhost:7545')
		);
	}

	App.start();
});
