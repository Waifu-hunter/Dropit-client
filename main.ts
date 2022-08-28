/**
 * Permet de gerer les demandes du node et de gerer ses données localement 
 * mise en place d'un proxy local
 */

/**
 * 
 * Serveur d'authentification.
 * Permet de se connecter à l'application via une clé d'authentification.
 * 
 * 2 tables de données: 
 * - une table de clés d'authentification
 *      - RSA clé publique
 *      - user key
 * - table des currents user connected
 *      - id user
 *      - node infos
 * 
 */

const RESPONSE_ERROR = new Response("I'm a teapot", { status: 418 });

const server = Deno.listen({ port: 25791, hostname: "127.0.0.1" });

import { web } from "./web/main.ts";

async function main(request: Request) {
    return await web(request)
}

console.log("Server started");
for await (const conn of server) {
    (async () => {
        const httpConn = Deno.serveHttp(conn);
        for await (const { request, respondWith} of httpConn) {
            if (["GET", "POST"].includes(request.method)) {
                const { status, body } = await main(request),
                    content = typeof body == "string" ? body : JSON.stringify(body);

                respondWith(new Response(content, { status }));
            } else {
                respondWith(RESPONSE_ERROR);
            }
        }
    })();
}