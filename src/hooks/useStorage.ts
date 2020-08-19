import { useFirebase } from "./useFirebase";

interface IFirebaseStorage<T> {
    getDownloadURL(fileName: string): Promise<any>;
    getChildDownloadURL(fileName: string): Promise<any>;
    put(data: Blob | Uint8Array | ArrayBuffer, avatarName: string): firebase.storage.UploadTask;
}

export const useStorage = <T>(): IFirebaseStorage<T> => {
    const { storage } = useFirebase();

    const getDownloadURL = (fileName:string) => {
        return storage().ref(fileName).getDownloadURL()
    }

    const getChildDownloadURL = (fileName:string) => {
        return storage().ref().child(fileName).getDownloadURL()
    }

    const put = (data: Blob | Uint8Array | ArrayBuffer, fileName: string) => {
        return storage().ref().child(fileName).put(data)
    }

    return {
        getDownloadURL,
        getChildDownloadURL,
        put
    }
}