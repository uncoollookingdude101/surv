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

                { circleIdx: 2, wait: 10, options: { type: GameConfig.Plane.Airdrop } },
                { circleIdx: 2, wait: 10, options: { type: GameConfig.Plane.Airdrop } },

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
                { name: "airdrop_crate_01a", weight: 3 },
                { name: "airdrop_crate_02", weight: 1 },
            ],
        },
        unlocks: {
            timings: [
                {
                    type: "bunker_twins_sublevel_01",
                    stagger: 0.2,
                    circleIdx: 2,
                    wait: 40,
                },
            ],
        },
        roles: {
            timings: [
                { role: "the_hunted", circleIdx: 1, wait: 1 },
                { role: "the_hunted", circleIdx: 1, wait: 1 },
                { role: "the_hunted", circleIdx: 1, wait: 1 },
                { role: "the_hunted", circleIdx: 1, wait: 1 },
                { role: "the_hunted", circleIdx: 1, wait: 1 },
                { role: "the_hunted", circleIdx: 1, wait: 1 },
                { role: "the_hunted", circleIdx: 1, wait: 1 },
                { role: "the_hunted", circleIdx: 1, wait: 1 },
            ],
        },
        bagSizes: {
            mirv: [3, 6, 9, 12],
            strobe: [3, 6, 9, 12],
        },
        bleedDamage: 2,
        bleedDamageMult: 1,
    },

    assets: {
        audio: [
            { name: "spawn_01", channel: "ui" },
            { name: "ping_unlock_01", channel: "ui" },
            { name: "potato_pickup_01", channel: "ui" },
            {
                name: "ambient_steam_01",
                channel: "ambient",
            },
            { name: "ambient_lab_01", channel: "ambient" },
            { name: "piano_music_01", channel: "ambient" },
            { name: "pumpkin_break_01", channel: "sfx" },
            { name: "potato_01", channel: "sfx" },
            { name: "potato_02", channel: "sfx" },
            { name: "club_music_01", channel: "sfx" },
            { name: "club_music_02", channel: "sfx" },
            { name: "log_11", channel: "sfx" },
            { name: "log_12", channel: "sfx" },
            { name: "log_13", channel: "sfx" },
            { name: "log_14", channel: "sfx" },
            { name: "piano_02", channel: "sfx" },
            { name: "log_03", channel: "sfx" },
            { name: "log_04", channel: "sfx" },
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
            "potato",
            "cobalt",
            "custom",
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
        tier_sv98: [
            { name: "sv98", count: 1, weight: 1 },
            { name: "awc", count: 1, weight: 0.25 },
        ],
        tier_ammo: [
            { name: "9mm", count: 60, weight: 3 },
            { name: "762mm", count: 60, weight: 3 },
            { name: "556mm", count: 60, weight: 3 },
            { name: "12gauge", count: 10, weight: 3 },
            { name: "45acp", count: 60, weight: 3 },
            { name: "flare", count: 1, weight: 1 },
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
            { name: "tier_custom", count: 1, weight: 1 },
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
            { name: "colt45", count: 1, weight: 1 },
            { name: "model94", count: 1, weight: 1 },
            { name: "m1911", count: 1, weight: 3 },
            { name: "m1a1", count: 1, weight: 2 },
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
            { name: "pkp", count: 1, weight: 0.75 },
            { name: "awc", count: 1, weight: 0.5 },
            { name: "m9", count: 1, weight: 0.5 },
            { name: "flare_gun_dual", count: 1, weight: 0.75 },
        ],
        tier_perks: [
            { name: "steelskin", count: 1, weight: 1 },
            { name: "takedown", count: 1, weight: 1 },
            { name: "tree_climbing", count: 1, weight: 1 },
            { name: "scavenger", count: 1, weight: 1 },
            { name: "chambered", count: 1, weight: 1 },
            { name: "flak_jacket", count: 1, weight: 1 },
            { name: "fabricate", count: 1, weight: 1 },
            { name: "broken_arrow", count: 1, weight: 1 },
            { name: "bonus_9mm", count: 1, weight: 1 },
        ],
        tier_hatchet_melee: [
            { name: "helmet03_leader2", count: 1, weight: 5 }, // ?
        ],
        tier_vault_floor: [
            { name: "helmet03_medic2", count: 1, weight: 0.5 },
            { name: "bonesaw_rusted", count: 1, weight: 0.5 },
        ],
        tier_chrys_02: [{ name: "windwalk", count: 1, weight: 1 }],
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
            { name: "ap_rounds", count: 1, weight: 1 },
            { name: "bonus_assault", count: 1, weight: 1 },
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
            { name: "outfitKeyLime", count: 1, weight: 0.2 }, // ?
            { name: "outfitWoodland", count: 1, weight: 0.2 }, // ?
            { name: "outfitCamo", count: 1, weight: 0.2 }, // ?
            { name: "outfitGhillie", count: 1, weight: 0.15 }, // ?
        ],
        tier_eye_block: [
            { name: "tier_scavenger_adv", count: 1, weight: 5 },
            { name: "tier_airdrop_perk", count: 1, weight: 1 },
        ],
        tier_helm_special: [
            { name: "helmet02_moon1", count: 1, weight: 1 },
            { name: "helmet02_moon2", count: 1, weight: 1 },
            { name: "helmet02_moon3", count: 1, weight: 1 },
            { name: "helmet02_moon4", count: 1, weight: 1 },
        ],
        tier_police: [
            { name: "helmet03", count: 1, weight: 0.15 },
            { name: "chest03", count: 1, weight: 0.1 },
            { name: "backpack03", count: 1, weight: 0.25 },
        ],
        tier_airdrop_armor: [
            { name: "helmet03", count: 1, weight: 1 },
            { name: "chest03", count: 1, weight: 1 },
            { name: "backpack03", count: 1, weight: 1 },
        ],
        tier_armor: [
            { name: "helmet01", count: 1, weight: 9 },
            { name: "helmet02", count: 1, weight: 6 },
            { name: "helmet03", count: 1, weight: 0.2 },
            { name: "chest01", count: 1, weight: 15 },
            { name: "chest02", count: 1, weight: 6 },
            { name: "chest03", count: 1, weight: 0.2 },
        ],
        // tier_class_crate_mythic: [{ name: "30xscope", count: 1, weight: 1 }],
        tier_scopes_sniper: [
            { name: "15xscope", count: 1, weight: 1 }, // ?
        ],
        tier_custom: [
            { name: "m134", count: 1, weight: 1 },
            { name: "m79", count: 1, weight: 1 },
        ]
    },
    biome: {
        colors: {
            background: 0x20536e,
            water: 0x3282ab,
            waterRipple: 0xb3f0ff,
            beach: 0xdc9e28,
            riverbank: 0xa37119,
            grass: 0x629522,
            underground: 0x1b0d03,
            playerSubmerge: 0x2b8ca4,
            playerGhillie: 0x659825,
        },
    },
    /* STRIP_FROM_PROD_CLIENT:START */
    mapGen: {
        map: {
            baseWidth: 750,
            baseHeight: 750,
            extension: 112,
            shoreInset: 48,
            grassInset: 24,
        },
        rivers: {
            lakes: [],
            weights: [
                { weight: 1, widths: [20, 20, 20] },
            ],
            smoothness: 0.45,
            spawnCabins: true,
            masks: [],
        },
        customSpawnRules: {
            locationSpawns: [
                {
                    type: "logging_complex_01",
                    pos: v2.create(0.6, 0.6),
                    rad: 200,
                    retryOnFailure: true,
                },
                {
                    type: "shilo_01",
                    pos: v2.create(0.25, 0.25),
                    rad: 200,
                    retryOnFailure: true,
                },
                {
                    type: "bunker_structure_09",
                    pos: v2.create(0.5, 0.5),
                    rad: 1,
                    retryOnFailure: true,
                },
            ],
            placeSpawns: ["desert_town_01", "desert_town_02"],
        },
        densitySpawns: [
            {
                tree_01: 150,
                tree_07: 150,
                stone_01: 175,
                barrel_01: 50,
                silo_01: 12,
                crate_01: 100,
                crate_02: 10,
                crate_03: 18,
                bush_01: 75,
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
                bunker_structure_09: 1,
                savannah_patch_01: 7,
                desert_town_01: 1,
                desert_town_02: 1,
                river_town_02: 1,
                warehouse_01: 5,
                house_red_01: { small: 3, large: 4 },
                house_red_02: { small: 3, large: 4 },
                barn_01: { small: 1, large: 3 },
                barn_02: 2,
                hut_02: 5,
                hut_03: 3,
                shack_03a: 2,
                shack_03b: 3,
                greenhouse_01as: 1,
                cache_01: 1,
                cache_02: 2,
                cache_07: 3,
                bunker_structure_01: { odds: 0.05 },
                bunker_structure_02: 1,
                bunker_structure_03: 1,
                bunker_structure_04: 1,
                bunker_structure_05: 1,
                warehouse_complex_01ms: 1,
                mansion_structure_01: 1,
                police_01: 1,
                bank_01: 1,
                chest_01: 3,
                chest_03: { odds: 0.2 },
                mil_crate_02: { odds: 0.25 },
                tree_02: 5,
                teahouse_complex_01su: 2,
                stone_04: 20,
                club_complex_01: 1,
                greenhouse_02: 2,
                logging_complex_02: 3,
            },
        ],
        randomSpawns: [],
        spawnReplacements: [{ tree_01: "tree_12" }],
        importantSpawns: [
            "desert_town_01",
            "desert_town_02",
            "river_town_02",
            "logging_complex_02",
            "bunker_structure_09",
            "warehouse_complex_01ms",
        ],
    },
    /* STRIP_FROM_PROD_CLIENT:END */
};

export const MainSummer = util.mergeDeep({}, Main, mapDef) as MapDef;
