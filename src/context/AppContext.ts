import {createBrowserHistory, History} from "history";

const history = createBrowserHistory();

export const AppContext = {
    getHistory(): History {
        return history;
    }
}
