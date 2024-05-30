import { AbstractMsg, type BitStream } from "../net";

export class JoinedMsg extends AbstractMsg {
    teamMode = 0;
    playerId = 0;
    started = false;
    emotes: string[] = [];

    override serialize(s: BitStream) {
        s.writeUint8(this.teamMode);
        s.writeUint16(this.playerId);
        s.writeBoolean(this.started);
        s.writeUint8(this.emotes.length);
        for (let i = 0; i < this.emotes.length; i++) {
            s.writeGameType(this.emotes[i]);
        }
        s.writeAlignToNextByte();
    }

    override deserialize(s: BitStream) {
        this.teamMode = s.readUint8();
        this.playerId = s.readUint16();
        this.started = s.readBoolean();
        const count = s.readUint8();
        for (let i = 0; i < count; i++) {
            const emote = s.readGameType();
            this.emotes.push(emote);
        }
        s.readAlignToNextByte();
    }
}
