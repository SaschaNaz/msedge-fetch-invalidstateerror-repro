const http = require("http");
const mz = require("mz/fs");

http.createServer(async (req, res) => {
    if (req.url === "/") {
        console.log("index.html");
        res.end(await mz.readFile("index.html"));
    }
    else if (req.url === "/json") {
        console.log("Opening a new JSON stream");
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Transfer-Encoding': 'chunked'
        });
        const intervalId = setInterval(() => {
            try {
                res.write(JSON.stringify({
                    value: "Data",
                    timeStamp: new Date().toUTCString()
                }) + "\r\n");
            }
            catch (e) {
                clearInterval(intervalId);
            }
        }, 1000);
        res.on("close", () => {
            clearInterval(intervalId);
            console.log("closed")
        })
    }
    else {
        console.log(404);
        res.writeHead(404);
        res.end();
    }
}).listen(process.env.PORT);
