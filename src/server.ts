import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";

var html = fs.readFileSync(path.resolve("src", "hello-world.html"));

const server = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
});
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("chat message", (msg) => {
        io.emit("distributed chat", msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(Number(process.env.PORT) || 3000, "0.0.0.0", 10, () => {
    console.log("Server running at localhost 3000");
});
