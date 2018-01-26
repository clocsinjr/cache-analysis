

var lru_must = new LRUcache_must(4, [['X'], [], ['S', 'T'], []]);

lru_must.print();

console.log("After adding 'Y' (must-analysis):");
lru_must.add('A');
lru_must.print();






var cg = new customgraph(4);
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

 
reset_graphvis();

//update_select_from();
//update_select_to();
update_graphtext();
//update_graphvis();

network.on("click", function (params) {
    onClick_graphvis(params);
});

function do_graph_next() {
    cg.next_step();
    update_graphtext();
    update_graphvis();
}

function do_add_node_cg(){
    nn_e_input = document.getElementById('input_new_node_elem').value;
    nn_id_input = document.getElementById('input_new_node_nid').value;
    
    if(cg.find(nn_id_input)){
        window.alert("That node ID already exists! Please choose another");
        return;
    }
    cg.add_node(nn_e_input, nn_id_input); // add to graph datastructure
    addNode_graphvis(nn_e_input, nn_id_input); // add to graph visualization
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
    //edges.update(new_entry);
    cg.print();

    //update_select_from();
    //update_select_to();
    update_graphtext();
    clear_selections();
}

function do_reset_cg() {
    cg = new customgraph(4);
    
    update_select_to();
    update_select_from();
    //update_graphtext();
    //update_graphvis();
    reset_graphvis();

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
    update_graphtext();
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
    update_graphtext();
    clear_selections();
}

function change_select_from(){
    update_select_to();
}

function change_select_to(){
    select_to = document.getElementById('select_to');
    div_create_new_node = document.getElementById('div_create_new_node');
    nn_e_input = document.getElementById('input_new_node_elem');
    nn_id_input = document.getElementById('input_new_node_nid');

    if (select_to.value == "New Node"){
        div_create_new_node.style.display = 'inline';
    }
    else {
        div_create_new_node.style.display = 'none';
    }
}

function update_select_from(){
    select_from = document.getElementById('select_from');
    select_from.options.length = 0;
    for (var i = 0; i < cg.nodes.length; i++){
        select_from.options[i] = new Option(cg.nodes[i].nid, cg.nodes[i].nid);
    }
}

function update_select_to(){
    select_from = document.getElementById('select_from');

    select_to = document.getElementById('select_to');
    select_to.options.length = 0;
    select_to.options[0] = new Option("New Node", "New Node");

    for (var i = 0; i < cg.nodes.length; i++){
        if (cg.nodes[i].nid != select_from.value)
            select_to.options[select_to.options.length] = new Option(cg.nodes[i].nid, cg.nodes[i].nid);
    }
}


cache = new LRUcache(4);

var step = 0;
function update_path(prev) {
    nodes[prev].circle.strokeWidth=1;
    nodes[prev].circle.strokeColor='black';
    nodes[step].circle.strokeWidth=3;
    nodes[step].circle.strokeColor='green';
}

function do_step_next() {
    for (var c = 0; c < cache.csize; c++){
        document.getElementById("c" + c).innerHTML = cache.cache[c];
    }
    cache.print()
}

function do_step_reset() {
    prev = step;
    step = 0;


    for (var c = 0; c < cache.csize; c++){
        document.getElementById("c" + c).innerHTML = " ";
    }

    // Reset style for the cache entry blocks;
    var cs_slider = document.getElementById("cs_slider");
    for (var c = 0; c < cs_slider.value; c++){
        document.getElementById("c" + c).style.background = '#FFFFFF';
    }
    for (var c = cs_slider.value; c < cs_slider.max; c++){
        document.getElementById("c" + c).style.background = '#639D11';
    }

    cache = new LRUcache(document.getElementById("cs_slider").value);
}

// window.onresize = function(){
    // var cfgvis = document.getElementById("column_cfgvis");
    // var divwidth = window.innerWidth - 400;
    // console.log("style","width:" + divwidth + "px");
    // cfgvis.setAttribute("style","width:" + divwidth + "px");
// };