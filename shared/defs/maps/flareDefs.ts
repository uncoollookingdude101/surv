import { util } from "../../utils/util";
import type { MapDef } from "../mapDefs";
import { Desert } from "./desertDefs";
import { type GunDef, GunDefs } from "../gameObjects/gunDefs";
import { GameConfig } from "../../gameConfig";

GameConfig.bagSizes.flare= [10, 100, 250, 500],

GunDefs.flare_gun.maxClip = 50;  // Increased clip size
GunDefs.flare_gun.fireDelay = 0;  // Faster firing rate
GunDefs.flare_gun.reloadTime = 0; // Faster reload time
GunDefs.flare_gun.fireMode= "single";

GunDefs.flare_gun_dual.maxClip = 100;  // Increased clip size
GunDefs.flare_gun_dual.fireDelay = 0;  // Faster firing rate
GunDefs.flare_gun_dual.reloadTime = 0; // Faster reload time
GunDefs.flare_gun_dual.fireMode= "single";

const mapDef = {
    lootTable: {
        tier_guns: [
            { name: "flare_gun", count: 1, weight: 10 },
            {name: "flare_gun_dual",count: 1,weight: 1},
        ],
        tier_airdrop_uncommon: [
            { name: "flare_gun", count: 1, weight: 0.5 },
        ],
        tier_airdrop_rare: [
            { name: "flare_gun_dual", count: 1, weight: 6 },
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
            {name: "outfitGhillie",count: 1,weight: 0.5,},
        ],
        tier_airdrop_melee: [
            { name: "", count: 1, weight: 19 },
            { name: "stonehammer", count: 1, weight: 1 },
            { name: "pan", count: 1, weight: 1 },
        ],
        tier_chest: [
            { name: "flare_gun", count: 1, weight: 1.15 },
            { name: "helmet02", count: 1, weight: 1 },
            { name: "helmet03", count: 1, weight: 0.25 },
            { name: "chest02", count: 1, weight: 1 },
            { name: "chest03", count: 1, weight: 0.25 },
            { name: "4xscope", count: 1, weight: 0.5 },
            { name: "8xscope", count: 1, weight: 0.25 },
        ],
        tier_hatchet: [
            { name: "flare_gun", count: 1, weight: 0.4 },
        ],
        tier_throwables:[
            { name: "smoke", count: 1, weight: 1 },
        ],
        tier_airdrop_throwables: [
            { name: "smoke", count: 1, weight: 1 },
        ],
    },
};
export const Flare = util.mergeDeep({}, Desert, mapDef) as MapDef;
