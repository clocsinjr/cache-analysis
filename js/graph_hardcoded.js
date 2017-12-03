function customgraph() {
    this.nodes = ['Begin', 'End'];
    this.edges = [['Begin', 'End']];

    this.add_edge = function(nfrom, nto) {
        console.log("" + nfrom + "->" + nto);
        if (!this.nodes.includes(nfrom)){
            console.log("adding nfrom");
            this.nodes.push(nfrom);
        }
        if (!this.nodes.includes(nto)){
            console.log("adding nto");
            this.nodes.push(nto);
        }
        if (this.edges.includes((nfrom, nto))){
            console.log("welp");
            return false;
        }
        else{
            this.edges.push([nfrom, nto]);
        }
            

        return true;
    }

    /* debug print function */
    this.print = function() {
        var pstring = "";
        for (var i = 0; i < this.edges.length; i++){
            var nfrom = this.edges[i][0];
            var nto = this.edges[i][1];
            console.log("edge:  " + this.edges[i]);
            pstring += nfrom + " -> " + nto + ", ";
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


var cg = new customgraph()
cg.add_edge('Begin', 'A');
cg.add_edge('A', 'End');
cg.print();


var nodes = [];
nodes[0] = make_circle('begin', 200, 50);
nodes[1] = make_circle('A', 200, 100);
nodes[2] = make_circle('B', 100, 200);
nodes[3] = make_circle('C', 300, 200);
nodes[4] = make_circle('D', 200, 300);
nodes[5] = make_circle('A', 200, 400);
// var circB2 = make_circle(100, 500);
// var circC2 = make_circle(300, 500);
// var circD2 = make_circle(200, 600);

// Only executed our code once the DOM is ready.
paper.install(window);
window.onload = function() {
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');

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




    // Create a paths between nodes
    var path_begin_A = draw_line([0, 1])
    var path_ABD = draw_line([1, 2, 4])
    var path_ACD = draw_line([1, 3, 4])
    var path_DA2 = draw_line([4, 5])

    for (var n = 0; n < nodes.length; n++){
        nodes[n] = set_circle(nodes[n]);
    }
    
    var mpos = (0, 0);

    // on every frame:
    paper.view.onFrame = function(event) {
        var valA = document.getElementById('inputA').value;
        nodes[1].text.content = 'A: ' + valA;
        var valB = document.getElementById('inputB').value;
        nodes[2].text.content = 'B: ' + valB;

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
    prev = step;
    if (step == 1){
        if (document.getElementById("input" + nodes[step].label).value < 5){
            step = 2;
        }
        else{
            step = 3;
        }
    }
    else if (step == 2){
        step = 4;
    }
    else if (step == 3){
        step = 4;
    }
    else if (step == 4){
        step = 1;
    }
    else {
        step++
    }

    cache.add(nodes[step].label)
    update_path(prev);

    for (var c = 0; c < cache.csize; c++){
        document.getElementById("c" + c).innerHTML = cache.cache[c];
    }
    cache.print()
}

function do_step_reset() {
    prev = step;
    step = 0;

    update_path(prev);

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

function do_add_node_cg() {
    return false;
}
function do_reset_cg() {
    cg = new customgraph();
}

