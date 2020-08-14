import React, { createContext, useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
import { Main } from "../pages/Main";
import { Login } from "../pages/Login";
import { BrowserRouter } from "react-router-dom";
import { Header } from "../components/Header";
import { Register } from "../pages/Register";
import * as firebase from "firebase";
import { Profile } from "../pages/profile/Profile";
import { CreateArticle } from "../pages/CreateArticle";
import { IUser } from "../entity/user";
import { IAppContext } from "../entity/app";
import { Post } from "../pages/Post";
import { PublicRoute } from "../components/PublicRoute";
import { PrivateRoute } from "../components/PrivateRoute";
import { EditArticle } from "../pages/EditArticle";
import {UserProfile} from "../pages/user-profile/UserProfile";

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
    const history = useHistory();

    useEffect(() => {
        window.onbeforeunload = () => {
            localStorage.setItem("pathBeforeReload", window.location.pathname);
        };
        const redirectPath = localStorage.getItem("pathBeforeReload");
        if (redirectPath) {
            history.push(redirectPath);
        }
    }, []);

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
            <Header onLogout={onLogout} />
            <Switch>
                <Route exact path={"/"} component={Main} />
                <PublicRoute auth={auth} path={"/login"} render={() => <Login />} />
                <Route path={"/register"} component={Register} />
                <PrivateRoute auth={auth} path={"/profile"} render={() => <Profile />} />
                <PrivateRoute auth={auth} path={"/users/:userId"} render={() => <UserProfile />} />
                <PrivateRoute auth={auth} path={"/article"} render={() => <CreateArticle />} />
                <PrivateRoute auth={auth} path={"/edit/:postId"} render={() => <EditArticle />} />
                <Route path={"/posts/:creatorId/:postId"} component={Post} />
            </Switch>
        </AppContext.Provider>
    );
}

export default App;
