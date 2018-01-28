COL_GREEN = "#00FF00"
COL_GREY = "#EEEEEE"

var nodes = null;
var edges = null;
var container = document.getElementById('CFGdisplay');
var data = null;
var options = null;
var network = null;

var s_node1 = null;
var s_node2 = null;
var s_edge = null;

function get_label(node){
    var label = node.elem + " (" + node.nid + ")";
    if (node.nid == "Begin" || node.nid == "End")
        label = node.nid;
    
    if (!(node.nid == "Begin"))
        label += "\n\n" + node.cstate.toString(true);
    
    return label;
}

function read_datastructure_graphvis(){
    var nodes_list = [];
    for (var n = 0; n < cg.nodes.length; n++){
        var node =  cg.nodes[n];
        nodes_list.push({id: node.nid, label: get_label(node), color:COL_GREY});
    }
    nodes = new vis.DataSet(nodes_list);
    
    var bnode = nodes.get("Begin");
    bnode.label = "Begin";
    bnode.color = { background: COL_GREEN };
    nodes.update(bnode);
    
    var enode = nodes.get("End");
    enode.label = get_label(cg.find(enode.id));
    nodes.update(enode);
    
    var edges_list = [];
    for (var e = 0; e < cg.edges.length; e++){
        edges_list.push({id: cg.edges[e].from.nid + "-" + cg.edges[e].to.nid,
            from: cg.edges[e].from.nid, 
            to: cg.edges[e].to.nid, 
            arrows:"to" });
    }
    // create an array with edges
    edges = new vis.DataSet(edges_list);

    var data = {
    nodes: nodes,
    edges: edges
    };
    
    return data;
}
function init_graphvis(){
    var data = read_datastructure_graphvis();
    
    // create a network
    var container = document.getElementById('CFGdisplay');
    
    var options = {
        nodes:{
            chosen: false,
            shape: 'box',
            margin: 10
        },
        interaction:{hover:true},
        manipulation: {
            enabled: true
        },
        physics: {
            enabled: false
        },
        edges:{
            smooth: {
                enabled: false,
                type: "continuous"
            },
        }
    };
    network = new vis.Network(container, data, options);
}

function clean_graphvis(){
    var data = read_datastructure_graphvis();
    network.setData(data);
}

function clear_selections(){
    var bt_dnode1 = document.getElementById('Delete_selection_node1');
    var bt_dnode2 = document.getElementById('Delete_selection_node2');
    var bt_dedge = document.getElementById('Delete_selection_edge');
    var bt_cedge = document.getElementById('Create_selection_edge');
    
    var span_n1 = document.getElementById('clicked_node_1');
    var span_n2 = document.getElementById('clicked_node_2');
    var span_e = document.getElementById('clicked_edge');
    
    bt_dnode1.disabled = true;
    bt_dnode2.disabled = true;
    bt_dedge.disabled = true;
    bt_cedge.disabled = true;
    
    span_n1.innerHTML = "-";
    span_n2.innerHTML = "-";
    span_e.innerHTML = "-";
    
    s_node1 = null;
    s_node2 = null;
    s_edge = null;
}
function update_selection_text(){
    var bt_dnode1 = document.getElementById('Delete_selection_node1');
    var bt_dnode2 = document.getElementById('Delete_selection_node2');
    var bt_dedge = document.getElementById('Delete_selection_edge');
    var bt_cedge = document.getElementById('Create_selection_edge');
    
    bt_dnode1.disabled = true;
    bt_dnode2.disabled = true;
    bt_dedge.disabled = true;
    bt_cedge.disabled = true;
    
    var span_n1 = document.getElementById('clicked_node_1');
    var span_n2 = document.getElementById('clicked_node_2');
    var span_e = document.getElementById('clicked_edge');
    
    var sel_string = "-";
    span_n1.innerHTML = sel_string;
    span_n2.innerHTML = sel_string;
    span_e.innerHTML = sel_string;
        
    if (s_node1){
        if (s_node2){
            // two nodes selected
            span_n1.innerHTML = ("" + s_node1.id);
            span_n2.innerHTML = ("" + s_node2.id);
            sel_string = "Nodes " + s_node1.id + " and " + s_node2.id;
            bt_dnode1.disabled = false;
            bt_dnode2.disabled = false;
            bt_cedge.disabled = false;
        }
        else{
            // one node selected
            span_n1.innerHTML = ("" + s_node1.id);
            sel_string = "Node " + s_node1.id;
            bt_dnode1.disabled = false;
        }
    }
    else if (s_edge){
        // edge selected
        span_e.innerHTML = (s_edge.from + " -> " + s_edge.to);
        bt_dedge.disabled = false;
    }
    
    
}

function onClick_graphvis(params){
    var click_node_id = network.getNodeAt(params.pointer.DOM);
    var click_edge_id = network.getEdgeAt(params.pointer.DOM);
    
    var click_node = nodes.get(click_node_id);
    var click_edge = edges.get(click_edge_id);
    
    var div = document.getElementById('clicked_node_edge');
    
    if (click_edge_id && !click_node_id){
        // the user clicked on an edge exclusively
        s_node1 = null;
        s_node2 = null;
        
        s_edge = click_edge;
        
    }
    else if (click_node_id){
        // the user clicked on a node
        s_edge = null;
        if (s_node1){
            if (s_node2){
                // The user has already clicked twice but clicked once more
                if (click_node_id == s_node2.id ){
                    // the user clicked the last selected node again
                    s_node1 = s_node2;
                    s_node2 = null;
                }
                else{
                    s_node1 = s_node2;
                    s_node2 = click_node;
                }
            }
            else{
                // The user clicked a second node after the first
                if (click_node_id == s_node1.id){
                    // the user clicked the same node again
                    s_node2 = null;
                }
                else{
                    // the user clicked a different node this time
                    s_node2 = click_node;
                }
            }
        }
        else{
            // The user clicked a node but not yet a second one
            s_node1 = click_node;
        }
    }
    else{
        clear_selections();
    }
    
    update_selection_text();
    update_graphvis();
    
}
function addNode_graphvis(cgnode){
    nodes.add({id: cgnode.nid, 
        label: get_label(cgnode), 
        color:COL_GREY});
}

function update_graphvis(){
    for (var n = 0; n < cg.nodes.length; n++){
        var thisnode = nodes.get(cg.nodes[n].nid);
        thisnode.color = { background: COL_GREY };
        thisnode.label = get_label(cg.nodes[n]);
        nodes.update(thisnode);
    }
    for (var c = 0; c < cg.cur.length; c++){
        var curnode = nodes.get(cg.cur[c].nid);
        curnode.color = { background: COL_GREEN };
        nodes.update(curnode);
    }    
}