import * as PIXI from "pixi.js";
import { coldet } from "../../../shared/utils/coldet";
import { collider } from "../../../shared/utils/collider";
import { GameConfig } from "../../../shared/gameConfig";
import { math } from "../../../shared/utils/math";
import { util } from "../../../shared/utils/util";
import { v2 } from "../../../shared/utils/v2";
import { BulletDefs } from "../../../shared/defs/gameObjects/bulletDefs";
import { GameObjectDefs } from "../../../shared/defs/gameObjectDefs";
import { MapObjectDefs } from "../../../shared/defs/mapObjectDefs";

export function transformSegment(p0, p1, pos, dir) {
    const ang = Math.atan2(dir.y, dir.x);
    return {
        p0: v2.add(pos, v2.rotate(p0, ang)),
        p1: v2.add(pos, v2.rotate(p1, ang))
    };
}

export function createBullet(bullet, bulletBarn, flareBarn, playerBarn, renderer) {
    if (BulletDefs[bullet.bulletType].addFlare) {
        flareBarn.addFlare(bullet, playerBarn, renderer);
    } else {
        bulletBarn.addBullet(bullet, playerBarn, renderer);
    }
}

export function playHitFx(particleName, soundName, pos, a, layer, particleBarn, audioManager) {
    let numParticles = Math.floor(util.random(1, 2));
    let vel = v2.mul(a, 9.5);
    for (
        let i = 0;
        i < numParticles;
        i++
    ) {
        vel = v2.rotate(vel, ((Math.random() - 0.5) * Math.PI) / 3);
        particleBarn.addParticle(particleName, layer, pos, vel);
    }
    audioManager.playGroup(soundName, {
        channel: "hits",
        soundPos: pos,
        layer: layer,
        filter: "muffled"
    });
}
export class BulletBarn {
    constructor() {
        this.bullets = [];
        this.tracerColors = {};
    }

    onMapLoad(map) {
        this.tracerColors = util.mergeDeep(
            GameConfig.tracerColors,
            map.getMapDef().biome.tracerColors
        );
    }

    addBullet(bullet, t, renderer) {
        let a = null;

        for (let i = 0; i < this.bullets.length; i++) {
            if (
                !this.bullets[i].alive &&
                !this.bullets[i].collided
            ) {
                a = this.bullets[i];
                break;
            }
        }

        if (!a) {
            a = {};
            a.alive = false;
            a.container = new PIXI.Container();
            a.container.pivot.set(14.5, 0);
            a.container.visible = false;
            a.bulletTrail = PIXI.Sprite.from(
                "player-bullet-trail-02.img"
            );
            a.bulletTrail.anchor.set(0.5, 0.5);
            a.container.addChild(a.bulletTrail);
            this.bullets.push(a);
        }

        const bulletDef = BulletDefs[bullet.bulletType];
        
        const variance = 1 + bullet.varianceT * bulletDef.variance;
        const distAdj = math.remap(bullet.distAdjIdx, 0, 16, -1, 1);
        let distance =
            bulletDef.distance /
            Math.pow(GameConfig.bullet.reflectDistDecay, bullet.reflectCount);
        if (bullet.clipDistance) {
            distance = bullet.distance;
        }
        a.alive = true;
        a.isNew = true;
        a.collided = false;
        a.scale = 1;
        a.playerId = bullet.playerId;
        a.startPos = v2.copy(bullet.pos);
        a.pos = v2.copy(bullet.pos);
        a.dir = v2.copy(bullet.dir);
        a.layer = bullet.layer;
        a.speed = bulletDef.speed * variance;
        a.distance = distance * variance + distAdj;
        a.damageSelf = bulletDef.shrapnel || bullet.reflectCount > 0;
        a.reflectCount = bullet.reflectCount;
        a.reflectObjId = bullet.reflectObjId;
        a.whizHeard = false;
        
        const angleRadians = Math.atan2(a.dir.x, a.dir.y);
        a.container.rotation = angleRadians - Math.PI / 2;
        
        a.layer = bullet.layer;
        const player = t.u(a.playerId);
        if (player && player.layer & 2) {
            a.layer |= 2;
        }

        // Set default scale.x to standard working length of 0.8
        let tracerWidth = bulletDef.tracerWidth;
        if (bullet.trailSmall) {
            tracerWidth *= 0.5;
        }
        if (bullet.trailThick) {
            tracerWidth *= 2;
        }
        a.bulletTrail.scale.set(0.8, tracerWidth);
        a.tracerLength = bulletDef.tracerLength;
        a.suppressed = !!bulletDef.suppressed;

        // Use saturated color if the player is on a bright surface
        const tracerColors = this.tracerColors[bulletDef.tracerColor];
        let tracerTint = tracerColors.regular;
        if (bullet.trailSaturated) {
            tracerTint = tracerColors.chambered || tracerColors.saturated;
        } else if (player?.surface?.data.isBright) {
            tracerTint = tracerColors.saturated;
        }
        a.bulletTrail.tint = tracerTint;
        a.tracerAlphaRate = tracerColors.alphaRate;
        a.tracerAlphaMin = tracerColors.alphaMin;
        a.bulletTrail.alpha = 1;
        if (a.reflectCount > 0) {
            a.bulletTrail.alpha *= 0.5;
        }
        a.container.visible = true;
        renderer.addPIXIObj(a.container, a.layer, 20);
    }

    /**
     * @param {import("../objects/player").PlayerBarn} playerBarn
    */
    m(dt, playerBarn, r, i, s, n, u, w) {
        for (
            let f = playerBarn.playerPool.p(), _ = 0;
            _ < this.bullets.length;
            _++
        ) {
            const b = this.bullets[_];
            if (b.collided) {
                b.scale = math.max(b.scale - dt * 6, 0);
                if (b.scale <= 0) {
                    b.collided = false;
                    b.container.visible = false;
                }
            }
            if (b.alive) {
                const distLeft =
                    b.distance - v2.length(v2.sub(b.startPos, b.pos));
                const distTravel = math.min(distLeft, dt * b.speed);
                const posOld = v2.copy(b.pos);
                b.pos = v2.add(b.pos, v2.mul(b.dir, distTravel));

                if (
                    !s.netData.he &&
                    util.sameAudioLayer(s.layer, b.layer) &&
                    v2.length(v2.sub(i.pos, b.pos)) < 7.5 &&
                    !b.whizHeard &&
                    b.playerId != s.__id
                ) {
                    w.playGroup("bullet_whiz", {
                        soundPos: b.pos,
                        fallOff: 4
                    });
                    b.whizHeard = true;
                }

                // Trail alpha
                if (b.tracerAlphaRate && b.suppressed) {
                    const rate = b.tracerAlphaRate;
                    b.bulletTrail.alpha = math.max(
                        b.tracerAlphaMin,
                        b.bulletTrail.alpha * rate
                    );
                }

                // Gather colliding obstacles and players
                const colObjs = [];

                // Obstacles
                const obstacles = r.Ve.p();
                for (let i = 0; i < obstacles.length; i++) {
                    const obstacle = obstacles[i];
                    if (
                        !!obstacle.active &&
                        !obstacle.dead &&
                        !!util.sameLayer(obstacle.layer, b.layer) &&
                        obstacle.height >= GameConfig.bullet.height &&
                        (b.reflectCount <= 0 ||
                            obstacle.__id != b.reflectObjId)
                    ) {
                        const res = collider.intersectSegment(
                            obstacle.collider,
                            posOld,
                            b.pos
                        );
                        if (res) {
                            colObjs.push({
                                type: "obstacle",
                                obstacleType: obstacle.type,
                                collidable: obstacle.collidable,
                                point: res.point,
                                normal: res.normal
                            });
                        }
                    }
                }
                for (let C = 0; C < f.length; C++) {
                    const A = f[C];
                    if (
                        A.active &&
                        !A.netData.he &&
                        (util.sameLayer(A.netData.pe, b.layer) ||
                            A.netData.pe & 2) &&
                        (A.__id != b.playerId || b.damageSelf)
                    ) {
                        let O = null;
                        if (A.hasActivePan()) {
                            const D = A;
                            const E = D.getPanSegment();
                            const B = transformSegment(
                                E.p0,
                                E.p1,
                                D.posOld,
                                D.dirOld
                            );
                            const R = transformSegment(E.p0, E.p1, D.pos, D.dir);
                            const L = coldet.intersectSegmentSegment(
                                posOld,
                                b.pos,
                                B.p0,
                                B.p1
                            );
                            const q = coldet.intersectSegmentSegment(
                                posOld,
                                b.pos,
                                R.p0,
                                R.p1
                            );
                            const F = q || L;
                            if (F) {
                                const j = v2.normalize(
                                    v2.perp(v2.sub(R.p1, R.p0))
                                );
                                O = {
                                    point: F.point,
                                    normal: j
                                };
                            }
                        }
                        const N = coldet.intersectSegmentCircle(
                            posOld,
                            b.pos,
                            A.pos,
                            A.rad
                        );
                        if (
                            N &&
                            (!O ||
                                v2.length(
                                    v2.sub(N.point, b.startPos)
                                ) <
                                v2.length(
                                    v2.sub(O.point, b.startPos)
                                ))
                        ) {
                            colObjs.push({
                                type: "player",
                                player: A,
                                point: N.point,
                                normal: N.normal,
                                layer: A.layer,
                                collidable: true
                            });
                            if (A.hasPerk("steelskin")) {
                                colObjs.push({
                                    type: "pan",
                                    point: v2.add(
                                        N.point,
                                        v2.mul(N.normal, 0.1)
                                    ),
                                    normal: N.normal,
                                    layer: A.layer,
                                    collidable: false
                                });
                            }
                        } else if (O) {
                            colObjs.push({
                                type: "pan",
                                point: O.point,
                                normal: O.normal,
                                layer: A.layer,
                                collidable: true
                            });
                        }
                        if (N || O) {
                            break;
                        }
                    }
                }

                for (let i = 0; i < colObjs.length; i++) {
                    const col = colObjs[i];
                    col.dist = v2.length(v2.sub(col.point, posOld));
                }

                colObjs.sort((a, b) => {
                    return a.dist - b.dist;
                });

                let shooterDead = false;
                const W = playerBarn.u(b.playerId);
                if (W && (W.netData.he || W.netData.ue)) {
                    shooterDead = true;
                }
                let hit = false;
                for (let X = 0; X < colObjs.length; X++) {
                    const col = colObjs[X];
                    if (col.type == "obstacle") {
                        const mapDef = MapObjectDefs[col.obstacleType];
                        playHitFx(
                            mapDef.hitParticle,
                            mapDef.sound.bullet,
                            col.point,
                            col.normal,
                            b.layer,
                            u,
                            w
                        );

                        // Continue travelling if non-collidable
                        hit = col.collidable;
                    } else if (col.type == "player") {
                        // Don't create a hit particle if the shooting
                        // player is dead; this helps avoid confusion around
                        // bullets being inactivated when a player dies.
                        if (!shooterDead) {
                            const Y = col.player;
                            if (
                                r.turkeyMode &&
                                W?.hasPerk("turkey_shoot")
                            ) {
                                const J = v2.mul(
                                    v2.randomUnit(),
                                    util.random(3, 6)
                                );
                                u.addParticle(
                                    "turkeyFeathersHit",
                                    Y.layer,
                                    Y.pos,
                                    J
                                );
                            }
                            const Q = v2.sub(col.point, Y.pos);
                            Q.y *= -1;
                            u.addParticle(
                                "bloodSplat",
                                Y.layer,
                                v2.mul(Q, i.ppu),
                                v2.create(0, 0),
                                1,
                                1,
                                Y.container
                            );
                            w.playGroup("player_bullet_hit", {
                                soundPos: Y.pos,
                                fallOff: 1,
                                layer: Y.layer,
                                filter: "muffled"
                            });
                        }
                        hit = col.collidable;
                    } else if (col.type == "pan") {
                        playHitFx(
                            "barrelChip",
                            GameObjectDefs.pan.sound.bullet,
                            col.point,
                            col.normal,
                            col.layer,
                            u,
                            w
                        );
                        hit = col.collidable;
                    }
                    if (hit) {
                        b.pos = col.point;
                        break;
                    }
                }
                if (!(b.layer & 2)) {
                    const $ = r.lr.p();
                    let ee = b.layer;
                    for (let te = 0; te < $.length; te++) {
                        const re = $[te];
                        if (re.active) {
                            let ae = false;
                            let ie = false;
                            for (
                                let oe = 0;
                                oe < re.stairs.length;
                                oe++
                            ) {
                                const se = re.stairs[oe];
                                if (
                                    !se.lootOnly &&
                                    collider.intersectSegment(
                                        se.collision,
                                        b.pos,
                                        posOld
                                    )
                                ) {
                                    ae = true;
                                    break;
                                }
                            }
                            for (
                                let ne = 0;
                                ne < re.mask.length;
                                ne++
                            ) {
                                if (
                                    collider.intersectSegment(
                                        re.mask[ne],
                                        b.pos,
                                        posOld
                                    )
                                ) {
                                    ie = true;
                                    break;
                                }
                            }
                            if (ae && !ie) {
                                ee |= 2;
                            }
                        }
                    }
                    if (ee != b.layer) {
                        b.layer = ee;
                        n.addPIXIObj(b.container, b.layer, 20);
                    }
                }
                if (hit || math.eqAbs(distLeft, distTravel)) {
                    b.collided = true;
                    b.alive = false;
                }
                b.isNew = false;
            }
        }
    }

    createBulletHit(playerBarn, targetId, audioManager) {
        const player = playerBarn.u(targetId);
        if (player) {
            audioManager.playGroup("player_bullet_hit", {
                soundPos: player.pos,
                fallOff: 1,
                layer: player.layer,
                filter: "muffled"
            });
        }
    }

    render(camera, debug) {
        camera.pixels(1);
        for (let i = 0; i < this.bullets.length; i++) {
            const b = this.bullets[i];
            if (b.alive || b.collided) {
                const dist = v2.length(v2.sub(b.pos, b.startPos));
                const screenPos = camera.pointToScreen(b.pos);
                b.container.position.set(screenPos.x, screenPos.y);
                const screenScale = camera.pixels(1);
                const trailLength = math.min(b.tracerLength * 15, dist / 2);
                b.container.scale.set(screenScale * trailLength * b.scale, screenScale);
            }
        }
    }
}
