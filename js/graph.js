function customgraph_node(elem, nid) {
    this.elem = elem; // node element, not unique
    this.nid = nid; // node identifier, unique

    // TODO: EDIT THIS LATER
    // - no hardcoded size
    // - change all functions that create nodes to include cache size
    // - change all functions that create nodes to include cache type
    this.cache = new LRUcache_must(4);
}

function customgraph_edge(first, second, lb) {
    this.from = first;
    this.to = second;
    this.loopback = false;

    if (lb){ this.loopback = lb; }
}

function print_edges(edges){
    var pstring = "[";
    for (var i = 0; i < edges.length; i++){
        pstring += "(" + edges[i].from.nid + " -> " + edges[i].to.nid + "), ";
    }
    pstring += "]";
    console.log("MOVES: " + pstring);

    return pstring;
}
function all_in(list1, list2){
    for (var i = 0; i < list1.length; i++){
        // return false if any element in list1 is not present in list2.
        if (!list2.includes(list1[i]))
            return false;
    }
    return true;
}

function customgraph() {
    this.begin_node = new customgraph_node('Begin', 'Begin');
    this.end_node = new customgraph_node('End', 'End');

    this.nodes = [this.begin_node, this.end_node];
    this.edges = [];

    this.cur = [this.begin_node];

    this.get_edges_children = function(node){
        var child_edges = [];
        for (var e = 0; e < this.edges.length; e++){
            if (this.edges[e].from == node)
                child_edges.push(this.edges[e]);
        }
        return child_edges;
    }
    this.get_edges_parents = function(node){
        var child_edges = [];
        for (var e = 0; e < this.edges.length; e++){
            if (this.edges[e].to == node)
                child_edges.push(this.edges[e]);
        }
        return child_edges;
    }

    this.next_step = function(){
        var cur_child_edges = [];
        for (var c = 0; c < this.cur.length; c++){
            var child_edges = this.get_edges_children(this.cur[c]);
            cur_child_edges = cur_child_edges.concat(child_edges);
        }

        /* at this point, cur_child_edges contains all edges going from any
         * node in this.cur */

        var moves = [];
        for (var c = 0; c < cur_child_edges.length; c++){
            var edge = cur_child_edges[c];

            // if check edge.to node has other parent edges
            // if not:
                // add edge to moves

            // if so:
                // check if all of its parent edges are in cur_child_edges
                // if so: 
                    // add edge to moves.

            var par = this.get_edges_parents(edge.to);
            if (par.length == 0){
                moves.push(edge);
            }
            else{
                if (all_in(par, cur_child_edges))
                    moves.push(edge);
            }
        }

        /* At this point, moves contains all possible followup states of the
         * current nodes. */
         print_edges(moves);

        // for edge in moves:
            // check if edge.from node has other child edges
            // if so:
                // don't remove edge.from from cur
            // if not:
                // remove edge.from from cur
            // add edge.to to cur

        for (var m = 0; m < moves.length; m++){
            var edge = moves[m];
            var cld = this.get_edges_children(edge.from);

            // check if all child edges of edge.from are in moves
            if (all_in(cld, moves)){
                // if all possible follow-up states of the node edge.from are
                // marked in move, then remove the node from cur (if not
                // already removed)
                console.log(" - removing " + edge.from.nid + " from cur");
                var index = this.cur.indexOf(edge.from);
                if (index != -1){this.cur.splice(index, 1);}
                    
            }
            console.log(" - adding " + edge.to.nid + " to cur");
            var curindex = this.cur.indexOf(edge.to);
            if (curindex == -1){this.cur.push(edge.to);}

        }
    }

    this.find = function(node_id){
        for (var i = 0; i < this.nodes.length; i++){
            if (this.nodes[i].nid == node_id){
                return this.nodes[i];
            }
        }
        return false;
    }

    this.find_cur = function(node_id){
        for (var i = 0; i < this.cur.length; i++){
            if (this.cur[i].nid == node_id){
                return this.cur[i];
            }
        }
        return false;
    }
    this.add_edge = function(nid_from, elem_to, nid_to){
        var from_node = this.find(nid_from);

        var to_node = new customgraph_node(elem_to, nid_to);
        this.nodes.push(to_node); // add new node reference to nodes list

        var newedge = new customgraph_edge(from_node, to_node);
        this.edges.push(newedge); // add new edge reference to edge list
    }
    this.add_edge_loopback = function(nid_from, nid_to){
        var from_node = this.find(nid_from);
        var to_node = this.find(nid_to);

        // create a new edge with loopback flag on
        var newedge = new customgraph_edge(from_node, to_node, true);
        this.edges.push(newedge); // add new edge reference to edge list
    }

    this.add_edge_existing = function(nid_from, nid_to){
        var from_node = this.find(nid_from);
        var to_node = this.find(nid_to);

        var newedge = new customgraph_edge(from_node, to_node);
        this.edges.push(newedge); // add new edge reference to edge list     
    }

    /* debug print function */
    this.print = function() {
        var pstring = "";
        for (var i = 0; i < this.edges.length; i++){
            var edge = this.edges[i];
            pstring += "" + edge.from.nid + " -> " + edge.to.nid + ", ";
        }
        console.log(pstring);
    }

}