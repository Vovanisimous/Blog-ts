import React, { createContext, useEffect, useState } from "react";
import { Route, Switch } from "react-router";
import { Main } from "../pages/Main";
import { Login } from "../pages/Login";
import { BrowserRouter } from "react-router-dom";
import { Header } from "../components/header/Header";
import { Register } from "../pages/Register";
import * as firebase from "firebase";
import { Profile } from "../pages/profile/Profile";
import { CreateArticle } from "../pages/CreateArticle";
import { IUser } from "../entity/user";
import { IAppContext } from "../entity/app";
import { SeparatePost } from "../components/Main/SeparatePost";
import { Post } from "../pages/Post";

export const fb = firebase;
const firebaseConfig = require("../firebase/firebase-config.json");
fb.initializeApp(firebaseConfig);

export const AppContext = createContext<IAppContext>({
    auth: false,
    user: {
        email: "",
        login: "",
        id: "",
        avatar: null,
    },
    updateUser(user: Partial<IUser>) {
        return Promise.resolve();
    },
});

function App() {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState<IUser | undefined>(undefined);

    useEffect(() => {
        fb.auth().onAuthStateChanged(async (user) => {
            // if (user) {
            //     setAuth(true);
            // } else {
            //     setAuth(false);
            // }
            if (user) {
                setAuth(!!user);
                if (user && user.email && user.displayName) {
                    setUser({
                        login: user.displayName,
                        email: user.email,
                        avatar: user.photoURL,
                        id: user.uid,
                    });
                }
                await fb
                    .database()
                    .ref(`users/${user.uid}`)
                    .once("value", async (snapshot) => {
                        const data = snapshot.val();
                        const avatarURL = await fb.storage().ref(data.avatar).getDownloadURL();
                        user.updateProfile({
                            photoURL: avatarURL,
                        });
                        updateUser({ avatar: avatarURL });
                    });
            }
        });
    }, []);

    const onLogout = () => {
        fb.auth()
            .signOut()
            .then(() => setAuth(false));
    };

    const updateUser = (value: Partial<IUser>): Promise<void> => {
        if (user) {
            setUser({
                id: user.id,
                email: value.email || user.email,
                login: value.login || user.login,
                avatar: value.avatar || user.avatar,
            });
        }
        const currentUser = fb.auth().currentUser;
        if (currentUser) {
            const isEmailChanged = fb.auth().currentUser?.email !== value?.email;
            if (isEmailChanged && value.email) {
                return currentUser.updateEmail(value.email);
            }
            const isLoginChanged = fb.auth().currentUser?.displayName !== value.login;
            if (isLoginChanged && value.login) {
                return currentUser.updateProfile({
                    displayName: value.login,
                });
            }
            const isAvatarChanged = fb.auth().currentUser?.photoURL !== value.avatar;
            if (isAvatarChanged && value.avatar) {
                return currentUser.updateProfile({
                    photoURL: value.avatar,
                });
            }
        }
        return Promise.resolve();
    };

    return (
        <AppContext.Provider value={{ auth, user, updateUser }}>
            <BrowserRouter>
                <Header onLogout={onLogout} />
                <Switch>
                    <Route exact path={"/"} component={Main} />
                    <Route path={"/login"} component={Login} />
                    <Route path={"/register"} component={Register} />
                    <Route path={"/profile"} component={Profile} />
                    <Route path={"/article"} component={CreateArticle} />
                    <Route path={"/posts/:id"} component={Post} />
                </Switch>
            </BrowserRouter>
        </AppContext.Provider>
    );
}

export default App;
