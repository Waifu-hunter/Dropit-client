export async function noLogedUser(request:Request, url:string) {

    if(url == "/" || url == "/login"){
        return { status: 200, body: await Deno.readFile("./web/login/index.html") };
    } else if(url == "/register"){
        return { status: 200, body: await Deno.readFile("./web/register/index.html") };
    } else {
        return { status: 404, body: "Not found" };
    }
}