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

        var addr_age = this.cache.length; //just outside the cache
        var pos_in_list = null;
        
        if (hit){
            addr_age = hit[0];          // hit[0] = age
            pos_in_list = hit[1]        // hit[1] = position in list on age hit[0]
            
            // If the addr was already found in the cache, remove it from its
            // previous position
            this.cache[addr_age].splice(pos_in_list, 1);
        }
        
        for (var c = addr_age - 1; c >= 0; c--){
            if ((c + 1) < this.cache.length){
                var moveover = this.cache[c];
                this.cache[c + 1] = this.cache[c + 1].concat(moveover);
            }
            this.cache[c] = [];
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
    this.toString = function(vertical) {
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
            if (vertical)
                pstring += "\n";
                
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
        if (!addr){return; }

        var hit = this.check_hit(addr);
        var addr_age = this.cache.length; //just outside the cache
        if (hit){
            addr_age = hit;
            
            // If the addr was already found in the cache, remove it from its
            // previous position
            this.cache[addr_age] = null;
        }
        
        for (var c = addr_age - 1; c >= 0; c--){
            if ((c + 1) < this.cache.length){
                this.cache[c + 1] = this.cache[c];
            }
            this.cache[c] = null;
        }

        // push the added address to the top of the cache
        this.cache[0] = addr;
    }

    this.clear = function(){
        for (var i = 0; i < this.cache.length; i++) {
            this.cache[i] = null;
        }
    }
    this.copy = function(){
        var tempcache = new LRUcache(this.cache.length);
        for (var i = 0; i < this.cache.length; i++){
            tempcache.cache[i] = this.cache[i];
        }
        return tempcache;
    }
    
    this.toString = function(vertical) {
        var pstring = "";
        for (var i = 0; i < this.cache.length; i++){
            pstring += "[";
            if (this.cache[i])
                pstring += this.cache[i];
            else
                pstring += " ";
            pstring += "]";
            if (vertical)
                pstring += "\n";
                
        }
        return pstring;
    }
    
    /* debug print function */
    this.print = function() {
        var pstring = this.toString();
        console.log(pstring);
    }
}
