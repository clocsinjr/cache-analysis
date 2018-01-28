

var lru_must = new LRUcache_abstract(4, TYPE_MUST, [['X'], [], ['A', 'T'], []]);

lru_must.print();

console.log("After adding 'A' (must-analysis):");
lru_must.add('A');
lru_must.print();


var lru_may = new LRUcache_abstract(4, TYPE_MAY, [['X'], [], ['A', 'T'], []]);

lru_may.print();

console.log("After adding 'A' (may-analysis):");
lru_may.add('A');
lru_may.print();



var cg = new customgraph(4, TYPE_MUST);
cg.add_node('A', 'a1');
cg.add_edge('Begin', 'a1');

cg.add_node('B', 'b1');
cg.add_edge('a1', 'b1');

cg.add_node('C', 'c1');
cg.add_edge('a1', 'c1');

cg.add_node('D', 'd1');
cg.add_edge('b1', 'd1');
cg.add_edge('c1', 'd1');

cg.add_edge('d1', 'End');

// cg.add_edge_loopback('d1', 'a1');

 
init_graphvis();

//update_graphvis();

network.on("click", function (params) {
    onClick_graphvis(params);
});

function do_graph_next() {
    cg.next_step();
    update_graphvis();
}

function do_graph_reset(){
    cg.reset_graph();
    clean_graphvis();
    update_graphvis();
}

function do_add_node_cg(){
    nn_e_input = document.getElementById('input_new_node_elem').value;
    nn_id_input = document.getElementById('input_new_node_nid').value;
    
    if(cg.find(nn_id_input)){
        window.alert("That node ID already exists! Please choose another");
        return;
    }
    var new_node = cg.add_node(nn_e_input, nn_id_input); // add to graph datastructure
    addNode_graphvis(new_node); // add to graph visualization
}
function do_add_edge_cg() {
    if (s_node2.id == "Begin"){
        window.alert("The program is not allowed to go back to the beginning. Please choose another combination.");
        return;
    }
    if (s_node1.id == "End"){
        window.alert("The program is not allowed to continue after termination. Please choose another combination.");
        return;
    }
    if (!s_node1 || !s_node2){
        window.alert("Please select two nodes to create an edge.");
        return;
    }
    if (cg.find_edge(s_node1.id, s_node2.id)){
        window.alert("This edge already exists! Please choose another combination.");
        return;
    }
    cg.add_edge(s_node1.id, s_node2.id);
    var edge_id = s_node1.id + "-" + s_node2.id;
    var new_entry = { id: edge_id, from: s_node1.id, to: s_node2.id, arrows:"to"}
    edges.add(new_entry);
    cg.print();

    update_graphvis();
    clear_selections();
}

function do_reset_cg() {
    if (!confirm("Are you sure you want to remove all nodes and edges?")) {
        return;
    }
    var csize = document.getElementById("cache_size_slider").value;
    var ctype = document.getElementById("cache_type_select").value;
    cg = new customgraph(csize, ctype);
    
    clean_graphvis();
    update_graphvis();
}

function do_rework_cg(){
    var csize = document.getElementById("cache_size_slider").value;
    var ctype = document.getElementById("cache_type_select").value;
    
    cg.rework_graph(csize, ctype);
    
    clean_graphvis();
    update_graphvis();
}

function do_clear_selections(){
    clear_selections();
}

function do_delete_selection_node(node_num){
    var rm_id = null;
    if (node_num == 1){
        rm_id = s_node1.id;
    }
    else if (node_num == 2){
        rm_id = s_node2.id;
    }
    
    for (var i = 0; i < cg.nodes.length; i++){
        if (cg.nodes[i].nid == rm_id){
            cg.nodes.splice(i, 1); // remove node from graph datastructure
            break;
        }
    }
    // remove node from visualization 
    nodes.remove({id: rm_id}); 
    clear_selections();
}

function do_delete_selection_edge(){
    var nid_from = s_edge.from;
    var nid_to = s_edge.to;
    
    for (var e = 0; e < cg.edges.length; e++){
        if (cg.edges[e].from.nid == nid_from && cg.edges[e].to.nid == nid_to){
            cg.edges.splice(e, 1); // remove edge from graph datastructure
            break;
        }
    }
    // remove edge from visualization
    edges.remove({id: nid_from + "-" + nid_to});
    clear_selections();
}

var cache_slider = document.getElementById("cache_size_slider");
cache_slider.oninput = function(){
    document.getElementById("cache_size_display").innerHTML = cache_slider.value;
}