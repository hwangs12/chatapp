import fs from "fs";

export function sendFile(res, filename, contentType, status) {
    fs.readFile(filename, (err, data) => {
        if (err) {
            // Couldn't read the file, send a 404

            // Couldn't even find the 404 file, send a minimal plaintext 404
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("The requested resource does not exist on this server.");
            res.end();
        } else {
            res.writeHead(status, { "Content-Type": contentType });
            res.write(data);
            res.end();
        }
    });
}
