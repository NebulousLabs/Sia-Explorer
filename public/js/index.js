function fillGeneralStats() {
	var request = new XMLHttpRequest();
	request.open('GET', '/explorer', true);
	request.onload = function() {
		var explorerStatus = JSON.parse(request.responseText);
		document.getElementById('height').innerHTML = addCommasToNumber(explorerStatus.height);
		document.getElementById('blockID').innerHTML = explorerStatus.blockid;
		document.getElementById('difficulty').innerHTML = readableDifficulty(explorerStatus.difficulty);
		document.getElementById('hashrate').innerHTML = readableHashrate(explorerStatus.estimatedhashrate);
		document.getElementById('maturityTimestamp').innerHTML = formatUnixTime(explorerStatus.maturitytimestamp);
		document.getElementById('totalCoins').innerHTML = readableCoins(explorerStatus.totalcoins);
		document.getElementById('activeFileContracts').innerHTML = addCommasToNumber(explorerStatus.activecontractcount);
		document.getElementById('totalFileContractCost').innerHTML = readableCoins(explorerStatus.totalcontractcost);
		document.getElementById('storageProofs').innerHTML = addCommasToNumber(explorerStatus.storageproofcount);
		// document.getElementById('storageProofSuccess').innerHTML = (100 * explorerStatus.storageproofcount / (explorerStatus.filecontractcount - explorerStatus.activecontractcount)).toFixed(0) + '%';
 	};
	request.send();
}
fillGeneralStats();
