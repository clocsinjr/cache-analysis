function LRUcache_must(size, preset) {

    this.cache = [];
    if (preset)
        this.cache = preset;
    else
        for (var i = 0; i < size; i++) { this.cache[i] = []; }
        

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
        if (!addr){return; }

        var hit = this.check_hit(addr);

        // If the addr was already found in the cache, remove it from its
        // previous position
        if (hit)
            this.cache[hit[0]].splice(hit[1], 1);

        // hit[0] = age
        // hit[1] = position in list on age hit[0]
        
        var moveover = [addr];
        for (var c = 0; c < this.cache.length; c++){
            
            var prev_cap = 1;
            for (var i = 0; i <= c; i++){ prev_cap += this.cache[i].length;}

            // prev_cap now has the number of elements in the cache from 
            // index 0 to c

            if (prev_cap > (c + 1)){
                var temp = moveover;
                moveover = this.cache[c];

                if (c+1 < this.cache.length)
                    this.cache[c+1] = this.cache[c+1].concat(moveover);
                this.cache[c] = [];
            }
        }



        // push the added address to the top of the cache
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

        return tempcache;
    }

    this.clear = function(){
        for (var i = 0; i < this.cache.length; i++) {
            this.cache[i] = [];
        }
    }
    this.copy = function(){
        var tempcache = new LRUcache_must(this.cache.length);
        for (var i = 0; i < this.cache.length; i++){
            for (var j = 0; j < this.cache[i].length; j++){
                tempcache.cache[i][j] = this.cache[i][j];
            }
        }
        return tempcache;
    }

    /* debug print function */
    this.toString = function() {
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
        return pstring;
    }

    this.print = function(){
        var pstring = this.toString();
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
