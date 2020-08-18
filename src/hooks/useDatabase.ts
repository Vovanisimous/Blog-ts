import { useFirebase } from "./useFirebase";
import { useState } from "react";

interface IFirebaseDatabase<T> {
    data: T | undefined;

    setData(data: T | undefined): void;

    fetchData(path: string, connectionType: "on" | "once"): void;

    addData(data: T | undefined, path: string): Promise<any>;

    updateData(data: T | undefined, path: string): Promise<any>;

    removeData(path: string): Promise<any>;
}

export const useDatabase = <T>(): IFirebaseDatabase<T> => {
    const { database } = useFirebase();
    const [data, setData] = useState<T | undefined>(undefined);

    const fetch = (path: string, connectionType: "on" | "once") => {
        if (connectionType === "on") {
            database()
                .ref(path)
                .on("value", (snapshot) => {
                    setData(snapshot.val());
                });
        } else {
            database()
                .ref(path)
                .once("value", (snapshot) => {
                    setData(snapshot.val());
                });
        }
    };

    const add = (data: T, path: string) => {
        return database()
            .ref(path)
            .set({ ...data });
    };

    const update = (data: T, path: string) => {
        return database()
            .ref(path)
            .update({ ...data });
    };

    const remove = (path: string) => {
        return database().ref(path).remove();
    }

    return {
        data,
        setData,
        fetchData: fetch,
        addData: add,
        updateData: update,
        removeData: remove,
    };
};
