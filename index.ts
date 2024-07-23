import { createServer } from "http";
import { readdirSync, readFileSync } from "fs";
import functions from "./import";

// start live server
createServer(async (req, res) => {
    const pages = await functions();

    type Page = {
        route: string
        page: Function
    }

    if (req.url == "/") {
        const page = pages.find((page: Page) => page.route == "index");
        res.writeHead(200, { // http header
            "Content-Type": "text/html"
        });
        res.write(page?.page().join(("")));
    } else {
        const page = pages.find((page: Page) => `/${page.route}` == req.url);

        if (page) {
            res.writeHead(200, { // http header
                "Content-Type": "text/html"
            });
            res.write(page.page().join(("")));
        } else {
            const page = pages.find((page: Page) => page.route == "404");
            let contentType: string = "text/html";
            
            if (page) {
                res.writeHead(200, { // http header
                    "Content-Type": "text/html"
                });
                res.write(page.page().join(""));
            } else {
                const static_assets = readdirSync("app/public");

                const asset = static_assets.find((asset: string) => `/${asset}` == req.url);

                if (asset) {
                    let asset_type: string = asset.split(".")[1];
                    let asset_content: string | Buffer = readFileSync(`app/public/${asset}`, "utf8");

                    switch (asset_type) {
                        case "css":
                            contentType = "text/css";
                            break;
                        case "js": case "json": case "woff": case "ttf": case "pdf":
                            contentType = `application/${asset_type}`;
                            break;
                        case "png": case "jpg": case "jpeg": case "gif": case "ico": case "webp":
                            contentType = `image/${asset_type}`;
                            asset_content = readFileSync(`app/public/${asset}`); // convert asset content to buffer
                            break;
                        case "svg":
                            contentType = "image/svg+xml";
                            break;
                        case "html":
                            break;
                        default:
                            console.log("Unknown file type");
                            process.exit(1);
                    }

                    res.writeHead(200, { // http header
                        "Content-Type": contentType
                    });

                    res.write(asset_content);
                    res.end();
                } else {
                    res.writeHead(200, { // http header
                        "Content-Type": "text/html"
                    });
    
                    res.write(`
                        <h1 style="text-align: center;">404 Not Found</h1>
                        <p style="text-align: center;">The requested url was not found.</p>
                        <a href="/" style="text-decoration: none;">
                            <button type="button" style="display: block; margin: auto; cursor: pointer;">Go Back</button>
                        </a>
                    `);
                }
            }
        }
    }
    res.end(); //end the response

    /* const image = readFileSync("app/public/joe.png");

    res.writeHead(200, { // http header
        "Content-Type": "image/png"
    });

    console.log(image);

    res.write(image)

    res.end(); //end the response */
}).listen(3000, function () {
    console.log("Hydro App running at http://localhost:3000"); //the server object listens on port 3000
});