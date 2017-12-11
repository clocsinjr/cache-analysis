function customgraph_node(top, parent_node, elem, nid) {
    this.top = top;
    this.elem = elem;
    this.nid = nid;

    this.loopback = null;
    this.parents = [parent_node];
    this.children = [];

    this.add_child = function(child_elem, child_id){
        child_node = new customgraph_node(this.top, this, child_elem, child_id);
        this.top.nodes.push(child_node);
        this.children.push(child_node);
    }

    this.give_child = function(child_node){
        this.children.push(child_node);
        child_node.parents.push(this);
    }

    this.give_child_lb = function(child_node){
        this.children.push(child_node);
        child_node.loopback = this;
    }
}

function customgraph() {
    this.begin_node = new customgraph_node(this, this, 'Begin', 'Begin');
    this.end_node = new customgraph_node(this, null, 'End', 'End');
    this.nodes = [this.begin_node, this.end_node];
    this.cur = [this.begin_node];

    this.advance_node = function(curnode){
        for (var c = 0; c < curnode.children.length; c++){
            var child = curnode.children[c];
        }
    }
    this.next_step = function(){
        var newcur = [];
        var to_remove = [];
        var mult_par = [];

        for (var c = 0; c < this.cur.length; c++){
            var adv = this.advance_node(this.cur[c]);
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

        from_node.add_child(elem_to, nid_to);
    }
    this.add_edge_loopback = function(nid_from, nid_to){
        var from_node = this.find(nid_from);
        var to_node = this.find(nid_to);

        from_node.give_child_lb(to_node);
    }

    this.add_edge_existing = function(nid_from, nid_to){
        var from_node = this.find(nid_from);
        var to_node = this.find(nid_to);

        from_node.give_child(to_node);
            
    }
    /* debug print function */
    this.print = function() {
        var pstring = "";
        for (var i = 0; i < this.nodes.length; i++){
            var i_node = this.nodes[i];
            for (var j = 0; j < i_node.children.length; j++){
                pstring += "" + i_node.elem + " -> " + i_node.children[j].elem + ", ";
            }
        }
        console.log(pstring);
    }

}