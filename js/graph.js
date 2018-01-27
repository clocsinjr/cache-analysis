TYPE_CONC = 1;
TYPE_MUST = 2;
TYPE_MAY = 3;

function customgraph_node(elem, nid, csize, ctype) {
    this.elem = elem; // node element, not unique
    this.nid = nid; // node identifier, unique

    this.cstate = new LRUcache_must(csize);
    if (ctype == TYPE_CONC)
        this.cstate = new LRUcache(csize);
    else if (ctype == TYPE_MUST)
        this.cstate = new LRUcache_must(csize);
    else if (ctype == TYPE_MAY)
        this.cstate = new LRUcache_may(csize);
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

function customgraph(csize, ctype) {
    this.csize = csize;
    this.ctype = ctype;
    this.begin_node = new customgraph_node(null, 'Begin', csize, ctype);
    this.end_node = new customgraph_node(null, 'End', csize, ctype);

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
    this.update_node_abstract = function(node){
        var par = this.get_edges_parents(node);
        var caches = [];

        // copy the caches of all the nodes parents to the caches list
        for (var e = 0; e < par.length; e++){
            var tcache = par[e].from.cstate.copy();
            tcache.add(par[e].from.elem);
            caches.push(tcache);
        }

        var newcache = caches[0];
        for (var c = 1; c < caches.length; c++){
            newcache = newcache.join(caches[c]);
        }
        node.cstate = newcache;
        this.cur.push(node);
    }
    
    this.get_cur_child_edges = function(){
        /* This function looks through all nodes in current and check what
         * edges can be followed to a follow-up node. All the edges that can
         * be traversed are put in a list. This list is returned */
        
        var cur_child_edges = [];
        for (var c = 0; c < this.cur.length; c++){
            var child_edges = this.get_edges_children(this.cur[c]);
            cur_child_edges = cur_child_edges.concat(child_edges);
        }

        return cur_child_edges;
    }
    
    this.next_step = function(){
        if (this.ctype == TYPE_CONC)
            this.next_step_conc();
        else if (this.ctype == TYPE_MUST)
            this.next_step_must();
        else if (this.ctype == TYPE_MAY)
            window.alert("May_cache step function not implemented yet!");
        else
            window.alert("this graph's cache type is not specified!");
    }
    this.next_step_conc = function(){
        var cur_child_edges = this.get_cur_child_edges();
        var next_node = null;
        
        var txtdiv = document.getElementById("next_step_text");
        
        if (cur_child_edges.length == 1){
            // There's only one possible follow-up state
            next_node = cur_child_edges[0].to;
        }
        else{
            // There are more possible follow-up states
            
            
            if (s_edge){
                // if an edge is selected
                console.log(print_edges(cur_child_edges));
                for (var e = 0; e < cur_child_edges.length; e++){
                    var edge = cur_child_edges[e];
                    if (edge.from.nid == s_edge.from &&  edge.to.nid == s_edge.to)
                        next_node = edge.to;
                }
                
                if (!next_node){
                    window.alert("Please select a traversable edge!");
                return;
                }
            }
            else{
                window.alert("Please select an edge to traverse by clicking on it!");
                return;
            }
        }
        
        var tempcache = this.cur[0].cstate.copy();
        tempcache.add(this.cur[0].elem);
        
        next_node.cstate = tempcache;
        this.cur = [next_node];
        
        cur_child_edges = this.get_cur_child_edges();
        var pstring = "The control-flow is split! Select a traversable ";
        pstring += "edge and click on \"Next step\" to continue!";
            
        if (cur_child_edges.length > 1)
            txtdiv.innerHTML = pstring;
        else if (cur_child_edges.length == 1)
            txtdiv.innerHTML = "Click on \"Next step\" to continue!";
        else 
            txtdiv.innerHTML = "Done!";
    }
    
    this.next_step_must = function(){
        
        var cur_child_edges = this.get_cur_child_edges();
        
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
            if (curindex == -1){
                this.update_node_abstract(edge.to);
            }

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
    
    this.find_edge = function(nid_from, nid_to){
        for (var e = 0; e < this.edges.length; e++){
            if (this.edges[e].from.nid == nid_from && this.edges[e].to.nid == nid_to){
                return this.edges[e];
            }
        }
    }
    
    this.add_node = function(elem, nid){
        var new_node = new customgraph_node(elem, nid, this.csize, this.ctype);
        this.nodes.push(new_node); // add new node reference to nodes list
        
        return new_node;
    }

    this.add_edge = function(nid_from, nid_to){
        var from_node = this.find(nid_from);
        var to_node = this.find(nid_to);

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