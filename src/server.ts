import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";

import { loginPassed } from "./login";

const loginPage = fs.readFileSync(path.resolve("src", "login.html"));
const chatPage = fs.readFileSync(path.resolve("src", "chat.html"));
const unauthorizedPage = fs.readFileSync(path.resolve("src", "unauthorized.html"))

const server = createServer((req, res) => {
    const url = req.url;
    if (url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(loginPage); //end the response
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
                    //add other headers here...
                });
                res.end();
            } else {
                res.writeHead(401, {
                    Location: "/",
                    //add other headers here...
                });
                res.end(unauthorizedPage);
            }
        });
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
