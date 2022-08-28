import { websocketClient } from './ws.ts';
const ws = websocketClient.getInstance();

export class api {
    public async main(request:Request, content:any) {
        const url = new URL(request.url).pathname
        if(url == "/api/login"){
            return await this.login(request, content);
        } else if(url == "/api/loginCheck"){
            return await this.loginCheck(request, content);
        } else if(url == "/api/register"){
            return await this.register(request, content);
        } else {
            return { status: 404, body: "invalid api route" };
        }
    }



    async login(_request:Request, content:any) {
        // check the body contain all the fields: username
        if(!content.username){
            return { status: 404, body: "Missing data" }
        }
        // send the data to the auth serveur
        const body = await ws.ask(JSON.stringify({
            route: "/login",
            body: {
                username: content.username
            }
        }))

        return { status: 200, body: { data: body } }
    }

    async loginCheck(_request:Request, content:any) {
        // check the body contain all the fields: username, authString
        if(!content.username || !content.authString){
            return { status: 404, body: "Missing data" }
        }
        // send the data to the auth serveur
        const body = await ws.ask(JSON.stringify({
            route: "/loginCheck",
            body: {
                username: content.username,
                authString: content.authString
            }
        }))

        return { status: 200, body: { data: body } }
    }

    async register(_request:Request, content:any) {
        // check the body contain all the fields: username, pubRSA
        if(!content.username || !content.pubRSA){
            return { status: 404, body: "Missing data" }
        }
        // send the data to the auth serveur
        const body = await ws.ask(JSON.stringify({
            route: "/register",
            body: {
                username: content.username,
                pubRSA: content.pubRSA
            }
        }))

        return { status: 200, body: { data: body } }
    }
}