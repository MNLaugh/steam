import { request } from "./request.ts";

type RelationShip = "all" | "friend";
type Options = {
    addr?: string
    appid?: number;
    gameid?: number;
    steamids?: [string];
    steamid?: string;
    relationship?: RelationShip;
    key?: string;
    lang?: string;
    count?: number;
    maxlength?: number;
    includeAppinfo?: boolean;
    includePlayedFreeGames?: boolean;
    appidsFilter?: [number];
    format?: string;
    requestInit?: RequestInit;
}
type Output = Promise<string | JSON | undefined>

const apiKeyError = new Error("You must add your steam api key in the instance or as options when calling this function!");
export default class Steam {
    b = "http://api.steampowered.com";
    v = "v0002";
    defaultkey?: string;
    defaultRequestInit: RequestInit;
    constructor (defaultkey?: string) {
        this.defaultkey = defaultkey;
        this.defaultRequestInit = {
            method: 'GET',
            headers: new Headers()
        };
    }

    getRequestInit(options?: Options) {
        return (options && options.requestInit) ? options.requestInit : this.defaultRequestInit;
    }

    getKey(options?: Options) {
        return (options && options.key) ? options.key : this.defaultkey;
    }

    searchParams(url: URL, options?: Options, protect = false): URL {
        if (protect) {
            const key = this.getKey(options);
            if (!key) throw apiKeyError;
            url.searchParams.append("key", key);
        }
        if (options) {
            if (options.addr) url.searchParams.append("addr", options.addr);
            if (options.appid) url.searchParams.append("appid", options.appid.toString());
            if (options.gameid) url.searchParams.append("gameid", options.gameid.toString());
            if (options.steamids) url.searchParams.append("steamids", options.steamids.toString());
            if (options.steamid) url.searchParams.append("steamid", options.steamid);
            if (options.relationship) url.searchParams.append("relationship", options.relationship);
            if (options.includeAppinfo) url.searchParams.append("include_appinfo", options.includeAppinfo.toString());
            if (options.includePlayedFreeGames) url.searchParams.append("include_played_free_games", options.includePlayedFreeGames.toString());
            if (options.appidsFilter) url.searchParams.append("appids_filter", options.appidsFilter.toString());
            if (options && options.lang) url.searchParams.append("L", options.lang);
            if (options.count) url.searchParams.append("count", options.count.toString());
            if (options.maxlength) url.searchParams.append("maxlength", options.maxlength.toString());
            if (options.format) url.searchParams.append("format", options.format.toString());
        }
        return url;
    }

    url(Interface: string, Method: string, Version: string = this.v): URL {
        return new URL(`${this.b}/${Interface}/${Method}/${Version}`);
    }

    async GetAppList(options?: Options): Output {
        let url = this.url("ISteamApps", "GetAppList");
        url = this.searchParams(url, options);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    async GetServersAtAddress(options?: Options): Output { // addr
        let url = this.url("ISteamApps", "GetServersAtAddress", "v0001");
        url = this.searchParams(url, options);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    async GetNewsForApp(options?: Options): Output { // appid, count, maxlength, format
        let url = this.url("ISteamNews", "GetNewsForApp");
        url = this.searchParams(url, options);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    async GetGlobalAchievementPercentagesForApp(options?: Options): Output { // gameid, format
        let url = this.url("ISteamUserStats", "GetGlobalAchievementPercentagesForApp");
        url = this.searchParams(url, options);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    async GetPlayerSummaries(options?: Options): Output { // steamids, format
        let url = this.url("ISteamUser", "GetPlayerSummaries");
        url = this.searchParams(url, options, true);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    async GetFriendList(options?: Options): Output { // steamid, relationship, format
        let url = this.url("ISteamUser", "GetFriendList", "v0001");
        url = this.searchParams(url, options, true);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    async GetPlayerAchievements(options?: Options): Output { // steamid, appid, L
        let url = this.url("ISteamUserStats", "GetPlayerAchievements", "v0001");
        url = this.searchParams(url, options, true);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    async GetUserStatsForGame(options?: Options): Output { //steamid, appid, L
        let url = this.url("ISteamUserStats", "GetUserStatsForGame");
        url = this.searchParams(url, options, true);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    async GetNumberOfCurrentPlayers(options?: Options): Output { // appid
        let url = this.url("ISteamUserStats", "GetNumberOfCurrentPlayers", "v0001");
        url = this.searchParams(url, options);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    async GetOwnedGames(options?: Options): Output { // steamid, include_appinfo, include_played_free_games, format, appids_filter
        let url = this.url("IPlayerService", "GetOwnedGames", "v0001");
        url = this.searchParams(url, options, true);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    async GetRecentlyPlayedGames(options?: Options): Output { // steamid, count, format
        let url = this.url("IPlayerService", "GetRecentlyPlayedGames", "v0001");
        url = this.searchParams(url, options, true);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }
}