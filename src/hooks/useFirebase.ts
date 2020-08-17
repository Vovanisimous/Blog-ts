import { fb } from "../app/App";

interface IFirebase {
    auth: (app?: firebase.app.App) => firebase.auth.Auth,
    database: (app?: firebase.app.App) =>  firebase.database.Database,
    storage: (app?: firebase.app.App) =>  firebase.storage.Storage,
}

export const useFirebase = (): IFirebase => {
    return {
        auth: fb.auth,
        database: fb.database,
        storage: fb.storage
    }
}