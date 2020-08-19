import React, { createContext, useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
import { Main } from "../pages/Main";
import { Login } from "../pages/Login";
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
import { UserProfile } from "../pages/user-profile/UserProfile";
import { useDatabase } from "../hooks/useDatabase";
import { useStorage } from "../hooks/useStorage";
import { useAuth } from "../hooks/useAuth";

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

    updatePassword(password:string) {
        return Promise.resolve();
    },

    reauthenticateWithCredential(credentials: firebase.auth.AuthCredential) {
        return Promise.resolve();
    }
});

function App() {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const history = useHistory();
    const database = useDatabase();
    const storage = useStorage();
    const authentication = useAuth();
    const { data, fetchData } = useDatabase<IUser>();

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
        authentication.onAuthStateChanged(async (userData) => {
            if (userData) {
                setAuth(!!userData);
                if (userData && userData.email && userData.displayName) {
                    setUser({
                        login: userData.displayName,
                        email: userData.email,
                        avatar: userData.photoURL,
                        id: userData.uid,
                    });
                }
                await fetchData(`users/${user?.id}`, "once")
                if (data?.avatar) {
                    const avatarURL = await storage.getDownloadURL(data?.avatar);
                    userData.updateProfile({
                        photoURL: avatarURL,
                    });
                    updateUser({avatar: avatarURL});
                }
            }
        });
    }, []);

    const onLogout = () => {
        authentication.onSignOut().then(() => setAuth(false));
    };

    const reauthenticateWithCredential = (credentials: firebase.auth.AuthCredential) => {
        authentication.OnReauthenticateWithCredential(credentials)
        return Promise.resolve();
    }

    const updatePassword = (password: string): Promise<void> => {
        const currentUser = authentication.onCurrentUser();
        if (currentUser) {
            return currentUser.updatePassword(password)
        }
        return Promise.resolve();
    }

    const updateUser = (value: Partial<IUser>): Promise<void> => {
        if (user) {
            setUser({
                id: user.id,
                email: value.email || user.email,
                login: value.login || user.login,
                avatar: value.avatar || user.avatar,
            });
        }
        const currentUser = authentication.onCurrentUser();
        if (currentUser) {
            const isEmailChanged = currentUser?.email !== value?.email;
            if (isEmailChanged && value.email) {
                return currentUser.updateEmail(value.email);
            }
            const isLoginChanged = currentUser?.displayName !== value.login;
            if (isLoginChanged && value.login) {
                return currentUser.updateProfile({
                    displayName: value.login,
                });
            }
            const isAvatarChanged = currentUser?.photoURL !== value.avatar;
            if (isAvatarChanged && value.avatar) {
                return currentUser.updateProfile({
                    photoURL: value.avatar,
                });
            }
        }
        return Promise.resolve();
    };

    return (
        <AppContext.Provider value={{ auth, user, updateUser, updatePassword, reauthenticateWithCredential }}>
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
