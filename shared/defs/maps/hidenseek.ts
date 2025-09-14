import { GameConfig } from "../../gameConfig";
import { util } from "../../utils/util";
import type { MapDef } from "../mapDefs";
import { Main, type PartialMapDef } from "./baseDefs";

const mapDef: PartialMapDef = {
    desc: {
        name: "Hide and Seek",
        icon: "img/emotes/question.svg",
        buttonCss: "btn-mode-main",
    },
    assets: {
        audio: [
            {
                name: "pumpkin_break_01",
                channel: "sfx",
            },
            { name: "club_music_01", channel: "ambient" },
            { name: "club_music_02", channel: "ambient" },
            {
                name: "ambient_steam_01",
                channel: "ambient",
            },
            { name: "log_11", channel: "sfx" },
            { name: "log_12", channel: "sfx" },
        ],
        atlases: [
            "gradient",
            "loadout",
            "shared",
            "main",
            "potato",
            "woods",
            "desert",
            "halloween",
            "custom",
        ],
    },
    biome: {
        colors: {
            background: 0x20536e,
            water: 0x3282ab,
            waterRipple: 0xb3f0ff,
            beach: 0xcdb35b,
            riverbank: 0x905e24,
            grass: 0x80af49,
            underground: 0x1b0d03,
            playerSubmerge: 0x2b8ca4,
        },
    },
    gameMode: { maxPlayers: 80 },
    /* STRIP_FROM_PROD_CLIENT:START */
    gameConfig: {
        planes: {
            timings: [
                {
                    circleIdx: 1,
                    wait: 10,
                    options: {
                        type: GameConfig.Plane.Airdrop,
                        airdropType: "airdrop_crate_01c",
                    },
                },
                {
                    circleIdx: 1,
                    wait: 10,
                    options: {
                        type: GameConfig.Plane.Airdrop,
                        airdropType: "airdrop_crate_01c",
                    },
                },
                { circleIdx: 2, wait: 30, options: { type: GameConfig.Plane.Airdrop } },
                { circleIdx: 3, wait: 10, options: { type: GameConfig.Plane.Airdrop } },
                { circleIdx: 4, wait: 10, options: { type: GameConfig.Plane.Airdrop } },
            ],
            crates: [{ name: "airdrop_crate_01b", weight: 1 }],
        },
        roles: {
            timings: [
                { role: "seeker", circleIdx: 0, wait: 20 },
                { role: "hider", circleIdx: 0, wait: 21 },
                { role: "hider", circleIdx: 0, wait: 21 },
                { role: "hider", circleIdx: 0, wait: 21 },
                { role: "hider", circleIdx: 0, wait: 21 },
                { role: "hider", circleIdx: 0, wait: 21 },
                { role: "hider", circleIdx: 0, wait: 21 },
                { role: "hider", circleIdx: 0, wait: 21 },
            ],
        },
        bagSizes: {
            "308sub": [0, 10, 0, 0],
            snowball_h: [0, 10, 0, 0],
        },
    },
    lootTable: {
        tier_world: [{ name: "", count: 1, weight: 0.29 }],
        tier_surviv: [{ name: "", count: 1, weight: 0.15 }],
        tier_container: [{ name: "", count: 1, weight: 0.29 }],
        tier_leaf_pile: [{ name: "", count: 1, weight: 0.2 }],
        tier_soviet: [
            { name: "", count: 1, weight: 3 }, // ?
        ],
        tier_toilet: [{ name: "", count: 1, weight: 0.1 }],
        tier_scopes: [{ name: "", count: 1, weight: 24 }],
        tier_packs: [
            { name: "", count: 1, weight: 15 }, // !
        ],
        tier_medical: [{ name: "", count: 5, weight: 16 }],
        tier_guns: [{ name: "", count: 1, weight: 10 }],
        tier_vending_soda: [
            { name: "", count: 1, weight: 1 }, // ?
        ],
        tier_throwables: [{ name: "snowball_h", count: 1, weight: 1 }],
        tier_airdrop_throwables: [{ name: "", count: 2, weight: 1 }],
        tier_ammo: [{ name: "", count: 60, weight: 1 }],
        tier_ammo_crate: [{ name: "", count: 60, weight: 1 }],
        tier_airdrop_ammo: [{ name: "", count: 60, weight: 1 }],
        tier_armor: [{ name: "", count: 1, weight: 9 }],
        tier_police: [{ name: "", count: 1, weight: 0.5 }],
        tier_airdrop_armor: [{ name: "", count: 1, weight: 1 }],
        tier_ring_case: [{ name: "", count: 1, weight: 1 }],
        tier_airdrop_rare: [{ name: "", count: 1, weight: 1 }],
        tier_hatchet: [{ name: "", count: 1, weight: 0.4 }],
        tier_chest: [{ name: "", count: 1, weight: 1.15 }],
        tier_club_melee: [{ name: "", count: 1, weight: 1 }],
        tier_woodaxe: [{ name: "", count: 1, weight: 1 }],
        tier_scopes_sniper: [
            { name: "", count: 1, weight: 5 }, // ?
        ],
        tier_sv98: [{ name: "", count: 1, weight: 1 }],
        tier_hatchet_melee: [
            { name: "", count: 1, weight: 5 }, // ?
        ],
        tier_cattle_crate: [{ name: "", count: 1, weight: 1 }],
        tier_outfits_halloween: [
            { name: "outfitBarrel", count: 1, weight: 1 },
            { name: "outfitWoodBarrel", count: 1, weight: 1 },
            { name: "outfitStone", count: 1, weight: 1 },
            { name: "outfitStump", count: 1, weight: 1 },
            { name: "outfitBush", count: 1, weight: 1 },
            { name: "outfitLeafPile", count: 1, weight: 1 },
            { name: "outfitCrate", count: 1, weight: 1 },
            { name: "outfitTable", count: 1, weight: 1 },
            { name: "outfitSoviet", count: 1, weight: 1 },
            { name: "outfitOven", count: 1, weight: 1 },
            { name: "outfitRefrigerator", count: 1, weight: 1 },
            { name: "outfitPumpkin", count: 1, weight: 1 },
            { name: "outfitWoodpile", count: 1, weight: 1 },
            { name: "outfitBushRiver", count: 1, weight: 1 },
            { name: "outfitStumpAxe", count: 1, weight: 1 },
        ],
    },
    mapGen: {
        map: {
            baseWidth: 500,
            baseHeight: 500,
            extension: 112,
            shoreInset: 48,
            grassInset: 18,
            rivers: {
                lakes: [],
                weights: [
                    { weight: 0.1, widths: [4] },
                    { weight: 0.15, widths: [8] },
                    { weight: 0.25, widths: [8, 4] },
                    { weight: 0.21, widths: [16] },
                    { weight: 0.09, widths: [16, 8] },
                    { weight: 0.2, widths: [16, 8, 4] },
                    {
                        weight: 1e-4,
                        widths: [16, 16, 8, 6, 4],
                    },
                ],
                smoothness: 0.45,
                spawnCabins: true,
                masks: [],
            },
        },
        densitySpawns: [
            {
                stone_01: 300,
                barrel_01: 75,
                silo_01: 20,
                pumpkin_01: 50,
                crate_01: 70,
                crate_02: 10,
                crate_03: 8,
                bush_01: 100,
                cache_06: 12,
                tree_01: 750,
                hedgehog_01: 24,
                container_01: 5,
                container_02: 5,
                container_03: 5,
                container_04: 5,
                shack_01: 7,
                outhouse_01: 5,
                barrel_02: 33,
                tree_09: 33,
                bush_06b: 33,
                table_01: 33,
                oven_01: 33,
                refrigerator_01b: 10,
                woodpile_01: 33,
                tree_02h: 33,
            },
        ],
        fixedSpawns: [
            {
                warehouse_01: 1,
                house_red_01: { small: 3, large: 4 },
                house_red_02: { small: 3, large: 4 },
                barn_01: { small: 1, large: 3 },
                hut_01: 3,
                shack_03a: 2,
                shack_03b: { small: 2, large: 3 },
                bunker_structure_02: 1,
                bunker_structure_03: 1,
                bunker_structure_04: 1,
                bunker_structure_05: 1,
                warehouse_complex_01: 1,
                chest_01: 1,
                chest_03: { odds: 0.2 },
                tree_02: 3,
                club_complex_01: 1,
                mansion_structure_01: 1,
                police_01: 1,
                logging_complex_01: 1,
                desert_town_02: 1,
            },
        ],
        spawnReplacements: [
            {
                cabin_01: "cabin_05",
                bush_01: "bush_01b",
                bunker_crossing_compartment_01: "bunker_crossing_compartment_01a",
            },
        ],
        importantSpawns: ["club_complex_01"],
    },
    /* STRIP_FROM_PROD_CLIENT:END */
};
export const HidenSeek = util.mergeDeep({}, Main, mapDef) as MapDef;
