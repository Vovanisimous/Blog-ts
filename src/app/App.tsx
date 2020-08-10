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

export const fb = firebase;
const firebaseConfig = require("../firebase/firebase-config.json");
fb.initializeApp(firebaseConfig);

export const AuthContext = createContext(false);

function App() {
    const [auth, setAuth] = useState(false);
    const userId = fb.auth().currentUser?.uid;
    useEffect(() => {
        fb.auth().onAuthStateChanged(async (user) => {
            // if (user) {
            //     setAuth(true);
            // } else {
            //     setAuth(false);
            // }
            if (user) {
                setAuth(!!user);
                fb.database()
                    .ref(`users/${user.uid}`)
                    .once("value", async (snapshot) => {
                        const data = snapshot.val();
                        const avatarURL = await fb.storage().ref(data.avatar).getDownloadURL();
                        user.updateProfile({
                            photoURL: avatarURL
                        });
                    });
            }
        });
    }, []);

    const onLogout = () => {
        fb.auth()
            .signOut()
            .then(() => setAuth(false));
    };

    return (
        <AuthContext.Provider value={auth}>
            <BrowserRouter>
                <Header onLogout={onLogout} />
                <Switch>
                    <Route exact path={"/"} component={Main} />
                    <Route path={"/login"} component={Login} />
                    <Route path={"/register"} component={Register} />
                    <Route path={"/profile"} component={Profile} />
                    <Route path={"/article"} component={CreateArticle} />
                </Switch>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
