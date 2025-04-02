import { io } from "socket.io-client";

const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit("chat message", input.value);
        input.value = "";
    }
});

socket.on("distributed chat", (msg) => {
    const item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on("welcome user", () => {
    const item = document.createElement("li");
    item.textContent = "Hi There, welcome to chat";
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
