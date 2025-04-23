import { z } from "zod";
import type { TeamMode } from "../gameConfig";

export const zFindGameBody = z.object({
    region: z.string(),
    zones: z.array(z.string()),
    version: z.number(),
    playerCount: z.number(),
    autoFill: z.boolean(),
    gameModeIdx: z.number(),
});

export type FindGameBody = z.infer<typeof zFindGameBody>;

export interface FindGameMatchData {
    zone: string;
    gameId: string;
    useHttps: boolean;
    hosts: string[];
    addrs: string[];
    data: string;
}

export type FindGameError =
    | "full"
    | "invalid_protocol"
    | "join_game_failed"
    | "rate_limited"
    | "banned"
    | "behind_proxy";

export type FindGameResponse =
    | {
          res: FindGameMatchData[];
          error?: undefined;

          banned?: undefined;
      }
    | {
          error: FindGameError;

          res?: undefined;
          banned?: undefined;
      }
    | {
          banned: true;
          reason: string;
          permanent: boolean;
          expiresIn: Date | string;

          res?: undefined;
          error?: undefined;
      };

export interface Info {
    country: string;
    gitRevision: string;
    modes: Array<{
        mapName: string;
        teamMode: TeamMode;
        enabled: boolean;
    }>;
    pops: Record<
        string,
        {
            playerCount: number;
            l10n: string;
        }
    >;
    youtube: {
        name: string;
        link: string;
    };
    twitch: Array<{
        name: string;
        viewers: number;
        url: string;
        img: string;
    }>;
}
