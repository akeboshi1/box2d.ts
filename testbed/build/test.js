System.register(["@box2d", "./draw.js", "./fullscreen_ui.js", "./particle_parameter.js"], function (exports_1, context_1) {
    "use strict";
    var b2, draw_js_1, fullscreen_ui_js_1, particle_parameter_js_1, DRAW_STRING_NEW_LINE, TestEntry, DestructionListener, ContactPoint, QueryCallback2, Test;
    var __moduleName = context_1 && context_1.id;
    function RandomFloat(lo = -1, hi = 1) {
        let r = Math.random();
        r = (hi - lo) * r + lo;
        return r;
    }
    exports_1("RandomFloat", RandomFloat);
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (draw_js_1_1) {
                draw_js_1 = draw_js_1_1;
            },
            function (fullscreen_ui_js_1_1) {
                fullscreen_ui_js_1 = fullscreen_ui_js_1_1;
            },
            function (particle_parameter_js_1_1) {
                particle_parameter_js_1 = particle_parameter_js_1_1;
            }
        ],
        execute: function () {
            // #endif
            exports_1("DRAW_STRING_NEW_LINE", DRAW_STRING_NEW_LINE = 16);
            TestEntry = class TestEntry {
                constructor(name, createFcn) {
                    this.name = "unknown";
                    this.name = name;
                    this.createFcn = createFcn;
                }
            };
            exports_1("TestEntry", TestEntry);
            DestructionListener = class DestructionListener extends b2.DestructionListener {
                constructor(test) {
                    super();
                    this.test = test;
                }
                SayGoodbyeJoint(joint) {
                    if (this.test.m_mouseJoint === joint) {
                        this.test.m_mouseJoint = null;
                    }
                    else {
                        this.test.JointDestroyed(joint);
                    }
                }
                SayGoodbyeFixture(fixture) { }
                // #if B2_ENABLE_PARTICLE
                SayGoodbyeParticleGroup(group) {
                    this.test.ParticleGroupDestroyed(group);
                }
            };
            exports_1("DestructionListener", DestructionListener);
            ContactPoint = class ContactPoint {
                constructor() {
                    this.normal = new b2.Vec2();
                    this.position = new b2.Vec2();
                    this.state = b2.PointState.b2_nullState;
                    this.normalImpulse = 0;
                    this.tangentImpulse = 0;
                    this.separation = 0;
                }
            };
            exports_1("ContactPoint", ContactPoint);
            // #if B2_ENABLE_PARTICLE
            QueryCallback2 = class QueryCallback2 extends b2.QueryCallback {
                constructor(particleSystem, shape, velocity) {
                    super();
                    this.m_particleSystem = particleSystem;
                    this.m_shape = shape;
                    this.m_velocity = velocity;
                }
                ReportFixture(fixture) {
                    return false;
                }
                ReportParticle(particleSystem, index) {
                    if (particleSystem !== this.m_particleSystem) {
                        return false;
                    }
                    const xf = b2.Transform.IDENTITY;
                    const p = this.m_particleSystem.GetPositionBuffer()[index];
                    if (this.m_shape.TestPoint(xf, p)) {
                        const v = this.m_particleSystem.GetVelocityBuffer()[index];
                        v.Copy(this.m_velocity);
                    }
                    return true;
                }
            };
            // #endif
            Test = class Test extends b2.ContactListener {
                // #endif
                constructor() {
                    super();
                    // #endif
                    this.m_bomb = null;
                    this.m_textLine = 30;
                    this.m_mouseJoint = null;
                    this.m_points = b2.MakeArray(Test.k_maxContactPoints, (i) => new ContactPoint());
                    this.m_pointCount = 0;
                    this.m_bombSpawnPoint = new b2.Vec2();
                    this.m_bombSpawning = false;
                    this.m_mouseWorld = new b2.Vec2();
                    // #if B2_ENABLE_PARTICLE
                    this.m_mouseTracing = false;
                    this.m_mouseTracerPosition = new b2.Vec2();
                    this.m_mouseTracerVelocity = new b2.Vec2();
                    // #endif
                    this.m_stepCount = 0;
                    this.m_maxProfile = new b2.Profile();
                    this.m_totalProfile = new b2.Profile();
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleParameters = null;
                    this.m_particleParameterDef = null;
                    // #if B2_ENABLE_PARTICLE
                    const particleSystemDef = new b2.ParticleSystemDef();
                    // #endif
                    const gravity = new b2.Vec2(0, -10);
                    this.m_world = new b2.World(gravity);
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystem = this.m_world.CreateParticleSystem(particleSystemDef);
                    // #endif
                    this.m_bomb = null;
                    this.m_textLine = 30;
                    this.m_mouseJoint = null;
                    this.m_destructionListener = new DestructionListener(this);
                    this.m_world.SetDestructionListener(this.m_destructionListener);
                    this.m_world.SetContactListener(this);
                    this.m_world.SetDebugDraw(draw_js_1.g_debugDraw);
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystem.SetGravityScale(0.4);
                    this.m_particleSystem.SetDensity(1.2);
                    // #endif
                    const bodyDef = new b2.BodyDef();
                    this.m_groundBody = this.m_world.CreateBody(bodyDef);
                }
                JointDestroyed(joint) { }
                // #if B2_ENABLE_PARTICLE
                ParticleGroupDestroyed(group) { }
                // #endif
                BeginContact(contact) { }
                EndContact(contact) { }
                PreSolve(contact, oldManifold) {
                    const manifold = contact.GetManifold();
                    if (manifold.pointCount === 0) {
                        return;
                    }
                    const fixtureA = contact.GetFixtureA();
                    const fixtureB = contact.GetFixtureB();
                    const state1 = Test.PreSolve_s_state1;
                    const state2 = Test.PreSolve_s_state2;
                    b2.GetPointStates(state1, state2, oldManifold, manifold);
                    const worldManifold = Test.PreSolve_s_worldManifold;
                    contact.GetWorldManifold(worldManifold);
                    for (let i = 0; i < manifold.pointCount && this.m_pointCount < Test.k_maxContactPoints; ++i) {
                        const cp = this.m_points[this.m_pointCount];
                        cp.fixtureA = fixtureA;
                        cp.fixtureB = fixtureB;
                        cp.position.Copy(worldManifold.points[i]);
                        cp.normal.Copy(worldManifold.normal);
                        cp.state = state2[i];
                        cp.normalImpulse = manifold.points[i].normalImpulse;
                        cp.tangentImpulse = manifold.points[i].tangentImpulse;
                        cp.separation = worldManifold.separations[i];
                        ++this.m_pointCount;
                    }
                }
                PostSolve(contact, impulse) { }
                Keyboard(key) { }
                KeyboardUp(key) { }
                SetTextLine(line) {
                    this.m_textLine = line;
                }
                DrawTitle(title) {
                    draw_js_1.g_debugDraw.DrawString(5, DRAW_STRING_NEW_LINE, title);
                    this.m_textLine = 3 * DRAW_STRING_NEW_LINE;
                }
                MouseDown(p) {
                    this.m_mouseWorld.Copy(p);
                    // #if B2_ENABLE_PARTICLE
                    this.m_mouseTracing = true;
                    this.m_mouseTracerPosition.Copy(p);
                    this.m_mouseTracerVelocity.SetZero();
                    // #endif
                    if (this.m_mouseJoint !== null) {
                        this.m_world.DestroyJoint(this.m_mouseJoint);
                        this.m_mouseJoint = null;
                    }
                    let hit_fixture = null; // HACK: tsc doesn't detect calling callbacks
                    // Query the world for overlapping shapes.
                    this.m_world.QueryPointAABB(p, (fixture) => {
                        const body = fixture.GetBody();
                        if (body.GetType() === b2.BodyType.b2_dynamicBody) {
                            const inside = fixture.TestPoint(p);
                            if (inside) {
                                hit_fixture = fixture;
                                return false; // We are done, terminate the query.
                            }
                        }
                        return true; // Continue the query.
                    });
                    if (hit_fixture) {
                        const body = hit_fixture.GetBody();
                        const md = new b2.MouseJointDef();
                        md.bodyA = this.m_groundBody;
                        md.bodyB = body;
                        md.target.Copy(p);
                        md.maxForce = 1000 * body.GetMass();
                        this.m_mouseJoint = this.m_world.CreateJoint(md);
                        body.SetAwake(true);
                    }
                }
                SpawnBomb(worldPt) {
                    this.m_bombSpawnPoint.Copy(worldPt);
                    this.m_bombSpawning = true;
                }
                CompleteBombSpawn(p) {
                    if (!this.m_bombSpawning) {
                        return;
                    }
                    const multiplier = 30;
                    const vel = b2.Vec2.SubVV(this.m_bombSpawnPoint, p, new b2.Vec2());
                    vel.SelfMul(multiplier);
                    this.LaunchBombAt(this.m_bombSpawnPoint, vel);
                    this.m_bombSpawning = false;
                }
                ShiftMouseDown(p) {
                    this.m_mouseWorld.Copy(p);
                    if (this.m_mouseJoint !== null) {
                        return;
                    }
                    this.SpawnBomb(p);
                }
                MouseUp(p) {
                    // #if B2_ENABLE_PARTICLE
                    this.m_mouseTracing = false;
                    // #endif
                    if (this.m_mouseJoint) {
                        this.m_world.DestroyJoint(this.m_mouseJoint);
                        this.m_mouseJoint = null;
                    }
                    if (this.m_bombSpawning) {
                        this.CompleteBombSpawn(p);
                    }
                }
                MouseMove(p) {
                    this.m_mouseWorld.Copy(p);
                    if (this.m_mouseJoint) {
                        this.m_mouseJoint.SetTarget(p);
                    }
                }
                LaunchBomb() {
                    const p = new b2.Vec2(b2.RandomRange(-15, 15), 30);
                    const v = b2.Vec2.MulSV(-5, p, new b2.Vec2());
                    this.LaunchBombAt(p, v);
                }
                LaunchBombAt(position, velocity) {
                    if (this.m_bomb) {
                        this.m_world.DestroyBody(this.m_bomb);
                        this.m_bomb = null;
                    }
                    const bd = new b2.BodyDef();
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.Copy(position);
                    bd.bullet = true;
                    this.m_bomb = this.m_world.CreateBody(bd);
                    this.m_bomb.SetLinearVelocity(velocity);
                    const circle = new b2.CircleShape();
                    circle.m_radius = 0.3;
                    const fd = new b2.FixtureDef();
                    fd.shape = circle;
                    fd.density = 20;
                    fd.restitution = 0;
                    // b2.Vec2 minV = position - b2.Vec2(0.3f,0.3f);
                    // b2.Vec2 maxV = position + b2.Vec2(0.3f,0.3f);
                    // b2.AABB aabb;
                    // aabb.lowerBound = minV;
                    // aabb.upperBound = maxV;
                    this.m_bomb.CreateFixture(fd);
                }
                Step(settings) {
                    let timeStep = settings.m_hertz > 0 ? 1 / settings.m_hertz : 0;
                    if (settings.m_pause) {
                        if (settings.m_singleStep) {
                            settings.m_singleStep = false;
                        }
                        else {
                            timeStep = 0;
                        }
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "****PAUSED****");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                    }
                    let flags = b2.DrawFlags.e_none;
                    if (settings.m_drawShapes) {
                        flags |= b2.DrawFlags.e_shapeBit;
                    }
                    // #if B2_ENABLE_PARTICLE
                    if (settings.m_drawParticles) {
                        flags |= b2.DrawFlags.e_particleBit;
                    }
                    // #endif
                    if (settings.m_drawJoints) {
                        flags |= b2.DrawFlags.e_jointBit;
                    }
                    if (settings.m_drawAABBs) {
                        flags |= b2.DrawFlags.e_aabbBit;
                    }
                    if (settings.m_drawCOMs) {
                        flags |= b2.DrawFlags.e_centerOfMassBit;
                    }
                    // #if B2_ENABLE_CONTROLLER
                    if (settings.m_drawControllers) {
                        flags |= b2.DrawFlags.e_controllerBit;
                    }
                    // #endif
                    draw_js_1.g_debugDraw.SetFlags(flags);
                    this.m_world.SetAllowSleeping(settings.m_enableSleep);
                    this.m_world.SetWarmStarting(settings.m_enableWarmStarting);
                    this.m_world.SetContinuousPhysics(settings.m_enableContinuous);
                    this.m_world.SetSubStepping(settings.m_enableSubStepping);
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystem.SetStrictContactCheck(settings.m_strictContacts);
                    // #endif
                    this.m_pointCount = 0;
                    // #if B2_ENABLE_PARTICLE
                    this.m_world.Step(timeStep, settings.m_velocityIterations, settings.m_positionIterations, settings.m_particleIterations);
                    // #else
                    // this.m_world.Step(timeStep, settings.velocityIterations, settings.positionIterations);
                    // #endif
                    this.m_world.DebugDraw();
                    if (timeStep > 0) {
                        ++this.m_stepCount;
                    }
                    if (settings.m_drawStats) {
                        const bodyCount = this.m_world.GetBodyCount();
                        const contactCount = this.m_world.GetContactCount();
                        const jointCount = this.m_world.GetJointCount();
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "bodies/contacts/joints = " + bodyCount + "/" + contactCount + "/" + jointCount);
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        // #if B2_ENABLE_PARTICLE
                        const particleCount = this.m_particleSystem.GetParticleCount();
                        const groupCount = this.m_particleSystem.GetParticleGroupCount();
                        const pairCount = this.m_particleSystem.GetPairCount();
                        const triadCount = this.m_particleSystem.GetTriadCount();
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "particles/groups/pairs/triads = " + particleCount + "/" + groupCount + "/" + pairCount + "/" + triadCount);
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        // #endif
                        const proxyCount = this.m_world.GetProxyCount();
                        const height = this.m_world.GetTreeHeight();
                        const balance = this.m_world.GetTreeBalance();
                        const quality = this.m_world.GetTreeQuality();
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "proxies/height/balance/quality = " + proxyCount + "/" + height + "/" + balance + "/" + quality.toFixed(2));
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                    }
                    // Track maximum profile times
                    {
                        const p = this.m_world.GetProfile();
                        this.m_maxProfile.step = b2.Max(this.m_maxProfile.step, p.step);
                        this.m_maxProfile.collide = b2.Max(this.m_maxProfile.collide, p.collide);
                        this.m_maxProfile.solve = b2.Max(this.m_maxProfile.solve, p.solve);
                        this.m_maxProfile.solveInit = b2.Max(this.m_maxProfile.solveInit, p.solveInit);
                        this.m_maxProfile.solveVelocity = b2.Max(this.m_maxProfile.solveVelocity, p.solveVelocity);
                        this.m_maxProfile.solvePosition = b2.Max(this.m_maxProfile.solvePosition, p.solvePosition);
                        this.m_maxProfile.solveTOI = b2.Max(this.m_maxProfile.solveTOI, p.solveTOI);
                        this.m_maxProfile.broadphase = b2.Max(this.m_maxProfile.broadphase, p.broadphase);
                        this.m_totalProfile.step += p.step;
                        this.m_totalProfile.collide += p.collide;
                        this.m_totalProfile.solve += p.solve;
                        this.m_totalProfile.solveInit += p.solveInit;
                        this.m_totalProfile.solveVelocity += p.solveVelocity;
                        this.m_totalProfile.solvePosition += p.solvePosition;
                        this.m_totalProfile.solveTOI += p.solveTOI;
                        this.m_totalProfile.broadphase += p.broadphase;
                    }
                    if (settings.m_drawProfile) {
                        const p = this.m_world.GetProfile();
                        const aveProfile = new b2.Profile();
                        if (this.m_stepCount > 0) {
                            const scale = 1 / this.m_stepCount;
                            aveProfile.step = scale * this.m_totalProfile.step;
                            aveProfile.collide = scale * this.m_totalProfile.collide;
                            aveProfile.solve = scale * this.m_totalProfile.solve;
                            aveProfile.solveInit = scale * this.m_totalProfile.solveInit;
                            aveProfile.solveVelocity = scale * this.m_totalProfile.solveVelocity;
                            aveProfile.solvePosition = scale * this.m_totalProfile.solvePosition;
                            aveProfile.solveTOI = scale * this.m_totalProfile.solveTOI;
                            aveProfile.broadphase = scale * this.m_totalProfile.broadphase;
                        }
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "step [ave] (max) = " + p.step.toFixed(2) + " [" + aveProfile.step.toFixed(2) + "] (" + this.m_maxProfile.step.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "collide [ave] (max) = " + p.collide.toFixed(2) + " [" + aveProfile.collide.toFixed(2) + "] (" + this.m_maxProfile.collide.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "solve [ave] (max) = " + p.solve.toFixed(2) + " [" + aveProfile.solve.toFixed(2) + "] (" + this.m_maxProfile.solve.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "solve init [ave] (max) = " + p.solveInit.toFixed(2) + " [" + aveProfile.solveInit.toFixed(2) + "] (" + this.m_maxProfile.solveInit.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "solve velocity [ave] (max) = " + p.solveVelocity.toFixed(2) + " [" + aveProfile.solveVelocity.toFixed(2) + "] (" + this.m_maxProfile.solveVelocity.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "solve position [ave] (max) = " + p.solvePosition.toFixed(2) + " [" + aveProfile.solvePosition.toFixed(2) + "] (" + this.m_maxProfile.solvePosition.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "solveTOI [ave] (max) = " + p.solveTOI.toFixed(2) + " [" + aveProfile.solveTOI.toFixed(2) + "] (" + this.m_maxProfile.solveTOI.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "broad-phase [ave] (max) = " + p.broadphase.toFixed(2) + " [" + aveProfile.broadphase.toFixed(2) + "] (" + this.m_maxProfile.broadphase.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                    }
                    // #if B2_ENABLE_PARTICLE
                    if (this.m_mouseTracing && !this.m_mouseJoint) {
                        const delay = 0.1;
                        ///b2Vec2 acceleration = 2 / delay * (1 / delay * (m_mouseWorld - m_mouseTracerPosition) - m_mouseTracerVelocity);
                        const acceleration = new b2.Vec2();
                        acceleration.x = 2 / delay * (1 / delay * (this.m_mouseWorld.x - this.m_mouseTracerPosition.x) - this.m_mouseTracerVelocity.x);
                        acceleration.y = 2 / delay * (1 / delay * (this.m_mouseWorld.y - this.m_mouseTracerPosition.y) - this.m_mouseTracerVelocity.y);
                        ///m_mouseTracerVelocity += timeStep * acceleration;
                        this.m_mouseTracerVelocity.SelfMulAdd(timeStep, acceleration);
                        ///m_mouseTracerPosition += timeStep * m_mouseTracerVelocity;
                        this.m_mouseTracerPosition.SelfMulAdd(timeStep, this.m_mouseTracerVelocity);
                        const shape = new b2.CircleShape();
                        shape.m_p.Copy(this.m_mouseTracerPosition);
                        shape.m_radius = 2 * this.GetDefaultViewZoom();
                        ///QueryCallback2 callback(m_particleSystem, &shape, m_mouseTracerVelocity);
                        const callback = new QueryCallback2(this.m_particleSystem, shape, this.m_mouseTracerVelocity);
                        const aabb = new b2.AABB();
                        const xf = new b2.Transform();
                        xf.SetIdentity();
                        shape.ComputeAABB(aabb, xf, 0);
                        this.m_world.QueryAABB(callback, aabb);
                    }
                    // #endif
                    if (this.m_bombSpawning) {
                        const c = new b2.Color(0, 0, 1);
                        draw_js_1.g_debugDraw.DrawPoint(this.m_bombSpawnPoint, 4, c);
                        c.SetRGB(0.8, 0.8, 0.8);
                        draw_js_1.g_debugDraw.DrawSegment(this.m_mouseWorld, this.m_bombSpawnPoint, c);
                    }
                    if (settings.m_drawContactPoints) {
                        const k_impulseScale = 0.1;
                        const k_axisScale = 0.3;
                        for (let i = 0; i < this.m_pointCount; ++i) {
                            const point = this.m_points[i];
                            if (point.state === b2.PointState.b2_addState) {
                                // Add
                                draw_js_1.g_debugDraw.DrawPoint(point.position, 10, new b2.Color(0.3, 0.95, 0.3));
                            }
                            else if (point.state === b2.PointState.b2_persistState) {
                                // Persist
                                draw_js_1.g_debugDraw.DrawPoint(point.position, 5, new b2.Color(0.3, 0.3, 0.95));
                            }
                            if (settings.m_drawContactNormals) {
                                const p1 = point.position;
                                const p2 = b2.Vec2.AddVV(p1, b2.Vec2.MulSV(k_axisScale, point.normal, b2.Vec2.s_t0), new b2.Vec2());
                                draw_js_1.g_debugDraw.DrawSegment(p1, p2, new b2.Color(0.9, 0.9, 0.9));
                            }
                            else if (settings.m_drawContactImpulse) {
                                const p1 = point.position;
                                const p2 = b2.Vec2.AddVMulSV(p1, k_impulseScale * point.normalImpulse, point.normal, new b2.Vec2());
                                draw_js_1.g_debugDraw.DrawSegment(p1, p2, new b2.Color(0.9, 0.9, 0.3));
                            }
                            if (settings.m_drawFrictionImpulse) {
                                const tangent = b2.Vec2.CrossVOne(point.normal, new b2.Vec2());
                                const p1 = point.position;
                                const p2 = b2.Vec2.AddVMulSV(p1, k_impulseScale * point.tangentImpulse, tangent, new b2.Vec2());
                                draw_js_1.g_debugDraw.DrawSegment(p1, p2, new b2.Color(0.9, 0.9, 0.3));
                            }
                        }
                    }
                }
                ShiftOrigin(newOrigin) {
                    this.m_world.ShiftOrigin(newOrigin);
                }
                GetDefaultViewZoom() {
                    return 1.0;
                }
                /**
                 * Apply a preset range of colors to a particle group.
                 *
                 * A different color out of k_ParticleColors is applied to each
                 * particlesPerColor particles in the specified group.
                 *
                 * If particlesPerColor is 0, the particles in the group are
                 * divided into k_ParticleColorsCount equal sets of colored
                 * particles.
                 */
                ColorParticleGroup(group, particlesPerColor) {
                    // DEBUG: b2.Assert(group !== null);
                    const colorBuffer = this.m_particleSystem.GetColorBuffer();
                    const particleCount = group.GetParticleCount();
                    const groupStart = group.GetBufferIndex();
                    const groupEnd = particleCount + groupStart;
                    const colorCount = Test.k_ParticleColors.length;
                    if (!particlesPerColor) {
                        particlesPerColor = Math.floor(particleCount / colorCount);
                        if (!particlesPerColor) {
                            particlesPerColor = 1;
                        }
                    }
                    for (let i = groupStart; i < groupEnd; i++) {
                        ///colorBuffer[i].Copy(box2d.Testbed.Test.k_ParticleColors[Math.floor(i / particlesPerColor) % colorCount]);
                        colorBuffer[i] = Test.k_ParticleColors[Math.floor(i / particlesPerColor) % colorCount].Clone();
                    }
                }
                /**
                 * Remove particle parameters matching "filterMask" from the set
                 * of particle parameters available for this test.
                 */
                InitializeParticleParameters(filterMask) {
                    const defaultNumValues = particle_parameter_js_1.ParticleParameter.k_defaultDefinition[0].numValues;
                    const defaultValues = particle_parameter_js_1.ParticleParameter.k_defaultDefinition[0].values;
                    ///  m_particleParameters = new ParticleParameter::Value[defaultNumValues];
                    this.m_particleParameters = [];
                    // Disable selection of wall and barrier particle types.
                    let numValues = 0;
                    for (let i = 0; i < defaultNumValues; i++) {
                        if (defaultValues[i].value & filterMask) {
                            continue;
                        }
                        ///memcpy(&m_particleParameters[numValues], &defaultValues[i], sizeof(defaultValues[0]));
                        this.m_particleParameters[numValues] = new particle_parameter_js_1.ParticleParameterValue(defaultValues[i]);
                        numValues++;
                    }
                    this.m_particleParameterDef = new particle_parameter_js_1.ParticleParameterDefinition(this.m_particleParameters, numValues);
                    ///m_particleParameterDef.values = m_particleParameters;
                    ///m_particleParameterDef.numValues = numValues;
                    Test.SetParticleParameters([this.m_particleParameterDef], 1);
                }
                /**
                 * Restore default particle parameters.
                 */
                RestoreParticleParameters() {
                    if (this.m_particleParameters) {
                        Test.SetParticleParameters(particle_parameter_js_1.ParticleParameter.k_defaultDefinition, 1);
                        ///  delete [] m_particleParameters;
                        this.m_particleParameters = null;
                    }
                }
                /**
                 * Set whether to restart the test on particle parameter
                 * changes. This parameter is re-enabled when the test changes.
                 */
                static SetRestartOnParticleParameterChange(enable) {
                    Test.particleParameter.SetRestartOnChange(enable);
                }
                /**
                 * Set the currently selected particle parameter value.  This
                 * value must match one of the values in
                 * Main::k_particleTypes or one of the values referenced by
                 * particleParameterDef passed to SetParticleParameters().
                 */
                static SetParticleParameterValue(value) {
                    const index = Test.particleParameter.FindIndexByValue(value);
                    // If the particle type isn't found, so fallback to the first entry in the
                    // parameter.
                    Test.particleParameter.Set(index >= 0 ? index : 0);
                    return Test.particleParameter.GetValue();
                }
                /**
                 * Get the currently selected particle parameter value and
                 * enable particle parameter selection arrows on Android.
                 */
                static GetParticleParameterValue() {
                    // Enable display of particle type selection arrows.
                    Test.fullscreenUI.SetParticleParameterSelectionEnabled(true);
                    return Test.particleParameter.GetValue();
                }
                /**
                 * Override the default particle parameters for the test.
                 */
                static SetParticleParameters(particleParameterDef, particleParameterDefCount = particleParameterDef.length) {
                    Test.particleParameter.SetDefinition(particleParameterDef, particleParameterDefCount);
                }
            };
            exports_1("Test", Test);
            // #if B2_ENABLE_PARTICLE
            Test.fullscreenUI = new fullscreen_ui_js_1.FullScreenUI();
            Test.particleParameter = new particle_parameter_js_1.ParticleParameter();
            // #endif
            Test.k_maxContactPoints = 2048;
            Test.PreSolve_s_state1 = [ /*b2.maxManifoldPoints*/];
            Test.PreSolve_s_state2 = [ /*b2.maxManifoldPoints*/];
            Test.PreSolve_s_worldManifold = new b2.WorldManifold();
            // #if B2_ENABLE_PARTICLE
            Test.k_ParticleColors = [
                new b2.Color().SetByteRGBA(0xff, 0x00, 0x00, 0xff),
                new b2.Color().SetByteRGBA(0x00, 0xff, 0x00, 0xff),
                new b2.Color().SetByteRGBA(0x00, 0x00, 0xff, 0xff),
                new b2.Color().SetByteRGBA(0xff, 0x8c, 0x00, 0xff),
                new b2.Color().SetByteRGBA(0x00, 0xce, 0xd1, 0xff),
                new b2.Color().SetByteRGBA(0xff, 0x00, 0xff, 0xff),
                new b2.Color().SetByteRGBA(0xff, 0xd7, 0x00, 0xff),
                new b2.Color().SetByteRGBA(0x00, 0xff, 0xff, 0xff),
            ];
            Test.k_ParticleColorsCount = Test.k_ParticleColors.length;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVVBLFNBQWdCLFdBQVcsQ0FBQyxLQUFhLENBQUMsQ0FBQyxFQUFFLEtBQWEsQ0FBQztRQUN6RCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEIsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdkIsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFSRCxTQUFTO1lBRVQsa0NBQWEsb0JBQW9CLEdBQVcsRUFBRSxFQUFDO1lBUS9DLFlBQUEsTUFBYSxTQUFTO2dCQUlwQixZQUFZLElBQVksRUFBRSxTQUFxQjtvQkFIeEMsU0FBSSxHQUFXLFNBQVMsQ0FBQztvQkFJOUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO2dCQUM3QixDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxzQkFBQSxNQUFhLG1CQUFvQixTQUFRLEVBQUUsQ0FBQyxtQkFBbUI7Z0JBRzdELFlBQVksSUFBVTtvQkFDcEIsS0FBSyxFQUFFLENBQUM7b0JBRVIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ25CLENBQUM7Z0JBRU0sZUFBZSxDQUFDLEtBQWU7b0JBQ3BDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEtBQUssS0FBSyxFQUFFO3dCQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7cUJBQy9CO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUNqQztnQkFDSCxDQUFDO2dCQUVNLGlCQUFpQixDQUFDLE9BQW1CLElBQVMsQ0FBQztnQkFFdEQs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