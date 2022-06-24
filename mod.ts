import { fail, ok } from "./deps.ts";
import type { TResultAsync } from "./deps.ts";

import type {
  httpResponse,
  BaseOptions,
  GetServersAtAddressOptions,
  GetNewsForAppOptions,
  RelationShip,
  PlayerAchievementsOptions,
  UserStatsForGameOptions,
  OwnedGamesOptions,
  RecentlyPlayedGamesOptions,
  Options,
  Player,
  App,
  Server,
  News,
  Achievement,
  Friend,
  PlayerAchievement,
  PlayerStat,
  OwnedGames,
  RecentlyPlayedGames,
} from "./types.ts";

const api = "http://api.steampowered.com";
const version = "v0002"
const apiKeyError = new Error("You must add your steam api key in the instance or as options when calling this function!");

function createUrl(Interface: string, Method: string, Version: string = version): URL {
  return new URL(`${api}/${Interface}/${Method}/${Version}`);
}

export default class Steam {
  apikey?: string;
  constructor(defaultkey?: string, private defaultRequestInit: RequestInit = {
      method: 'GET',
      headers: new Headers()
  }) {
      this.apikey = defaultkey;
  }

  /**
   * This function creates a new instance of the Steam class and returns it.
   * @param {string} [defaultkey] - The default key to use for all requests.
   * @returns A new instance of the Steam class.
   */
  static create(defaultkey?: string) {
      return new Steam(defaultkey);
  }

  /**
   * It takes a URL, an optional Options object, and an optional boolean. It then appends the key,
   * addr, appid, gameid, steamids, steamid, relationship, includeAppinfo, includePlayedFreeGames,
   * lang, count, and maxlength properties of the Options object to the URL's search parameters. If
   * the boolean is true, it will throw an error if the Options object doesn't have a key property.
   * </code>
   * @param {URL} url - URL - The URL to apply the options to.
   * @param {Options} [options] - 
   * @param [protect=false] - boolean - Whether or not to protect the request with an API key.
   * @returns The URL object is being returned.
   */
  private applyOptions(url: URL, options?: Options, protect = false): URL {
    if (protect) {
      if (options && options.key) url.searchParams.append("key", options.key);
      else if (this.apikey) url.searchParams.append("key", this.apikey);
      else throw apiKeyError;
    }
    
    if (options) {
      if (options.addr) url.searchParams.append("addr", options.addr);                  // GetServersAtAddress
      if (options.gmsindex) url.searchParams.append("gmsindex", `${options.gmsindex}`); // GetServersAtAddress
      if (options.appid) url.searchParams.append("appid", `${options.appid}`);          // GetServersAtAddress
      if (options.gamedir) url.searchParams.append("gamedir", `${options.gamedir}`);    // GetServersAtAddress
      if (options.region) url.searchParams.append("region", `${options.region}`);       // GetServersAtAddress
      if (options.secure) url.searchParams.append("secure", `${options.secure}`);       // GetServersAtAddress
      if (options.lan) url.searchParams.append("lan", `${options.lan}`);                // GetServersAtAddress
      if (options.gameport) url.searchParams.append("gameport", `${options.gameport}`); // GetServersAtAddress
      if (options.specport) url.searchParams.append("specport", `${options.specport}`); // GetServersAtAddress

      if (options.count) url.searchParams.append("count", options.count.toString());              // GetNewsForApp
      if (options.maxlength) url.searchParams.append("maxlength", options.maxlength.toString());  // GetNewsForApp

      if (options.gameid) url.searchParams.append("gameid", options.gameid.toString()); // GetGlobalAchievementPercentagesForApp

      if (options.steamids) url.searchParams.append("steamids", options.steamids.toString()); // GetPlayerSummaries

      if (options.steamid) url.searchParams.append("steamid", options.steamid); // GetFriendList, 
      if (options.relationship) url.searchParams.append("relationship", options.relationship); // GetFriendList

      if (options.appid) url.searchParams.append("appid", options.appid.toString());
      
      if (options.include_appinfo) url.searchParams.append("include_appinfo", options.include_appinfo.toString()); // GetOwnedGames
      if (options.include_played_free_games) url.searchParams.append("include_played_free_games", options.include_played_free_games.toString()); // GetOwnedGames
      // if (options.appids_filter) url.searchParams.append("input_json", encodeURI(JSON.stringify({ appids_filter: options.appids_filter}))); // GetOwnedGames

      if (options && options.lang) url.searchParams.append("l", options.lang); // GetPlayerAchievements, GetUserStatsForGame
    }
    return url;
  }

  async request(url: string, options?: Options): TResultAsync<httpResponse, Error> {
    try {
      const result = await fetch(url, options?.requestInit || this.defaultRequestInit);
      const { status, headers } = result;
      if (status !== 200) {
        const body = (headers.has("content-type"))
        ? (await result.text())
        : void 0;
        return fail(new Error(body))
      } else {
        const contentType = headers.get("content-type");
        if (contentType && contentType.search("json") === -1) return fail(new Error(await result.text()))
        const body = await result.json();
        if (!body) return fail(new Error("Unresolvable response!"))
        return ok({ status, headers, body: body });
      }
    } catch (error) {
      return fail(error);
    }
  }

  /**
   * It takes an optional parameter of type Options, and returns a Promise of type App[]
   * @param {Options?} [options] - Options
   * @returns An array of App objects.
   */
  async GetAppList(options?: BaseOptions): Promise<App[]> {
    let url = createUrl("ISteamApps", "GetAppList");
    url = this.applyOptions(url, options);
    const result = await this.request(url.toString(), options).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const apps: any = (result.unwrap().body as any)?.applist?.apps;
    if (!apps) throw new Error(`Response body is invalid!`);
    return apps;
  }

  /**
   * "This function returns a list of servers that are running on the specified IP address."
   * @param {string!} [addr] - The IP address of the server.
   * @param {GetServersAtAddressOptions?} [options] - Options
   * @returns An array of servers.
   */
  async GetServersAtAddress(addr?: string, options?: GetServersAtAddressOptions): Promise<Server[]> {
    const params: Options = { addr: addr, ...options }
    let url = createUrl("ISteamApps", "GetServersAtAddress", "v0001");
    url = this.applyOptions(url, params);
    const result = await this.request(url.toString(), options).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const response: any = (result.unwrap().body as any)?.response;
    if (!response || typeof response === "string" || !response.servers) throw new Error(`Response body is invalid!\n${response}`);
    else {
      const servers: Server[] = response.servers;
      return servers;
    }
  }

  /**
   * "This function returns an array of News, which are the news items for the specified appid."
   * 
   * The first line of the function is the function signature. It's a function that returns a promise
   * of an array of News objects. The function takes an appid and an optional options object
   * @param {number!} appid - The appid of the game you want to get news for.
   * @param {GetNewsForAppOptions?} [options] - GetNewsForAppOptions
   * @returns An array of News objects.
   */
  async GetNewsForApp(appid: number, options?: GetNewsForAppOptions): Promise<News[]> {
    const params: Options = { appid: appid, ...options };
    let url = createUrl("ISteamNews", "GetNewsForApp");
    url = this.applyOptions(url, params);
    const result = await this.request(url.toString(), options).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const response: any = (result.unwrap().body as any).appnews;
    if (!response || typeof response === "string" || !response.newsitems) throw new Error(`Response body is invalid!\n${response}`);
    else {
      const news: News[] = response.newsitems;
      return news;
    }
  }

  /**
   * It gets the global achievement percentages for a specific game.
   * @param {number!} gameid - The game's appid.
   * @param {Options?} [options] - Options
   * @returns An array of Achievement.
   */
  async GetGlobalAchievementPercentagesForApp(gameid: number, options?: Options): Promise<Achievement[]> {
    const params: Options = { gameid: gameid, ...options };
    let url = createUrl("ISteamUserStats", "GetGlobalAchievementPercentagesForApp");
    url = this.applyOptions(url, params);
    const result = await this.request(url.toString(), options).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const response: any = (result.unwrap().body as any).achievementpercentages;
    if (!response || typeof response === "string" || !response.achievements) throw new Error(`Response body is invalid!\n${response}`);
    else {
      const achievements: Achievement[] = response.achievements;
      return achievements;
    }
  }

  /**
   * "GetPlayerSummaries returns a list of player summaries for the given steamids."
   * 
   * The function takes two arguments:
   * 1. steamids: string[] | string
   * 2. options?: Options
   * 
   * The first argument is a list of steamids or a single steamid.
   * The second argument is an optional object that can be used to pass additional parameters to the
   * function
   * @param {string[] | string} steamids - string[] | string
   * @param {Options} [options] - Options
   * @returns a promise that resolves to an array of Player objects or a single Player object.
   */
  async GetPlayerSummaries(steamids: string[] | string, options?: Options): Promise<Player[] | Player> {
    const params: Options = {
      steamids: (Array.isArray(steamids)) ? steamids : [steamids],
      ...options
    };
    let url = createUrl("ISteamUser", "GetPlayerSummaries");
    url = this.applyOptions(url, params, true);
    const result = await this.request(url.toString(), options).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const response: any = (result.unwrap().body as any)?.response;
    if (!response || typeof response === "string" || !response.players) throw new Error(`Response body is invalid!\n${response}`);
    else {
      const players: Player[] = response.players;
      return (Array.isArray(steamids)) ? players : players[0] || null;
    }
  }

  /**
   * It takes a steamid, a relationship, and an optional options object, and returns a promise that
   * resolves to an array of Friend objects
   * @param {string} steamid - The SteamID of the user you want to get the friend list of.
   * @param {RelationShip} relationship - RelationShip
   * @param {Options} [options] - Options
   * @returns An array of objects.
   */
  async GetFriendList(steamid: string, relationship: RelationShip, options?: Options): Promise<Friend[]> {
    const params = { steamid: steamid, relationship: relationship, ...options };
    let url = createUrl("ISteamUser", "GetFriendList", "v0001");
    url = this.applyOptions(url, params, true);
    const result = await this.request(url.toString(), options).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const response: any = (result.unwrap().body as any).friendslist;
    if (!response || typeof response === "string" || !response.friends) throw new Error(`Response body is invalid!\n${response}`);
    else {
      const friends: Friend[] = response.friends;
      return friends;
    }
  }

  /**
   * This function returns an array of PlayerAchievement objects, which contain the achievement name,
   * achievement description, and whether or not the player has unlocked the achievement.
   * @param {string} steamid - The SteamID of the user you want to get the achievements for.
   * @param {number} appid - The appid of the game you want to get the achievements for.
   * @param {PlayerAchievementsOptions} [options] - PlayerAchievementsOptions
   * @returns An array of PlayerAchievement objects.
   */
  async GetPlayerAchievements(steamid: string, appid: number, options?: PlayerAchievementsOptions): Promise<PlayerAchievement[]> {
    const params = { steamid: steamid, appid: appid, ...options }
    let url = createUrl("ISteamUserStats", "GetPlayerAchievements", "v0001");
    url = this.applyOptions(url, params, true);
    const result = await this.request(url.toString(), params).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const response: any = (result.unwrap().body as any).playerstats;
    if (!response || typeof response === "string" || !response.achievements) throw new Error(`Response body is invalid!\n${response}`);
    else {
      const achievements: PlayerAchievement[] = response.achievements;
      return achievements;
    }
  }

  /**
   * "GetUserStatsForGame() is a function that takes in a steamid and an appid and returns a
   * PlayerStat object."
   * 
   * The first line of the function is the function declaration. It's a function that returns a
   * Promise of a PlayerStat object
   * @param {string} steamid - The SteamID of the user.
   * @param {number} appid - The appid of the game you want to get the stats for.
   * @param {UserStatsForGameOptions} [options] - UserStatsForGameOptions
   * @returns The response is a JSON object that contains a playerstats object.
   */
  async GetUserStatsForGame(steamid: string, appid: number, options?: UserStatsForGameOptions): Promise<PlayerStat> {
    const params: Options = { steamid: steamid, appid: appid, ...options }
    let url = createUrl("ISteamUserStats", "GetUserStatsForGame");
    url = this.applyOptions(url, params, true);
    const result = await this.request(url.toString(), params).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const response: any = (result.unwrap().body as any);
    if (!response || typeof response === "string" || !response.playerstats) throw new Error(`Response body is invalid!\n${response}`);
    else {
      const playerstats: PlayerStat = response.playerstats;
      return playerstats;
    }
  }

  /**
   * This function returns the number of players currently playing the game with the specified appid.
   * @param {number} appid - number - The appid of the game you want to get the number of current
   * players for.
   * @param {Options} [options] - Options
   * @returns The number of players currently playing the game.
   */
  async GetNumberOfCurrentPlayers(appid: number, options?: Options): Promise<number> {
    const params: Options = { appid: appid, ...options };
    let url = createUrl("ISteamUserStats", "GetNumberOfCurrentPlayers", "v0001");
    url = this.applyOptions(url, params);
    const result = await this.request(url.toString(), params).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const response: any = (result.unwrap().body as any).response;
    if (!response || typeof response === "string" || !response.player_count) throw new Error(`Response body is invalid!\n${response}`);
    else {
      const player_count: number = response.player_count;
      return player_count;
    }
  }

  /**
   * This function takes a steamid and an optional OwnedGamesOptions object and returns a promise
   * that resolves to an OwnedGames object.
   * @param {string} steamid - string - The SteamID of the user to retrieve the owned games for.
   * @param {OwnedGamesOptions} [options] - OwnedGamesOptions
   * @returns The response is a JSON object.
   */
  async GetOwnedGames(steamid: string, options?: OwnedGamesOptions): Promise<OwnedGames> {
    const params: Options = { steamid: steamid, ...options }
    let url = createUrl("IPlayerService", "GetOwnedGames", "v0001");
    url = this.applyOptions(url, params, true);
    if (params.appids_filter) console.warn("\"appids_filter\": This parameter is currently not supported, comming soon.")
    const result = await this.request(url.toString(), params).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const response: any = (result.unwrap().body as any).response;
    if (!response || typeof response === "string") throw new Error(`Response body is invalid!\n${response}`);
    else {
      const ownedGames: OwnedGames = response;
      return ownedGames;
    }
  }

  /**
   * It takes a steamid and an optional object of options and returns a promise of a
   * RecentlyPlayedGames object
   * @param {string} steamid - The SteamID of the user to get recently played games for.
   * @param {RecentlyPlayedGamesOptions} [options] - RecentlyPlayedGamesOptions
   * @returns An object with the following properties:
   */
  async GetRecentlyPlayedGames(steamid: string, options?: RecentlyPlayedGamesOptions): Promise<RecentlyPlayedGames> { // steamid, count, format
    const params: Options = { steamid: steamid, ...options };
    let url = createUrl("IPlayerService", "GetRecentlyPlayedGames", "v0001");
    url = this.applyOptions(url, params, true);
    const result = await this.request(url.toString(), params).catch((error: Error) => { throw error; });
    // deno-lint-ignore no-explicit-any
    const response: any = (result.unwrap().body as any).response;
    if (!response || typeof response === "string" || !response) throw new Error(`Response body is invalid!\n${response}`);
    else {
      const recentlyPlayedGames: RecentlyPlayedGames = response;
      return recentlyPlayedGames;
    }
  }
}