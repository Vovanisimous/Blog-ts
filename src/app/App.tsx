import React, {createContext, useEffect, useState} from "react";
import { Route, Switch } from "react-router";
import { Main } from "../pages/Main";
import { Login } from "../pages/Login";
import { BrowserRouter } from "react-router-dom";
import { Header } from "../components/header/Header";
import { Register } from "../pages/Register";
import * as firebase from "firebase";
import { Profile } from "../pages/Profile"

export const fb = firebase;
const firebaseConfig = require("../firebase/firebase-config.json");
fb.initializeApp(firebaseConfig);

export const AuthContext = createContext(false);

function App() {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        fb.auth().onAuthStateChanged((user) => {
            // if (user) {
            //     setAuth(true);
            // } else {
            //     setAuth(false);
            // }
            setAuth(!!user);
        })
    }, []);

    const onLogout = () => {
        fb.auth().signOut().then(() => setAuth(false));
    }

    return (
        <AuthContext.Provider value={auth}>
            <BrowserRouter>
                <Header onLogout={onLogout} />
                <Switch>
                    <Route exact path={"/"} component={Main} />
                    <Route path={"/login"} component={Login} />
                    <Route path={"/register"} component={Register} />
                    <Route path={"/profile"} component={Profile} />
                </Switch>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
