import { Cookies } from './cookie.ts';
const cookies = new Cookies();

import { Db } from './db.ts';
const db = Db.getInstance();

import { logedUser } from './logedUser.ts';
import { noLogedUser } from './noLogedUser.ts'
import { api } from '../api/main.ts';

const myapi = new api();

export async function web(request:Request) {

    const url = new URL(request.url).pathname
    
    console.log(url)
    if(url.startsWith('/assets/')){
        try {
            return { status: 200, body: Deno.readFileSync(`./assets${url}`) }
        } catch (_error) {
            return { status: 404, body: "Not found" };
        }
    } else if(url.startsWith('/api/') && request.method == "POST"){
        try {
            const content = await request.json();
            return await myapi.main(request, content);
        } catch (_error) {
            console.log(_error)
            return { status: 404, body: "Not found" };
        }
    } else {
        // check if user is logged in
        const userCookies = cookies.getCookie(request);
        const userData = {
            connected: false,
            id: "",
            username: ""
        }
        const u = userCookies.find(x => x.key == "userID")
        if(u.length > 0){
            // get the user data
            const ud = db.getUserData(u.value);
            if(ud){
                userData.connected = true;
                userData.id = ud.id;
                userData.username = ud.username;
            }
        }

        if(userData.connected){
            return await logedUser(request);
        } else {
            return await noLogedUser(request, url);
        }

    }

}