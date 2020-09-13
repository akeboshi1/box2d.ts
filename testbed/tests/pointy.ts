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

// #if B2_ENABLE_PARTICLE

import * as b2 from "@box2d";
import * as testbed from "../testbed.js";

/**
 * Test behavior when particles fall on a convex ambigious Body
 * contact fixture junction.
 */

export class Pointy extends testbed.Test {
  public m_killfieldShape = new b2.PolygonShape();
  public m_killfieldTransform = new b2.Transform();

  constructor() {
    super();

    {
      const bd = new b2.BodyDef();
      const ground = this.m_world.CreateBody(bd);

      // Construct a triangle out of many polygons to ensure there's no
      // issue with particles falling directly on an ambiguous corner

      const xstep = 1.0;
      for (let x = -10.0; x < 10.0; x += xstep) {
        const shape = new b2.PolygonShape();
        const vertices = [
          new b2.Vec2(x, -10.0),
          new b2.Vec2(x + xstep, -10.0),
          new b2.Vec2(0.0, 25.0),
        ];
        shape.Set(vertices, 3);
        ground.CreateFixture(shape, 0.0);
      }
    }

    this.m_particleSystem.SetRadius(0.25 * 2); // HACK: increase particle radius
    const particleType = testbed.Test.GetParticleParameterValue();
    if (particleType === b2.ParticleFlag.b2_waterParticle) {
      this.m_particleSystem.SetDamping(0.2);
    }

    // Create killfield shape and transform
    this.m_killfieldShape = new b2.PolygonShape();
    this.m_killfieldShape.SetAsBox(50.0, 1.0);

    // Put this at the bottom of the world
    this.m_killfieldTransform = new b2.Transform();
    const loc = new b2.Vec2(-25, 1);
    this.m_killfieldTransform.SetPositionAngle(loc, 0);
  }

  public Step(settings: testbed.Settings) {
    super.Step(settings);

    const flags = testbed.Test.GetParticleParameterValue();
    const pd = new b2.ParticleDef();

    pd.position.Set(0.0, 33.0);
    pd.velocity.Set(0.0, -1.0);
    pd.flags = flags;

    if (flags & (b2.ParticleFlag.b2_springParticle | b2.ParticleFlag.b2_elasticParticle)) {
      const count = this.m_particleSystem.GetParticleCount();
      pd.velocity.Set(count & 1 ? -1.0 : 1.0, -5.0);
      pd.flags |= b2.ParticleFlag.b2_reactiveParticle;
    }

    this.m_particleSystem.CreateParticle(pd);

    // kill every particle near the bottom of the screen
    this.m_particleSystem.DestroyParticlesInShape(this.m_killfieldShape, this.m_killfieldTransform);
  }

  public static Create() {
    return new Pointy();
  }
}

// #endif
