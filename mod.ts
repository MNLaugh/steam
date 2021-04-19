import { request } from "./request.ts";

export type RelationShip = "all" | "friend";
export type Format = "json" | "xml";
export type BaseOptions = {
    key?: string;
    requestInit?: RequestInit;
}
export type FormatOption = { format?: Format };
export type GetNewsForAppOptions = BaseOptions & {
    count?: number,
    maxlength?: number
} & FormatOption;
export type PlayerAchievementsOptions = BaseOptions & {
    L?: string
} & FormatOption
export type UserStatsForGameOptions = PlayerAchievementsOptions;
export type OwnedGamesOptions = BaseOptions & {
    includeAppinfo?: boolean,
    includePlayedFreeGames?: boolean
} & FormatOption;
export type RecentlyPlayedGamesOptions = BaseOptions & {
    count?: number;
} & FormatOption;
type Options = GetNewsForAppOptions & UserStatsForGameOptions & OwnedGamesOptions & RecentlyPlayedGamesOptions & {
    addr?: string
    appid?: number;
    gameid?: number;
    steamids?: [string];
    steamid?: string;
    relationship?: RelationShip;
    lang?: string;
}

type Output = Promise<string | JSON | undefined>

const apiKeyError = new Error("You must add your steam api key in the instance or as options when calling this function!");
export default class Steam {
    private b = "http://api.steampowered.com";
    private v = "v0002";
    private defaultkey?: string;
    private defaultRequestInit: RequestInit;
    constructor(defaultkey?: string) {
        this.defaultkey = defaultkey;
        this.defaultRequestInit = {
            method: 'GET',
            headers: new Headers()
        };
    }

    private getRequestInit(options?: Options) {
        return (options && options.requestInit) ? options.requestInit : this.defaultRequestInit;
    }

    private getKey(options?: Options) {
        return (options && options.key) ? options.key : this.defaultkey;
    }

    private searchParams(url: URL, options?: Options, protect = false): URL {
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
            if (options && options.lang) url.searchParams.append("L", options.lang);
            if (options.count) url.searchParams.append("count", options.count.toString());
            if (options.maxlength) url.searchParams.append("maxlength", options.maxlength.toString());
            if (options.format) url.searchParams.append("format", options.format.toString());
        }
        return url;
    }

    private url(Interface: string, Method: string, Version: string = this.v): URL {
        return new URL(`${this.b}/${Interface}/${Method}/${Version}`);
    }

    /**
     * Get all steam applications data.
     * @param {Format?} format
     * @return {Output}
     */
    async GetAppList(format?: Format): Output {
        const options: Options = { format: format }
        let url = this.url("ISteamApps", "GetAppList");
        url = this.searchParams(url, options);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    /**
     * Get all steam application data from a server.
     * @param {string!} addr IP adress of target server.
     * @param {Format?} format
     * @return {Output}
     */
    async GetServersAtAddress(addr?: string, format?: Format): Output {
        const options: Options = { addr: addr, format: format }
        let url = this.url("ISteamApps", "GetServersAtAddress", "v0001");
        url = this.searchParams(url, options);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    /**
     * Returns the latest news of a game specified by its appID.
     * @param appid
     * @param {GetNewsForAppOptions} options {
     *      count?: number,         // How many news enties you want to get returned.
     *      maxlength?: number,     // Maximum length of each news entry.
     *      format?: Format
     * }
     * @return {Output}
     */
    async GetNewsForApp(appid: number, options?: GetNewsForAppOptions): Output {
        const params: Options = { appid: appid, ...options };
        let url = this.url("ISteamNews", "GetNewsForApp");
        url = this.searchParams(url, params);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    /**
     * Returns on global achievements overview of a specific game in percentages.
     * @param {number!} gameid AppID of the game you want the news of.
     * @param {Format?} format
     * @return {Output}
     */
    async GetGlobalAchievementPercentagesForApp(gameid: number, format?: Format): Output {
        const options: Options = { gameid: gameid, format: format };
        let url = this.url("ISteamUserStats", "GetGlobalAchievementPercentagesForApp");
        url = this.searchParams(url, options);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }
    
    /**
     * Returns basic profile information for a list of 64-bit Steam IDs.
     * @param {[string]!} steamids Comma-delimited list of 64 bit Steam IDs to return profile information for. Up to 100 Steam IDs can be requested.
     * @param {Format?} format
     * @return {Output}
     */
    async GetPlayerSummaries(steamids: [string], format?: Format): Output {
        const options: Options = { steamids: steamids, format: format };
        let url = this.url("ISteamUser", "GetPlayerSummaries");
        url = this.searchParams(url, options, true);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    /**
     * Returns the friend list of any Steam user, provided his Steam Community profile visibility is set to "Public".
     * @param {string!} steamid 64 bit Steam ID to return friend list for.
     * @param {RelationShip!} relationship Relationship filter. Possibles values: all, friend.
     * @param {Format?} format
     * @return {Output}
     */
    async GetFriendList(steamid: string, relationship: RelationShip, format?: Format): Output {
        const options: Options = { steamid: steamid, relationship: relationship, format: format };
        let url = this.url("ISteamUser", "GetFriendList", "v0001");
        url = this.searchParams(url, options, true);
        const result = await request(url.toString(), this.getRequestInit(options)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    /**
     * Returns a list of achievements for this user by app id.
     * @param {string!} steamid 64 bit Steam ID to return friend list for.
     * @param {number!} appid The ID for the game you're requesting.
     * @param {Options} options {
     *      L?: string,             // Language. If specified, it will return language data for the requested language.
     *      format?: Format
     * }
     * @return {Output}
     */
    async GetPlayerAchievements(steamid: string, appid: number, options?: PlayerAchievementsOptions): Output {
        const params: Options = { steamid: steamid, appid: appid, ...options }
        let url = this.url("ISteamUserStats", "GetPlayerAchievements", "v0001");
        url = this.searchParams(url, params, true);
        const result = await request(url.toString(), this.getRequestInit(params)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    /**
     * Returns a list of achievements for this user by app id.
     * @param {string!} steamid 64 bit Steam ID to return friend list for.
     * @param {number!} appid The ID for the game you're requesting.
     * @param {UserStatsForGameOptions} options
     * @return {Output}
     */
    async GetUserStatsForGame(steamid: string, appid: number, options?: UserStatsForGameOptions): Output {
        const params: Options = { steamid: steamid, appid: appid, ...options }
        let url = this.url("ISteamUserStats", "GetUserStatsForGame");
        url = this.searchParams(url, params, true);
        const result = await request(url.toString(), this.getRequestInit(params)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    /**
     * Returns number of current players by app id.
     * @param {number!} appid The ID for the game you're requesting.
     * @param {Format} format
     * @return {Output}
     */
    async GetNumberOfCurrentPlayers(appid: number, format?: Format): Output {
        const params: Options = { appid: appid, format: format };
        let url = this.url("ISteamUserStats", "GetNumberOfCurrentPlayers", "v0001");
        url = this.searchParams(url, params);
        const result = await request(url.toString(), this.getRequestInit(params)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    /**
     * Returns a list of games a player owns along with some playtime information.
     * @param {string!} steamid 64 bit Steam ID to return friend list for.
     * @param {OwnedGamesOptions} options
     * @return {Output}
     */
    async GetOwnedGames(steamid: string, options?: OwnedGamesOptions): Output {
        const params: Options = { steamid: steamid, ...options }
        let url = this.url("IPlayerService", "GetOwnedGames", "v0001");
        url = this.searchParams(url, params, true);
        const result = await request(url.toString(), this.getRequestInit(params)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }

    /**
     * Returns a list of games a player has played in the last two weeks.
     * @param {string!} steamid 64 bit Steam ID to return friend list for.
     * @param {RecentlyPlayedGamesOptions} options
     * @return {Output}
     */
    async GetRecentlyPlayedGames(steamid: string, options?: RecentlyPlayedGamesOptions): Output { // steamid, count, format
        const params: Options = { steamid: steamid, ...options };
        let url = this.url("IPlayerService", "GetRecentlyPlayedGames", "v0001");
        url = this.searchParams(url, params, true);
        const result = await request(url.toString(), this.getRequestInit(params)).catch((error: Error) => { throw error; });
        return (result.unwrap().body) ? result.unwrap().body : void 0;
    }
}