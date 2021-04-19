# Deno steam api

Deno Wrapper to communicate with Steam Web API

## SteamID64 Finder

Please refer to [http://steamid.co/](http://steamid.co/) or [http://steamidconverter.com/](http://steamidconverter.com/) to find the user steam id.

## Usage

```ts
import Steam from "https://deno.land/x/steam/mod.ts";

const steam = new Steam("your api key");
```

## Api

- ### GetAppList

  - @param format (Optional) [Format](###format)
  - @return [Output](###output)

    ```ts
    /**
     * Get all steam applications data.
     * @param {Format?} format
     * @return {Output}
     */
    const apps = await steam.GetAppList().catch(console.error);
    ```

- ### GetServersAtAddress

  - @param addr [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  - @param format (Optional) [Format](###format)
  - @return [Output](###output)

    ```ts
    /**
     * Get all steam application data from a server.
     * @param {String!} addr IP adress of target server.
     * @param {Format?} format
     * @return {Output}
     */
    const servers = await steam.GetServersAtAddress("ip").catch(console.error);
    ```

- ### GetNewsForApp

  - @param appid [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  - @param options (Optional) [GetNewsForAppOptions](###GetNewsForAppOptions)
  - @return [Output](###output)

    ```ts
    /**
     * Returns the latest news of a game specified by its appID.
     * @param appid
     * @param {GetNewsForAppOptions} options
     * @return {Output}
     */
    const news = await steam.GetNewsForApp(440, { count: 3 }).catch(console.error);
    ```

- ### GetGlobalAchievementPercentagesForApp

  - @param gameid [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
  - @param format (Optional) [Format](###format)
  - @return [Output](###output)

    ```ts
    /**
     * Returns on global achievements overview of a specific game in percentages.
     * @param {number!} gameid AppID of the game you want the news of.
     * @param {Format?} format
     * @return {Output}
     */
    const GlobalAchievementPercentages = await steam.GetGlobalAchievementPercentagesForApp({ gameid: 440 }).catch(console.error);
    ```

- ### GetPlayerSummaries

  - @param steamids [[String]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#description)
  - @param format (Optional) [Format](###format)
  - @return [Output](###output)

    ```ts
    /**
     * Returns basic profile information for a list of 64-bit Steam IDs.
     * @param {[string]!} steamids Comma-delimited list of 64 bit Steam IDs to return profile information for. Up to 100 Steam IDs can be requested.
     * @param {Format?} format
     * @return {Output}
     */
    const PlayerSummaries = await steam.GetPlayerSummaries({ steamids: "steam ID" }).catch(console.error);
    ```

- ### GetFriends

  - @param steamid [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  - @param relationship [RelationShip](###RelationShip)
  - @param format (Optional) [Format](###format)
  - @return [Output](###output)

    ```ts
        /**
     * Returns the friend list of any Steam user, provided his Steam Community profile visibility is set to "Public".
     * @param {string!} steamid 64 bit Steam ID to return friend list for.
     * @param {RelationShip!} relationship Relationship filter. Possibles values: all, friend.
     * @param {Format?} format
     * @return {Output}
     */
    const Friends = await steam.GetFriendList({ steamid: "steam ID", relationship: "all" }).catch(console.error);
    ```

- ### GetPlayerAchievements

  - @param steamid [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  - @param appid [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
  - @param options (Optional) [PlayerAchievementsOptions](###PlayerAchievementsOptions)
  - @return [Output](###output)

    ```ts
    /**
     * Returns a list of achievements for this user by app id.
     * @param {string!} steamid 64 bit Steam ID to return friend list for.
     * @param {number!} appid The ID for the game you're requesting.
     * @param {PlayerAchievementsOptions} options
     * @return {Output}
     */
    const PlayerAchievements = await steam.GetPlayerAchievements("steam ID", 730).catch(console.error);
    ```

- ### GetUserStatsForGame

  - @param steamid [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  - @param appid [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
  - @param options (Optional) [UserStatsForGameOptions](###UserStatsForGameOptions)
  - @return [Output](###output)

    ```ts
    /**
     * Returns a list of achievements for this user by app id.
     * @param {string!} steamid 64 bit Steam ID to return friend list for.
     * @param {number!} appid The ID for the game you're requesting.
     * @param {UserStatsForGameOptions} options
     * @return {Output}
     */
    const UserStats = await steam.GetUserStatsForGame("steam ID", 730).catch(console.error);
    ```

- ### GetNumberOfCurrentPlayers

  - @param appid [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
  - @param format (Optional) [Format](###Format)
  - @return [Output](###output)

    ```ts
    /**
     * Returns number of current players by app id.
     * @param {number!} appid The ID for the game you're requesting.
     * @param {Format} format
     * @return {Output}
     */
    const NumberOfCurrentPlayers = await steam.GetNumberOfCurrentPlayers(730).catch(console.error);
    ```

- ### GetOwnedGames

  - @param steamid [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  - @param options (Optional) [OwnedGamesOptions](###OwnedGamesOptions)
  - @return [Output](###output)

    ```ts
    /**
     * Returns a list of games a player owns along with some playtime information.
     * @param {string!} steamid 64 bit Steam ID to return friend list for.
     * @param {OwnedGamesOptions} options
     * @return {Output}
     */
    const Games = await steam.GetOwnedGames("steam ID").catch(console.error);
    ```

- ### GetRecentlyPlayedGames

  - @param steamid [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  - @param options (Optional) [RecentlyPlayedGamesOptions](###RecentlyPlayedGamesOptions)
  - @return [Output](###output)

    ```ts
    /**
     * Returns a list of games a player has played in the last two weeks.
     * @param {string!} steamid 64 bit Steam ID to return friend list for.
     * @param {RecentlyPlayedGamesOptions} options
     * @return {Output}
     */
    const Games = await steam.GetRecentlyPlayedGames("steam ID").catch(console.error);
    ```

## TypeDef

- ### Format

    ```ts
    type Format = "json" | "xml";
    ```

- ### RelationShip

    ```ts
    type RelationShip = "all" | "friend";
    ```

- ### GetNewsForAppOptions

    ```ts
    type GetNewsForAppOptions = {
        count?: number,
        maxlength?: number,
        format?: Format
    };
    ```

- ### PlayerAchievementsOptions

    ```ts
    type PlayerAchievementsOptions = {
        L?: string
        format?: Format
    }
    ```

- ### UserStatsForGameOptions

    ```ts
    type UserStatsForGameOptions = PlayerAchievementsOptions;
    ```

- ### OwnedGamesOptions

    ```ts
    type OwnedGamesOptions = {
        includeAppinfo?: boolean,
        includePlayedFreeGames?: boolean,
        format?: Format
    };
    ```

- ### RecentlyPlayedGamesOptions

    ```ts
    type RecentlyPlayedGamesOptions = {
        count?: number;
        format?: Format
    };
    ```

- ### Output

    ```ts
    type Output = Promise<string | JSON | undefined>;
    ```
