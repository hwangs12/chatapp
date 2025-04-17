import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";

import { loginPassed } from "./login";
import { sendFile } from "./sendFile";

const loginPage = fs.readFileSync(path.resolve("src", "login.html"));
const chatPage = fs.readFileSync(path.resolve("src", "chat.html"));
const unauthorizedPage = fs.readFileSync(path.resolve("src", "401.html"))

const server = createServer((req, res) => {
    const url = req.url;
    if (url === "/") {
        res.writeHead(301, { location: "/enter" });
        res.end(); //end the response
    } else if (url === "/chat") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(chatPage);
    } else if (url === "/login") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            if (loginPassed(body)) {
                res.writeHead(302, {
                    Location: "/chat",
                });
                res.end();
            } else {
                res.writeHead(302, {
                    Location: "/unauthorized",
                });
                res.end(unauthorizedPage);
            }
        });
    } else if (url === '/client.js') {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        sendFile(res, "client.js");
    } else if (url === '/enter') {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(loginPage);
    } else if (url === '/unauthorized') {
        res.writeHead(401, { "Content-Type": "text/html" });
        res.end(unauthorizedPage);
    }
});
const io = new Server(server);

io.on("connection", (socket) => {
    io.emit("welcome user");
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
