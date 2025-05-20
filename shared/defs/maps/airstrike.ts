import { GameConfig } from "../../gameConfig";
import { util } from "../../utils/util";
import { v2 } from "../../utils/v2";
import type { MapDef } from "../mapDefs";
import { Desert } from "./desertDefs";
import type { PartialMapDef } from "./baseDefs";

const mapDef: PartialMapDef = {
    desc: {
        name: "Airstrike",
        icon: "img/loot/loot-perk-broken-arrow.svg",
        buttonCss: "btn-mode-desert",
    },
    assets: {
        audio: [
            { name: "log_03", channel: "sfx" },
            { name: "log_04", channel: "sfx" },
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
    gameConfig: {
        planes: {
            timings: [
                {
                    circleIdx: 0,
                    wait: 30,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 75, weight: 1 }],
                        airstrikeZoneRad: 250,
                        wait: 0.25,
                        delay: 0.1,
                    },
                },
                {
                    circleIdx: 1,
                    wait: 5,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 100, weight: 1 }],
                        airstrikeZoneRad: 175,
                        wait: 0.25,
                        delay: 0.5,
                    },
                },
                {
                    circleIdx: 1,
                    wait: 30,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 100, weight: 1 }],
                        airstrikeZoneRad: 175,
                        wait: 0.25,
                        delay: 0.5,
                    },
                },
                {
                    circleIdx: 2,
                    wait: 5,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 75, weight: 1 }],
                        airstrikeZoneRad: 150,
                        wait: 0.25,
                        delay: 0.3,
                    },
                },
                {
                    circleIdx: 2,
                    wait: 20,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 75, weight: 1 }],
                        airstrikeZoneRad: 150,
                        wait: 0.25,
                        delay: 0.3,
                    },
                },
                {
                    circleIdx: 2,
                    wait: 35,
                    options: { type: GameConfig.Plane.Airdrop },
                },
                {
                    circleIdx: 3,
                    wait: 5,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 75, weight: 1 }],
                        airstrikeZoneRad: 125,
                        wait: 0.25,
                        delay: 0.2,
                    },
                },
                {
                    circleIdx: 3,
                    wait: 20,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 75, weight: 1 }],
                        airstrikeZoneRad: 125,
                        wait: 0.25,
                        delay: 0.2,
                    },
                },
                {
                    circleIdx: 3,
                    wait: 35,
                    options: { type: GameConfig.Plane.Airdrop },
                },
                {
                    circleIdx: 4,
                    wait: 5,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 25, weight: 1 }],
                        airstrikeZoneRad: 50,
                        wait: 0.25,
                        delay: 0.15,
                    },
                },
                {
                    circleIdx: 4,
                    wait: 10,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 25, weight: 1 }],
                        airstrikeZoneRad: 50,
                        wait: 0.25,
                        delay: 0.15,
                    },
                },
                {
                    circleIdx: 4,
                    wait: 20,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 25, weight: 1 }],
                        airstrikeZoneRad: 50,
                        wait: 0.25,
                        delay: 0.15,
                    },
                },
                {
                    circleIdx: 5,
                    wait: 0,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 10, weight: 1 }],
                        airstrikeZoneRad: 25,
                        wait: 0.25,
                        delay: 0.15,
                    },
                },
                {
                    circleIdx: 5,
                    wait: 5,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 10, weight: 1 }],
                        airstrikeZoneRad: 25,
                        wait: 0.25,
                        delay: 0.15,
                    },
                },
                {
                    circleIdx: 5,
                    wait: 10,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 10, weight: 1 }],
                        airstrikeZoneRad: 25,
                        wait: 0.25,
                        delay: 0.15,
                    },
                },
                {
                    circleIdx: 5,
                    wait: 15,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 10, weight: 1 }],
                        airstrikeZoneRad: 25,
                        wait: 0.25,
                        delay: 0.15,
                    },
                },
                {
                    circleIdx: 5,
                    wait: 20,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 10, weight: 1 }],
                        airstrikeZoneRad: 25,
                        wait: 0.25,
                        delay: 0.15,
                    },
                },
            ],
            crates: [{ name: "airdrop_crate_02de", weight: 1 }],
        },
        bagSizes: {
            strobe: [5, 10, 15, 20],
        },
        bleedDamage: 2,
        bleedDamageMult: 1,
    },
    lootTable: {
        tier_guns: [
            { name: "m9", count: 1, weight: 1 },
            { name: "m1911", count: 1, weight: 1 },
            { name: "glock", count: 1, weight: 0.75 },
            { name: "m93r", count: 1, weight: 0.75 },
            { name: "colt45", count: 1, weight: 0.25 },
            { name: "p30l", count: 1, weight: 0.25 },
            { name: "m1100", count: 1, weight: 0.5 },
        ],
        tier_airdrop_rare: [{ name: "deagle", count: 1, weight: 1 }],
        tier_ammo: [
            { name: "45acp", count: 60, weight: 3 },
            { name: "9mm", count: 60, weight: 3 },
            { name: "12gauge", count: 10, weight: 3 },
        ],
        tier_ammo_crate: [
            { name: "45acp", count: 60, weight: 3 },
            { name: "12gauge", count: 10, weight: 3 },
            { name: "9mm", count: 60, weight: 3 },
        ],
        tier_airdrop_ammo: [
            { name: "45acp", count: 30, weight: 3 },
            { name: "9mm", count: 30, weight: 3 },
            { name: "12gauge", count: 5, weight: 3 },
        ],
        tier_throwables: [
            { name: "strobe", count: 2, weight: 1 },
            { name: "smoke", count: 1, weight: 1 },
            { name: "mirv", count: 1, weight: 1 },
        ],
        tier_airdrop_outfits: [{ name: "outfitGhillie", count: 1, weight: 0.5 }],
        tier_airdrop_melee: [{ name: "katana", count: 1, weight: 1 }],
        tier_airdrop_throwables: [
            { name: "strobe", count: 5, weight: 1 },
            { name: "mirv", count: 2, weight: 1 },
        ],
        tier_perks: [
            { name: "broken_arrow", count: 1, weight: 1 },
            { name: "fabricate", count: 1, weight: 1 },
        ],
        tier_scopes: [
            { name: "2xscope", count: 1, weight: 2 },
            { name: "4xscope", count: 1, weight: 1 },
            { name: "8xscope", count: 1, weight: 0.25 }, // ?
            { name: "15xscope", count: 1, weight: 0.1 }, // ?
        ],
    },
    mapGen: {
        map: {
            scale: { small: 1.1875, large: 1.1875 },
            shoreInset: 8,
            grassInset: 12,
            baseWidth: 400,
            baseHeight: 400,
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
                    type: "bunker_structure_01as",
                    pos: v2.create(0.5, 0.5),
                    rad: 1,
                    retryOnFailure: true,
                },
            ],
            placeSpawns: [],
        },
        densitySpawns: [
            {
                stone_01: 280,
                barrel_01: 76,
                bush_01: 90,
                tree_06: 220,
                tree_05c: 144,
                tree_09: 40,
                hedgehog_01: 12,
                outhouse_01: 50,
                crate_03: 8,
            },
        ],
        fixedSpawns: [
            {
                house_red_01: 4,
                bunker_structure_01as: 5,
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
                cabin_01: "cabin_03",
            },
        ],
    },
};

export const Airstrike = util.mergeDeep({}, Desert, mapDef) as MapDef;
