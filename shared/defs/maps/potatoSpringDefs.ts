import { util } from "../../utils/util";
import type { MapDef } from "../mapDefs";
import type { PartialMapDef } from "./baseDefs";
import { Potato } from "./potatoDefs";

const mapDef: PartialMapDef = {
    assets: {
        audio: [
            {
                name: "pumpkin_break_01",
                channel: "sfx",
            },
            {
                name: "potato_01",
                channel: "sfx",
            },
            {
                name: "potato_02",
                channel: "sfx",
            },
            {
                name: "potato_pickup_01",
                channel: "ui",
            },
        ],
        atlases: ["gradient", "loadout", "shared", "main", "potato"],
    },
    biome: {
        colors: {
            background: 2118510,
            water: 3310251,
            waterRipple: 11792639,
            beach: 16035400,
            riverbank: 9079434,
            grass: 6066442,
            underground: 1772803,
            playerSubmerge: 2854052,
            playerGhillie: 0x5b8e0a,
        },
        particles: {
            camera: "falling_leaf_potato",
        },
    },
    lootTable: {
        tier_chrys_case: [
            { name: "", count: 1, weight: 2 }, // ?
            { name: "helmet03_moon", count: 1, weight: 3 },
            { name: "tier_katanas", count: 1, weight: 3 }, // ?
            { name: "naginata", count: 1, weight: 1 }, // ?
        ],
    },
    /* STRIP_FROM_PROD_CLIENT:START */
    mapGen: {
        densitySpawns: [
            {
                stone_01: 350,
                barrel_01: 76,
                silo_01: 8,
                crate_01: 50,
                crate_02: 4,
                crate_03: 8,
                bush_01: 78,
                cache_06: 12,
                tree_01: 300,
                tree_08sp: 30,
                tree_08spb: 30,
                tree_07spr: 160,
                tree_08spr: 80,
                hedgehog_01: 24,
                potato_01: 50,
                potato_02: 50,
                potato_03: 50,
                container_01: 5,
                container_02: 5,
                container_03: 5,
                container_04: 5,
                shack_01: 7,
                outhouse_01: 5,
                loot_tier_1: 24,
                loot_tier_beach: 4,
            },
        ],
        fixedSpawns: [
            {
                ...Potato.mapGen.fixedSpawns[0],
                cache_02: 0,
                cache_02sp: 1,
            },
        ],
        spawnReplacements: [
            {
                tree_01: "tree_07sp",
            },
        ],
    },
    /* STRIP_FROM_PROD_CLIENT:END */
};

export const PotatoSpring = util.mergeDeep({}, Potato, mapDef) as MapDef;
