import * as PIXI from "pixi.js";
import { GameConfig } from "../../shared/gameConfig";
import GameObject from "../../shared/utils/gameObject";
import { mapHelpers } from "../../shared/utils/mapHelpers";
import { math } from "../../shared/utils/math";
import net from "../../shared/net";
import { v2 } from "../../shared/utils/v2";
import { device } from "./device";
import { helpers } from "./helpers";
import { RoleDefs } from "../../shared/defs/gameObjects/roleDefs";
import { GameObjectDefs } from "../../shared/defs/gameObjectDefs";
import { AirdropBarn } from "./objects/airdrop";
import { BulletBarn, createBullet } from "./objects/bullet";
import { Camera } from "./camera";
import { DeadBodyBarn } from "./objects/deadBody";
import { debugLines } from "./debugLines";
import { DecalBarn } from "./objects/decal";
import { EmoteBarn } from "./emote";
import { ExplosionBarn } from "./objects/explosion";
import { FlareBarn } from "./objects/flare";
import { Gas } from "./gas";
import input from "./input";
import { LootBarn } from "./objects/loot";
import { Map } from "./map";
import { Creator } from "./objects/objectPool";
import { ParticleBarn } from "./objects/particles";
import { PlaneBarn } from "./objects/plane";
import { PlayerBarn } from "./objects/player";
import { ShotBarn } from "./objects/shot";
import { ProjectileBarn } from "./objects/projectile";
import { SmokeBarn } from "./objects/smoke";
import { Renderer } from "./renderer";
import { Touch } from "./ui/touch";
import { UiManager } from "./ui/ui";
import { UiManager2 } from "./ui/ui2";

const Input = GameConfig.Input;

export class Game {
    /**
     * @param {PIXI.Application} PIXI
     * @param {import("./audioManager").AudioManager} audioManager
     * @param {import("./ui/localization")} localization
     * @param {import("./config").ConfigManager} config
     * @param {import("./input")} input
     * @param {import("./inputBinds").InputBinds} inputBinds
     * @param {import("./inputBinds").InputBindUi} inputBindUi
     * @param {import("./ambiance").Ambiance} ambience
     * @param {import("./resources").ResourceManager} resourceManager
     */
    constructor(pixi, audioManager, localization, config, input, inputBinds, inputBindUi, ambience, resourceManager, onJoin, onQuit) {
        this.initialized = false;
        this.teamMode = 0;
        // Callbacks
        this.onJoin = onJoin;
        this.onQuit = onQuit;

        this.pixi = pixi;
        this.audioManager = audioManager;
        this.ambience = ambience;
        this.localization = localization;
        this.config = config;
        this.m_input = input;
        this.m_inputBinds = inputBinds;
        this.m_inputBindUi = inputBindUi;
        this.resourceManager = resourceManager;
        this.victoryMusic = null;
        this.ws = null;
        this.connecting = false;
        this.connected = false;
    }

    tryJoinGame(url, matchPriv, loadoutPriv, questPriv, onConnectFail) {
        const _this = this;
        if (
            !this.connecting &&
            !this.connected &&
            !this.initialized
        ) {
            if (this.ws) {
                this.ws.onerror = function() { };
                this.ws.onopen = function() { };
                this.ws.onmessage = function() { };
                this.ws.onclose = function() { };
                this.ws.close();
                this.ws = null;
            }
            this.connecting = true;
            this.connected = false;
            try {
                this.ws = new WebSocket(url);
                this.ws.binaryType = "arraybuffer";
                this.ws.onerror = function(_err) {
                    _this.ws?.close();
                };
                this.ws.onopen = function() {
                    _this.connecting = false;
                    _this.connected = true;
                    const name = _this.config.get("playerName");
                    const joinMessage = new net.JoinMsg();
                    joinMessage.protocol = GameConfig.protocolVersion;
                    joinMessage.matchPriv = matchPriv;
                    joinMessage.loadoutPriv = loadoutPriv;
                    joinMessage.questPriv = questPriv;
                    joinMessage.name = name;
                    joinMessage.useTouch = device.touch;
                    joinMessage.isMobile = device.mobile || window.mobile;
                    joinMessage.bot = false;
                    joinMessage.emotes = _this.config.get("loadout").emotes;

                    _this.sendMessage(net.MsgType.Join, joinMessage, 8192);
                };
                this.ws.onmessage = function(e) {
                    const msgStream = new net.MsgStream(e.data);
                    while (true) {
                        const type = msgStream.deserializeMsgType();
                        if (type == net.MsgType.None) {
                            break;
                        }
                        _this.onMsg(type, msgStream.getStream());
                    }
                };
                this.ws.onclose = function() {
                    const displayingStats = _this.uiManager?.displayingStats;
                    const connecting = _this.connecting;
                    const connected = _this.connected;
                    _this.connecting = false;
                    _this.connected = false;
                    if (connecting) {
                        onConnectFail();
                    } else if (connected && !_this.gameOver && !displayingStats) {
                        const errMsg =
                            _this.disconnectMsg || "index-host-closed";
                        _this.onQuit(errMsg);
                    }
                };
            } catch (err) {
                console.error(errMsg);
                this.connecting = false;
                this.connected = false;
                onConnectFail();
            }
        }
    }

    init() {
        this.canvasMode = this.pixi.renderer.type == PIXI.RENDERER_TYPE.CANVAS;
        // Anti-cheat
        this.m_mangle = false;
        this.m_frame = 0;
        this.m_cheatDetected = false;
        this.m_cheatSentLoadoutMsg = false;
        // Modules
        this.touch = new Touch(this.m_input, this.config);
        this.camera = new Camera();
        this.renderer = new Renderer(this, this.canvasMode);
        this.particleBarn = new ParticleBarn(this.renderer);
        this.decalBarn = new DecalBarn();
        this.map = new Map(this.decalBarn);
        this.playerBarn = new PlayerBarn();
        this.bulletBarn = new BulletBarn();
        this.flareBarn = new FlareBarn();
        this.projectileBarn = new ProjectileBarn();
        this.explosionBarn = new ExplosionBarn();
        this.planeBarn = new PlaneBarn(this.audioManager);
        this.airdropBarn = new AirdropBarn();
        this.smokeBarn = new SmokeBarn();
        this.deadBodyBarn = new DeadBodyBarn();
        this.lootBarn = new LootBarn();
        this.gas = new Gas(this.canvasMode);
        this.uiManager = new UiManager(
            this,
            this.audioManager,
            this.particleBarn,
            this.planeBarn,
            this.localization,
            this.canvasMode,
            this.touch,
            this.m_inputBinds,
            this.m_inputBindUi
        );
        this.ui2Manager = new UiManager2(this.localization, this.m_inputBinds);
        this.emoteBarn = new EmoteBarn(
            this.audioManager,
            this.uiManager,
            this.playerBarn,
            this.camera,
            this.map
        );
        this.shotBarn = new ShotBarn(this.particleBarn, this.audioManager, this.uiManager);

        // Register types
        const TypeToPool = {
            [GameObject.Type.Player]: this.playerBarn.playerPool,
            [GameObject.Type.Obstacle]: this.map.Ve,
            [GameObject.Type.Loot]: this.lootBarn.sr,
            [GameObject.Type.DeadBody]: this.deadBodyBarn.ot,
            [GameObject.Type.Building]: this.map.nr,
            [GameObject.Type.Structure]: this.map.lr,
            [GameObject.Type.Decal]: this.decalBarn._,
            [GameObject.Type.Projectile]: this.projectileBarn.cr,
            [GameObject.Type.Smoke]: this.smokeBarn.e,
            [GameObject.Type.Airdrop]: this.airdropBarn.re
        };
        this.objectCreator = new Creator();
        for (const type in TypeToPool) {
            if (TypeToPool.hasOwnProperty(type)) {
                this.objectCreator.registerType(type, TypeToPool[type]);
            }
        }
        // Render ordering
        this.debugDisplay = new PIXI.Graphics();
        const pixiContainers = [
            this.map.display.ground,
            this.renderer.layers[0],
            this.renderer.ground,
            this.renderer.layers[1],
            this.renderer.layers[2],
            this.renderer.layers[3],
            this.debugDisplay,
            this.gas.gasRenderer.display,
            this.touch.container,
            this.emoteBarn.container,
            this.uiManager.container,
            this.uiManager.Pe.container,
            this.emoteBarn.indContainer
        ];
        for (
            let i = 0;
            i < pixiContainers.length;
            i++
        ) {
            const container = pixiContainers[i];
            if (container) {
                container.interactiveChildren = false;
                this.pixi.stage.addChild(container);
            }
        }
        // Local vars
        this.disconnectMsg = "";
        this.playing = false;
        this.gameOver = false;
        this.spectating = false;
        this.inputMsgTimeout = 0;
        this.prevInputMsg = new net.InputMsg();
        this.playingTicker = 0;
        this.updateRecvCount = 0;
        this.updatePass = false;
        this.updatePassDelay = 0;
        this.m_localId = 0;
        this.m_activeId = 0;
        this.m_activePlayer = null;
        this.m_validateAlpha = false;
        this.m_targetZoom = 1;
        this.debugZoom = 1;
        this.useDebugZoom = false;

        // Latency determination

        this.seq = 0;
        this.seqInFlight = false;
        this.seqSendTime = 0;
        this.pings = [];
        this.debugPingTime = 0;

        // Process config
        this.camera.setShakeEnabled(this.config.get("screenShake"));
        this.playerBarn.anonPlayerNames =
            this.config.get("anonPlayerNames");
        this.initialized = true;
    }

    free() {
        if (this.ws) {
            this.ws.onmessage = function() { };
            this.ws.close();
            this.ws = null;
        }
        this.connecting = false;
        this.connected = false;
        if (this.initialized) {
            this.initialized = false;
            this.updatePass = false;
            this.updatePassDelay = 0;
            this.emoteBarn.free();
            this.ui2Manager.free();
            this.uiManager.free();
            this.gas.free();
            this.airdropBarn.free();
            this.planeBarn.free();
            this.map.free();
            this.particleBarn.free();
            this.renderer.free();
            this.m_input.n();
            this.audioManager.stopAll();
            while (this.pixi.stage.children.length > 0) {
                const c = this.pixi.stage.children[0];
                this.pixi.stage.removeChild(c);
                c.destroy({
                    children: true
                });
            }
        }
    }

    warnPageReload() {
        return (
            import.meta.env.PROD &&
            this.initialized &&
            this.playing &&
            !this.spectating &&
            !this.uiManager.displayingStats
        );
    }

    update(dt) {
        const smokeParticles = this.smokeBarn.particles;
        const obstacles = this.map.Ve.p();
        let a = 0;
        // End anti-cheat hacking
        this.m_mangle = true;
        const debug = {};
        debug.render = debug.render || {};

        if (this.playing) {
            this.playingTicker += dt;
        }
        this.playerBarn.m(
            dt,
            this.m_activeId,
            this.teamMode,
            this.renderer,
            this.particleBarn,
            this.camera,
            this.map,
            this.m_inputBinds,
            this.audioManager,
            this.ui2Manager,
            this.emoteBarn.wheelKeyTriggered,
            this.uiManager.displayingStats,
            this.spectating
        );
        this.updateAmbience();

        this.camera.pos = v2.copy(this.m_activePlayer.pos);
        this.camera.applyShake();
        const zoom = this.m_activePlayer.getZoom();
        const minDim = math.min(this.camera.screenWidth, this.camera.screenHeight);
        const maxDim = math.max(this.camera.screenWidth, this.camera.screenHeight);
        const maxScreenDim = math.max(minDim * (16 / 9), maxDim);
        this.camera.q = (maxScreenDim * 0.5) / (zoom * this.camera.ppu);
        const zoomLerpIn = this.m_activePlayer.zoomFast ? 3 : 2;
        const zoomLerpOut = this.m_activePlayer.zoomFast ? 3 : 1.4;
        const zoomLerp = this.camera.q > this.camera.O ? zoomLerpIn : zoomLerpOut;
        this.camera.O = math.lerp(dt * zoomLerp, this.camera.O, this.camera.q);
        this.audioManager.cameraPos = v2.copy(this.camera.pos);
        if (this.m_input.We(input.Key.Escape)) {
            this.uiManager.toggleEscMenu();
        }
        // Large Map
        if (
            this.m_inputBinds.isBindPressed(Input.ToggleMap) ||
            (this.m_input.We(input.Key.G) && !this.m_inputBinds.isKeyBound(input.Key.G))
        ) {
            this.uiManager.displayMapLarge(false);
        }
        // Minimap
        if (this.m_inputBinds.isBindPressed(Input.CycleUIMode)) {
            this.uiManager.cycleVisibilityMode();
        }
        // Hide UI
        if (
            this.m_inputBinds.isBindPressed(Input.HideUI) ||
            (this.m_input.We(input.Key.Escape) && !this.uiManager.hudVisible)
        ) {
            this.uiManager.cycleHud();
        }
        // Update facing direction
        const playerPos = this.m_activePlayer.pos;
        const mousePos = this.camera.screenToPoint(this.m_input.Ue);
        const toMousePos = v2.sub(mousePos, playerPos);
        let toMouseLen = v2.length(toMousePos);
        let toMouseDir = toMouseLen > 0.00001 ? v2.div(toMousePos, toMouseLen) : v2.create(1, 0);

        if (this.emoteBarn.wheelDisplayed) {
            toMouseLen = this.prevInputMsg.toMouseLen;
            toMouseDir = this.prevInputMsg.toMouseDir;
        }

        // Input
        const inputMsg = new net.InputMsg();
        inputMsg.seq = this.seq;
        if (!this.spectating) {
            if (device.touch) {
                const touchPlayerMovement = this.touch.getTouchMovement(this.camera);
                const touchAimMovement = this.touch.getAimMovement(this.m_activePlayer, this.camera);
                let aimDir = v2.copy(touchAimMovement.aimMovement.toAimDir);
                this.touch.turnDirTicker -= dt;
                if (this.touch.moveDetected && !touchAimMovement.touched) {
                    // Keep looking in the old aimDir while waiting for the ticker
                    const touchDir = v2.normalizeSafe(
                        touchPlayerMovement.toMoveDir,
                        v2.create(1, 0)
                    );
                    const modifiedAimDir =
                        this.touch.turnDirTicker < 0
                            ? touchDir
                            : touchAimMovement.aimMovement.toAimDir;
                    this.touch.setAimDir(modifiedAimDir);
                    aimDir = modifiedAimDir;
                }
                if (touchAimMovement.touched) {
                    this.touch.turnDirTicker = this.touch.turnDirCooldown;
                }
                if (this.touch.moveDetected) {
                    inputMsg.touchMoveDir = v2.normalizeSafe(
                        touchPlayerMovement.toMoveDir,
                        v2.create(1, 0)
                    );
                    inputMsg.touchMoveLen = Math.round(
                        math.clamp(touchPlayerMovement.toMoveLen, 0, 1) * 255
                    );
                } else {
                    inputMsg.touchMoveLen = 0;
                }
                inputMsg.touchMoveActive = true;
                const aimLen = touchAimMovement.aimMovement.toAimLen;
                const toTouchLenAdjusted =
                    math.clamp(aimLen / this.touch.padPosRange, 0, 1) *
                    GameConfig.player.throwableMaxMouseDist;
                inputMsg.toMouseLen = toTouchLenAdjusted;
                inputMsg.toMouseDir = aimDir;
            } else {
                // Only use arrow keys if they are unbound
                inputMsg.moveLeft =
                    this.m_inputBinds.isBindDown(Input.MoveLeft) ||
                    (this.m_input.Ye(input.Key.Left) &&
                        !this.m_inputBinds.isKeyBound(input.Key.Left));
                inputMsg.moveRight =
                    this.m_inputBinds.isBindDown(Input.MoveRight) ||
                    (this.m_input.Ye(input.Key.Right) &&
                        !this.m_inputBinds.isKeyBound(input.Key.Right));
                inputMsg.moveUp =
                    this.m_inputBinds.isBindDown(Input.MoveUp) ||
                    (this.m_input.Ye(input.Key.Up) &&
                        !this.m_inputBinds.isKeyBound(input.Key.Up));
                inputMsg.moveDown =
                    this.m_inputBinds.isBindDown(Input.MoveDown) ||
                    (this.m_input.Ye(input.Key.Down) &&
                        !this.m_inputBinds.isKeyBound(input.Key.Down));
                inputMsg.toMouseDir = v2.copy(toMouseDir);
                inputMsg.toMouseLen = toMouseLen;
            }
            inputMsg.touchMoveDir = v2.normalizeSafe(
                inputMsg.touchMoveDir,
                v2.create(1, 0)
            );
            inputMsg.touchMoveLen = math.clamp(inputMsg.touchMoveLen, 0, 255);
            inputMsg.toMouseDir = v2.normalizeSafe(
                inputMsg.toMouseDir,
                v2.create(1, 0)
            );
            inputMsg.toMouseLen = math.clamp(
                inputMsg.toMouseLen,
                0,
                net.Constants.MouseMaxDist
            );
            inputMsg.shootStart =
                this.m_inputBinds.isBindPressed(Input.Fire) || this.touch.wr;
            inputMsg.shootHold = this.m_inputBinds.isBindDown(Input.Fire) || this.touch.wr;
            inputMsg.portrait = this.camera.screenWidth < this.camera.screenHeight;
            const checkInputs = [
                Input.Reload,
                Input.Revive,
                Input.Use,
                Input.Loot,
                Input.Cancel,
                Input.EquipPrimary,
                Input.EquipSecondary,
                Input.EquipThrowable,
                Input.EquipMelee,
                Input.EquipNextWeap,
                Input.EquipPrevWeap,
                Input.EquipLastWeap,
                Input.EquipOtherGun,
                Input.EquipPrevScope,
                Input.EquipNextScope,
                Input.StowWeapons
            ];
            for (
                let B = 0;
                B < checkInputs.length;
                B++
            ) {
                const input = checkInputs[B];
                if (this.m_inputBinds.isBindPressed(input)) {
                    inputMsg.addInput(input);
                }
            }

            // Handle Interact
            // Interact should not activate Revive, Use, or Loot if those inputs are bound separately.
            if (this.m_inputBinds.isBindPressed(Input.Interact)) {
                const inputs = [];
                const interactBinds = [Input.Revive, Input.Use, Input.Loot];
                for (let i = 0; i < interactBinds.length; i++) {
                    const b = interactBinds[i];
                    if (!this.m_inputBinds.getBind(b)) {
                        inputs.push(b);
                    }
                }
                if (inputs.length == interactBinds.length) {
                    inputMsg.addInput(Input.Interact);
                } else {
                    for (let i = 0; i < inputs.length; i++) {
                        inputMsg.addInput(inputs[i]);
                    }
                }
            }

            // Swap weapon slots
            if (
                this.m_inputBinds.isBindPressed(Input.SwapWeapSlots) ||
                this.uiManager.swapWeapSlots
            ) {
                inputMsg.addInput(Input.SwapWeapSlots);
                this.m_activePlayer.gunSwitchCooldown = 0;
            }

            // Handle touch inputs
            if (this.uiManager.reloadTouched) {
                inputMsg.addInput(Input.Reload);
            }
            if (this.uiManager.interactionTouched) {
                inputMsg.addInput(Input.Interact);
                inputMsg.addInput(Input.Cancel);
            }

            // Process 'use' actions trigger from the ui
            for (let i = 0; i < this.ui2Manager.uiEvents.length; i++) {
                const e = this.ui2Manager.uiEvents[i];
                if (e.action == "use") {
                    if (e.type == "weapon") {
                        const weapIdxToInput = {
                            0: Input.EquipPrimary,
                            1: Input.EquipSecondary,
                            2: Input.EquipMelee,
                            3: Input.EquipThrowable
                        };
                        const input = weapIdxToInput[e.data];
                        if (input) {
                            inputMsg.addInput(input);
                        }
                    } else {
                        inputMsg.useItem = e.data;
                    }
                }
            }
            if (this.m_inputBinds.isBindPressed(Input.UseBandage)) {
                inputMsg.useItem = "bandage";
            } else if (this.m_inputBinds.isBindPressed(Input.UseHealthKit)) {
                inputMsg.useItem = "healthkit";
            } else if (this.m_inputBinds.isBindPressed(Input.UseSoda)) {
                inputMsg.useItem = "soda";
            } else if (this.m_inputBinds.isBindPressed(Input.UsePainkiller)) {
                inputMsg.useItem = "painkiller";
            }

            // Process 'drop' actions triggered from the ui
            let playDropSound = false;
            for (let X = 0; X < this.ui2Manager.uiEvents.length; X++) {
                const e = this.ui2Manager.uiEvents[X];
                if (e.action == "drop") {
                    const dropMsg = new net.DropItemMsg();
                    if (e.type == "weapon") {
                        const Y = this.m_activePlayer.Re.tt;
                        dropMsg.item = Y[e.data].type;
                        dropMsg.weapIdx = e.data;
                    } else if (e.type == "perk") {
                        const J = this.m_activePlayer.netData.Me;
                        const Q =
                            J.length > e.data ? J[e.data] : null;
                        if (Q?.droppable) {
                            dropMsg.item = Q.type;
                        }
                    } else {
                        let $ = "";
                        $ =
                            e.data == "helmet"
                                ? this.m_activePlayer.netData.le
                                : e.data == "chest"
                                    ? this.m_activePlayer.netData.ce
                                    : e.data;
                        dropMsg.item = $;
                    }
                    if (dropMsg.item != "") {
                        this.sendMessage(net.MsgType.DropItem, dropMsg, 128);
                        if (dropMsg.item != "fists") {
                            playDropSound = true;
                        }
                    }
                }
            }
            if (playDropSound) {
                this.audioManager.playSound("loot_drop_01", {
                    channel: "ui"
                });
            }
            if (this.uiManager.roleSelected) {
                const roleSelectMessage = new net.PerkModeRoleSelectMsg();
                roleSelectMessage.role = this.uiManager.roleSelected;
                this.sendMessage(net.MsgType.PerkModeRoleSelect, roleSelectMessage, 128);
                this.config.set("perkModeRole", roleSelectMessage.role);
            }
        }
        const specBegin = this.uiManager.specBegin;
        const specNext =
            this.uiManager.specNext ||
            (this.spectating && this.m_input.We(input.Key.Right));
        const specPrev =
            this.uiManager.specPrev ||
            (this.spectating && this.m_input.We(input.Key.Left));
        const specForce =
            this.m_input.We(input.Key.Right) || this.m_input.We(input.Key.Left);
        if (specBegin || (this.spectating && specNext) || specPrev) {
            const specMsg = new net.SpectateMsg();
            specMsg.specBegin = specBegin;
            specMsg.specNext = specNext;
            specMsg.specPrev = specPrev;
            specMsg.specForce = specForce;
            this.sendMessage(net.MsgType.Spectate, specMsg, 128);
        }
        this.uiManager.specBegin = false;
        this.uiManager.specNext = false;
        this.uiManager.specPrev = false;
        this.uiManager.reloadTouched = false;
        this.uiManager.interactionTouched = false;
        this.uiManager.swapWeapSlots = false;
        this.uiManager.roleSelected = "";

        // Only send a InputMsg if the new data has changed from the previously sent data. For the look direction, we need to determine if the angle difference is large enough.
        let diff = false;
        for (const k in inputMsg) {
            if (inputMsg.hasOwnProperty(k)) {
                if (k == "inputs") {
                    diff = inputMsg[k].length > 0;
                } else if (
                    k == "toMouseDir" ||
                    k == "touchMoveDir"
                ) {
                    const dot = math.clamp(
                        v2.dot(inputMsg[k], this.prevInputMsg[k]),
                        -1,
                        1
                    );
                    const angle = math.rad2deg(Math.acos(dot));
                    diff = angle > 0.1;
                } else if (k == "toMouseLen") {
                    diff =
                        Math.abs(this.prevInputMsg[k] - inputMsg[k]) >
                        0.5;
                } else if (k == "shootStart") {
                    diff = inputMsg[k] || inputMsg[k] != this.prevInputMsg[k];
                } else if (this.prevInputMsg[k] != inputMsg[k]) {
                    diff = true;
                }
                if (diff) {
                    break;
                }
            }
        }
        this.inputMsgTimeout -= dt;
        if (diff || this.inputMsgTimeout < 0) {
            if (!this.seqInFlight) {
                this.seq = (this.seq + 1) % 256;
                this.seqSendTime = Date.now();
                this.seqInFlight = true;
                inputMsg.seq = this.seq;
            }
            this.sendMessage(net.MsgType.Input, inputMsg, 128);
            this.inputMsgTimeout = 1;
            this.prevInputMsg = inputMsg;
        }

        // Clear cached data
        this.ui2Manager.flushInput();

        this.map.m(
            dt,
            this.m_activePlayer,
            this.playerBarn,
            this.particleBarn,
            this.audioManager,
            this.ambience,
            this.renderer,
            this.camera,
            smokeParticles,
            debug
        );
        this.lootBarn.update(dt, this.m_activePlayer, this.map, this.audioManager, this.camera, debug);
        this.bulletBarn.m(
            dt,
            this.playerBarn,
            this.map,
            this.camera,
            this.m_activePlayer,
            this.renderer,
            this.particleBarn,
            this.audioManager
        );
        this.flareBarn.update(
            dt,
            this.playerBarn,
            this.map,
            this.camera,
            this.m_activePlayer,
            this.renderer,
            this.particleBarn,
            this.audioManager
        );
        this.projectileBarn.m(
            dt,
            this.particleBarn,
            this.audioManager,
            this.m_activePlayer,
            this.map,
            this.renderer,
            this.camera
        );
        this.explosionBarn.m(
            dt,
            this.map,
            this.playerBarn,
            this.camera,
            this.particleBarn,
            this.audioManager,
            debug
        );
        this.airdropBarn.m(
            dt,
            this.m_activePlayer,
            this.camera,
            this.map,
            this.particleBarn,
            this.renderer,
            this.audioManager
        );
        this.planeBarn.m(dt, this.camera, this.m_activePlayer, this.map, this.renderer);
        this.smokeBarn.m(dt, this.camera, this.m_activePlayer, this.map, this.renderer);
        this.shotBarn.update(dt, this.m_activeId, this.playerBarn, this.particleBarn, this.audioManager);
        this.particleBarn.m(dt, this.camera, debug);
        this.deadBodyBarn.m(dt, this.playerBarn, this.m_activePlayer, this.map, this.camera, this.renderer);
        this.decalBarn.update(dt, this.camera, this.renderer, debug);
        this.uiManager.m(
            dt,
            this.m_activePlayer,
            this.map,
            this.gas,
            this.lootBarn,
            this.playerBarn,
            this.camera,
            this.teamMode,
            this.map.factionMode
        );
        this.ui2Manager.update(
            dt,
            this.m_activePlayer,
            this.spectating,
            this.playerBarn,
            this.lootBarn,
            this.map,
            this.m_inputBinds
        );
        this.emoteBarn.m(
            dt,
            this.m_localId,
            this.m_activePlayer,
            this.teamMode,
            this.deadBodyBarn,
            this.map,
            this.renderer,
            this.m_input,
            this.m_inputBinds,
            this.spectating
        );
        this.touch.update(dt, this.m_activePlayer, this.map, this.camera, this.renderer);
        this.renderer.m(dt, this.camera, this.map, debug);
        if (!this.m_cheatSentLoadoutMsg && this.map._r && this.map.U) {
            this.m_cheatSentLoadoutMsg = true;
            const me = new net.LoadoutMsg();
            me.emotes = [];
            for (
                let pe = 0;
                pe < this.emoteBarn.emoteLoadout.length;
                pe++
            ) {
                me.emotes.push(this.emoteBarn.emoteLoadout[pe]);
            }
            me.custom = this.emoteBarn.hasCustomEmotes();
            this.sendMessage(net.MsgType.Loadout, me, 128);
        }
        for (let he = 0; he < this.emoteBarn.newPings.length; he++) {
            const de = this.emoteBarn.newPings[he];
            const ue = new net.EmoteMsg();
            ue.type = de.type;
            ue.pos = de.pos;
            ue.isPing = true;
            this.sendMessage(net.MsgType.Emote, ue, 128);
        }
        this.emoteBarn.newPings = [];
        for (let ge = 0; ge < this.emoteBarn.newEmotes.length; ge++) {
            const ye = this.emoteBarn.newEmotes[ge];
            const we = new net.EmoteMsg();
            we.type = ye.type;
            we.pos = ye.pos;
            we.isPing = false;
            this.sendMessage(net.MsgType.Emote, we, 128);
        }
        this.emoteBarn.newEmotes = [];
        this.render(dt, debug);
        if (++this.m_frame % 30 == 0) {
            const fe = mapHelpers.ct;
            for (let _e = 0; _e < smokeParticles.length; _e++) {
                const be = smokeParticles[_e];
                if (be.active && !be.fade && fe(be, mapHelpers.nt)) {
                    a++;
                }
            }
            for (let i = 0; i < obstacles.length; i++) {
                const Se = obstacles[i];
                if (Se.active && !Se.dead && fe(Se, mapHelpers.lt)) {
                    a++;
                }
            }
            if (a) {
                this.m_cheatDetected = true;
            }
            if (a && this.m_validateAlpha) {
                helpers.cheatDetected(this);
            }
        }
    }

    render(dt, debug) {
        const grassColor = this.map.mapLoaded
            ? this.map.getMapDef().biome.colors.grass
            : 8433481;
        this.pixi.renderer.background.color = grassColor;
        // Module rendering
        this.playerBarn.render(this.camera, debug);
        this.bulletBarn.render(this.camera, debug);
        this.flareBarn.render(this.camera);
        this.decalBarn.render(this.camera, debug, this.m_activePlayer.layer);
        this.map.render(this.camera);
        this.gas.render(this.camera);
        this.uiManager.render(
            this.m_activePlayer.pos,
            this.gas,
            this.camera,
            this.map,
            this.planeBarn,
            debug
        );
        this.emoteBarn.render(this.camera);
        debugLines.flush();
    }

    updateAmbience() {
        const e = this.m_activePlayer.pos;
        let t = 0;
        let r = 0;
        let a = 1;
        if (this.map.isInOcean(e)) {
            t = 1;
            r = 0;
            a = 0;
        } else {
            const i = this.map.distanceToShore(e);
            t = math.delerp(i, 50, 0);
            r = 0;
            for (
                let o = 0;
                o < this.map.terrain.rivers.length;
                o++
            ) {
                const s = this.map.terrain.rivers[o];
                const n = s.spline.getClosestTtoPoint(e);
                const l = s.spline.getPos(n);
                const c = v2.length(v2.sub(l, e));
                const p = s.waterWidth + 2;
                const d = math.delerp(c, 30 + p, p);
                const u = math.clamp(s.waterWidth / 8, 0.25, 1);
                r = math.max(d * u, r);
            }
            if (this.m_activePlayer.layer == 1) {
                r = 0;
            }
            a = 1;
        }
        this.ambience.getTrack("wind").weight = a;
        this.ambience.getTrack("river").weight = r;
        this.ambience.getTrack("waves").weight = t;
    }

    resize() {
        this.camera.screenWidth = device.screenWidth;
        this.camera.screenHeight = device.screenHeight;
        this.map.resize(this.pixi.renderer, this.canvasMode);
        this.gas.resize();
        this.uiManager.resize(this.map, this.camera);
        this.touch.resize();
        this.renderer.resize(this.map, this.camera);
    }

    processGameUpdate(msg) {
        const ctx = {
            audioManager: this.audioManager,
            renderer: this.renderer,
            particleBarn: this.particleBarn,
            map: this.map,
            smokeBarn: this.smokeBarn,
            decalBarn: this.decalBarn
        };
        // Update active playerId
        if (msg.activePlayerIdDirty) {
            this.m_activeId = msg.activePlayerId;
        }
        // Update player infos
        for (let i = 0; i < msg.playerInfos.length; i++) {
            this.playerBarn.setPlayerInfo(msg.playerInfos[i]);
        }
        // Delete player infos
        for (let i = 0; i < msg.deletedPlayerIds.length; i++) {
            const playerId = msg.deletedPlayerIds[i];
            this.playerBarn.deletePlayerInfo(playerId);
        }
        if (
            msg.playerInfos.length > 0 ||
            msg.deletedPlayerIds.length > 0
        ) {
            this.playerBarn.recomputeTeamData();
        }
        // Update player status
        if (msg.playerStatusDirty) {
            const teamId = this.playerBarn.qe(this.m_activeId).teamId;
            this.playerBarn.updatePlayerStatus(teamId, msg.playerStatus, this.map.factionMode);
        }

        // Update group status
        if (msg.groupStatusDirty) {
            const groupId = this.playerBarn.qe(this.m_activeId).groupId;
            this.playerBarn.updateGroupStatus(groupId, msg.groupStatus);
        }

        // Delete objects
        for (let i = 0; i < msg.delObjIds.length; i++) {
            this.objectCreator.deleteObj(msg.delObjIds[i]);
        }

        // Update full objects
        for (let i = 0; i < msg.fullObjects.length; i++) {
            const obj = msg.fullObjects[i];
            this.objectCreator.updateObjFull(obj.__type, obj.__id, obj, ctx);
        }

        // Update partial objects
        for (let i = 0; i < msg.partObjects.length; i++) {
            const obj = msg.partObjects[i];
            this.objectCreator.updateObjPart(obj.__id, obj, ctx);
        }
        this.spectating = this.m_activeId != this.m_localId;
        this.m_activePlayer = this.playerBarn.u(this.m_activeId);
        this.m_activePlayer.setLocalData(msg.activePlayerData, this.playerBarn);
        if (msg.activePlayerData.weapsDirty) {
            this.uiManager.weapsDirty = true;
        }
        if (this.spectating) {
            this.uiManager.setSpectateTarget(
                this.m_activeId,
                this.m_localId,
                this.teamMode,
                this.playerBarn
            );
            this.touch.hideAll();
        }
        this.m_activePlayer.layer = this.m_activePlayer.netData.pe;
        this.renderer.setActiveLayer(this.m_activePlayer.layer);
        this.audioManager.activeLayer = this.m_activePlayer.layer;
        const underground = this.m_activePlayer.isUnderground(this.map);
        this.renderer.setUnderground(underground);
        this.audioManager.underground = underground;

        // Gas data
        if (msg.gasDirty) {
            this.gas.setFullState(
                msg.gasT,
                msg.gasData,
                this.map,
                this.uiManager
            );
        }
        if (msg.gasTDirty) {
            this.gas.setProgress(msg.gasT);
        }

        // Create bullets
        for (let i = 0; i < msg.bullets.length; i++) {
            const b = msg.bullets[i];
            createBullet(b, this.bulletBarn, this.flareBarn, this.playerBarn, this.renderer);
            if (b.shotFx) {
                this.shotBarn.addShot(b);
            }
        }
        // Create explosions
        for (let i = 0; i < msg.explosions.length; i++) {
            const e = msg.explosions[i];
            this.explosionBarn.addExplosion(e.type, e.pos, e.layer);
        }

        // Create emotes and pings
        for (let i = 0; i < msg.emotes.length; i++) {
            const e = msg.emotes[i];
            if (e.isPing) {
                this.emoteBarn.addPing(e, this.map.factionMode);
            } else {
                this.emoteBarn.addEmote(e);
            }
        }

        // Update planes
        this.planeBarn.updatePlanes(msg.planes, this.map);

        // Create airstrike zones
        for (let x = 0; x < msg.airstrikeZones.length; x++) {
            this.planeBarn.createAirstrikeZone(msg.airstrikeZones[x]);
        }

        // Update map indicators
        this.uiManager.updateMapIndicators(msg.mapIndicators);

        // Update kill leader
        if (msg.killLeaderDirty) {
            const leaderNameText = helpers.htmlEscape(
                this.playerBarn.getPlayerName(msg.killLeaderId, this.m_activeId, true)
            );
            this.uiManager.updateKillLeader(
                msg.killLeaderId,
                leaderNameText,
                msg.killLeaderKills,
                this.map.getMapDef().gameMode
            );
        }

        // Latency determination
        this.updateRecvCount++;
        if (msg.ack == this.seq && this.seqInFlight) {
            this.seqInFlight = false;
        }
    }

    // Socket functions
    onMsg(type, stream) {
        switch (type) {
        case net.MsgType.Joined: {
            const msg = new net.JoinedMsg();
            msg.deserialize(stream);
            this.onJoin();
            this.teamMode = msg.teamMode;
            this.m_localId = msg.playerId;
            this.m_validateAlpha = true;
            this.emoteBarn.updateEmoteWheel(msg.emotes);
            if (!msg.started) {
                this.uiManager.setWaitingForPlayers(true);
            }
            if (this.victoryMusic) {
                this.victoryMusic.stop();
                this.victoryMusic = null;
            }

            // Play a sound if the user in another windows or tab
            if (!document.hasFocus()) {
                this.audioManager.playSound("notification_start_01", {
                    channel: "ui"
                });
            }

            // Update cheat detection
            if (helpers.detectCheatWindowVars() || helpers.detectCheatScripts()) {
                this.m_cheatDetected = true;
            }
            break;
        }
        case net.MsgType.Map: {
            const msg = new net.MapMsg();
            msg.deserialize(stream);
            this.map.loadMap(
                msg,
                this.camera,
                this.canvasMode,
                this.particleBarn
            );
            this.resourceManager.loadMapAssets(this.map.mapName);
            this.map.renderMap(
                this.pixi.renderer,
                this.canvasMode
            );
            this.playerBarn.onMapLoad(this.map);
            this.bulletBarn.onMapLoad(this.map);
            this.particleBarn.onMapLoad(this.map);
            this.uiManager.onMapLoad(this.map, this.camera);
            if (this.map.perkMode) {
                const i = this.config.get("perkModeRole");
                this.uiManager.setRoleMenuOptions(
                    i,
                    this.map.getMapDef().gameMode.perkModeRoles
                );
                this.uiManager.setRoleMenuActive(true);
            } else {
                this.uiManager.setRoleMenuActive(false);
            }
            break;
        }
        case net.MsgType.Update: {
            const msg = new net.UpdateMsg();
            msg.deserialize(stream, this.objectCreator);
            /* if (o.partObjects.length) {
                                console.log(o)
                            } */
            this.playing = true;
            this.processGameUpdate(msg);
            break;
        }
        case net.MsgType.Kill: {
            const msg = new net.KillMsg();
            msg.deserialize(stream);
            const sourceType = msg.itemSourceType || msg.mapSourceType;
            const activeTeamId = this.playerBarn.qe(this.m_activeId).teamId;
            const useKillerInfoInFeed =
                    (msg.downed && !msg.killed) ||
                    msg.damageType == GameConfig.DamageType.Gas ||
                    msg.damageType == GameConfig.DamageType.Bleeding ||
                    msg.damageType == GameConfig.DamageType.Airdrop;
            const targetInfo = this.playerBarn.qe(msg.targetId);
            const killerInfo = this.playerBarn.qe(msg.killCreditId);
            const killfeedKillerInfo = useKillerInfoInFeed ? killerInfo : this.playerBarn.qe(msg.killerId);
            let targetName = this.playerBarn.getPlayerName(
                targetInfo.playerId,
                this.m_activeId,
                true
            );
            let killerName = this.playerBarn.getPlayerName(
                killerInfo.playerId,
                this.m_activeId,
                true
            );
            let killfeedKillerName = this.playerBarn.getPlayerName(
                killfeedKillerInfo.playerId,
                this.m_activeId,
                true
            );
            targetName = helpers.htmlEscape(targetName);
            killerName = helpers.htmlEscape(killerName);
            killfeedKillerName = helpers.htmlEscape(killfeedKillerName);
            // Display the kill / downed notification for the active player
            if (msg.killCreditId == this.m_activeId) {
                const completeKill = msg.killerId == this.m_activeId;
                const suicide =
                        msg.killerId == msg.targetId ||
                        msg.killCreditId == msg.targetId;
                const killText = this.ui2Manager.getKillText(
                    killerName,
                    targetName,
                    completeKill,
                    msg.downed,
                    msg.killed,
                    suicide,
                    sourceType,
                    msg.damageType,
                    this.spectating
                );
                const killCountText =
                        msg.killed && !suicide
                            ? this.ui2Manager.getKillCountText(
                                msg.killerKills
                            )
                            : "";
                this.ui2Manager.displayKillMessage(killText, killCountText);
            } else if (
                msg.targetId == this.m_activeId &&
                    msg.downed &&
                    !msg.killed
            ) {
                const downedText = this.ui2Manager.getDownedText(
                    killerName,
                    targetName,
                    sourceType,
                    msg.damageType,
                    this.spectating
                );
                this.ui2Manager.displayKillMessage(downedText, "");
            }

            // Update local kill counter
            if (msg.killCreditId == this.m_localId && msg.killed) {
                this.uiManager.setLocalKills(msg.killerKills);
            }

            // Add killfeed entry for this kill
            const killText = this.ui2Manager.getKillFeedText(
                targetName,
                killfeedKillerInfo.teamId ? killfeedKillerName : "",
                sourceType,
                msg.damageType,
                msg.downed && !msg.killed
            );
            const killColor = this.ui2Manager.getKillFeedColor(
                activeTeamId,
                targetInfo.teamId,
                killerInfo.teamId,
                this.map.factionMode
            );
            this.ui2Manager.addKillFeedMessage(killText, killColor);
            if (msg.killed) {
                this.playerBarn.addDeathEffect(
                    msg.targetId,
                    msg.killerId,
                    sourceType,
                    this.audioManager,
                    this.particleBarn
                );
            }

            // Bullets often don't play hit sounds on the frame that a player dies
            if (msg.type == GameConfig.DamageType.Player) {
                this.bulletBarn.createBulletHit(
                    this.playerBarn,
                    msg.targetId,
                    this.audioManager
                );
            }
            break;
        }
        case net.MsgType.RoleAnnouncement: {
            const msg = new net.RoleAnnouncementMsg();
            msg.deserialize(stream);
            const roleDef = RoleDefs[msg.role];
            if (!roleDef) {
                break;
            }
            const playerInfo = this.playerBarn.qe(msg.playerId);
            const nameText = helpers.htmlEscape(
                this.playerBarn.getPlayerName(msg.playerId, this.m_activeId, true)
            );
            if (msg.assigned) {
                if (roleDef.sound?.assign) {
                    if (
                        msg.role == "kill_leader" &&
                            this.map.getMapDef().gameMode
                                .spookyKillSounds
                    ) {
                        // Halloween map has special logic for the kill leader sounds
                        this.audioManager.playGroup(
                            "kill_leader_assigned",
                            {
                                channel: "ui"
                            }
                        );
                    } else if (
                    // The intent here is to not play the role-specific assignment sounds in perkMode unless you're the player selecting a role.
                        msg.role == "kill_leader" ||
                            !this.map.perkMode ||
                            this.m_localId == msg.playerId
                    ) {
                        this.audioManager.playSound(roleDef.sound.assign, {
                            channel: "ui"
                        });
                    }
                }
                if (this.map.perkMode && this.m_localId == msg.playerId) {
                    this.uiManager.setRoleMenuActive(false);
                }
                if (roleDef.killFeed?.assign) {
                    // In addition to playing a sound, display a notification on the killfeed
                    const killText =
                            this.ui2Manager.getRoleAssignedKillFeedText(
                                msg.role,
                                playerInfo.teamId,
                                nameText
                            );
                    const killColor = this.ui2Manager.getRoleKillFeedColor(
                        msg.role,
                        playerInfo.teamId,
                        this.playerBarn
                    );
                    this.ui2Manager.addKillFeedMessage(killText, killColor);
                }
                // Show an announcement if you've been assigned a role
                if (roleDef.announce && this.m_localId == msg.playerId) {
                    const assignText = this.ui2Manager.getRoleAnnouncementText(
                        msg.role,
                        playerInfo.teamId
                    );
                    this.uiManager.displayAnnouncement(
                        assignText.toUpperCase()
                    );
                }
            } else if (msg.killed) {
                if (roleDef.killFeed?.dead) {
                    let killerName = helpers.htmlEscape(
                        this.playerBarn.getPlayerName(
                            msg.killerId,
                            this.m_activeId,
                            true
                        )
                    );

                    if (msg.playerId == msg.killerId) {
                        killerName = "";
                    }
                    const killText = this.ui2Manager.getRoleKilledKillFeedText(
                        msg.role,
                        playerInfo.teamId,
                        killerName
                    );
                    const killColor = this.ui2Manager.getRoleKillFeedColor(
                        msg.role,
                        playerInfo.teamId,
                        this.playerBarn
                    );
                    this.ui2Manager.addKillFeedMessage(killText, killColor);
                }
                if (roleDef.sound?.dead) {
                    if (
                        this.map.getMapDef().gameMode
                            .spookyKillSounds
                    ) {
                        this.audioManager.playGroup("kill_leader_dead", {
                            channel: "ui"
                        });
                    } else {
                        this.audioManager.playSound(roleDef.sound.dead, {
                            channel: "ui"
                        });
                    }
                }
            }
            break;
        }
        case net.MsgType.PlayerStats: {
            const msg = new net.PlayerStatsMsg();
            msg.deserialize(stream);
            this.uiManager.setLocalStats(msg.playerStats);
            this.uiManager.showTeamAd(msg.playerStats, this.ui2Manager);
            break;
        }
        case net.MsgType.Stats: {
            const msg = new net.StatsMsg();
            msg.deserialize(stream);
            helpers.J(msg.data, this);
            break;
        }
        case net.MsgType.GameOver: {
            const msg = new net.GameOverMsg();
            msg.deserialize(stream);
            this.gameOver = msg.gameOver;
            const localTeamId = this.playerBarn.qe(this.m_localId).teamId;

            // Set local stats based on final results.
            // This is necessary because the last person on a team to die
            // will not receive a PlayerStats message, they will only receive
            // the GameOver message.
            for (let j = 0; j < msg.playerStats.length; j++) {
                const stats = msg.playerStats[j];
                if (stats.playerId == this.m_localId) {
                    this.uiManager.setLocalStats(stats);
                    break;
                }
            }
            this.uiManager.showStats(
                msg.playerStats,
                msg.teamId,
                msg.teamRank,
                msg.winningTeamId,
                msg.gameOver,
                localTeamId,
                this.teamMode,
                this.spectating,
                this.playerBarn,
                this.audioManager,
                this.map,
                this.ui2Manager
            );
            if (localTeamId == msg.winningTeamId) {
                this.victoryMusic = this.audioManager.playSound(
                    "menu_music",
                    {
                        channel: "music",
                        delay: 1300,
                        forceStart: true
                    }
                );
            }
            this.touch.hideAll();
            break;
        }
        case net.MsgType.Pickup: {
            const msg = new net.PickupMsg();
            msg.deserialize(stream);
            if (msg.type == net.PickupMsgType.Success && msg.item) {
                this.m_activePlayer.playItemPickupSound(msg.item, this.audioManager);
                const itemDef = GameObjectDefs[msg.item];
                if (itemDef && itemDef.type == "xp") {
                    this.ui2Manager.addRareLootMessage(msg.item, true);
                }
            } else {
                this.ui2Manager.displayPickupMessage(msg.type);
            }
            break;
        }
        case net.MsgType.UpdatePass: {
            new net.UpdatePassMsg().deserialize(stream);
            this.updatePass = true;
            this.updatePassDelay = 0;
            break;
        }
        case net.MsgType.AliveCounts: {
            const msg = new net.AliveCountsMsg();
            msg.deserialize(stream);
            if (msg.teamAliveCounts.length == 1) {
                this.uiManager.updatePlayersAlive(
                    msg.teamAliveCounts[0]
                );
            } else if (msg.teamAliveCounts.length >= 2) {
                this.uiManager.updatePlayersAliveRed(
                    msg.teamAliveCounts[0]
                );
                this.uiManager.updatePlayersAliveBlue(
                    msg.teamAliveCounts[1]
                );
            }
            break;
        }
        case net.MsgType.Disconnect: {
            const msg = new net.DisconnectMsg();
            msg.deserialize(stream);
            this.disconnectMsg = msg.reason;
        }
        }
    }

    sendMessage(type, data, maxLen) {
        const bufSz = maxLen || 128;
        const msgStream = new net.MsgStream(new ArrayBuffer(bufSz));
        msgStream.serializeMsg(type, data);
        this.sendMessageImpl(msgStream);
    }

    sendMessageImpl(msgStream) {
        // Separate function call so m_sendMessage can be optimized;
        // v8 won't optimize functions containing a try/catch
        if (this.ws && this.ws.readyState == this.ws.OPEN) {
            try {
                this.ws.send(msgStream.getBuffer());
            } catch (e) {
                console.error("sendMessageException", e);
                this.ws.close();
            }
        }
    }
}
