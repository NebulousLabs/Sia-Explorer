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
	// First query the local instance of siad for the status
	explorerState, err := srv.siad.ExplorerState()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	blocklist, err := srv.siad.GetBlockData(0, explorerState.Height)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// Attempt to make a page out of it
	page, err := parseOverview(overviewRoot{
		Explorer: explorerState,
		Blocks: blocklist,
	})
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write(page)
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
	// Initilize the server
	var srv = &ExploreServer{
		siad: api.New("9000"),
		serveMux: http.NewServeMux(),
	}

	srv.serveMux.Handle("/", http.FileServer(http.Dir("./webroot/")))
	http.HandleFunc("/", srv.rootHandler)
	http.ListenAndServe(":9003", nil)
	fmt.Println("Done serving")
}
