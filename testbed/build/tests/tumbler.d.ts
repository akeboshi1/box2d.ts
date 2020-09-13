import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class Tumbler extends testbed.Test {
    static readonly e_count = 800;
    m_joint: b2.RevoluteJoint;
    m_count: number;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=tumbler.d.ts.map