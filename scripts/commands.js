// TODO: Add header

(function(exports) {

    function Commands() {
  	    this.commands = {};
    }

    Commands.prototype.addCommand = function(name, help_params, help_desc, fct) {
        if (name in this.commands) {
  		    console.log("Ignoring duplicate command: "+name);
  		    return;
  	    }
  	    this.commands[name] = {help_params: help_params,
                                help_desc: help_desc,
                                fct: fct};
    }

    Commands.prototype.help = function(name, args) {
        var result = '';
        for (var command in this.commands) {
            result += command;
            result += '\t' +this.commands[command].help_desc + "\n";
            if (Object.keys(this.commands[command].help_params).length > 0) {
                result += '  Parameters:\n';
                for (var param in this.commands[command].help_params) {
                    result += "  - " + param + ": " + this.commands[command].help_params[param] + "\n";
                }
            }
            result += '\n';
        }
    
        return result;
    }

    Commands.prototype.run = function(name, args) {
        if (name === 'help') {
            return "0: Commands:\n"+this.help(name, args);
        }
  	
        if (!(name in this.commands)) {
  		    throw 'Unknown command '+name+'. Try "help"';
  	    }

  	    var context={};
  	    return this.commands[name].fct.call(context, args);
    }

    exports.Commands = new Commands();

})(window);

Commands.addCommand("window_background", 
    {
        id: "ID of the window",
        background: "Color of the Webview background",
    },
    "Set the background color of the Webview.",
    function(args) {
        try {
            appWin = chrome.app.window.get(args[0]);
            if (appWin === null) {
                return "1: Window "+args[0]+" does not exist."
            }
            var doc= appWin.contentWindow.document;
            var wv = doc.querySelector("webview");
            wv.src = "data:text/plain,Offline";
            wv.insertCSS({code: "body { background-color: "+args[1]+"; overflow: hidden;}"})
            return "0: Window "+args[0]+" colored with: "+args[1];
        } catch (e) {
            return "1: "+e;
        }
    }
);

Commands.addCommand("window_new",
    {
        width: "Width of the window",
        height: "Height of the window"
    },
    "Create a new Chromimum window and returns the window's ID.",
    function(args) {

        var newWinId = IdSequence.getFreeId();
        try {
            chrome.app.window.create('resources/black.html', 
                                        {id: newWinId.toString(),
                                        innerBounds: {
                                            width: parseInt(args[0]),
                                            height: parseInt(args[1]) },
                                        state: "normal",
                                        resizable: false,
                                        singleton: true,
                                        focused: false});
            return "0: ID "+newWinId;
        } catch (e) {
            return "1: "+e;
        }
    }
);

Commands.addCommand("window_close",
    {
        id: "ID of the window",
    },
    "Close a Chromium window.",
    function(args) {

        try {
            appWin = chrome.app.window.get(args[0]);
            if (appWin === null) {
                return "1: Window "+args[0]+" does not exist."
            }
            appWin.close();
            return "0: Window "+args[0]+" closed.";
        } catch (e) {
            return "1: "+e;
        }
    }
);

Commands.addCommand("window_close_all",
    {},
    "Close all Chromium windows.",
    function(args) {

        var counter = 0;
        try {
            var appWins = chrome.app.window.getAll();
            for (var i = 0 ; i < appWins.length ; i++) {
                var appWin = appWins[i];
                appWin.close();
                counter++;
            }
            return "0: "+counter+" windows closed."
        } catch (e) {
            return "1: "+e;
        }
    }
);

Commands.addCommand("window_url", 
    {
        id: "ID of the window",
        url: "URL to open in the Window",
    },
    "Open the given URL in the given Window.",
    function(args) {
        try {
            appWin = chrome.app.window.get(args[0]);
            if (appWin === null) {
                return "1: Window "+args[0]+" does not exist."
            }
            var doc= appWin.contentWindow.document;
            var wv = doc.querySelector("webview");
            wv.src = args[1];
            wv.insertCSS({code: "body { overflow: hidden; }"});
            return "0: Window "+args[0]+" opened: "+args[1];
        } catch (e) {
            return "1: "+e;
        }
    }
);
