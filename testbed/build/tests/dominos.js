/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Dominos;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            Dominos = class Dominos extends testbed.Test {
                constructor() {
                    super();
                    let b1 = null;
                    {
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        const bd = new b2.BodyDef();
                        b1 = this.m_world.CreateBody(bd);
                        b1.CreateFixture(shape, 0.0);
                    }
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(6.0, 0.25);
                        const bd = new b2.BodyDef();
                        bd.position.Set(-1.5, 10.0);
                        const ground = this.m_world.CreateBody(bd);
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.1, 1.0);
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 20.0;
                        fd.friction = 0.1;
                        for (let i = 0; i < 10; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(-6.0 + 1.0 * i, 11.25);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(fd);
                        }
                    }
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(7.0, 0.25, b2.Vec2_zero, 0.3);
                        const bd = new b2.BodyDef();
                        bd.position.Set(1.0, 6.0);
                        const ground = this.m_world.CreateBody(bd);
                        ground.CreateFixture(shape, 0.0);
                    }
                    let _b2 = null;
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.25, 1.5);
                        const bd = new b2.BodyDef();
                        bd.position.Set(-7.0, 4.0);
                        _b2 = this.m_world.CreateBody(bd);
                        _b2.CreateFixture(shape, 0.0);
                    }
                    let b3 = null;
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(6.0, 0.125);
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(-0.9, 1.0);
                        bd.angle = -0.15;
                        b3 = this.m_world.CreateBody(bd);
                        b3.CreateFixture(shape, 10.0);
                    }
                    const jd = new b2.RevoluteJointDef();
                    const anchor = new b2.Vec2();
                    anchor.Set(-2.0, 1.0);
                    jd.Initialize(b1, b3, anchor);
                    jd.collideConnected = true;
                    this.m_world.CreateJoint(jd);
                    let b4 = null;
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.25, 0.25);
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(-10.0, 15.0);
                        b4 = this.m_world.CreateBody(bd);
                        b4.CreateFixture(shape, 10.0);
                    }
                    anchor.Set(-7.0, 15.0);
                    jd.Initialize(_b2, b4, anchor);
                    this.m_world.CreateJoint(jd);
                    let b5 = null;
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(6.5, 3.0);
                        b5 = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 10.0;
                        fd.friction = 0.1;
                        shape.SetAsBox(1.0, 0.1, new b2.Vec2(0.0, -0.9), 0.0);
                        b5.CreateFixture(fd);
                        shape.SetAsBox(0.1, 1.0, new b2.Vec2(-0.9, 0.0), 0.0);
                        b5.CreateFixture(fd);
                        shape.SetAsBox(0.1, 1.0, new b2.Vec2(0.9, 0.0), 0.0);
                        b5.CreateFixture(fd);
                    }
                    anchor.Set(6.0, 2.0);
                    jd.Initialize(b1, b5, anchor);
                    this.m_world.CreateJoint(jd);
                    let b6 = null;
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(1.0, 0.1);
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(6.5, 4.1);
                        b6 = this.m_world.CreateBody(bd);
                        b6.CreateFixture(shape, 30.0);
                    }
                    anchor.Set(7.5, 4.0);
                    jd.Initialize(b5, b6, anchor);
                    this.m_world.CreateJoint(jd);
                    let b7 = null;
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.1, 1.0);
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(7.4, 1.0);
                        b7 = this.m_world.CreateBody(bd);
                        b7.CreateFixture(shape, 10.0);
                    }
                    const djd = new b2.DistanceJointDef();
                    djd.bodyA = b3;
                    djd.bodyB = b7;
                    djd.localAnchorA.Set(6.0, 0.0);
                    djd.localAnchorB.Set(0.0, -1.0);
                    const d = b2.Vec2.SubVV(djd.bodyB.GetWorldPoint(djd.localAnchorB, new b2.Vec2()), djd.bodyA.GetWorldPoint(djd.localAnchorA, new b2.Vec2()), new b2.Vec2());
                    djd.length = d.Length();
                    this.m_world.CreateJoint(djd);
                    {
                        const radius = 0.2;
                        const shape = new b2.CircleShape();
                        shape.m_radius = radius;
                        for (let i = 0; i < 4; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(5.9 + 2.0 * radius * i, 2.4);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 10.0);
                        }
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new Dominos();
                }
            };
            exports_1("Dominos", Dominos);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9taW5vcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL2RvbWlub3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLFVBQUEsTUFBYSxPQUFRLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQ3ZDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDZDt3QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUVuRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDNUIsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNqQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDOUI7b0JBRUQ7d0JBQ0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUUxQixNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDNUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQzVCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUs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