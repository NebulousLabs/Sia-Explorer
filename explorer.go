package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/NebulousLabs/Sia-Block-Explorer/api"
)

// A structure to store any state of the server. Should remain
// relatively unpopulated, mostly constants which will eventually be
// broken off
type ExploreServer struct {
	// The explorer must know where to send the API calls
	siad *api.ApiLink

	// Used to store the server muxer
	serveMux *http.ServeMux
}

// writeJSON writes the object to the ResponseWriter. If the encoding fails, an
// error is written instead.
func writeJSON(w http.ResponseWriter, obj interface{}) {
	if json.NewEncoder(w).Encode(obj) != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func (srv *ExploreServer) overviewPage(w http.ResponseWriter, r *http.Request) {
	chainheight, err := srv.siad.BlockChain()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	block, err := srv.siad.GetCurrent()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	siacoins, err := srv.siad.Siacoins()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	filecontracts, err := srv.siad.FileContracts()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	blocklist, err := srv.siad.GetBlockData(0, chainheight)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	page, err := parseOverview(overviewRoot{
		Chainheight: chainheight,
		Curblock: block,
		Siacoins: siacoins,
		FileContracts: filecontracts,
		Blocks: blocklist,
	})

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write(page)

	// writeJSON(w, chainheight)
	// writeJSON(w, block)
	// writeJSON(w, siacoins)
	// writeJSON(w, filecontracts)
	// fmt.Fprintf(w, "\n")
	// hr := rateString(hashrate(blocklist[0:chainheight]))
	// fmt.Fprintf(w, "Average Hash Rate (All time): %s\n", hr)
	// hr = rateString(hashrate(blocklist[chainheight-400:chainheight-300]))
	// fmt.Fprintf(w, "Average Hash Rate (last 20 blocks): %s\n", hr)
	// writeJSON(w, blocklist)
}

// Handles the root page being requested. Is responsible for
// differentiating between api calls and pages
func (srv *ExploreServer) rootHandler(w http.ResponseWriter, r *http.Request) {

	if (strings.Contains(r.URL.Path, ".")) {
		srv.serveMux.ServeHTTP(w, r)
	} else {
		srv.overviewPage(w, r)
	}
}

// TODO: parse port as a command line option

func main() {
	// Initilize the api state
	var srv = &ExploreServer{
		siad: api.New("9000"),
		serveMux: http.NewServeMux(),
	}

	srv.serveMux.Handle("/", http.FileServer(http.Dir("./webroot/")))
	http.HandleFunc("/", srv.rootHandler)
	http.ListenAndServe(":9983", nil)
	fmt.Println("Done serving")
}
