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

    this.next_step = function(){
        var newcur = [];
        var to_remove = [];
        var mult_par = [];

        for (var c = 0; c < this.cur.length; c++){
            var cchildren = this.cur[c].children;

            // Loop through the children of this current node
            for (var c2 = 0; c2 < cchildren.length; c2++){

                // add the child to the new current list if it has one parent
                // (it's only connnected to the current node)
                if (cchildren[c2].parents.length == 1){

                    // TODO: HERE THE CURRENT NODE ADVANCES ONE STEP
                    newcur.push(cchildren[c2]);
                    to_remove.push(c);
                }
                else{
                    // add to childnodes with multiple parents
                    mult_par.push(cchildren[c2]);
                }
            }
        }

        // remove the marked indices
        for (var i = 0; i < to_remove.length; i++){ this.cur.splice(to_remove[i], 1);}

        
        for (var c = 0; c < mult_par.length; c++){
            // if all parents of the multi-parent node are found in this.cur
            // then the parents are removed from this.cur and the multiparent
            // node is added to newcur
            if (this.find_parents_in_cur(mult_par[c])){
                newcur.push(mult_par[c]);
            }
        }
        this.cur = newcur;
    }

    this.find_parents_in_cur = function(mp_node){
        
        // list of nodes to be removed from cur
        var to_remove = [];

        for (var p = 0; p < mp_node.parents.length; p++){
            // check if the nid of the parent is in this.cur
            var par = this.find_cur(mp_node.parents[p].nid);
            if (par){
                to_remove.push(par);
            }
            else{
                return false;
            }
        }

        // THIS CODE WILL BE REACHED IF ALL THE PARENTS OF THIS MULTI PARENT
        // NODE ARE PRESENT IN this.cur

        // The following nested loops remove the marked parents of the mp_node
        // from this.cur
        for (var r = 0; r < to_remove.length; r++){
            for (var c = 0; c < this.cur.length; c++){
                if (to_remove[r].nid == this.cur[c].nid){
                    this.cur.splice(c, 1);
                    break;
                }

            }
        }

        return true;
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