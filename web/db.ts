// this is a singleton class

interface User {
    id: string;
    username: string;
}

export class Db {
    private static instance: Db;

    private userDB: User[] = []

    private constructor() {
        try {
            this.userDB = JSON.parse(Deno.readTextFileSync("./db.json"));
        } catch (error) {}

        setInterval(() => {
            Deno.writeTextFileSync("./db.json", JSON.stringify(this.userDB));
        }, 10000)
    }

    public static getInstance() {
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }
    
    public getUserData(userID: string): User | undefined {
        return this.userDB.find(x => x.id == userID);
    }
}