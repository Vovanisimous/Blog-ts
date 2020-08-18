import fb from "firebase";
import { useFirebase } from "./useFirebase";
interface IAuth {
    onRegister: (email: string, login: string, password: string) => Promise<fb.auth.UserCredential>
    onLogin: (email: string, password: string) => Promise<fb.auth.UserCredential>
    credential: (email: string, password: string) => firebase.auth.AuthCredential;
}

export const useAuth = (): IAuth => {
    const firebase = useFirebase();

    const register = (email: string, login: string, password: string) => {
        return firebase.auth.Auth().createUserWithEmailAndPassword(email, password);
    }

    const login = (email: string, password: string) => {
        return firebase.auth.Auth().signInWithEmailAndPassword(email, password);
    }
    
    const credential = (email: string, password: string) => {
        return firebase.auth.credential(email, password)
    }

    return {
        onRegister: register,
        onLogin: login,
        credential
    }
}
