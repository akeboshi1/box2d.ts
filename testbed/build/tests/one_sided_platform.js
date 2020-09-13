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
    var b2, testbed, OneSidedPlatform, OneSidedPlatform_State;
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
            OneSidedPlatform = class OneSidedPlatform extends testbed.Test {
                constructor() {
                    super();
                    this.m_radius = 0.0;
                    this.m_top = 0.0;
                    this.m_bottom = 0.0;
                    this.m_state = OneSidedPlatform_State.e_unknown;
                    // Ground
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Platform
                    {
                        const bd = new b2.BodyDef();
                        bd.position.Set(0.0, 10.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(3.0, 0.5);
                        this.m_platform = body.CreateFixture(shape, 0.0);
                        this.m_bottom = 10.0 - 0.5;
                        this.m_top = 10.0 + 0.5;
                    }
                    // Actor
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 12.0);
                        const body = this.m_world.CreateBody(bd);
                        this.m_radius = 0.5;
                        const shape = new b2.CircleShape();
                        shape.m_radius = this.m_radius;
                        this.m_character = body.CreateFixture(shape, 20.0);
                        body.SetLinearVelocity(new b2.Vec2(0.0, -50.0));
                        this.m_state = OneSidedPlatform_State.e_unknown;
                    }
                }
                PreSolve(contact, oldManifold) {
                    super.PreSolve(contact, oldManifold);
                    const fixtureA = contact.GetFixtureA();
                    const fixtureB = contact.GetFixtureB();
                    if (fixtureA !== this.m_platform && fixtureA !== this.m_character) {
                        return;
                    }
                    if (fixtureB !== this.m_platform && fixtureB !== this.m_character) {
                        return;
                    }
                    const position = this.m_character.GetBody().GetPosition();
                    if (position.y < this.m_top + this.m_radius - 3.0 * b2.linearSlop) {
                        contact.SetEnabled(false);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new OneSidedPlatform();
                }
            };
            exports_1("OneSidedPlatform", OneSidedPlatform);
            (function (OneSidedPlatform_State) {
                OneSidedPlatform_State[OneSidedPlatform_State["e_unknown"] = 0] = "e_unknown";
                OneSidedPlatform_State[OneSidedPlatform_State["e_above"] = 1] = "e_above";
                OneSidedPlatform_State[OneSidedPlatform_State["e_below"] = 2] = "e_below";
            })(OneSidedPlatform_State || (OneSidedPlatform_State = {}));
            exports_1("OneSidedPlatform_State", OneSidedPlatform_State);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25lX3NpZGVkX3BsYXRmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvb25lX3NpZGVkX3BsYXRmb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixtQkFBQSxNQUFhLGdCQUFpQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQVFoRDtvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFSSCxhQUFRLEdBQUcsR0FBRyxDQUFDO29CQUNmLFVBQUssR0FBRyxHQUFHLENBQUM7b0JBQ1osYUFBUSxHQUFHLEdBQUcsQ0FBQztvQkFDZixZQUFPLEdBQUcsc0JBQXNCLENBQUMsU0FBUyxDQUFDO29CQU9oRCxTQUFTO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUM1QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDbkUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ2xDO29CQUVELFdBQVc7b0JBQ1g7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQzVCLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxD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