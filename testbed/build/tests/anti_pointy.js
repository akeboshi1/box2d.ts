/*
 * Copyright (c) 2014 Google, Inc.
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
    var b2, testbed, AntiPointy;
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
            /**
             * Test the behavior of particles falling onto a concave
             * ambiguous Body contact fixture junction.
             */
            AntiPointy = class AntiPointy extends testbed.Test {
                constructor() {
                    super();
                    this.m_particlesToCreate = 300;
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        // Construct a valley out of many polygons to ensure there's no
                        // issue with particles falling directly on an ambiguous set of
                        // fixture corners.
                        const step = 1.0;
                        for (let i = -10.0; i < 10.0; i += step) {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(i, -10.0),
                                new b2.Vec2(i + step, -10.0),
                                new b2.Vec2(0.0, 15.0),
                            ];
                            shape.Set(vertices, 3);
                            ground.CreateFixture(shape, 0.0);
                        }
                        for (let i = -10.0; i < 35.0; i += step) {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(-10.0, i),
                                new b2.Vec2(-10.0, i + step),
                                new b2.Vec2(0.0, 15.0),
                            ];
                            shape.Set(vertices, 3);
                            ground.CreateFixture(shape, 0.0);
                            const vertices2 = [
                                new b2.Vec2(10.0, i),
                                new b2.Vec2(10.0, i + step),
                                new b2.Vec2(0.0, 15.0),
                            ];
                            shape.Set(vertices2, 3);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    // Cap the number of generated particles or we'll fill forever
                    this.m_particlesToCreate = 300;
                    this.m_particleSystem.SetRadius(0.25 * 2); // HACK: increase particle radius
                    const particleType = testbed.Test.GetParticleParameterValue();
                    if (particleType === b2.ParticleFlag.b2_waterParticle) {
                        this.m_particleSystem.SetDamping(0.2);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    if (this.m_particlesToCreate <= 0) {
                        return;
                    }
                    --this.m_particlesToCreate;
                    const flags = testbed.Test.GetParticleParameterValue();
                    const pd = new b2.ParticleDef();
                    pd.position.Set(0.0, 40.0);
                    pd.velocity.Set(0.0, -1.0);
                    pd.flags = flags;
                    if (flags & (b2.ParticleFlag.b2_springParticle | b2.ParticleFlag.b2_elasticParticle)) {
                        const count = this.m_particleSystem.GetParticleCount();
                        pd.velocity.Set(count & 1 ? -1.0 : 1.0, -5.0);
                        pd.flags |= b2.ParticleFlag.b2_reactiveParticle;
                    }
                    this.m_particleSystem.CreateParticle(pd);
                }
                static Create() {
                    return new AntiPointy();
                }
            };
            exports_1("AntiPointy", AntiPointy);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW50aV9wb2ludHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9hbnRpX3BvaW50eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0g7OztlQUdHO1lBRUgsYUFBQSxNQUFhLFVBQVcsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFHMUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSEgsd0JBQW1CLEdBQUcsR0FBRyxDQUFDO29CQUsvQjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDNUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDLCtEQUErRDt3QkFDL0QsK0RBQStEO3dCQUMvRCxtQkFBbUI7d0JBRW5CLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQzt3QkFFakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxJQUFJLEVBQUU7NEJBQ3ZDLE1BQU0sS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDOzRCQUNwQyxNQUFNLFFBQVEsR0FBRztnQ0FDZixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2dDQUNyQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQztnQ0FDNUIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7NkJBQ3ZCLENBQUM7NEJBQ0YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcs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