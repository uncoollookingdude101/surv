import { GameConfig } from "../../gameConfig";
import { util } from "../../utils/util";
import { v2 } from "../../utils/v2";
import type { MapDef } from "../mapDefs";
import { Main } from "./baseDefs";
import { Desert } from "./desertDefs";

const flareofwarDef = {
    mapId: 1,
    desc: {
        name: "FlareofWar",
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
        atlases: ["gradient", "loadout", "shared", "flares"],
    },
    biome: {
        colors: {
            background: 6976835,
            water: 9083726,
            waterRipple: 13756037,
            beach: 13206586,
            riverbank: 11689508,
            grass: 14657367,
            underground: 4001027,
            playerSubmerge: 5151631,
        },
        particles: {},
    },
    gameMode: { maxPlayers: 80, desertMode: true },
    /* STRIP_FROM_PROD_CLIENT:START */
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
    },
    lootTable: {
        tier_guns: [
            { name: "flare_gun", count: 1, weight: 14.5 },
            {name: "flare_gun_dual",count: 1,weight: 0.25,},
        ],
        tier_airdrop_uncommon: [
            { name: "flare_gun", count: 1, weight: 0.5 },
        ],
        tier_airdrop_rare: [
            { name: "flare_gun", count: 1, weight: 6 },
        ],
        tier_ammo: [
            { name: "flare", count: 1, weight: 3 },
        ],
        tier_ammo_crate: [
            { name: "flare", count: 1, weight: 1 },
        ],
        tier_airdrop_ammo: [
            { name: "flare", count: 1, weight: 3 },
        ],
        tier_airdrop_outfits: [
            { name: "", count: 1, weight: 20 },
            { name: "outfitMeteor", count: 1, weight: 5 },
            { name: "outfitHeaven", count: 1, weight: 1 },
            {
                name: "outfitGhillie",
                count: 1,
                weight: 0.5,
            },
        ],
        tier_airdrop_melee: [
            { name: "", count: 1, weight: 19 },
            { name: "stonehammer", count: 1, weight: 1 },
            { name: "pan", count: 1, weight: 1 },
        ],
        tier_chest: [
            { name: "flare_gun", count: 1, weight: 0.5 },
            { name: "flare_gun_dual", count: 1, weight: 0.25 },
            { name: "flare", count: 1, weight: 1 },
            { name: "helmet02", count: 1, weight: 1 },
            { name: "helmet03", count: 1, weight: 0.25 },
            { name: "chest02", count: 1, weight: 1 },
            { name: "chest03", count: 1, weight: 0.25 },
            { name: "4xscope", count: 1, weight: 0.5 },
            { name: "8xscope", count: 1, weight: 0.25 },
        ],
        tier_hatchet: [
            { name: "flare_gun", count: 1, weight: 1 },
        ],
        tier_throwables: [
            { name: "smoke", count: 1, weight: 1 },
            { name: "strobe", count: 1, weight: 0.2 },
        ],
        tier_airdrop_throwables: [
            { name: "strobe", count: 1, weight: 1 },
        ],
    },
    mapGen: {
        map: {
            scale: { small: 1.1875, large: 1.1875 },
            shoreInset: 8,
            grassInset: 12,
            rivers: {
                weights: [
                    { weight: 0.1, widths: [4] },
                    { weight: 0.15, widths: [8] },
                    { weight: 0.25, widths: [8, 4] },
                    { weight: 0.21, widths: [8] },
                    { weight: 0.09, widths: [8, 8] },
                    { weight: 0.2, widths: [8, 8, 4] },
                    {
                        weight: 1e-4,
                        widths: [8, 8, 8, 6, 4],
                    },
                ],
                masks: [{ pos: v2.create(0.5, 0.5), rad: 80 }],
            },
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
            locationSpawns: [
                {
                    type: "river_town_02",
                    pos: v2.create(0.51, 0.5),
                    rad: 50,
                    retryOnFailure: false,
                },
            ],
            placeSpawns: ["desert_town_01", "desert_town_02"],
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
                barn_02d: 1,
                cache_01: 1,
                cache_02: 1,
                bunker_structure_01: { odds: 0.05 },
                bunker_structure_03: 1,
                chest_01: 1,
                chest_03d: { odds: 1 },
                mil_crate_02: { odds: 0.25 },
                crate_18: 12,
                tree_02: 3,
                desert_town_01: 1,
                desert_town_02: 1,
                river_town_02: 1,
                greenhouse_02: 1,
                stone_05: 6,
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
            },
        ],
        importantSpawns: ["desert_town_01", "desert_town_02", "river_town_02"],
    },
    /* STRIP_FROM_PROD_CLIENT:END */
};

export const FlareofWar = util.mergeDeep({}, Desert, flareofwarDef) as MapDef;
