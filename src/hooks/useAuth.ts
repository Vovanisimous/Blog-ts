import fb from "firebase";
import { useFirebase } from "./useFirebase";
interface IAuth {
    onRegister: (email: string, login: string, password: string) => Promise<fb.auth.UserCredential>;
    onLogin: (email: string, password: string) => Promise<fb.auth.UserCredential>;
    credential: (email: string, password: string) => firebase.auth.AuthCredential;
    onAuthStateChanged: (
        fun: firebase.Observer<any> | ((a: firebase.User | null) => any),
        error?: (a: firebase.auth.Error) => any,
        completed?: firebase.Unsubscribe,
    ) => firebase.Unsubscribe;
    onSignOut: () => Promise<void>;
    OnReauthenticateWithCredential: (
        credential: firebase.auth.AuthCredential,
    ) => Promise<firebase.auth.UserCredential> | undefined;
    onCurrentUser: () => firebase.User | null;
}

export const useAuth = (): IAuth => {
    const firebase = useFirebase();

    const register = (email: string, login: string, password: string) => {
        return firebase.auth.Auth().createUserWithEmailAndPassword(email, password);
    };

    const login = (email: string, password: string) => {
        return firebase.auth.Auth().signInWithEmailAndPassword(email, password);
    };

    const signOut = () => {
        return firebase.auth.Auth().signOut();
    };

    const currentUser = () => {
        return firebase.auth.Auth().currentUser
    }

    const credential = (email: string, password: string) => {
        return firebase.auth.credential(email, password);
    };

    const authStateChanged = (
        fun: firebase.Observer<any> | ((a: firebase.User | null) => any),
        error?: (a: firebase.auth.Error) => any,
        completed?: firebase.Unsubscribe,
    ) => {
        return firebase.auth.Auth().onAuthStateChanged(fun);
    };

    const reauthenticateWithCredential = (credential: firebase.auth.AuthCredential) => {
        return firebase.auth.Auth().currentUser?.reauthenticateWithCredential(credential);
    };

    return {
        onRegister: register,
        onLogin: login,
        credential,
        onAuthStateChanged: authStateChanged,
        onSignOut: signOut,
        OnReauthenticateWithCredential: reauthenticateWithCredential,
        onCurrentUser: currentUser,
    };
};
