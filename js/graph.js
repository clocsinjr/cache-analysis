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

function LRUcache_must(size, preset) {

    this.cache = [];
    if (preset){
        this.cache = preset;
    }
    else{
        for (var i = 0; i < size; i++) {
            this.cache[i] = [];
        }
    }
        

    /* check_hit checks the cache and returns the index of the array if addr
     * is present in the cache or returns false if addr is not present. */
    this.check_hit = function(addr) {
        for (var i = 0; i < this.cache.length; i++){
            for (var j = 0; j < this.cache[i].length; j++){
                if (this.cache[i][j] == addr)
                    return [i, j];
            }
        }
        return false;
    }

    /* add pushes a new addr onto the cache. Uses check_hit to check if it
     * is already present. */
    this.add = function(addr){
        var hit = this.check_hit(addr);

        // If the addr was already found in the cache, remove it from its
        // previous position
        if (hit)
            this.cache[hit[0]].splice(hit[1], 1);

        this.cache[0].push(addr);
    }

    this.join = function(other){

        var tempcache = new LRUcache_must(this.cache.length);

        for (var i = 0; i < this.cache.length; i++){
            for (var j = 0; j < this.cache[i].length; j++){
                var f = other.check_hit(this.cache[i][j]);

                if(f){
                    var newpos = i;
                    if (f[0] > newpos){ newpos = f[0];}

                    tempcache.cache[newpos].push(this.cache[i][j]);
                }
            }
        }

        this.cache = tempcache.cache;
    }

    this.clear = function(){
        for (var i = 0; i < this.cache.length; i++) {
            this.cache[i] = [];
        }
    }

    /* debug print function */
    this.print = function() {
        var pstring = "";
        for (var i = 0; i < this.cache.length; i++){
            pstring += "[";

            if (this.cache[i]){
                pstring += "{";
                for (var j = 0; j < this.cache[i].length; j++){
                    pstring += this.cache[i][j] + ", ";
                }
                pstring += "}";
            }                    
            else{
                pstring += " ";
            }

            pstring += "]";
                
        }
        console.log(pstring);
    }
}


function LRUcache(size) {
    this.csize = size;
    this.cache = [];
    for (var i = 0; i < size; i++) {
        this.cache[i] = null;
    };

    /* check_hit checks the cache and returns the index of the array if addr
     * is present in the cache or returns false if addr is not present. */
    this.check_hit = function(addr) {
        for (var i = 0; i < this.csize; i++){
            if (this.cache[i] == addr)
                return i;
        }
        return false;
    }

    /* add pushes a new addr onto the cache. Uses check_hit to check if it
     * is already present. */
    this.add = function(addr){
        var hit = this.check_hit(addr);
        var bound = this.csize;
        if (hit)
            bound = hit;

        for (var i=bound; i > 0; i--)
            this.cache[i] = this.cache[i - 1];
        this.cache[0] = addr;
    }

    /* debug print function */
    this.print = function() {
        var pstring = "";
        for (var i = 0; i < this.csize; i++){
            if (this.cache[i])
                pstring += "[" + this.cache[i] + "]";
            else
                pstring += "[ ]";
        }
        console.log(pstring);
    }
}

function make_circle(l, x, y) {
    return {circle: null, text: null, label: l, val:null, pos:[x, y]}
}


var lru_must = new LRUcache_must(4, [['A'], [], ['C', 'F'], ['D']]);
var lru_must_B = new LRUcache_must(4, [['C'], ['E'], ['A'], ['D']]);

lru_must.join(lru_must_B);
lru_must.print();

lru_must.add('A');
lru_must.print();

var cg = new customgraph();

function do_add_edge_cg() {
    select_from = document.getElementById('select_from');
    select_to = document.getElementById('select_to');
    nn_input = document.getElementById('input_new_node');

    if (select_to.value == "New Node"){
        cg.add_edge(select_from.value, nn_input.value);
    }
    else{
        cg.add_edge(select_from.value, select_to.value);
    }
    cg.print();

    update_select_from();
    update_select_to();
    cg.calc_maxes();
}

function do_reset_cg() {
    cg = new customgraph();

    update_select_to();
    update_select_from();

}

function change_select_from(){
    update_select_to();
}

function change_select_to(){
    select_to = document.getElementById('select_to');
    nn_input = document.getElementById('input_new_node');

    if (select_to.value == "New Node")
        nn_input.style.display = 'inline';
    else
        nn_input.style.display = 'none';
}

function update_select_from(){
    select_from = document.getElementById('select_from');
    select_from.options.length = 0;
    for (var i = 0; i < cg.nodes.length; i++){
        select_from.options[i] = new Option(cg.nodes[i].name, cg.nodes[i].name);
    }
}

function update_select_to(){
    select_from = document.getElementById('select_from');

    select_to = document.getElementById('select_to');
    select_to.options.length = 0;
    select_to.options[0] = new Option("New Node", "New Node");

    for (var i = 0; i < cg.nodes.length; i++){
        if (cg.nodes[i].name != select_from.value)
            select_to.options[select_to.options.length] = new Option(cg.nodes[i].name, cg.nodes[i].name);
    }
}


// Only executed our code once the DOM is ready.
paper.install(window);
window.onload = function() {
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    var canvas_h = canvas.height;
    var canvas_w = canvas.width;

    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    // Function used to draw lines between the nodes specified by the indices
    // given in list 'n_indices'
    function draw_line(n_indices){
        var path = new paper.Path();
        path.strokeColor = 'black';
        path.strokeWidth = 1;

        path.moveTo(nodes[n_indices[0]].pos)
        for (var i = 1; i < n_indices.length; i++){
            path.lineTo(nodes[n_indices[i]].pos);
        }
    }
    // Function used to make simple circles
    function set_circle(node) {
        var circ = new Path.Circle(new Point(node.pos), 20);
        circ.strokeColor = 'black';
        circ.fillColor =(0.9, 0.9, 0.9);

        node.circle = circ

        var t = new PointText(new Point(node.pos));
        t.justification = 'center';
        t.fillColor = 'black';
        t.content = node.label;

        node.text = t;

        return node;
    }


    paper.project.clear();

    // on every frame:
    paper.view.onFrame = function(event) {

        // if (valA < 5){
        //     path_ABD.strokeWidth = 5;
        //     path_ABD.strokeColor = 'green';
        //     path_ACD.strokeWidth = 1;
        //     path_ACD.strokeColor = 'black';
        // }
        // else{
        //     path_ACD.strokeWidth = 5;
        //     path_ACD.strokeColor = 'green';
        //     path_ABD.strokeWidth = 1;
        //     path_ABD.strokeColor = 'black';
        // }
    }

    // on mouse move:
    var tool = new Tool();
    tool.onMouseMove = function(event) {
        mpos = event.point;
    }
    paper.view.draw();


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

