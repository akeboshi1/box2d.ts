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
    var b2, testbed, CollisionProcessing;
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
            CollisionProcessing = class CollisionProcessing extends testbed.Test {
                constructor() {
                    super();
                    // Ground body
                    {
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        const sd = new b2.FixtureDef();
                        sd.shape = shape;
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        ground.CreateFixture(sd);
                    }
                    const xLo = -5.0, xHi = 5.0;
                    const yLo = 2.0, yHi = 35.0;
                    // Small triangle
                    const vertices = new Array(3);
                    vertices[0] = new b2.Vec2(-1.0, 0.0);
                    vertices[1] = new b2.Vec2(1.0, 0.0);
                    vertices[2] = new b2.Vec2(0.0, 2.0);
                    const polygon = new b2.PolygonShape();
                    polygon.Set(vertices, 3);
                    const triangleShapeDef = new b2.FixtureDef();
                    triangleShapeDef.shape = polygon;
                    triangleShapeDef.density = 1.0;
                    const triangleBodyDef = new b2.BodyDef();
                    triangleBodyDef.type = b2.BodyType.b2_dynamicBody;
                    triangleBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body1 = this.m_world.CreateBody(triangleBodyDef);
                    body1.CreateFixture(triangleShapeDef);
                    // Large triangle (recycle definitions)
                    vertices[0].SelfMul(2.0);
                    vertices[1].SelfMul(2.0);
                    vertices[2].SelfMul(2.0);
                    polygon.Set(vertices, 3);
                    triangleBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body2 = this.m_world.CreateBody(triangleBodyDef);
                    body2.CreateFixture(triangleShapeDef);
                    // Small box
                    polygon.SetAsBox(1.0, 0.5);
                    const boxShapeDef = new b2.FixtureDef();
                    boxShapeDef.shape = polygon;
                    boxShapeDef.density = 1.0;
                    const boxBodyDef = new b2.BodyDef();
                    boxBodyDef.type = b2.BodyType.b2_dynamicBody;
                    boxBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body3 = this.m_world.CreateBody(boxBodyDef);
                    body3.CreateFixture(boxShapeDef);
                    // Large box (recycle definitions)
                    polygon.SetAsBox(2.0, 1.0);
                    boxBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body4 = this.m_world.CreateBody(boxBodyDef);
                    body4.CreateFixture(boxShapeDef);
                    // Small circle
                    const circle = new b2.CircleShape();
                    circle.m_radius = 1.0;
                    const circleShapeDef = new b2.FixtureDef();
                    circleShapeDef.shape = circle;
                    circleShapeDef.density = 1.0;
                    const circleBodyDef = new b2.BodyDef();
                    circleBodyDef.type = b2.BodyType.b2_dynamicBody;
                    circleBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body5 = this.m_world.CreateBody(circleBodyDef);
                    body5.CreateFixture(circleShapeDef);
                    // Large circle
                    circle.m_radius *= 2.0;
                    circleBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body6 = this.m_world.CreateBody(circleBodyDef);
                    body6.CreateFixture(circleShapeDef);
                }
                Step(settings) {
                    super.Step(settings);
                    // We are going to destroy some bodies according to contact
                    // points. We must buffer the bodies that should be destroyed
                    // because they may belong to multiple contact points.
                    const k_maxNuke = 6;
                    const nuke = new Array(k_maxNuke);
                    let nukeCount = 0;
                    // Traverse the contact results. Destroy bodies that
                    // are touching heavier bodies.
                    for (let i = 0; i < this.m_pointCount; ++i) {
                        const point = this.m_points[i];
                        const body1 = point.fixtureA.GetBody();
                        const body2 = point.fixtureB.GetBody();
                        const mass1 = body1.GetMass();
                        const mass2 = body2.GetMass();
                        if (mass1 > 0.0 && mass2 > 0.0) {
                            if (mass2 > mass1) {
                                nuke[nukeCount++] = body1;
                            }
                            else {
                                nuke[nukeCount++] = body2;
                            }
                            if (nukeCount === k_maxNuke) {
                                break;
                            }
                        }
                    }
                    // Sort the nuke array to group duplicates.
                    nuke.sort((a, b) => {
                        return a - b;
                    });
                    // Destroy the bodies, skipping duplicates.
                    let i = 0;
                    while (i < nukeCount) {
                        const b = nuke[i++];
                        while (i < nukeCount && nuke[i] === b) {
                            ++i;
                        }
                        if (b !== this.m_bomb) {
                            this.m_world.DestroyBody(b);
                        }
                    }
                }
                static Create() {
                    return new CollisionProcessing();
                }
            };
            exports_1("CollisionProcessing", CollisionProcessing);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGlzaW9uX3Byb2Nlc3NpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9jb2xsaXNpb25fcHJvY2Vzc2luZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0Ysc0JBQUEsTUFBYSxtQkFBb0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDbkQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsY0FBYztvQkFDZDt3QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUVuRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDL0IsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBRWpCLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUM1QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDM0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDMUI7b0JBRUQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQ2QsR0FBRyxHQUFHLEdBQUcsQ0FBQztvQkFDWixNQUFNLEdBQUcsR0FBRyxHQUFHLEVBQ2IsR0FBRyxHQUFHLElBQUksQ0FBQztvQkFFYixpQkFBaUI7b0JBQ2pCLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNyQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDcEMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRXBDLE1BQU0sT0FBTyxHQUFHLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFekIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDN0MsZ0JBQWdCLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztvQkFDakMsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztvQkFFL0IsTUFBTSxlQUFlLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3pDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7b0JBQ2xELGVBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBRWpGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUN2RCxLQUFLLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBRXRDLHVDQUF1QztvQkFDdkMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRXpCLGVBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBRWpGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUN2RCxLQUFLLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBRXRDLFlBQVk7b0JBQ1osT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRTNCLE1BQU0sV0FBVyxHQUFHLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUN4QyxXQUFXLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztvQkFDNUIsV0FBVyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7b0JBRTFCLE1BQU0sVUFBVSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNwQyxVQUFVLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO29CQUM3QyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUU1RSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbEQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFFakMsa0NBQWtDO29CQUNsQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDM0IsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFFNUUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ2xELEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBRWpDLGVBQWU7b0JBQ2YsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ3BDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO29CQUV0QixNQUFNLGNBQWMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDM0MsY0FBYyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7b0JBQzlCLGNBQWMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO29CQUU3QixNQUFNLGFBQWEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDdkMsYUFBYSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztvQkFDaEQsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFFL0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3JELEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBRXBDLGVBQWU7b0JBQ2YsTUFBTSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUM7b0JBQ3ZCLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBRS9FLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNyRCxLQUFLLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUV0QyxDQUFDO2dCQUVNLElBQUksQ0FBQyxRQUEwQjtvQkFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFckIsMkRBQTJEO29CQUMzRCw2REFBNkQ7b0JBQzdELHNEQUFzRDtvQkFDdEQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDO29CQUNwQixNQUFNLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDbEMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO29CQUVsQixvREFBb0Q7b0JBQ3BELCtCQUErQjtvQkFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQzFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRS9CLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ3ZDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ3ZDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDOUIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUU5QixJQUFJLEtBQUssR0FBRyxHQUFHLElBQUksS0FBSyxHQUFHLEdBQUcsRUFBRTs0QkFDOUIsSUFBSSxLQUFLLEdBQUcsS0FBSyxFQUFFO2dDQUNqQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7NkJBQzNCO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQzs2QkFDM0I7NEJBRUQsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO2dDQUMzQixNQUFNOzZCQUNQO3lCQUNGO3FCQUNGO29CQUVELDJDQUEyQztvQkFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNmLENBQUMsQ0FBQyxDQUFDO29CQUVILDJDQUEyQztvQkFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNWLE9BQU8sQ0FBQyxHQUFHLFNBQVMsRUFBRTt3QkFDcEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ3BCLE9BQU8sQ0FBQyxHQUFHLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFOzRCQUNyQyxFQUFFLENBQUMsQ0FBQzt5QkFDTDt3QkFFRCxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFOzRCQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDN0I7cUJBQ0Y7Z0JBQ0gsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTTtvQkFDbEIsT0FBTyxJQUFJLG1CQUFtQixFQUFFLENBQUM7Z0JBQ25DLENBQUM7YUFDRixDQUFBIn0=