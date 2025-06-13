import { util } from "../../utils/util";
import { v2 } from "../../utils/v2";
import type { MapDef } from "../mapDefs";
import { MapId } from "../types/misc";
import { Main, type PartialMapDef } from "./baseDefs";

const mapDef: PartialMapDef = {
    mapId: MapId.Desert,
    desc: {
        name: "Desert",
        icon: "img/loot/loot-weapon-flare-gun.svg",
        buttonCss: "btn-mode-desert",
    },
    assets: {
        audio: [
            { name: "piano_02", channel: "sfx" },
            { name: "log_03", channel: "sfx" },
            { name: "log_04", channel: "sfx" },
            { name: "piano_music_01", channel: "ambient" },
        ],
        atlases: ["gradient", "loadout", "shared", "desert"],
    },
    biome: {
        colors: {
            background: 0x6a7543,
            water: 0x8a9b4e,
            waterRipple: 0xd1e685,
            beach: 0xc9843a,
            riverbank: 0xb25e24,
            grass: 0xdfa757,
            underground: 0x3d0d03,
            playerSubmerge: 0x4e9b8f,
            playerGhillie: 0xdfa761,
        },
        particles: {},
    },
    gameMode: { maxPlayers: 80, desertMode: true },
    /* STRIP_FROM_PROD_CLIENT:START */
    gameConfig: {
        planes: {
            timings: [],
            crates: [{ name: "airdrop_crate_01", weight: 10 }],
        },
        bagSizes: {
            smoke: [3, 5, 10, 15],
            strobe: [3, 5, 10, 15],
            flare: [10, 50, 100, 200],
        },
    },
    lootTable: {
        tier_guns: [{ name: "flare_gun2", count: 1, weight: 1 }],
        tier_airdrop_uncommon: [{ name: "flare_gun2", count: 1, weight: 1 }],
        tier_airdrop_rare: [],
        tier_ammo: [{ name: "flare", count: 3, weight: 1 }],
        tier_ammo_crate: [{ name: "flare", count: 1, weight: 1 }],
        tier_airdrop_ammo: [{ name: "flare", count: 2, weight: 1 }],
        tier_airdrop_outfits: [
            { name: "", count: 1, weight: 20 },
            { name: "outfitMeteor", count: 1, weight: 5 },
            { name: "outfitHeaven", count: 1, weight: 1 },
            { name: "outfitGhillie", count: 1, weight: 0.5 },
        ],
        tier_airdrop_melee: [
            { name: "", count: 1, weight: 5 },
            { name: "stonehammer", count: 1, weight: 1 },
            { name: "pan", count: 1, weight: 1 },
        ],
        tier_chest: [
            { name: "flare_gun2", count: 1, weight: 1 },
            { name: "helmet02", count: 1, weight: 1 },
            { name: "helmet03", count: 1, weight: 0.25 },
            { name: "chest02", count: 1, weight: 1 },
            { name: "chest03", count: 1, weight: 0.25 },
            { name: "4xscope", count: 1, weight: 0.5 },
            { name: "8xscope", count: 1, weight: 0.25 },
        ],
        tier_hatchet: [{ name: "flare_gun2", count: 1, weight: 1 }],
        tier_throwables: [
            { name: "smoke", count: 1, weight: 1 },
            { name: "strobe", count: 1, weight: 0.5 },
        ],
        tier_airdrop_throwables: [
            { name: "strobe", count: 3, weight: 1 },
            { name: "smoke", count: 1, weight: 1 },
        ],
        tier_perks: [
            { name: "broken_arrow", count: 1, weight: 1 },
            { name: "fabricate", count: 1, weight: 1 },
            { name: "flak_jacket", count: 1, weight: 1 },
        ],
        tier_cattle_crate: [{ name: "flare_gun2", count: 1, weight: 0.1 }],
    },
    mapGen: {
        map: {
            scale: { small: 1.1875, large: 1.1875 },
            shoreInset: 8,
            grassInset: 12,
            baseWidth: 450,
            baseHeight: 450,
        },
        places: [
            {
                name: "Blood Gulch",
                pos: v2.create(0.51, 0.5),
            },
            {
                name: "Southhaven",
                pos: v2.create(0.35, 0.76),
            },
            {
                name: "Atonement",
                pos: v2.create(0.8, 0.4),
            },
            {
                name: "Los Perdidos",
                pos: v2.create(0.33, 0.25),
            },
        ],
        customSpawnRules: {
            locationSpawns: [],
        },
        densitySpawns: [
            {
                stone_01: 280,
                barrel_01: 76,
                silo_01: 4,
                crate_01: 50,
                crate_03: 8,
                bush_01: 90,
                tree_06: 220,
                tree_05c: 144,
                tree_09: 40,
                hedgehog_01: 12,
                container_01: 5,
                container_02: 5,
                container_03: 5,
                container_04: 5,
                shack_01: 8,
                outhouse_01: 5,
                loot_tier_1: 24,
                loot_tier_beach: 4,
            },
        ],
        fixedSpawns: [
            {
                warehouse_01: 4,
                house_red_01: 3,
                house_red_02: 1,
                barn_01: 1,
                cache_01: 1,
                cache_02: 1,
                bunker_structure_01: { odds: 0.05 },
                bunker_structure_03: 1,
                chest_01: 1,
                chest_03d: { odds: 1 },
                mil_crate_02: { odds: 0.25 },
                crate_18: 12,
                tree_02: 3,
            },
        ],
        randomSpawns: [],
        spawnReplacements: [
            {
                tree_01: "tree_06",
                bush_01: "bush_05",
                crate_02: "crate_18",
                stone_01: "stone_01b",
                stone_03: "stone_03b",
                cabin_01: "cabin_04",
            },
        ],
        importantSpawns: [],
    },
    /* STRIP_FROM_PROD_CLIENT:END */
};

export const Flare = util.mergeDeep({}, Main, mapDef) as MapDef;
