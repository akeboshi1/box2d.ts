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

import * as b2 from "@box2d";
import * as testbed from "../testbed.js";

// Adapted from MotorJoint.h

export class MotorJoint2 extends testbed.Test {
  constructor() {
    super();

    let ground: b2.Body;
    {
      const bd = new b2.BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new b2.EdgeShape();
      shape.SetTwoSided(new b2.Vec2(-20.0, 0.0), new b2.Vec2(20.0, 0.0));

      const fd = new b2.FixtureDef();
      fd.shape = shape;

      ground.CreateFixture(fd);
    }

    // b2Body * body1 = NULL;
    let body1: b2.Body;
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.0, 4.0);
      body1 = this.m_world.CreateBody(bd);

      const shape = new b2.CircleShape();
      shape.m_radius = 1.0;

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.friction = 0.6;
      fd.density = 2.0;
      body1.CreateFixture(fd);
    }

    // b2Body * body2 = NULL;
    let body2: b2.Body;
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(4.0, 8.0);
      body2 = this.m_world.CreateBody(bd);

      const shape = new b2.CircleShape();
      shape.m_radius = 1.0;

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.friction = 0.6;
      fd.density = 2.0;
      body2.CreateFixture(fd);
    }

    {
      const mjd = new b2.MotorJointDef();
      mjd.Initialize(body1, body2);
      mjd.maxForce = 1000.0;
      mjd.maxTorque = 1000.0;
      this.m_joint = this.m_world.CreateJoint(mjd) as b2.MotorJoint;
    }
  }

  // b2MotorJoint* m_joint;
  public m_joint: b2.MotorJoint;

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new MotorJoint2();
  }
}
