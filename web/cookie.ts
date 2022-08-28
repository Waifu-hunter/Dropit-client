export class Cookies {

    public getCookie(request:Request) {
        const cookies = request.headers.get("cookie");
        const db = []
        if(cookies){
            cookies.split(";").forEach(cookie => {
                const [key, value] = cookie.split("=");
                db.push({ key, value });
            })
        }
        return db;
    }

    

}