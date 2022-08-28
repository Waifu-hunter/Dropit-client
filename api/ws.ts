// this is a singleton class
export class websocketClient {
    private static instance: websocketClient;

    private client = new WebSocket("ws://127.0.0.1:25793/dropit")
    private promises = new Map<string, (body: any) => void>;

    private constructor() {
        this.client.onmessage = ({ data }) => {
            const content = JSON.parse(data);
            if (content.type == "reply" && content.uid && content.body) {
                const promise = this.promises.get(content.uid);
                if (promise) promise(content.body);
            }
        }
    }

    public static getInstance() {
        if (!websocketClient.instance) {
            websocketClient.instance = new websocketClient();
        }
        return websocketClient.instance;
    }

    public ask(body: string) {
        const uid = this.generateRandomString(10)
        
        return new Promise<any>((resolve) => {
            this.promises.set(uid, resolve);
            this.client.send(JSON.stringify({ 
                uid,
                body,
                type: "ask"
            }));
        })
    }
    
    // au cas ou pour les autres script par pour lui
    public reply(socket: WebSocket, uid: string, body: string) {
        socket.send(JSON.stringify({ 
            uid,
            body
        }));
    }

    private generateRandomString(length:number){
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}



