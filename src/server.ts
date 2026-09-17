import http from "http";
import fs from "fs";
import path from "path";

export async function startServer(
    projectPath: string,
    port: number
) {

    const htmlPath = path.join(
        projectPath,
        "dist",
        "index.html"
    );

    if (!fs.existsSync(htmlPath)) {
        throw new Error(
            "Production build not found."
        );
    }

    const server =
        http.createServer(
            (req, res) => {

                if (
                    req.url === "/" ||
                    req.url === "/index.html"
                ) {

                    const html =
                        fs.readFileSync(
                            htmlPath
                        );

                    res.writeHead(
                        200,
                        {
                            "Content-Type":
                                "text/html; charset=utf-8"
                        }
                    );

                    res.end(html);

                    return;
                }

                res.writeHead(404);

                res.end("404 - Not Found");
            }
        );

    server.listen(
        port,
        "0.0.0.0",
        () => {

            console.log(`
started successfully

http://localhost:${port}
`);
        }
    );
}
