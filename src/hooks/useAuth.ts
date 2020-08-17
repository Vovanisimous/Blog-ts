import fb from "firebase";
import { useFirebase } from "./useFirebase";
interface IAuth {
    onRegister: (email: string, login: string, password: string) => Promise<fb.auth.UserCredential>
    onLogin: (email: string, password: string) => Promise<fb.auth.UserCredential>
}

export const useAuth = (): IAuth => {
    const firebase = useFirebase();

    const register = (email: string, login: string, password: string) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    const login = (email: string, password: string) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    return {
        onRegister: register,
        onLogin: login
    }
}