import { b2PolygonShape, b2FixtureDef, b2BodyType, b2Vec2 } from "@box2d/core";

import { registerTest, Test } from "../../test";

class DominoTower extends Test {
    constructor() {
        super();

        const DOMINO_WIDTH = 0.2;
        const DOMINO_FRICTION = 0.1;
        const DOMINO_HEIGHT = 1;
        const BASE_COUNT = 25;

        /**
         * The density of the dominos under construction. Varies for
         * different parts of the tower.
         */
        let dominoDensity: number;

        const world = this.m_world;
        function makeDomino(x: number, y: number, horizontal: boolean) {
            const sd = new b2PolygonShape();
            sd.SetAsBox(0.5 * DOMINO_WIDTH, 0.5 * DOMINO_HEIGHT);
            const myBody = world.CreateBody({
                type: b2BodyType.b2_dynamicBody,
                position: { x, y },
                angle: horizontal ? Math.PI / 2 : 0,
            });
            myBody.CreateFixture({
                shape: sd,
                density: dominoDensity,
                friction: DOMINO_FRICTION,
                restitution: 0.65,
            });
        }

        // Create the floor
        {
            const sd = new b2PolygonShape();
            sd.SetAsBox(50, 10);

            const body = world.CreateBody({
                position: { x: 0, y: -10 },
            });
            body.CreateFixture({ shape: sd, density: 0 });
        }

        {
            dominoDensity = 10;
            // Make bullet
            const sd = new b2PolygonShape();
            sd.SetAsBox(0.7, 0.7);
            const fd: b2FixtureDef = {
                density: 35,
                shape: sd,
                friction: 0,
                restitution: 0.85,
            };
            let b = world.CreateBody({
                type: b2BodyType.b2_dynamicBody,
                bullet: true,
                position: { x: 30, y: 5 },
            });
            b.CreateFixture(fd);
            b.SetLinearVelocity(new b2Vec2(-25, -25));
            b.SetAngularVelocity(6.7);

            fd.density = 25;
            b = world.CreateBody({
                type: b2BodyType.b2_dynamicBody,
                bullet: true,
                position: { x: -30, y: 25 },
            });
            b.CreateFixture(fd);
            b.SetLinearVelocity(new b2Vec2(35, -10));
            b.SetAngularVelocity(-8.3);
        }

        {
            let currX;
            // Make base
            for (let i = 0; i < BASE_COUNT; ++i) {
                currX = i * 1.5 * DOMINO_HEIGHT - (1.5 * DOMINO_HEIGHT * BASE_COUNT) / 2;
                makeDomino(currX, DOMINO_HEIGHT / 2, false);
                makeDomino(currX, DOMINO_HEIGHT + DOMINO_WIDTH / 2, true);
            }
            currX = BASE_COUNT * 1.5 * DOMINO_HEIGHT - (1.5 * DOMINO_HEIGHT * BASE_COUNT) / 2;

            // Make 'I's
            for (let j = 1; j < BASE_COUNT; ++j) {
                if (j > 3) {
                    dominoDensity *= 0.8;
                }

                // The y at the center of the I structure.
                const currY = DOMINO_HEIGHT * 0.5 + (DOMINO_HEIGHT + 2 * DOMINO_WIDTH) * 0.99 * j;

                for (let i = 0; i < BASE_COUNT - j; ++i) {
                    currX = i * 1.5 * DOMINO_HEIGHT - (1.5 * DOMINO_HEIGHT * (BASE_COUNT - j)) / 2;
                    dominoDensity *= 2.5;
                    if (i === 0) {
                        makeDomino(currX - 1.25 * DOMINO_HEIGHT + 0.5 * DOMINO_WIDTH, currY - DOMINO_WIDTH, false);
                    }
                    if (i === BASE_COUNT - j - 1) {
                        makeDomino(currX + 1.25 * DOMINO_HEIGHT - 0.5 * DOMINO_WIDTH, currY - DOMINO_WIDTH, false);
                    }

                    dominoDensity /= 2.5;
                    makeDomino(currX, currY, false);
                    makeDomino(currX, currY + 0.5 * (DOMINO_WIDTH + DOMINO_HEIGHT), true);
                    makeDomino(currX, currY - 0.5 * (DOMINO_WIDTH + DOMINO_HEIGHT), true);
                }
            }
        }
    }
}

registerTest("Benchmark", "Domino Tower", DominoTower);
