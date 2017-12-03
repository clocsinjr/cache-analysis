function customgraph_node(top, parent_node, name) {
    this.top = top;
    this.name = name;
    this.depth = parent_node.depth + 1;
    this.children = [];

    this.add_child = function(child_name){
        child_node = new customgraph_node(this.top, this, child_name);
        this.top.nodes.push(child_node);
        this.children.push(child_node);
    }

    this.give_child = function(child_node){
        this.children.push(child_node);

        if (this.depth + 1 > child_node.depth){
            child_node.depth = this.depth + 1;
        }
    }
}

function customgraph() {
    this.depth = 0;

    this.max_depth = 1;
    this.max_width = 1;

    this.begin_node = new customgraph_node(this, this, 'Begin');
    this.nodes = [this.begin_node];

    this.calc_maxes = function(){
        var new_max_depth = 0;
        var new_max_width = 0;

        var width_for_depth = [];

        for (var i = 0; i < this.nodes.length; i++){

            if (this.nodes[i].depth > new_max_depth){
                new_max_depth = this.nodes[i].depth;
            }
        }
        this.max_depth = new_max_depth;

        // initialize the array of widths per depth with zeroes
        for (var i = 0; i < new_max_depth + 1; i++){ width_for_depth[i] = 0; }

        // Count the number of nodes at each depth
        for (var i = 0; i < this.nodes.length; i++){
            width_for_depth[this.nodes[i].depth] += 1;
        }

        // get the highest width found
        this.max_width = Math.max.apply(null, width_for_depth);

        console.log("depth: " + this.max_depth + ", width: " + this.max_width);
    }

    this.find = function(node_name){
        for (var i = 0; i < this.nodes.length; i++){
            if (this.nodes[i].name == node_name){
                return this.nodes[i];
            }
        }
        return false;
    }
    this.add_edge = function(nfrom, nto){
        var from_node = this.find(nfrom);
        var to_node = this.find(nto);

        if (!to_node)
            from_node.add_child(nto);
        else
            from_node.give_child(to_node);
            
    }
    /* debug print function */
    this.print = function() {
        var pstring = "";
        for (var i = 0; i < this.nodes.length; i++){
            var i_node = this.nodes[i];
            for (var j = 0; j < i_node.children.length; j++){
                pstring += "" + i_node.name + " -> " + i_node.children[j].name + ", ";
            }
        }
        console.log(pstring);
    }

}