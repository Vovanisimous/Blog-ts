import axios, { AxiosInstance } from "axios";
import { useEffect, useState } from "react";

interface ITransport {
    init(baseUrl: string): void;

    get<Response>(url: string, params?: object): Promise<Response>;

    // post<Request, Response>(url: string, body: Request, params?: object): Promise<Response>;
    //
    // put<Request, Response>(url: string, body: Request, params?: object): Promise<Response>;
    //
    // delete<Response>(url: string, params?: object): Promise<Response>;
}

export function useTransport(): ITransport {
    const [baseUrl, setBaseUrl] = useState("");

    let client: AxiosInstance;

    useEffect(() => {
        client = axios.create({
            baseURL: baseUrl
        })
    }, [baseUrl])

    const init = (url: string) => {
        setBaseUrl(url);
    };

    const get = async <Response>(url: string, params?: object) => {
        const request = await client.get<Response>(url, {
            params,
        });
        return request.data;
    };

    return { init, get };
}
