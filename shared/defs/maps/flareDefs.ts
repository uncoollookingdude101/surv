import { util } from "../../utils/util";
import type { MapDef } from "../mapDefs";
import { Desert } from "./desertDefs";

import { GameConfig } from "../../gameConfig";
import { v2 } from "../../utils/v2";


const mapDef = {
    gameConfig: {
        planes: {
            timings: [
                {
                    circleIdx: 1,
                    wait: 10,
                    options: { type: GameConfig.Plane.Airdrop },
                },
                {
                    circleIdx: 3,
                    wait: 2,
                    options: { type: GameConfig.Plane.Airdrop },
                },
            ],
            crates: [
                { name: "airdrop_crate_01", weight: 10 },
                { name: "airdrop_crate_02", weight: 1 },
            ],
        },
        bagSizes: {flare: [10, 50, 100, 500],},
        bleedDamage: 2,
        bleedDamageMult: 1,
        player: {
            moveSpeed: 12,
        }
    },
    lootTable: {
        tier_guns: [
            { name: "flare_gun2", count: 1, weight: 10 },
        ],
        tier_airdrop_uncommon: [
            { name: "flare_gun2", count: 1, weight: 0.5 },
        ],
        tier_airdrop_rare: [
            { name: "flare_gun2", count: 1, weight: 6 },
        ],
        tier_ammo: [
            { name: "flare", count: 5, weight: 3 },
        ],
        tier_ammo_crate: [
            { name: "flare", count: 5, weight: 1 },
        ],
        tier_airdrop_ammo: [
            { name: "flare", count: 10, weight: 3 },
        ],
        tier_airdrop_outfits: [
            { name: "", count: 1, weight: 20 },
            { name: "outfitMeteor", count: 1, weight: 5 },
            { name: "outfitHeaven", count: 1, weight: 1 },
            {name: "outfitGhillie",count: 1,weight: 0.5},
        ],
        tier_airdrop_melee: [
            { name: "", count: 1, weight: 19 },
            { name: "stonehammer", count: 1, weight: 1 },
            { name: "pan", count: 1, weight: 1 },
        ],
        tier_chest: [
            { name: "flare_gun2", count: 1, weight: 1.15 },
            { name: "helmet02", count: 1, weight: 1 },
            { name: "helmet03", count: 1, weight: 0.25 },
            { name: "chest02", count: 1, weight: 1 },
            { name: "chest03", count: 1, weight: 0.25 },
            { name: "4xscope", count: 1, weight: 0.5 },
            { name: "8xscope", count: 1, weight: 0.25 },
        ],
        tier_hatchet: [
            { name: "flare_gun2", count: 1, weight: 0.4 },
        ],
        tier_throwables:[
            { name: "smoke", count: 1, weight: 1 },
        ],
        tier_airdrop_throwables: [
            { name: "smoke", count: 1, weight: 1 },
        ],
    },
    mapGen: {
        map: {
            baseWidth: 300,
            baseHeight: 300,
        }
    }
};
export const Flare = util.mergeDeep({}, Desert, mapDef) as MapDef;
