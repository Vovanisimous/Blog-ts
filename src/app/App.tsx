import React from "react";
import { Route, Switch } from "react-router";
import { Main } from "../pages/Main";
import { Login } from "../pages/Login";
import { BrowserRouter } from "react-router-dom";
import { Header } from "../components/header/Header";
import { Register } from "../pages/Register";
import * as firebase from "firebase";

export const fb = firebase;
const firebaseConfig = require("../firebase/firebase-config.json");
fb.initializeApp(firebaseConfig);

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Switch>
                <Route exact path={"/"} component={Main} />
                <Route path={"/login"} component={Login} />
                <Route path={"/register"} component={Register} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
