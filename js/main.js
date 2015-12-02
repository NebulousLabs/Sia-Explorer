// addCommasToNumber adds commas to a number at the thousands places.
function addCommasToNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// formatUnixTime takes a unix timestamp from the blockchain and
// returns a date.
function formatUnixTime(unixTime) {
	var date = new Date(unixTime * 1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; 
	return date.getHours() + ':' + ('0'+date.getMinutes()).slice(-2) + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

// readableCoins converts a number of hastings into a more readable volume of
// siacoins.
function readableCoins(hastings) {
	if (hastings < 1000000000000000000000000) {
		return 'dust';
	} else if (hastings >= 1000000000000000000000000 && hastings <= 2000000000000000000000000) {
		return '1 siacoin';
	} else if (hastings < 1000000000000000000000000000000000) {
		return addCommasToNumber((hastings / 1000000000000000000000000).toFixed(0)) + " siacoins";
	} else {
		return addCommasToNumber((hastings / 1000000000000000000000000000000000).toFixed(2)) + " billion siacoins";
	}
}

// readableDifficulty takes a difficulty and formats into something readable.
function readableDifficulty(hashes) {
	return addCommasToNumber((hashes / 1000000000000).toFixed(0)) + ' TH';
}

// readableHashrate formats hashes per second into a human readable string.
function readableHashrate(hashesPerSecond) {
	return addCommasToNumber((hashesPerSecond / 1000000000).toFixed(0)) + ' GH/s';
}

// readableBytes converts bytes into a human readable form.
function readableBytes(bytes) {
	if (bytes < 1000) {
		return bytes + ' bytes';
	} else if (bytes < 10000) {
		return (bytes / 1000).toFixed(2) + ' KB';
	} else if (bytes < 1000000) {
		return bytes / 1000 + ' KB';
	} else if (bytes < 10000000) {
		return (bytes / 1000000).toFixed(2) + ' MB';
	} else if (bytes < 1000000000) {
		return bytes / 1000000 + ' MB';
	} else if (bytes < 10000000000) {
		return (bytes / 1000000000).toFixed(2) + ' GB';
	} else if (bytes < 1000000000000) {
		return bytes / 1000000000 + ' GB';
	} else if (bytes < 10000000000000) {
		return (bytes / 1000000000000).toFixed(2) + ' TB';
	} else {
		return bytes / 1000000000000 + ' TB';
	}
}

// linkHash takes a hash and returns a link that has the hash as text and
// leads to the hashes hash page.
function linkHash(domParent, hash) {
	var a = document.createElement('a');
	var text = document.createTextNode(hash);
	a.appendChild(text);
	a.href = 'hash.html?hash='+hash;
	domParent.appendChild(a);
}

// linkHeight takes a height and returns a link that has the height as text
// (with commas) and leads to the block page for the block at the input height.
function linkHeight(domParent, height) {
	var a = document.createElement('a');
	var text = document.createTextNode(addCommasToNumber(height));
	a.appendChild(text);
	a.href = 'block.html?height='+height;
	domParent.appendChild(a);
}

// appendHeading adds a heading to the hash page.
function appendHeading(domParent, text) {
	var heading = document.createElement('h3');
	heading.className = 'sub-banner';
	heading.appendChild(document.createTextNode(text));
	domParent.appendChild(heading);
}

// createStatsTable creates a table that conforms to the stats css.
function createStatsTable() {
	var table = document.createElement('table');
	table.className = 'pure-table pure-table-horizontal stats';
	return table
}

// appendStatTableTitle adds a stat table title to the provided dom element.
function appendStatTableTitle(domParent, titleText) {
	var minerPayoutHeader = document.createElement('h2');
	var headerText = document.createTextNode(titleText);
	minerPayoutHeader.appendChild(headerText);
	domParent.appendChild(minerPayoutHeader);
}

// appendStatHeader appends a header to a stat table.
function appendStatHeader(table, headerText) {
	var thead = document.createElement('thead');
	var row = thead.insertRow(0);
	var cell = row.insertCell(0);
	cell.colSpan = '2';
	cell.className = 'stats-head';
	cell.appendChild(document.createTextNode(headerText));
	table.appendChild(thead);
}

// appendStat appends a statistic to a table. The new row and the two new
// column doms are returned in an array.
function appendStat(table, statLabel, statText) {
	var tr = document.createElement('tr');
	var labelCell = tr.insertCell(0);
	labelCell.className = 'stats-title';
	labelCell.appendChild(document.createTextNode(statLabel));
	var textCell = tr.insertCell(1);
	textCell.className = 'stats-info';
	textCell.appendChild(document.createTextNode(statText));
	table.appendChild(tr);
	return [tr, labelCell, textCell];
}

// appendBlockStatistics creates a block statistics table and appends it to the
// input dom parent.
function appendBlockStatistics(domParent, explorerBlock) {
	var table = createStatsTable();
	appendStatHeader(table, 'Block Statistics');
	var doms = appendStat(table, 'Height', '');
	linkHeight(doms[2], explorerBlock.height);
	doms = appendStat(table, 'ID', '');
	linkHash(doms[2], explorerBlock.blockid);
	doms = appendStat(table, 'Parent Block', '');
	linkHash(doms[2], explorerBlock.rawblock.parentid);
	appendStat(table, 'Time', formatUnixTime(explorerBlock.rawblock.timestamp));
	appendStat(table, 'Difficulty', readableDifficulty(explorerBlock.difficulty));
	appendStat(table, 'Estimated Hashrate', readableHashrate(explorerBlock.estimatedhashrate));
	appendStat(table, 'Total Coins', readableCoins(explorerBlock.totalcoins));
	appendStat(table, 'Active File Contracts', addCommasToNumber(explorerBlock.activecontractcount));
	appendStat(table, 'Total Contract Cost', readableCoins(explorerBlock.totalcontractcost));
	appendStat(table, 'Storage Proofs', addCommasToNumber(explorerBlock.storageproofcount));
	// appendStat(table, 'Storage Proof Success Rate', (100 * explorerBlock.storageproofcount / (explorerBlock.filecontractcount - explorerBlock.activecontractcount)).toFixed(0) + '%');
	domParent.appendChild(table);
}
