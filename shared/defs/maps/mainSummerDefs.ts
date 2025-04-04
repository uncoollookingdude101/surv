import { GameConfig } from "../../gameConfig";
import { util } from "../../utils/util";
import { v2 } from "../../utils/v2";
import type { MapDef } from "../mapDefs";
import { Main } from "./baseDefs";
const mapDef = {
    desc: {
        name: "Savannah",
        icon: "img/gui/player-the-hunted.svg",
        buttonCss: "btn-mode-savannah",
    },
    gameMode: {
        maxPlayers: 80,
        killLeaderEnabled: true,
        sniperMode: true,
    },
    gameConfig: {
        planes: {
            timings: [
                { circleIdx: 1, wait: 5, options: { type: GameConfig.Plane.Airdrop } },
                { circleIdx: 1, wait: 5, options: { type: GameConfig.Plane.Airdrop } },
                { circleIdx: 1, wait: 5, options: { type: GameConfig.Plane.Airdrop } },
                {
                    circleIdx: 1,
                    wait: 8,
                    options: {
                        type: GameConfig.Plane.Airstrike,
                        numPlanes: [{ count: 20, weight: 1 }],
                        airstrikeZoneRad: 150,
                        wait: 0.5,
                        delay: 0.5,
                    },
                },

                { circleIdx: 2, wait: 10, options: { type: GameConfig.Plane.Airdrop } },
                { circleIdx: 2, wait: 10, options: { type: GameConfig.Plane.Airdrop } },
                { circleIdx: 2, wait: 10, options: { type: GameConfig.Plane.Airdrop } },

                { circleIdx: 3, wait: 2, options: { type: GameConfig.Plane.Airdrop } },
                { circleIdx: 3, wait: 2, options: { type: GameConfig.Plane.Airdrop } },
                { circleIdx: 3, wait: 2, options: { type: GameConfig.Plane.Airdrop } },

                {
                    circleIdx: 4,
                    wait: 1,
                    options: {
                        type: GameConfig.Plane.Airdrop,
                        airdropType: "airdrop_crate_04",
                    },
                },
            ],
            crates: [
                { name: "airdrop_crate_01", weight: 2 },
                { name: "airdrop_crate_02", weight: 1 },
            ],
        },
        bagSizes: {
            strobe: [2, 4, 6, 10],
        },
        bleedDamage: 2,
        bleedDamageMult: 1,
        player: {},
    },

    assets: {
        audio: [
            { name: "club_music_01", channel: "ambient" },
            { name: "club_music_02", channel: "ambient" },
            {
                name: "ambient_steam_01",
                channel: "ambient",
            },
            { name: "log_11", channel: "sfx" },
            { name: "log_12", channel: "sfx" },
            { name: "piano_02", channel: "sfx" },
            { name: "log_03", channel: "sfx" },
            { name: "log_04", channel: "sfx" },
            { name: "piano_music_01", channel: "ambient" },
        ],
        atlases: [
            "gradient",
            "loadout",
            "shared",
            "main",
            "savannah",
            "woods",
            "desert",
            "halloween",
            "faction",
        ],
    },
    lootTable: {
        tier_club_melee: [{ name: "pan", count: 1, weight: 1 }],
        tier_throwables: [
            { name: "frag", count: 2, weight: 1 }, // !
            { name: "smoke", count: 1, weight: 1 },
            { name: "mirv", count: 2, weight: 0.5 },
            { name: "strobe", count: 1, weight: 0.5 },
        ],
        tier_airdrop_throwables: [{ name: "strobe", count: 1, weight: 1 }],
        loot_tier_sv98: [
            { name: "sv98", count: 1, weight: 1 },
            { name: "awc", count: 1, weight: 0.25 },
        ],
        tier_ammo: [
            { name: "9mm", count: 60, weight: 3 },
            { name: "762mm", count: 60, weight: 3 },
            { name: "556mm", count: 60, weight: 3 },
            { name: "12gauge", count: 10, weight: 3 },
            { name: "45acp", count: 60, weight: 3 },
            { name: "flare", count: 1, weight: 3.5 },
        ],
        tier_cattle_crate: [
            { name: "colt45", count: 1, weight: 1 },
            { name: "model94", count: 1, weight: 1 },
            { name: "m1911", count: 1, weight: 3 },
            { name: "m1a1", count: 1, weight: 2 },
            { name: "flare_gun", count: 1, weight: 1 },
        ],
        tier_ring_case: [
            { name: "potato_cannon", count: 1, weight: 1 },
            { name: "potato_smg", count: 1, weight: 1 },
        ],
        tier_cloud_01: [
            { name: "sv98", count: 1, weight: 0.5 },
            { name: "blr", count: 1, weight: 2 },
            { name: "scout_elite", count: 1, weight: 1.5 },
            { name: "mosin", count: 1, weight: 0.75 },
            { name: "model94", count: 1, weight: 3 },
            { name: "awc", count: 1, weight: 0.1 },
        ],
        tier_guns: [
            { name: "famas", count: 1, weight: 0.9 },
            { name: "hk416", count: 1, weight: 4 },
            { name: "mk12", count: 1, weight: 0.1 },
            { name: "pkp", count: 1, weight: 0.005 },
            { name: "m249", count: 1, weight: 0.006 },
            { name: "ak47", count: 1, weight: 2.7 },
            { name: "scar", count: 1, weight: 0.1 },
            { name: "dp28", count: 1, weight: 0.5 },
            { name: "mosin", count: 1, weight: 0.1 },
            { name: "m39", count: 1, weight: 0.1 },
            { name: "mp5", count: 1, weight: 10 },
            { name: "mac10", count: 1, weight: 6 },
            { name: "ump9", count: 1, weight: 3 },
            { name: "m870", count: 1, weight: 9 },
            { name: "m1100", count: 1, weight: 6 },
            { name: "mp220", count: 1, weight: 2 },
            { name: "saiga", count: 1, weight: 0.1 },
            { name: "ot38", count: 1, weight: 8 },
            { name: "ots38", count: 1, weight: 5 },
            { name: "m9", count: 1, weight: 19 },
            { name: "m93r", count: 1, weight: 5 },
            { name: "glock", count: 1, weight: 7 },
            { name: "deagle", count: 1, weight: 1 },
            { name: "vector", count: 1, weight: 1 },
            { name: "sv98", count: 1, weight: 0.01 },
            { name: "spas12", count: 1, weight: 1 },
            { name: "qbb97", count: 1, weight: 0.075 },
            { name: "flare_gun", count: 1, weight: 0.145 }, // !
            { name: "flare_gun_dual", count: 1, weight: 0.0025 }, // !
            { name: "groza", count: 1, weight: 1 },
            { name: "scout_elite", count: 1, weight: 0.05 },
            { name: "vss", count: 1, weight: 0.5 }, // !
            { name: "bar", count: 1, weight: 1 },
        ],
        tier_cloud_02: [
            { name: "garand", count: 1, weight: 1 },
            { name: "m1014", count: 1, weight: 0.25 },
            { name: "mk12", count: 1, weight: 2 },
            { name: "mkg45", count: 1, weight: 1 },
            { name: "vss", count: 1, weight: 1.5 },
            { name: "scarssr", count: 1, weight: 0.75 },
            { name: "l86", count: 1, weight: 1.25 },
            { name: "m39", count: 1, weight: 3 },
            { name: "svd", count: 1, weight: 1 },
        ],
        tier_hatchet: [
            { name: "usas", count: 1, weight: 2 },
            { name: "m249", count: 1, weight: 1 },
            { name: "pkp", count: 1, weight: 0.5 },
            { name: "awc", count: 1, weight: 0.5 },
            { name: "m9", count: 1, weight: 0.5 },
            { name: "flare_gun_dual", count: 1, weight: 0.75 },
        ],
        tier_perks: [
            { name: "firepower", count: 1, weight: 1 },
            { name: "windwalk", count: 1, weight: 1 },
            { name: "endless_ammo", count: 1, weight: 1 },
            { name: "steelskin", count: 1, weight: 1 },
            { name: "small_arms", count: 1, weight: 1 },
            { name: "takedown", count: 1, weight: 1 },
            { name: "field_medic", count: 1, weight: 1 },
            { name: "tree_climbing", count: 1, weight: 1 },
            { name: "scavenger", count: 1, weight: 1 },
            { name: "chambered", count: 1, weight: 1 },
            { name: "martyrdom", count: 1, weight: 1 },
            { name: "self_revive", count: 1, weight: 1 },
            { name: "bonus_9mm", count: 1, weight: 1 },
            { name: "flak_jacket", count: 1, weight: 1 },
            { name: "fabricate", count: 1, weight: 1 },
        ],
        tier_hatchet_melee: [
            { name: "helmet04_leader2", count: 1, weight: 5 }, // ?
        ],
        tier_vault_floor: [
            { name: "helmet04_medic2", count: 1, weight: 0.5 },
            { name: "bonesaw_rusted", count: 1, weight: 0.5 },
        ],
        tier_chrys_02: [{ name: "helmet03_forest", count: 1, weight: 1 }],
        tier_chrys_03: [
            { name: "15xscope", count: 1, weight: 1 }, // ?
        ],
        tier_chrys_case: [
            { name: "", count: 1, weight: 5 }, // ?
            { name: "tier_katanas", count: 1, weight: 3 }, // ?
            { name: "naginata", count: 1, weight: 1 }, // ?
        ],
        tier_airdrop_perk: [
            { name: "splinter", count: 1, weight: 1 },
            { name: "explosive", count: 1, weight: 1 },
            { name: "scavenger_adv", count: 1, weight: 1 },
            { name: "bonus_assault", count: 1, weight: 1 },
            { name: "broken_arrow", count: 1, weight: 1 },
        ],
        tier_airdrop_rare: [
            { name: "awc", count: 1, weight: 1 },
            { name: "pkp", count: 1, weight: 1 },
            { name: "m249", count: 1, weight: 1 },
            { name: "m4a1", count: 1, weight: 1 },
            { name: "scorpion", count: 1, weight: 1 },
            { name: "usas", count: 1, weight: 1 },
            { name: "potato_smg", count: 1, weight: 1 },
            { name: "potato_cannon", count: 1, weight: 1 },
        ],
        tier_airdrop_uncommon: [
            { name: "scar", count: 1, weight: 0.75 },
            { name: "mosin", count: 1, weight: 1 },
            { name: "saiga", count: 1, weight: 1 },
            { name: "deagle", count: 1, weight: 1 },
            { name: "vector", count: 1, weight: 1 },
            { name: "sv98", count: 1, weight: 0.5 },
            { name: "qbb97", count: 1, weight: 1.5 },
            { name: "flare_gun", count: 1, weight: 0.5 },
            { name: "scout_elite", count: 1, weight: 1.5 },
            { name: "vss", count: 1, weight: 1.5 }, // !
        ],
        tier_saloon: [{ name: "flare_gun_dual", count: 2, weight: 1 }],
        tier_outfits: [
            { name: "outfitCobaltShell", count: 1, weight: 0.2 }, // ?
            { name: "outfitKeyLime", count: 1, weight: 0.15 }, // ?
            { name: "outfitWoodland", count: 1, weight: 0.1 }, // ?
            { name: "outfitCamo", count: 1, weight: 0.1 }, // ?
            { name: "outfitGhillie", count: 1, weight: 0.05 }, // ?
        ],
        tier_eye_block: [
            { name: "flare_gun", count: 1, weight: 2 },
            { name: "painkiller", count: 1, weight: 2 },
            { name: "m4a1", count: 1, weight: 2 },
            { name: "m249", count: 1, weight: 1 },
            { name: "awc", count: 1, weight: 1 },
            { name: "pkp", count: 1, weight: 1 },
            { name: "strobe", count: 1, weight: 2 },
            { name: "tier_airdrop_perk", count: 1, weight: 1 },
        ],
        tier_helm_special: [
            { name: "helmet03_moon1", count: 1, weight: 2 },
            { name: "helmet03_moon2", count: 1, weight: 0.5 },
            { name: "helmet03_moon3", count: 1, weight: 1 },
        ],
    },
    biome: {
        colors: {
            background: 2118510,
            water: 3310251,
            waterRipple: 11792639,
            beach: 14458408,
            riverbank: 10711321,
            grass: 6460706,
            underground: 1772803,
            playerSubmerge: 2854052,
            playerGhillie: 6658085,
        },
    },
    /* STRIP_FROM_PROD_CLIENT:START */
    mapGen: {
        map: {
            baseWidth: 750,
            baseHeight: 750,
            extension: 112,
            shoreInset: 48,
            grassInset: 18,
        },
        rivers: {
            lakes: [],
            weights: [
                { weight: 0.1, widths: [4] },
                { weight: 0.15, widths: [8] },
                { weight: 0.25, widths: [8, 4] },
                { weight: 0.21, widths: [16] },
                { weight: 0.09, widths: [16, 8] },
                { weight: 1, widths: [16, 8, 4] },
                { weight: 1e-4, widths: [16, 16, 8, 6, 4] },
            ],
            smoothness: 0.45,
            spawnCabins: true,
            masks: [],
        },
        customSpawnRules: {
            locationSpawns: [
                {
                    type: "logging_complex_01",
                    pos: v2.create(0.5, 0.5),
                    rad: 200,
                    retryOnFailure: true,
                },
            ],
            placeSpawns: ["desert_town_01", "desert_town_02"],
        },
        densitySpawns: [
            {
                tree_01: 170,
                tree_07: 170,
                stone_01: 250,
                barrel_01: 90,
                silo_01: 12,
                crate_01: 75,
                crate_02: 10,
                crate_03: 18,
                bush_01: 100,
                cache_06: 18,
                hedgehog_01: 35,
                container_01: 7,
                container_02: 7,
                container_03: 7,
                container_04: 7,
                shack_01: 9,
                outhouse_01: 10,
                loot_tier_1: 50,
                loot_tier_beach: 7,
                cache_pumpkin_01: 30,
            },
        ],
        fixedSpawns: [
            {
                kopje_patch_01: 5,
                savannah_patch_01: 7,
                desert_town_01: 1,
                desert_town_02: 1,
                river_town_02: 1,
                warehouse_01: 6,
                house_red_01: { small: 3, large: 4 },
                house_red_02: { small: 3, large: 4 },
                barn_01: { small: 1, large: 3 },
                barn_02: 2,
                hut_02: 5,
                hut_03: 3,
                shack_03a: 2,
                shack_03b: 3,
                greenhouse_01: 1,
                cache_01: 1,
                cache_02: 2,
                cache_07: 3,
                bunker_structure_01: { odds: 0.05 },
                bunker_structure_02: 1,
                bunker_structure_03: 1,
                bunker_structure_04: 1,
                bunker_structure_05: 1,
                warehouse_complex_01: 1,
                mansion_structure_01: 2,
                police_01: 1,
                bank_01: 2,
                chest_01: 3,
                chest_03: { odds: 0.2 },
                mil_crate_02: { odds: 0.25 },
                tree_02: 5,
                teahouse_complex_01su: 4,
                stone_04: 20,
                club_complex_01: 2,
                greenhouse_02: 2,
                logging_complex_02: 5,
            },
        ],
        randomSpawns: [],
        spawnReplacements: [{ tree_01: "tree_12" }],
        importantSpawns: [
            "desert_town_01",
            "desert_town_02",
            "river_town_02",
            "logging_complex_01",
            "teapavilion_01w",
            "police_01",
            "logging_complex_02",
            "kopje_patch_01",
        ],
    },
    /* STRIP_FROM_PROD_CLIENT:END */
};

export const MainSummer = util.mergeDeep({}, Main, mapDef) as MapDef;
