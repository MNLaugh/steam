export type BaseOptions = {
	key?: string; // Steam API Key
  /**
   * init for fetch @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#init
   */
	requestInit?: RequestInit;
}
export type RelationShip = "all" | "friend";
export type GetServersAtAddressOptions = BaseOptions & {
	gmsindex?: number;  // Gives the gmsindex.
  appid?: number;     // Gives the steam game appid.
  gamedir?: string;   // Tells which directory the game is from.
  region?: number;    // Gives the region of the server.
  secure?: boolean;   // Boolean, if server is secure or not.
  lan?: boolean;      // Boolean, if server is a lan game.
  gameport?: number;  // Gives the port number for the server.
  specport?: number;  // Gives the specport.
}
export type GetNewsForAppOptions = BaseOptions & {
	count?: number;     // How many news enties you want to get returned.
	maxlength?: number; // Maximum length of each news entry.
}
export type PlayerAchievementsOptions = BaseOptions & {
  L?: string; // Language. If specified, it will return language data for the requested language.
}
export type UserStatsForGameOptions = PlayerAchievementsOptions;
export type OwnedGamesOptions = BaseOptions & {
  include_appinfo?: boolean;
  include_played_free_games?: boolean;
  appids_filter?: number[];
}
export type RecentlyPlayedGamesOptions = BaseOptions & {
  count?: number;
}
export type Options = GetServersAtAddressOptions & GetNewsForAppOptions & UserStatsForGameOptions & OwnedGamesOptions & RecentlyPlayedGamesOptions & {
  addr?: string;
  appid?: number;
  gameid?: number;
  steamids?: string[];
  steamid?: string;
  relationship?: RelationShip;
  lang?: string;
}

export type httpResponse = {
  status: number;
  headers: Headers;
  body?: string | JSON;
};

export type App = {
  appid: number;
  name: string;
}

export type Server = {
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

export type News = {
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

export type Achievement = {
  name: string;
  percent: number;
}

export type Player = {
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

export type Friend = {
  steamid: string;
  relationship: string;
  friend_since: number;
}

export type PlayerAchievement = {
  apiname: string;
  achieved: number;
  unlocktime: number;
}

export type Stat = {
  name: string;
  value: number;
}

export type PlayerStat = {
  steamID: string;
  gameName: string;
  stats: Stat[];
  achievements: {
    name: string;
    achieved: number;
  };
}

export type OwnedGame = {
  appid: number;
  playtime_forever: number;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
}
export type OwnedGames = {
  game_count: number;
  game: OwnedGame[];
}

export type RecentlyPlayedGame = {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
}

export type RecentlyPlayedGames = {
  total_count: number;
  games: RecentlyPlayedGame[];
}