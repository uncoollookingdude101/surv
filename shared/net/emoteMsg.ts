import { v2 } from "../utils/v2";
import type { AbstractMsg, BitStream } from "./net";

export class EmoteMsg implements AbstractMsg {
    pos = v2.create(0, 0);
    type = "";
    isPing = false;

    serialize(s: BitStream) {
        /* STRIP_FROM_PROD_CLIENT:START */
        s.writeVec(this.pos, 0, 0, 1024, 1024, 16);
        s.writeGameType(this.type);
        s.writeBoolean(this.isPing);
        /* STRIP_FROM_PROD_CLIENT:END */
    }

    deserialize(s: BitStream) {
        this.pos = s.readVec(0, 0, 1024, 1024, 16);
        this.type = s.readGameType();
        this.isPing = s.readBoolean();
    }
}
