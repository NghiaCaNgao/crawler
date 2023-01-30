/**
 * @author: Nghiacangao
 * @description: An abstract class provided core methods for derived class and play as a wrapper class
 */

import axios from "axios";
import { CrawlerOption, Query, Response } from "../types";
import { isValidURL } from "../utils";

export default abstract class Crawler {
    private _host: string;
    private _keyMap: Map<string, string>

    public static readonly DEFAULT_VALUE: CrawlerOption = {
        host: "http://112.137.129.115/tkb/listbylist.php",
        keyMap: new Map<string, string>()
    }

    public get host(): string {
        return this._host;
    }

    public set host(host: string) {
        if (isValidURL(host)) this._host = host
        else throw new Error(host + " is not a valid host url");
    }

    public get keyMap(): Map<string, string> {
        return this._keyMap;
    }

    public set keyMap(map: Map<string, string>) {
        this._keyMap = map;
    }

    public constructor({ host, keyMap }: CrawlerOption) {
        this.host = host || Crawler.DEFAULT_VALUE.host;
        this.keyMap = keyMap || Crawler.DEFAULT_VALUE.keyMap;
    }

    /**
     * Join all queries into single url string
     * @param query query 
     * @returns url
     */
    private joinParams(query: Query = {}): string {
        return this.host + "?" + Object.keys(query)
            .map(key => {
                if (this.keyMap.get(key))
                    return this.keyMap.get(key) + "=" + query[key];
                else throw new Error(key + " is not in query type")
            })
            .join("&");
    }

    /**
     * Fetch data
     * @param query 
     * @returns {Promise<Response<string>>} response data structure
     */
    protected async fetch(query: Query = {}): Promise<Response<string>> {
        try {
            const response = await axios.get(this.joinParams(query));
            return {
                status: response.status,
                data: (response.status === 200) ? response.data : "",
                message: response.statusText
            }
        } catch (error) {
            return {
                status: 500,
                data: "",
                message: error.message
            }
        }
    }

    /**
     * Convert data to json.
     * @param {Response<string>} fetchedData 
     * @returns {Response<T | object>}
     */
    protected parseResponse<T>(
        fetchedData: Response<string>,
        handle?: (data: string) => T): Response<T | unknown> {

        try {
            if (fetchedData.status === 200) {
                return {
                    status: 200,
                    data: (handle)
                        ? handle(fetchedData.data)
                        : this.parse(fetchedData.data),
                    message: "success"
                }
            } else throw new Error(fetchedData.message);
        } catch (error) {
            return {
                status: 400,
                data: {},
                message: error.message
            }
        }
    }

    /**
     * Default parser.
     * @param data 
     */
    protected abstract parse(data: string): unknown
}