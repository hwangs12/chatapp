import fs from "fs";
import { ServerResponse, IncomingMessage } from "http";
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function sendFile(res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }, file: string) {
    const filename = path.join(__dirname, file);
    fs.readFile(filename, (err, data) => {
        if (err) {
            console.log(err);
            res.statusCode = 404;
            res.end();
        } else {
            res.end(data);
        }
    })
}