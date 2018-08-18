import * as mongoose from "mongoose";

class dbMongoConnector {
    public host: string;
    public userName: string;
    public password: string;
    public db: string;
    public port: string = '47330';
    
    private protocol:string = 'mongodb'; 
    
    constructor(host: string, db: string, userName: string, password: string, port: string = '47330') {
        this.host = host;
        this.db = db;
        this.userName = userName;
        this.password = password;
        this.port = port;
    }
    
    private formatConnectionUrl(): string {
        return `${this.protocol}://${this.userName}:${this.password}@${this.host}:47330/${this.db}`
    }
    
    public async connect(): Promise<any> {
        const dbUrl = this.formatConnectionUrl();

        const connectPromise = function (resolve: any, reject: any): any {
            mongoose.connect(
                dbUrl,
                { useNewUrlParser: true },
                (err: any) => {
                    if (err) {
                      reject(err);
                    }

                    resolve('connected');
                  }
            );
        };

        return new Promise(connectPromise);
    }

    public async closeConnection() {
        setTimeout(() => {
            mongoose.disconnect();            
        }, 5000);
    }
}

export default dbMongoConnector;