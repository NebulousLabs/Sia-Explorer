package main

import (
	"fmt"
	"math/big"

	"github.com/NebulousLabs/Sia/modules"
	"github.com/NebulousLabs/Sia/types"
)

var postfixes []string = []string{"H/s", "KH/s", "MH/s", "GH/s", "TH/s", "PH/s"}

func rateString(rate uint64) string {
	r := float64(rate)

	var i int = 0
	for r > 1000 {
		r = r / 1000
		i++
	}

	return fmt.Sprintf("%f %s", r, postfixes[i])
}

// The hashrate function takes in a slice of block data, each with a
// timestamp and a target, and returns an estimated number of hashes
// that were done per second
func hashrate(blocks []modules.ExplorerBlockData) (rate uint64) {
	if len(blocks) <= 0 {
		return 0
	}

	totaltime := blocks[len(blocks)-1].Timestamp - blocks[0].Timestamp
	if totaltime == 0 {
		return 0
	}

	// find the total target
	sum := blocks[0].Target
	for i := 1; i < len(blocks); i++ {
		sum = sum.AddDifficulties(blocks[i].Target)
	}

	hashes := new(big.Int).Div(types.RootDepth.Int(), sum.Int())
	rate = uint64(new(big.Int).Div(hashes, big.NewInt(int64(totaltime))).Int64())
	return
}
