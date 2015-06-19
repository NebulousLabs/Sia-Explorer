package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"strings"
)

// A structure to store any state of the server. Should remain
// relatively unpopulated, mostly constants which will eventually be
// broken off
type ExploreServer struct {
	// The explorer must know where to send the API calls
	url string

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
	explorerState, err := srv.apiExplorerState()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	blocklist, err := srv.apiGetBlockData(0, explorerState.Height)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	// Attempt to make a page out of it
	page, err := parseOverview(overviewRoot{
		Explorer:       explorerState,
		BlockSummaries: blocklist,
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
	if strings.Contains(r.URL.Path, ".") {
		srv.serveMux.ServeHTTP(w, r)
	} else {
		srv.overviewPage(w, r)
	}
}

func main() {
	// Parse command line flags for port numbers
	apiPort := flag.String("a", "9980", "Api port")
	hostPort := flag.String("p", "9983", "HTTP host port")
	flag.Parse()

	// Initilize the server
	var srv = &ExploreServer{
		url:      "http://localhost:" + *apiPort,
		serveMux: http.NewServeMux(),
	}

	srv.serveMux.Handle("/", http.FileServer(http.Dir("./webroot/")))
	http.HandleFunc("/", srv.rootHandler)
	http.ListenAndServe(":"+*hostPort, nil)
	fmt.Println("Done serving")
}
