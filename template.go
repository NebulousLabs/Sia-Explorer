package main

import (
	"bytes"
	"errors"
	"fmt"
	"text/template"

	"github.com/NebulousLabs/Sia/modules"
	"github.com/NebulousLabs/Sia/types"
)

// This will be the root struct given to the template parser
type overviewRoot struct {
	Chainheight types.BlockHeight
	Curblock modules.ExplorerCurrentBlockData
	Siacoins modules.ExplorerSiacoinData
	FileContracts modules.ExplorerFileContractData
	Blocks []modules.ExplorerBlockData
}

var funcMap = template.FuncMap{
        "siacoinString": siacoinString,
	"hashAvgString": hashAvgString,
}


var coinPostfixes []string = []string{"SC", "KS", "MS", "GS", "TS", "PS"}

func siacoinString(siacoins types.Currency) string {
	coins := float64(siacoins.Div(types.SiacoinPrecision).Big().Int64())

	var i int = 0
	for coins > 1000 {
		coins = coins / 1000
		i++
	}

	return fmt.Sprintf("%f %s", coins, coinPostfixes[i])
}

func hashAvgString(blocks types.BlockHeight, o overviewRoot) (s string) {
	s = rateString(hashrate(o.Blocks[o.Chainheight - blocks:o.Chainheight]))
	return
}

// Function that handles the template parsing and execution of that template
func parseOverview (data overviewRoot) ([]byte, error) {
	t, err := template.New("overview").Funcs(funcMap).ParseGlob("templates/*.html")
	if err != nil {
		s := fmt.Sprintf("Error parsing overview template: %s", err.Error())
		fmt.Println(s)
		return nil, errors.New(s)
	}

	// Use a bytes buffer to avoid requiring the writing
	// object. This way we can return a byte slice
        var doc bytes.Buffer
        err = t.ExecuteTemplate(&doc, "overview.html", data)
	if err != nil {
		s := fmt.Sprintf("Error executing overview template: %s", err.Error())
		fmt.Println(s)
		return nil, errors.New(s)
	}

        s := doc.Bytes()
	return s, nil
}
