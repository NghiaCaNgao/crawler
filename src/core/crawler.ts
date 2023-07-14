/**
 * @author Nghiacangao
 * @description
 * An abstract class plays as a wrapper and provides core methods for the 
 * derived includes getter/ setter, join params, fetch and parse fetched data.
 */

import axios from "axios";
import { CrawlerOption, Response } from "../types";
import { isValidURL } from "../utils";

export type MethodType = "GET" | "POST";

export default abstract class Crawler {
    private _host: string;
    private _keyMap: Map<string, string>

    public static readonly DEFAULT_OPTIONS: CrawlerOption = {
        host: "http://112.137.129.115/tkb/listbylist.php",
        keyMap: new Map<string, string>()
    }

    public get host(): string {
        return this._host;
    }

    public set host(host: string) {
        if (isValidURL(host)) this._host = host
        else throw new Error("'" + host + "' is not a valid host.");
    }

    public get keyMap(): Map<string, string> {
        return this._keyMap;
    }

    public set keyMap(map: Map<string, string>) {
        this._keyMap = map;
    }

    public constructor({ host, keyMap }: CrawlerOption) {
        this.host = host || Crawler.DEFAULT_OPTIONS.host;
        this.keyMap = keyMap || Crawler.DEFAULT_OPTIONS.keyMap;
    }

    /**
     * Test the given key whether in keyMap or not.
     * @param key key needs testing.
     * @returns 
     */
    private isValidKey(key: string): boolean {
        // conflicted keys are all the names of properties in this class. Eg. ["host", "keyMap"]
        const ConflictedKey: Set<string> = new Set(
            Object.getOwnPropertyNames(this)
                .map(key_name => key_name.slice(1)));

        return !!this.keyMap.get(key) && !ConflictedKey.has(key);
    }

    /**
     * Rename key.
     * @param query 
     * @returns 
     */
    private renameKey(query: CrawlerOption): object {
        const newObject = {};

        Object.keys(query)
            .forEach(key => {
                if (this.isValidKey(key)) newObject[this.keyMap.get(key)] = query[key];
                else throw new Error("'" + key + "' is not in key map.")
            });

        return newObject;
    }

    /**
     * Fetch data.
     * Code:
     *      200: success
     *      500: error while converting or fetching data (error not in 2xx)
     * 
     * @param query query data
     * @returns {Promise<Response<string>>} Response in raw text.
     */
    protected async fetch(query: CrawlerOption, method: MethodType = "GET"): Promise<Response<string>> {
        try {
            const response = (method === "GET")
                ? await axios.get(this.host, { params: this.renameKey(query) })
                : await axios.post(this.host, this.renameKey(query));

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
     * Code:
     *      200: success
     *      400: error while parsing or response code is not 200
     * 
     * @param {Response<string>} fetchedData Response in raw text.
     * @returns {Response<T | object>} Response in json.
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
     * @param {string} data raw string extract from response.
     */
    protected abstract parse(data: string): unknown
}