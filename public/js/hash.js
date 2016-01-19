// appendTransactionStatsistics adds a list of statistics for a transaction to
// the dom info in the form of a set of tables.
function appendTransactionStatistics(infoBody, explorerTransaction) {
	var table = createStatsTable();
	appendStatHeader(table, 'Transaction Statistics');
	var doms = appendStat(table, 'Height', '');
	linkHeight(doms[2], explorerTransaction.height);
	doms = appendStat(table, 'ID', '');
	linkHash(doms[2], explorerTransaction.id);
	if (explorerTransaction.rawtransaction.siacoininputs != null) {
		appendStat(table, 'Siacoin Input Count', explorerTransaction.rawtransaction.siacoininputs.length);
	}
	if (explorerTransaction.rawtransaction.siacoinoutputs != null) {
		appendStat(table, 'Siacoin Output Count', explorerTransaction.rawtransaction.siacoinoutputs.length);
	}
	if (explorerTransaction.rawtransaction.filecontracts != null) {
		appendStat(table, 'File Contract Count', explorerTransaction.rawtransaction.filecontracts.length);
	}
	if (explorerTransaction.rawtransaction.filecontractrevisions != null) {
		appendStat(table, 'File Contract Revision Count', explorerTransaction.rawtransaction.filecontractrevisions.length);
	}
	if (explorerTransaction.rawtransaction.storageproofs != null) {
		appendStat(table, 'Storage Proof Count', explorerTransaction.rawtransaction.storageproofs.length);
	}
	if (explorerTransaction.rawtransaction.siafundinputs != null) {
		appendStat(table, 'Siafund Input Count', explorerTransaction.rawtransaction.siafundinputs.length);
	}
	if (explorerTransaction.rawtransaction.siafundoutputs != null) {
		appendStat(table, 'Siafund Output Count', explorerTransaction.rawtransaction.siafundoutputs.length);
	}
	if (explorerTransaction.rawtransaction.arbitrarydata != null) {
		appendStat(table, 'Arbitrary Data Count', explorerTransaction.rawtransaction.arbitrarydata.length);
	}
	infoBody.appendChild(table);

	// Add tables for each type of transaction element.
	if (explorerTransaction.rawtransaction.siacoininputs != null) {
		appendStatTableTitle(infoBody, 'Siacoin Inputs');
		for (var i = 0; i < explorerTransaction.rawtransaction.siacoininputs.length; i++) {
			var table = createStatsTable();
			var doms = appendStat(table, 'Parent ID', '');
			linkHash(doms[2], explorerTransaction.rawtransaction.siacoininputs[i].parentid);
			doms = appendStat(table, 'Address', '');
			linkHash(doms[2], explorerTransaction.siacoininputoutputs[i].unlockhash);
			appendStat(table, 'Value', readableCoins(explorerTransaction.siacoininputoutputs[i].value));
			infoBody.appendChild(table);
		}
	}
	if (explorerTransaction.rawtransaction.siacoinoutputs != null) {
		appendStatTableTitle(infoBody, 'Siacoin Outputs');
		for (var i = 0; i < explorerTransaction.rawtransaction.siacoinoutputs.length; i++) {
			var table = createStatsTable();
			var doms = appendStat(table, 'ID', '');
			linkHash(doms[2], explorerTransaction.siacoinoutputids[i]);
			doms = appendStat(table, 'Address', '');
			linkHash(doms[2], explorerTransaction.rawtransaction.siacoinoutputs[i].unlockhash);
			appendStat(table, 'Value', readableCoins(explorerTransaction.rawtransaction.siacoinoutputs[i].value));
			infoBody.appendChild(table);
		}
	}
	if (explorerTransaction.rawtransaction.filecontracts != null) {
		appendStatTableTitle(infoBody, 'File Contracts');
		for (var i = 0; i < explorerTransaction.rawtransaction.filecontracts.length; i++) {
			var table = createStatsTable();
			var doms = appendStat(table, 'ID', '');
			linkHash(doms[2],  explorerTransaction.filecontractids[i]);
			appendStat(table, 'File Size', readableBytes(explorerTransaction.rawtransaction.filecontracts[i].filesize));
			appendStat(table, 'File Merkle Root', explorerTransaction.rawtransaction.filecontracts[i].filemerkleroot);
			appendStat(table, 'Payout', readableCoins(explorerTransaction.rawtransaction.filecontracts[i].payout));
			appendStat(table, 'Revision Number', explorerTransaction.rawtransaction.filecontracts[i].revisionnumber);
			infoBody.appendChild(table);
		}
	}
	if (explorerTransaction.rawtransaction.filecontractrevisions != null) {
		appendStatTableTitle(infoBody, 'File Contract Revisions');
		for (var i = 0; i < explorerTransaction.rawtransaction.filecontractrevisions.length; i++) {
			var table = createStatsTable();
			var doms = appendStat(table, 'Parent ID', '');
			linkHash(doms[2], explorerTransaction.rawtransaction.filecontractrevisions[i].parentid);
			appendStat(table, 'New File Size', readableBytes(explorerTransaction.rawtransaction.filecontractrevisions[i].newfilesize));
			appendStat(table, 'New File Merkle Root', explorerTransaction.rawtransaction.filecontractrevisions[i].newfilemerkleroot);
			appendStat(table, 'New Revision Number', explorerTransaction.rawtransaction.filecontractrevisions[i].newrevisionnumber);
			infoBody.appendChild(table);
		}
	}
	if (explorerTransaction.rawtransaction.storageproofs != null) {
		appendStatTableTitle(infoBody, 'Storage Proofs');
		for (var i = 0; i < explorerTransaction.rawtransaction.storageproofs.length; i++) {
			var table = createStatsTable();
			var doms = appendStat(table, 'Parent ID', '');
			linkHash(doms[2], explorerTransaction.rawtransaction.storageproofs[i].parentid);
			for (var j = 0; j < explorerTransaction.storageproofoutputids[i].length; j++) {
				var doms = appendStat(table, 'Storage Proof Output ' + (j+1) + ' ID',  '');
				linkHash(doms[2], explorerTransaction.storageproofoutputids[i][j]);
				doms = appendStat(table, 'Storage Proof Output ' + (j+1) + ' Address', '');
				linkHash(doms[2], explorerTransaction.storageproofoutputs[i][j].unlockhash);
				appendStat(table, 'Storage Proof Output ' + (j+1) + ' Value', readableCoins(explorerTransaction.storageproofoutputs[i][j].value));
			}
			infoBody.appendChild(table);
		}
	}
	if (explorerTransaction.rawtransaction.siafundinputs != null) {
		appendStatTableTitle(infoBody, 'Siafund Inputs');
		for (var i = 0; i < explorerTransaction.rawtransaction.siafundinputs.length; i++) {
			var table = createStatsTable();
			var doms = appendStat(table, 'Parent ID', '');
			linkHash(doms[2], explorerTransaction.rawtransaction.siafundinputs[i].parentid);
			doms = appendStat(table, 'Address', '');
			linkHash(doms[2], explorerTransaction.siafundinputoutputs[i].unlockhash);
			appendStat(table, 'Value', explorerTransaction.siafundinputoutputs[i].value);
			infoBody.appendChild(table);
		}
	}
	if (explorerTransaction.rawtransaction.siafundoutputs != null) {
		appendStatTableTitle(infoBody, 'Siafund Outputs');
		for (var i = 0; i < explorerTransaction.rawtransaction.siafundoutputs.length; i++) {
			var table = createStatsTable();
			var doms = appendStat(table, 'ID', '');
			linkHash(doms[2], explorerTransaction.siafundoutputids[i]);
			doms = appendStat(table, 'Address', '');
			linkHash(doms[2], explorerTransaction.rawtransaction.siafundoutputs[i].unlockhash);
			appendStat(table, 'Value', explorerTransaction.rawtransaction.siafundoutputs[i].value);
			infoBody.appendChild(table);
		}
	}
	if (explorerTransaction.rawtransaction.arbitrarydata != null) {
		appendStatTableTitle(infoBody, 'Arbitrary Data');
		for (var i = 0; i < explorerTransaction.rawtransaction.arbitrarydata.length; i++) {
			var table = createStatsTable();
			appendStat(table, 'Data', explorerTransaction.rawtransaction.arbitrarydata[i]);
			infoBody.appendChild(table);
		}
	}
}

// appendUnlockHashTransactionElements is a helper function for
// appendUnlockHashTables that adds all of the relevent components of
// transactions to the dom.
function appendUnlockHashTransactionElements(domParent, hash, explorerHash) {
	// Compile a set of transactions that have siacoin outputs featuring
	// the hash, along with the corresponding siacoin output ids. Later,
	// the transactions will be scanned again for siacoin inputs sharing
	// the siacoin output id which will reveal whether the output has been
	// spent.
	var tables = [];
	var scoids = []; // The siacoin output id corresponding with every siacoin output in the table, 1:1 match.
	var scoidMatches = [];
	var found = false; // Indicates that there are siacoin outputs.
	for (var i = 0; i < explorerHash.transactions.length; i++) {
		if (explorerHash.transactions[i].siacoinoutputids != null && explorerHash.transactions[i].siacoinoutputids.length != 0) {
			// Scan for a relevant siacoin output.
			for (var j = 0; j < explorerHash.transactions[i].siacoinoutputids.length; j++) {
				if (explorerHash.transactions[i].rawtransaction.siacoinoutputs[j].unlockhash == hash) {
					found = true;
					var table = createStatsTable();
					var doms = appendStat(table, 'Height', '');
					linkHeight(doms[2], explorerHash.transactions[i].height);
					doms = appendStat(table, 'Parent Transaction', '');
					linkHash(doms[2], explorerHash.transactions[i].id);
					doms = appendStat(table, 'ID', '');
					linkHash(doms[2], explorerHash.transactions[i].siacoinoutputids[j]);
					doms = appendStat(table, 'Address', '');
					linkHash(doms[2], hash);
					appendStat(table, 'Value', readableCoins(explorerHash.transactions[i].rawtransaction.siacoinoutputs[j].value));
					tables.push(table);
					scoids.push(explorerHash.transactions[i].siacoinoutputids[j]);
					scoidMatches.push(false);
				}
			}
		}
	}
	// If there are any relevant siacoin outputs, scan the transaction set
	// for relevant siacoin inputs and add a field 
	if (found) {
		// Add the header for the siacoin outputs.
		appendStatTableTitle(domParent, 'Siacoin Output Appearances');

		for (var i = 0; i < explorerHash.transactions.length; i++) {
			if (explorerHash.transactions[i].rawtransaction.siacoininputs != null && explorerHash.transactions[i].rawtransaction.siacoininputs.length != 0) {
				for (var j = 0; j < explorerHash.transactions[i].rawtransaction.siacoininputs.length; j++) {
					// Iterate through the list of known
					// scoids to see if any of them match
					// the parent id of the current siacoin
					// input.
					for (var k = 0; k < scoids.length; k++) {
						if (explorerHash.transactions[i].rawtransaction.siacoininputs[j].parentid == scoids[k]) {
							scoidMatches[k] = true;
						}
					}
				}
			}
		}

		// Iterate through the scoidMatches. If a match was found
		// indicate that the siacoin output has been spent. Otherwise,
		// indicate that the siacoin output has not been spent.
		for (var i = 0; i < scoids.length; i++) {
			if (scoidMatches[i] == true) {
				appendStat(tables[i], 'Has Been Spent', 'Yes');
			} else {
				appendStat(tables[i], 'Has Been Spent', 'No');
			}
			domParent.appendChild(tables[i]);
		}
	}

	// TODO: Compile the list of file contracts and revisions that use the
	// unlock hash, and that have the unlock hash somewhere in the payout
	// scheme.

	// Compile a set of transactions that have siafund outputs featuring
	// the hash, along with the corresponding siafund output ids. Later,
	// the transactions will be scanned again for siafund inputs sharing
	// the siafund output id which will reveal whether the output has been
	// spent.
	tables = [];
	var sfoids = []; // The siafund output id corresponding with every siafund output in the table, 1:1 match.
	var sfoidMatches = [];
	found = false; // Indicates that there are siafund outputs.
	for (var i = 0; i < explorerHash.transactions.length; i++) {
		if (explorerHash.transactions[i].siafundoutputids != null && explorerHash.transactions[i].siafundoutputids.length != 0) {
			// Scan for a relevant siafund output.
			for (var j = 0; j < explorerHash.transactions[i].siafundoutputids.length; j++) {
				if (explorerHash.transactions[i].rawtransaction.siafundoutputs[j].unlockhash == hash) {
					found = true;
					var table = createStatsTable();
					var doms = appendStat(table, 'Height', '');
					linkHeight(doms[2], explorerHash.transactions[i].height);
					doms = appendStat(table, 'Parent Transaction', '');
					linkHash(doms[2],  explorerHash.transactions[i].id);
					doms = appendStat(table, 'ID', '');
					linkHash(doms[2], explorerHash.transactions[i].siafundoutputids[j]);
					doms = appendStat(table, 'Address', '');
					linkHash(doms[2], hash);
					appendStat(table, 'Value', explorerHash.transactions[i].rawtransaction.siafundoutputs[j].value + ' siafunds');
					tables.push(table);
					sfoids.push(explorerHash.transactions[i].siafundoutputids[j]);
					sfoidMatches.push(false);
				}
			}
		}
	}
	// If there are any relevant siafund outputs, scan the transaction set
	// for relevant siafund inputs and add a field.
	if (found) {
		// Add the header for the siafund outputs.
		appendStatTableTitle(domParent, 'Siafund Output Appearances');

		for (var i = 0; i < explorerHash.transactions.length; i++) {
			if (explorerHash.transactions[i].rawtransaction.siafundinputs != null && explorerHash.transactions[i].rawtransaction.siafundinputs.length != 0) {
				for (var j = 0; j < explorerHash.transactions[i].rawtransaction.siafundinputs.length; j++) {
					// Iterate through the list of known
					// sfoids to see if any of them match
					// the parent id of the current siafund
					// input.
					for (var k = 0; k < sfoids.length; k++) {
						if (explorerHash.transactions[i].rawtransaction.siafundinputs[j].parentid == sfoids[k]) {
							sfoidMatches[k] = true;
						}
					}
				}
			}
		}

		// Iterate through the sfoidMatches. If a match was found
		// indicate that the siafund output has been spent. Otherwise,
		// indicate that the siafund output has not been spent.
		for (var i = 0; i < sfoids.length; i++) {
			if (sfoidMatches[i] == true) {
				appendStat(tables[i], 'Has Been Spent', 'Yes');
			} else {
				appendStat(tables[i], 'Has Been Spent', 'No');
			}
			domParent.appendChild(tables[i]);
		}
	}
}

// appendUnlockHashTables appends a series of tables that provide information
// about an unlock hash to the domParent.
function appendUnlockHashTables(domParent, hash, explorerHash) {
	// Create the tables that expose all of the miner payouts the hash has
	// been involved in.
	if (explorerHash.blocks != null && explorerHash.blocks.length != 0) {
		appendStatTableTitle(domParent, 'Miner Payout Appearances');
		for (var i = 0; i < explorerHash.blocks.length; i++) {
			for (var j = 0; j < explorerHash.blocks[i].minerpayoutids.length; j++) {
				if (explorerHash.blocks[i].rawblock.minerpayouts[j].unlockhash == hash) {
					var table = createStatsTable();
					var doms = appendStat(table, 'Parent Block ID', '');
					linkHash(doms[2], explorerHash.blocks[i].blockid);
					doms = appendStat(table, 'Miner Payout ID', '');
					linkHash(doms[2], explorerHash.blocks[i].minerpayoutids[j]);
					doms = appendStat(table, 'Payout Address', '');
					linkHash(doms[2], hash);
					appendStat(table, 'Value', readableCoins(explorerHash.blocks[i].rawblock.minerpayouts[j].value));
					domParent.appendChild(table);
				}
			}
		}
	}

	// Compile all of the tables + headers that can be created from
	// transactions featuring the hash.
	if (explorerHash.transactions != null && explorerHash.transactions.length != 0) {
		appendUnlockHashTransactionElements(domParent, hash, explorerHash);
	}
}

// appendSiacoinOutputTables appends a series of table sthat provide
// information about a siacoin output ot the domParent.
function appendSiacoinOutputTables(infoBody, hash, explorerHash) {
	// Check if a siacoin input exists for this output.
	var hasBeenSpent = 'No';
	if (explorerHash.transactions != null) {
		for (var i = 0; i < explorerHash.transactions.length; i++) {
			for (var j = 0; j < explorerHash.transactions[i].rawtransaction.siacoininputs.length; j++) {
				if (explorerHash.transactions[i].rawtransaction.siacoininputs[j].parentid == hash) {
					hasBeenSpent = 'Yes';
				}
			}
		}
	}

	if (explorerHash.blocks != null) {
		// Siacoin output is a miner payout.
		for (var i = 0; i < explorerHash.blocks[0].minerpayoutids.length; i++) {
			if (explorerHash.blocks[0].minerpayoutids[i] == hash) {
				appendStatTableTitle(infoBody, 'Siacoin Output - Miner Payout');
				var table = createStatsTable();
				var doms = appendStat(table, 'ID', '');
				linkHash(doms[2], hash);
				doms = appendStat(table, 'Parent Block', '');
				linkHash(doms[2], explorerHash.blocks[0].blockid);
				doms = appendStat(table, 'Address', '');
				linkHash(doms[2], explorerHash.blocks[0].rawblock.minerpayouts[i].unlockhash);
				appendStat(table, 'Value', readableCoins(explorerHash.blocks[0].rawblock.minerpayouts[i].value));
				appendStat(table, 'Has Been Spent', hasBeenSpent);
				infoBody.appendChild(table);
			}
		}
	} else {
		// Create the table containing the siacoin output.
		for (var i = 0; i < explorerHash.transactions.length; i++) {
			for (var j = 0; j < explorerHash.transactions[i].siacoinoutputids.length; j++) {
				if (explorerHash.transactions[i].siacoinoutputids[j] == hash) {
					appendStatTableTitle(infoBody, 'Siacoin Output');
					var table = createStatsTable();
					var doms = appendStat(table, 'ID', '');
					linkHash(doms[2], hash);
					doms = appendStat(table, 'Parent Transaction', '');
					linkHash(doms[2], explorerHash.transactions[i].id);
					doms = appendStat(table, 'Address', '');
					linkHash(doms[2], explorerHash.transactions[i].rawtransaction.siacoinoutputs[j].unlockhash);
					appendStat(table, 'Value', readableCoins(explorerHash.transactions[i].rawtransaction.siacoinoutputs[j].value));
					appendStat(table, 'Has Been Spent', hasBeenSpent);
					infoBody.appendChild(table);
				}
			}
		}
	}

	// Create the table containing the siacoin input.
	for (var i = 0; i < explorerHash.transactions.length; i++) {
		for (var j = 0; j < explorerHash.transactions[i].rawtransaction.siacoininputs.length; j++) {
			if (explorerHash.transactions[i].rawtransaction.siacoininputs[j].parentid == hash) {
				appendStatTableTitle(infoBody, 'Siacoin Input');
				var table = createStatsTable();
				var doms = appendStat(table, 'ID', '');
				linkHash(doms[2], hash);
				doms = appendStat(table, 'Parent Transaction', '');
				linkHash(doms[2], explorerHash.transactions[i].id);
				infoBody.appendChild(table);
			}
		}
	}
}

// appendFileContractTables appends a series of tables that provide information
// about structures relating to a particular file contract id.
function appendFileContractTables(infoBody, hash, explorerHash) {
	// Display the original file contract.
	for (var i = 0; i < explorerHash.transactions.length; i++) {
		if (explorerHash.transactions[i].filecontractids != null) {
			for (var j = 0; j < explorerHash.transactions[i].filecontractids.length; j++) {
				if (explorerHash.transactions[i].filecontractids[j] == hash) {
					appendStatTableTitle(infoBody, 'File Contract');
					var table = createStatsTable();
					var doms = appendStat(table, 'ID', '');
					linkHash(doms[2], hash);
					doms = appendStat(table, 'Parent Transaction', '');
					linkHash(doms[2], explorerHash.transactions[i].id);
					appendStat(table, 'File Size', readableBytes(explorerHash.transactions[i].rawtransaction.filecontracts[j].filesize));
					appendStat(table, 'Payout', readableCoins(explorerHash.transactions[i].rawtransaction.filecontracts[j].payout));
					appendStat(table, 'Revision Number', explorerHash.transactions[i].rawtransaction.filecontracts[j].revisionnumber);
					infoBody.appendChild(table);
				}
			}
		}
	}

	// Display the file contract revisions.
	for (var i = 0; i < explorerHash.transactions.length; i++) {
		if (explorerHash.transactions[i].rawtransaction.filecontractrevisions != null) {
			for (var j = 0; j < explorerHash.transactions[i].rawtransaction.filecontractrevisions.length; j++) {
				if (explorerHash.transactions[i].rawtransaction.filecontractrevisions[j].parentid == hash) {
					appendStatTableTitle(infoBody, 'File Contract Revision');
					var table = createStatsTable();
					var doms = appendStat(table, 'ID', '');
					linkHash(doms[2], hash);
					doms = appendStat(table, 'Parent Transaction', '');
					linkHash(doms[2], explorerHash.transactions[i].id);
					appendStat(table, 'New File Size', readableBytes(explorerHash.transactions[i].rawtransaction.filecontractrevisions[j].newfilesize));
					appendStat(table, 'New Revision Number', explorerHash.transactions[i].rawtransaction.filecontractrevisions[j].newrevisionnumber);
					infoBody.appendChild(table);
				}
			}
		}
	}

	// Display the storage proof.
	for (var i = 0; i < explorerHash.transactions.length; i++) {
		if (explorerHash.transactions[i].rawtransaction.storageproofs!= null) {
			for (var j = 0; j < explorerHash.transactions[i].rawtransaction.storageproofs.length; j++) {
				if (explorerHash.transactions[i].rawtransaction.storageproofs[j].parentid == hash) {
					appendStatTableTitle(infoBody, 'Storage Proof');
					var table = createStatsTable();
					for (var k = 0; k < explorerHash.transactions[i].storageproofoutputids[j].length; k++) {
						var doms = appendStat(table, 'Storage Proof Output ' + (k+1) + ' ID', '');
						linkHash(doms[2], explorerHash.transactions[i].storageproofoutputids[j][k]);
						doms = appendStat(table, 'Storage Proof Output ' + (k+1) + ' Address', '');
						linkHash(doms[2], explorerHash.transactions[i].storageproofoutputs[j][k].unlockhash);
						appendStat(table, 'Storage Proof Output ' + (k+1) + ' Value', readableCoins(explorerHash.transactions[i].storageproofoutputs[j][k].value));
					}
					infoBody.appendChild(table);
				}
			}
		}
	}
}

// appendSiafundOutputTables appends a series of table sthat provide
// information about a siafund output ot the domParent.
function appendSiafundOutputTables(infoBody, hash, explorerHash) {
	// Check if a siafund input exists for this output.
	var hasBeenSpent = 'No';
	for (var i = 0; i < explorerHash.transactions.length; i++) {
		if (explorerHash.transactions[i].rawtransaction.siafundinputs != null) {
			for (var j = 0; j < explorerHash.transactions[i].rawtransaction.siafundinputs.length; j++) {
				if (explorerHash.transactions[i].rawtransaction.siafundinputs[j].parentid == hash) {
					hasBeenSpent = 'Yes';
				}
			}
		}
	}

	// Create the table containing the siafund output.
	for (var i = 0; i < explorerHash.transactions.length; i++) {
		for (var j = 0; j < explorerHash.transactions[i].siafundoutputids.length; j++) {
			if (explorerHash.transactions[i].siafundoutputids[j] == hash) {
				appendStatTableTitle(infoBody, 'Siafund Output');
				var table = createStatsTable();
				var doms = appendStat(table, 'ID', '');
				linkHash(doms[2], hash);
				doms = appendStat(table, 'Parent Transaction', '');
				linkHash(doms[2], explorerHash.transactions[i].id);
				doms = appendStat(table, 'Address', '');
				linkHash(doms[2], explorerHash.transactions[i].rawtransaction.siafundoutputs[j].unlockhash);
				appendStat(table, 'Value', explorerHash.transactions[i].rawtransaction.siafundoutputs[j].value);
				appendStat(table, 'Has Been Spent', hasBeenSpent);
				infoBody.appendChild(table);
			}
		}
	}

	// Create the table containing the siafund input.
	for (var i = 0; i < explorerHash.transactions.length; i++) {
		for (var j = 0; j < explorerHash.transactions[i].rawtransaction.siafundinputs.length; j++) {
			if (explorerHash.transactions[i].rawtransaction.siafundinputs[j].parentid == hash) {
				appendStatTableTitle(infoBody, 'Siafund Input');
				var table = createStatsTable();
				var doms = appendStat(table, 'ID', '');
				linkHash(doms[2], hash);
				doms = appendStat(table, 'Parent Transaction', '');
				linkHash(doms[2], explorerHash.transactions[i].id);
				infoBody.appendChild(table);
			}
		}
	}
}

// populateHashPage parses a query to the hash explorer and then returns
// information about the query.
function populateHashPage(hash, explorerHash) {
	var hashType = explorerHash.hashtype;
	var infoBody = document.getElementById('dynamic-elements');
	if (hashType === "blockid") {
		appendHeading(infoBody, 'Hash Type: Block ID');
		appendHeading(infoBody, 'Hash: ' + hash);
		appendBlockStatistics(infoBody, explorerHash.block);
	} else if (hashType === "transactionid") {
		appendHeading(infoBody, 'Hash Type: Transaction ID');
		appendHeading(infoBody, 'Hash: ' + hash);
		appendTransactionStatistics(infoBody, explorerHash.transaction);
	} else if (hashType === "unlockhash") {
		appendHeading(infoBody, 'Hash Type: Unlock Hash / Address');
		appendHeading(infoBody, 'Hash: ' + hash);
		appendUnlockHashTables(infoBody, hash, explorerHash);
	} else if (hashType === "siacoinoutputid") {
		appendHeading(infoBody, 'Hash Type: Siacoin Output ID');
		appendHeading(infoBody, 'Hash: ' + hash);
		appendSiacoinOutputTables(infoBody, hash, explorerHash);
	} else if (hashType === "filecontractid") {
		appendHeading(infoBody, 'Hash Type: File Contract ID');
		appendHeading(infoBody, 'Hash: ' + hash);
		appendFileContractTables(infoBody, hash, explorerHash);
	} else if (hashType === "siafundoutputid") {
		appendHeading(infoBody, 'Hash Type: Siafund Output ID');
		appendHeading(infoBody, 'Hash: ' + hash);
		appendSiafundOutputTables(infoBody, hash, explorerHash);
	}
}

// fetchHashInfo queries the explorer api about in the input hash, and then
// fills out the page with the response.
function fetchHashInfo(hash) {
	var request = new XMLHttpRequest();
	var reqString = '/explorer/hashes/' + hash;
	request.open('GET', reqString, false);
	request.send();
	if (request.status != 200) {
		return 'error';
	}
	return JSON.parse(request.responseText);
}

// parseHashQuery parses the query string in the URL and loads the block
// that makes sense based on the result.
function parseHashQuery() {
	var urlParams;
	(window.onpopstate = function () {
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
		query  = window.location.search.substring(1);
	urlParams = {};
	while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);
	})();
	return urlParams.hash;
}

// buildHashPage parses the query string, turns it into an api request, and
// then formats the response into a user-friendly webpage.
function buildHashPage() {
	var hash = parseHashQuery();
	var explorerHash = fetchHashInfo(hash);
	if (explorerHash == 'error') {
		var infoBody = document.getElementById('dynamic-elements');
		appendHeading(infoBody, 'Hash not Found in Database');
		appendHeading(infoBody, 'Hash: ' + hash);
	} else {
		populateHashPage(hash, explorerHash);
	}
}
buildHashPage();
