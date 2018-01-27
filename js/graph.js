TYPE_CONC = 1;
TYPE_MUST = 2;
TYPE_MAY = 3;

function customgraph_node(elem, nid, csize, ctype) {
    this.elem = elem; // node element, not unique
    this.nid = nid; // node identifier, unique

    this.cstate = null;
    if (ctype == TYPE_CONC)
        this.cstate = new LRUcache(csize);
    else if (ctype == TYPE_MUST)
        this.cstate = new LRUcache_abstract(csize, TYPE_MUST);
    else if (ctype == TYPE_MAY)
        this.cstate = new LRUcache_abstract(csize, TYPE_MAY);
    else
        window.alert("No cache type specified!");
}

function customgraph_edge(first, second, lb) {
    this.from = first;
    this.to = second;
    this.traversed = false;
    
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
        var par_edges = [];
        for (var e = 0; e < this.edges.length; e++){
            if (this.edges[e].to == node)
                par_edges.push(this.edges[e]);
        }
        return par_edges;
    }
    
    this.get_children = function(node){
        var child_edges = this.get_edges_children(node);
        var children = []
        for (var c = 0; c < child_edges.length; c++){
            if (children.indexOf(child_edges[c].to) == -1)
                children.push(child_edges[c].to);
        }
        return children;
    }
    
    this.get_parents = function(node){
        var par_edges = this.get_edges_parents(node);
        var parents = []
        for (var c = 0; c < par_edges.length; c++){
            if (parents.indexOf(par_edges[c].from) == -1)
                parents.push(par_edges[c].from);
        }
        return parents;
    }
    
    this.has_other_parents = function(node){
        var parents = this.get_parents(node);
        for (var p = 0; p < parents.length; p++){
            if (!this.find_cur(parents[p].nid))
                return true;
        }
        return false;
    }
    
    this.all_traversed = function(edge_list){
        for (var e = 0; e < edge_list.length; e++){
            if ( !edge_list[e].traversed)
                return false;
        }
        return true;
    }
    
    this.update_node_abstract = function(node){
        /* This function takes a node, finds all its parents, takes the cache
         * of all parents, joins the caches together and pushes the node as a
         * new current node. */
        
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
        else if (this.ctype == TYPE_MUST || this.ctype == TYPE_MAY)
            this.next_step_abstr();
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
    
    this.next_step_abstr = function(){
        var newcur = [];
        
        for (var c = 0; c < this.cur.length; c++){
            var curn = this.cur[c];
            
            var children = this.get_children(curn);
            for (var i = 0; i < children.length; i++){
                var curn_child = children[i];
                if (!this.has_other_parents(curn_child)){
                    var edge_between = this.find_edge(curn.nid, curn_child.nid);
                    
                    if (!edge_between.traversed){
                        edge_between.traversed = true;
                        this.update_node_abstract(curn_child);
                        newcur.push(curn_child);
                    }
                }
            }
        }
        for (var c = 0; c < this.cur.length; c++){   
            var curn = this.cur[c];
            var cedges = this.get_edges_children(curn);
            console.log(curn, cedges);
            if (!this.all_traversed(cedges) && newcur.indexOf(curn) == -1){
                // if not all edges from curn are traversed, add it back to cur
                newcur.push(curn);
            }
        }
        
        this.cur = newcur;
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