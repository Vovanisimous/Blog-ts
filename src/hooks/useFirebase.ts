import { fb } from "../app/App";

interface IFirebase {
    auth: {
        Auth: (app?: firebase.app.App) => firebase.auth.Auth;
        credential: (email: string, password: string) => firebase.auth.AuthCredential;
    };
    database: (app?: firebase.app.App) => firebase.database.Database;
    storage: (app?: firebase.app.App) => firebase.storage.Storage;
}

export const useFirebase = (): IFirebase => {
    return {
        auth: {
            Auth: fb.auth,
            credential: fb.auth.EmailAuthProvider.credential,
        },
        database: fb.database,
        storage: fb.storage,
    };
};
