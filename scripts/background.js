// TODO: Add header

var tcpServer;

/**
 * Listens for the app launching then creates the window
 *
 * @see https://developer.chrome.com/apps/app_runtime
 * @see https://developer.chrome.com/apps/app_window
 */
chrome.app.runtime.onLaunched.addListener(function() {

    // Start TCP Server
    console.log('Chromium CLI+APP is starting...');
    startServer('127.0.0.1', 12345);
});

chrome.app.runtime.onRestarted.addListener(function() {

    // Start TCP Server
    console.log('Chromium CLI+APP is restarting...');
});

function onAcceptCB(tcpConnection, socketInfo){
    console.log('New connection from ' + socketInfo.peerAddress);

    tcpConnection.sendMessage("0: Connected. Welcome :)");

    // Callback function when data are received
    tcpConnection.addDataReceivedListener(function(data) {
        // Parse line by line
        var lines = data.split(/[\n\r]+/);
        for (var i = 0 ; i < lines.length ; i++) {
            var line = lines[i];
            if (line.length > 0) {
                console.log (' => '+line);
                var command = line.split(/\s+/);
                try {
                    tcpConnection.sendMessage(Commands.run (command[0], command.slice(1)));
                } catch (excp) {
                    tcpConnection.sendMessage("1: "+excp);
                }
            }
        }
    });
}

function stopServer() {
    if (tcpServer){
        tcpServer.disconnect();
        tcpServer=null;
    }
}

function startServer(addr, port) {
    if (tcpServer){
        tcpServer.disconnect();
    }
    tcpServer = new TcpServer(addr, port);
    tcpServer.listen(onAcceptCB);
}
