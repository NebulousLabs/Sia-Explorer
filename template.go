package main

import (
	"bytes"
	"errors"
	"fmt"
	"math/big"
	"text/template"
	"time"

	"github.com/NebulousLabs/Sia/crypto"
	"github.com/NebulousLabs/Sia/modules"
	"github.com/NebulousLabs/Sia/types"
)

type (
	// This will be the root struct given to the template parser
	overviewRoot struct {
		Explorer       modules.ExplorerStatus
		BlockSummaries []modules.ExplorerBlockData
	}

	blockRoot struct {
		Block  types.Block
		Height types.BlockHeight
		Target types.Target
		Size   uint64
	}

	outputRoot struct {
		OutputTx crypto.Hash
		InputTx  crypto.Hash
		OutputID crypto.Hash
	}

	filecontractRoot struct {
		Contract  crypto.Hash
		Revisions []crypto.Hash
		Proof     crypto.Hash
		FcID      types.FileContractID
	}

	addressRoot struct {
		Txns []crypto.Hash
		Addr []byte
	}
)

// Used in siacoinString and byteString
var coinPostfixes []string = []string{"yS", "zS", "aS", "fS", "pS", "nS", "\u03bcS", "mS", "SC", "KS", "MS", "GS", "TS", "PS"}
var bytePostfixes []string = []string{"B", "KB", "MB", "GB", "TB", "PB", "EB"}

// siacoinString, byteString, and timeString, are used for formatting numbers
// in a human readable way inside the template
func siacoinString(siacoins types.Currency) string {
	if siacoins.Cmp(types.NewCurrency64(0)) == 0 {
		return "0 SC"
	}

	coins := big.NewRat(0, 1).SetFrac(siacoins.Big(), types.SiacoinPrecision.Big())

	var i int = 8
	for coins.Cmp(big.NewRat(1000, 1)) > 0 {
		coins.Mul(coins, big.NewRat(1, 1000))
		i++
	}

	for coins.Cmp(big.NewRat(1, 1)) < 0 {
		coins.Mul(coins, big.NewRat(1000, 1))
		i--
	}

	if i < 0 {
		return fmt.Sprintf("%s H", siacoins)
	}
	// Second argument is exactness, which will get cut off upon
	// printing
	f, _ := coins.Float64()
	return fmt.Sprintf("%f %s", f, coinPostfixes[i])
}

func byteString(numBytes uint64) string {
	numBytesF := float64(numBytes)

	var i int = 0
	for numBytesF > 1024 {
		numBytesF = numBytesF / 1024
		i++
	}

	return fmt.Sprintf("%f %s", numBytesF, bytePostfixes[i])
}

func timeString(epoch types.Timestamp) string {
	// layout shows by example how the reference time should be
	// represented. #Golang Magic
	return time.Unix(int64(epoch), 0).Format("Jan 2, 2006 at 3:04pm (MST)")
}

// hashAvgString is a wrapper for the hashrate function, found in hashrate.go
func hashAvgString(numBlocks types.BlockHeight, o overviewRoot) string {
	if int(numBlocks) >= len(o.BlockSummaries) {
		return rateString(hashrate(o.BlockSummaries))
	}
	return rateString(hashrate(o.BlockSummaries[o.Explorer.Height-numBlocks : o.Explorer.Height]))
}

// parseTemplate is a more generic function to parse a template given
// just a template filename and an object to be put into the template,
func (es *ExploreServer) parseTemplate(templateName string, data interface{}) ([]byte, error) {

	// funcMap is passed to the template engine so that templates may have
	// access to these functions. Defined here to give access to functions of es.
	var funcMap = template.FuncMap{
		"siacoinString":    siacoinString,
		"byteString":       byteString,
		"hashAvgString":    hashAvgString,
		"timeString":       timeString,
		"parseTemplate":    es.parseTemplate,
		"parseTransaction": es.parseTransaction,
		"findOutput":       es.findOutput,
		"increment":        func(x types.BlockHeight) types.BlockHeight { return x + 1 },
	}

	t, err := template.New(templateName).Funcs(funcMap).ParseFiles("templates/" + templateName)
	if err != nil {
		s := fmt.Sprintf("Error parsing template %s: %v", templateName, err)
		fmt.Println(s)
		return nil, errors.New(s)
	}

	// Use a bytes buffer to avoid requiring the writing
	// object. This way we can return a byte slice
	var doc bytes.Buffer
	err = t.Execute(&doc, data)
	if err != nil {
		s := fmt.Sprintf("Error executing template %s: %v", templateName, err)
		fmt.Println(s)
		return nil, errors.New(s)
	}

	return doc.Bytes(), nil
}
