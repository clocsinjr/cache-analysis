var lru_must = new LRUcache_must(4, [['X'], [], ['S', 'T'], []]);

lru_must.print();

console.log("After adding 'Y' (must-analysis):");
lru_must.add('A');
lru_must.print();


var cg = new customgraph(4);
cg.add_edge('Begin', 'A', 'a1');
cg.add_edge('a1', 'B', 'b1');
cg.add_edge('a1', 'C', 'c1');
cg.add_edge('b1', 'D', 'd1');
cg.add_edge_existing('c1', 'd1');
cg.add_edge_existing('d1', 'End');
//cg.add_edge_loopback('d1', 'a1');


// cg.add_edge('Begin', 'A', 'a1');
// cg.add_edge('a1', 'B', 'b1');
// cg.add_edge('a1', 'C', 'c1');
// cg.add_edge('b1', 'D', 'd1');
// cg.add_edge_existing('c1', 'd1');
// cg.add_edge('d1', 'A', 'a2');
// cg.add_edge('a2', 'B', 'b2');
// cg.add_edge('a2', 'C', 'c2');
// cg.add_edge('b2', 'D', 'd2');
// cg.add_edge_existing('c2', 'd2');
// cg.add_edge_existing('d2', 'a1');
// cg.add_edge_existing('d2', 'End');

update_select_from();
update_select_to();
update_graphtext();

function do_graph_next() {
    cg.next_step();
    update_graphtext();
}

function update_graphtext(){
    txtbox = document.getElementById('graphtext');
    curbox = document.getElementById('curtext');
    cstbox = document.getElementById('cachetext');

    txtbox.innerHTML = ""
    for (var i = 0; i < cg.edges.length; i++){
        var fn = cg.edges[i].from;
        var tn = cg.edges[i].to;

        var fn_str = fn.nid + " (" + fn.elem + ")";
        var tn_str = tn.nid + " (" + tn.elem + ")";

        if (cg.find_cur(fn.nid))
            fn_str = fn_str.fontcolor("green");
        if (cg.find_cur(tn.nid))
            tn_str = tn_str.fontcolor("green");

        txtbox.innerHTML  += fn_str + " -> " + tn_str + "<br />";
    }

    pstring = "current nodes: <br />";
    for (var i = 0; i < cg.cur.length; i++){
        pstring += "* "+ cg.cur[i].nid + " ("+ cg.cur[i].elem + ") <br />";
    }
    curbox.innerHTML = pstring;

    cstbox.innerHTML = "cache states: <br />";
    for (var i = 0; i < cg.nodes.length; i++){
        var node = cg.nodes[i];
        var nstr = node.nid + " (" + node.elem + ")";
        if (cg.find_cur(node.nid)){ nstr = nstr.fontcolor("green"); }

        cstbox.innerHTML  += nstr + ":<br />" + node.cstate.toString() + "<br /><br />";
    }
}

function do_add_edge_cg() {
    select_from = document.getElementById('select_from');
    select_to = document.getElementById('select_to');
    
    nn_e_input = document.getElementById('input_new_node_elem');
    nn_id_input = document.getElementById('input_new_node_nid');


    if (select_to.value == "New Node"){
        if(cg.find(nn_id_input.value)){
            window.alert("That node ID already exists! Please choose another");
            return;
        }

        cg.add_edge(select_from.value, nn_e_input.value, nn_id_input.value);
    }
    else{
        cg.add_edge_existing(select_from.value, select_to.value);
    }
    cg.print();

    update_select_from();
    update_select_to();
    update_graphtext();
}

function do_reset_cg() {
    cg = new customgraph(4);

    update_select_to();
    update_select_from();
    update_graphtext();

}

function change_select_from(){
    update_select_to();
}

function change_select_to(){
    select_to = document.getElementById('select_to');
    div = document.getElementById('div_input_hide');
    nn_e_input = document.getElementById('input_new_node_elem');
    nn_id_input = document.getElementById('input_new_node_nid');

    if (select_to.value == "New Node"){
        div.style.display = 'inline';
    }
    else {
        div.style.display = 'none';
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

