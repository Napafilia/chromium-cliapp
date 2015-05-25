var IdSequence = (function () {

    var instance;       // Singleton
    var dict = [];      // List of used IDs
    var index = 0;

    function createInstance () {
        var object = new Object();
        return object;
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    
        getFreeId: function() {
            do {
                index = (index + 1) % 64;
            } while (dict.indexOf (index) != -1);

            dict.push (index);
            return (index);
        }
    };

})();
