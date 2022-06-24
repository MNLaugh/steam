# Deno steam api

  Deno Wrapper to communicate with Steam Web API

## SteamID64 Finder

  Please refer to [http://steamid.co/](http://steamid.co/) or [http://steamidconverter.com/](http://steamidconverter.com/) to find the user steam id.

## API key

  You can get your api key on [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)

## Usage

  ```ts
  import Steam from "https://deno.land/x/steam/mod.ts";

  const steam = new Steam("your api key");
  ```

## Api

- ### GetAppList

  It takes an optional parameter of type Options, and returns a Promise of type App[].
  - @param {[Options](#Options)?} - Options
  - @returns An array of [App](#App) objects.

  ```ts
  const apps = await steam.GetAppList().catch(console.error);
  console.log(apps);
  /*
  Output: 
  [
    { appid: 2016512, name: "" },
    { appid: 2025850, name: "X Wars Deluxe - Line Effect DLC" },
    { appid: 2026000, name: "Our Adventurer Guild" },
    { appid: 2026020, name: "The Alchemist" },
    { appid: 2026030, name: "twenty, in total" },
    { appid: 2026070, name: "Tank Commander" },
    ...more items
  ]
  */
  ```

- ### GetServersAtAddress

  This function returns a list of servers that are running on the specified IPaddress.
  - @param {string!} - The IP address of the server.
  - @param {[GetServersAtAddressOptions](#GetServersAtAddressOptions)?} - Options
  - @returns An array of [Server](#Server).

  ```ts
  const servers = await steam.GetServersAtAddress("216.52.148.47").catch(console.error);
  console.log(servers);
  /*
  Output: 
  [
    {
      addr: "216.52.148.47:27015",
      gmsindex: -1,
      steamid: "85568392924437989",
      appid: 730,
      gamedir: "csgo",
      region: 0,
      secure: true,
      lan: false,
      gameport: 27015,
      specport: 0
    }
  ]
  */
  ```

- ### GetNewsForApp

  This function returns an array of News, which are the news items for the specifiedappid.
  - @param {number!} - The appid of the game you want to get news  for.
  - @param {[GetNewsForAppOptions](#GetNewsForAppOptions)?} [options] - GetNewsForAppOptions
  - @returns An array of [News](#News).

  ```ts
  const news = await steam.GetNewsForApp(440, { count: 1 }).catch(console.error);
  console.log(news);
  /*
  Output:
  [
    {
      gid: "4474904295729829044",
      title: "CS:GO fans want to change the meta by making the M4A1-S pricier",
      url: "https://steamstore-a.akamaihd.net/news/externalpost/The Loadout/4474904295729829044",
      is_external_url: true,
      author: "editor@theloadout.com",
      contents: '<img width="900" height="507" src="https://www.theloadout.com/wp-content/uploads/2022/06/csgo-m4a1s-...',
      feedlabel: "The Loadout",
      date: 1655990548,
      feedname: "The Loadout",
      feed_type: 0,
      appid: 730
    }
  ]
  */
  ```

- ### GetGlobalAchievementPercentagesForApp

  It gets the global achievement percentages for a specific game.
  - @param {number!} - The game's appid.
  - @param {[Options](#Options)?} - Options
  - @returns An array of Achievement.

  ```ts
  const GlobalAchievementPercentages = await steam.GetGlobalAchievementPercentagesForApp(440).catch(console.error);
  console.log(GlobalAchievementPercentages);
  /*
  Output:
  [
    { name: "GIVE_DAMAGE_LOW", percent: 67 },
    { name: "KILL_ENEMY_RELOADING", percent: 66.5 },
    { name: "UNSTOPPABLE_FORCE", percent: 66.19999694824219 },
    { name: "KILL_ENEMY_LOW", percent: 64.69999694824219 },
    { name: "WIN_ROUNDS_LOW", percent: 63.900001525878906 },
    { name: "IMMOVABLE_OBJECT", percent: 62 },
    { name: "EARN_MONEY_LOW", percent: 61.400001525878906 },
    { name: "KILL_SNIPER_WITH_SNIPER", percent: 60.5 },
    ... 67 more items
  ]
  */
  ```

- ### GetPlayerSummaries

  GetPlayerSummaries returns a list of player summaries for the given steamids.

  - @param {string[] | string!} - Steam ID or array of steam ID's
  - @param {[Options](#Options)?} - Options
  - @returns a promise that resolves to an array of [Player](#Player) objects or a single Player object.

  ```ts
  const player = await steam.GetPlayerSummaries("steam ID").catc(console.error);
  console.log(player);
  /*
  Output:
  {
    steamid: "steam ID",
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: "Name",
    ...
  }
  */
  ```

  ```ts
  const players = await steam.GetPlayerSummaries(["steam ID1", "steam ID2"]).catc(console.error);
  console.log(players);
  /*
  Output:
  [
    {
      steamid: "steam ID1",
      communityvisibilitystate: 3,
      profilestate: 1,
      personaname: "Name1",
      ...
    },
    {
      steamid: "steam ID2",
      communityvisibilitystate: 3,
      profilestate: 1,
      personaname: "Name2",
      ...
    }
  ]
  */
  ```

- ### GetFriends

  It takes a steamid, a relationship, and an optional options object, and returns a promise that resolves to an array of Friend.

  - @param {string!} - The SteamID of the user you want to get the friend list of.
  - @param {[RelationShip](#RelationShip)!} - RelationShip
  - @param {[Options](#Options)?} - Options
  - @returns An array of [Friend](#Friend).

    ```ts
    const friends = await steam.GetFriendList("steam ID", "all" }).catch(console.error);
    console.log(friends);
    /*
    Output:
    [
      { steamid: "steam ID", relationship: "friend", friend_since: 1562700502 },
      ... more items
    ]
    */
    ```

- ### GetPlayerAchievements

  This function returns an array of PlayerAchievement objects, which contain the achievement name, achievement description, and whether or not the player has unlocked the achievement.

  - @param {string!} - The SteamID of the user you want to get the achievements for.
  - @param {number!} - The appid of the game you want to get the achievements for.
  - @param {[PlayerAchievementsOptions](#PlayerAchievementsOptions)?} - PlayerAchievementsOptions
  - @returns An array of [PlayerAchievement](#PlayerAchievement).

    ```ts
    const PlayerAchievements = await steam.GetPlayerAchievements("steam ID", 730).catch(console.error);
    console.log(PlayerAchievements);
    /*
    Output:
    [
      { apiname: "WIN_BOMB_PLANT", achieved: 1, unlocktime: 1390843147 },
      { apiname: "BOMB_PLANT_LOW", achieved: 1, unlocktime: 1412790573 },
      { apiname: "WIN_MAP_DE_SHORTTRAIN", achieved: 1, unlocktime: 1405868543 },
      { apiname: "KILL_WHILE_IN_AIR", achieved: 1, unlocktime: 1355877421 },
      { apiname: "KILL_ENEMY_IN_AIR", achieved: 1, unlocktime: 1357241363 },
      { apiname: "KILLER_AND_ENEMY_IN_AIR", achieved: 0, unlocktime: 0 },
      ... 67 more items
    ]
    */
    ```

- ### GetUserStatsForGame

  GetUserStatsForGame() is a function that takes in a steamid and an appid and returns a [PlayerStats](###PlayerStat).

  - @param {string} steamid - The SteamID of the user.
  - @param {number} appid - The appid of the game you want to get the stats for.
  - @param {[UserStatsForGameOptions](###UserStatsForGameOptions)} [options] - UserStatsForGameOptions
  - @returns The response is a JSON object that contains a [PlayerStats](###PlayerStat).

    ```ts
    const UserStats = await steam.GetUserStatsForGame("steam ID", 730).catch(console.error);
    console.log(UserStats);
    /*
    Output:
    {
      steamID: "Steam ID",
      gameName: "Game Name",
      stats: [
        { name: "total_kills", value: 60158 },
        { name: "total_deaths", value: 61406 },
        { name: "total_time_played", value: 4902023 },
        ... more items
      ],
      achievements: [
        { name: "WIN_BOMB_PLANT", achieved: 1 },
        { name: "BOMB_PLANT_LOW", achieved: 1 },
        ... more items
      ]
    }
    */
    ```

- ### GetNumberOfCurrentPlayers

   This function returns the number of players currently playing the game with the specified appid.

  - @param {number} appid - number - The appid of the game you want to get the number of current
  - players for.
  - @param {[Options](#Options)} - Options
  - @returns The number of players currently playing the game.

    ```ts
    const NumberOfCurrentPlayers = await steam.GetNumberOfCurrentPlayers(730).catch(console.error);
    console.log(NumberOfCurrentPlayers);
    /*
    Output:
    453905
    */
    ```

- ### GetOwnedGames

  This function takes a steamid and an optional [OwnedGamesOptions](#OwnedGamesOptions) object and returns a promise that resolves to an [OwnedGames](#OwnedGames) object.

  - @param {string} - string - The SteamID of the user to retrieve the owned games for.
  - @param {[OwnedGamesOptions](#OwnedGamesOptions)} - OwnedGamesOptions
  - @returns The response is a [OwnedGames](#OwnedGames).

    ```ts
    const Games = await steam.GetOwnedGames("steam ID").catch(console.error);
    console.log(Games);
    /*
    Output:
    {
      game_count: 1,
      games: [
        {
          appid: 10,
          playtime_forever: 39,
          playtime_windows_forever: 0,
          playtime_mac_forever: 0,
          playtime_linux_forever: 0
        }
      ]
    }
    */
    ```

- ### GetRecentlyPlayedGames

  It takes a steamid and an optional object of options and returns a promise of a [RecentlyPlayedGames](#RecentlyPlayedGames) object.
  
  - @param {string} - The SteamID of the user to get recently played games for.
  - @param {[RecentlyPlayedGamesOptions](#RecentlyPlayedGamesOptions)} - RecentlyPlayedGamesOptions
  - @returns An object [RecentlyPlayedGames](#RecentlyPlayedGames)

    ```ts
    const Games = await steam.GetRecentlyPlayedGames("steam ID").catch(console.error);
    console.log(Games);
    /*
    Output:
    {
      total_count: 1,
      games: [
        {
          appid: game ID,
          name: "Game name",
          playtime_2weeks: 875,
          playtime_forever: 135059,
          img_icon_url: "9ad6dd3d173523355438595g5sb5fb2af87639c4163",
          playtime_windows_forever: 60292,
          playtime_mac_forever: 0,
          playtime_linux_forever: 49
        }
      ]
    }
    */
    ```

## TypeDef Options

- ### BaseOptions

  ```ts
  {
    key?: string; // Steam API Key
    /**
     * init for fetch @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#init */
    requestInit?: RequestInit;
  }
  ```

- ### RelationShip

  ```ts
  "all" | "friend"
  ```

- ### GetServersAtAddressOptions

  ```ts
  BaseOptions & {
    gmsindex?: number;  // Gives the gmsindex.
    appid?: number;     // Gives the steam game appid.
    gamedir?: string;   // Tells which directory the game is from.
    region?: number;    // Gives the region of the server.
    secure?: boolean;   // Boolean, if server is secure or not.
    lan?: boolean;      // Boolean, if server is a lan game.
    gameport?: number;  // Gives the port number for the server.
    specport?: number;  // Gives the specport.
  }
  ```

- ### GetNewsForAppOptions

  ```ts
  BaseOptions & {
    count?: number;     // How many news enties you want to get returned.
    maxlength?: number; // Maximum length of each news entry.
  }
  ```

- ### PlayerAchievementsOptions

  ```ts
  BaseOptions & {
    L?: string; // Language. If specified, it will return language data for the requested language.
  }
  ```

- ### UserStatsForGameOptions

  Same as [PlayerAchievementsOptions](#PlayerAchievementsOptions)

- ### OwnedGamesOptions

  ```ts
  BaseOptions & {
    include_appinfo?: boolean;
    include_played_free_games?: boolean;
    appids_filter?: number[];
  }
  ```

- ### RecentlyPlayedGamesOptions

  ```ts
  BaseOptions & {
    count?: number;
  }
  ```

- ### Options

  depends on:
  - [GetServersAtAddressOptions](#GetServersAtAddressOptions)
  - [GetNewsForAppOptions](#GetNewsForAppOptions)
  - [UserStatsForGameOptions](#UserStatsForGameOptions)
  - [OwnedGamesOptions](#OwnedGamesOptions)
  - [RecentlyPlayedGamesOptions](#RecentlyPlayedGamesOptions)
  - [RelationShip](#RelationShip)

  ```ts
  GetServersAtAddressOptions & GetNewsForAppOptions & UserStatsForGameOptions & OwnedGamesOptions & RecentlyPlayedGamesOptions & {
    addr?: string;
    appid?: number;
    gameid?: number;
    steamids?: string[];
    steamid?: string;
    relationship?: RelationShip;
    lang?: string;
  }
  ```

## TypeDef Result

- ### App

  ```ts
  {
    appid: number;
    name: string;
  }
  ```

- ### Server

  ```ts
  {
    addr: string;
    gmsindex: number;
    steamid: string
    appid: number;
    gamedir: string;
    region: number;
    secure: boolean;
    lan: boolean;
    gameport: number;
    specport: number;
  }
  ```

- ### News

  ```ts
  {
    gid: string;
    title: string;
    url: string;
    is_external_url: boolean;
    author: string;
    contents: string;
    feedlabel: string;
    date: number;
    feedname: string;
    feed_type: number;
    appid: number;
  }
  ```

- ### Achievement

  ```ts
  {
    name: string;
    percent: number;
  }
  ```

- ### Player

  ```ts
  {
    steamid: string;
    communityvisibilitystate: number;
    profilestate: number;
    personaname: string;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    avatarhash: string;
    lastlogoff: number;
    personastate: 1;
    realname: string;
    primaryclanid: string;
    timecreated: number;
    personastateflags: 0;
    loccountrycode: string;
  }
  ```

- ### Friend

  ```ts
  {
    steamid: string;
    relationship: string;
    friend_since: number;
  }
  ```

- ### PlayerAchievement

  ```ts
  {
    apiname: string;
    achieved: number;
    unlocktime: number;
  }
  ```

- ### Stat

  ```ts
  {
    name: string;
    value: number;
  }
  ```

- ### PlayerStat

  depends on [Stat](#Stat)

  ```ts
  {
    steamID: string;
    gameName: string;
    stats: Stat[];
    achievements: {
      name: string;
      achieved: number;
    };
  }
  ```

- ### OwnedGame

  ```ts
  {
    appid: number;
    playtime_forever: number;
    playtime_windows_forever: number;
    playtime_mac_forever: number;
    playtime_linux_forever: number;
  }
  ```

- ### OwnedGames

  depends on [OwnedGame](#OwnedGame)

  ```ts
  {
    game_count: number;
    game: OwnedGame[];
  }
  ```

- ### RecentlyPlayedGame

  ```ts
  {
    appid: number;
    name: string;
    playtime_2weeks: number;
    playtime_forever: number;
    img_icon_url: string;
    playtime_windows_forever: number;
    playtime_mac_forever: number;
    playtime_linux_forever: number;
  }
  ```

- ### RecentlyPlayedGames

  depends on [RecentlyPlayedGame](#RecentlyPlayedGame)

  ```ts
  {
    total_count: number;
    games: RecentlyPlayedGame[];
  }
  ```
