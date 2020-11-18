/*
 * Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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

import { b2_maxManifoldPoints, b2MakeNumberArray } from "../common/b2_common";
import { b2Vec2 } from "../common/b2_math";
import { b2Manifold } from "../collision/b2_collision";
import { b2Contact } from "./b2_contact";
import { b2Joint } from "./b2_joint";
import { b2Fixture } from "./b2_fixture";

/// Joints and fixtures are destroyed when their associated
/// body is destroyed. Implement this listener so that you
/// may nullify references to these joints and shapes.
export class b2DestructionListener {
    /// Called when any joint is about to be destroyed due
    /// to the destruction of one of its attached bodies.
    public SayGoodbyeJoint(_joint: b2Joint): void {}

    /// Called when any fixture is about to be destroyed due
    /// to the destruction of its parent body.
    public SayGoodbyeFixture(_fixture: b2Fixture): void {}
}

/// Implement this class to provide collision filtering. In other words, you can implement
/// this class if you want finer control over contact creation.
export class b2ContactFilter {
    /// Return true if contact calculations should be performed between these two shapes.
    /// @warning for performance reasons this is only called when the AABBs begin to overlap.
    public ShouldCollide(fixtureA: b2Fixture, fixtureB: b2Fixture): boolean {
        const filterA = fixtureA.GetFilterData();
        const filterB = fixtureB.GetFilterData();

        if (filterA.groupIndex === filterB.groupIndex && filterA.groupIndex !== 0) {
            return filterA.groupIndex > 0;
        }

        return (filterA.maskBits & filterB.categoryBits) !== 0 && (filterA.categoryBits & filterB.maskBits) !== 0;
    }

    public static readonly b2_defaultFilter = new b2ContactFilter();
}

/// Contact impulses for reporting. Impulses are used instead of forces because
/// sub-step forces may approach infinity for rigid body collisions. These
/// match up one-to-one with the contact points in b2Manifold.
export class b2ContactImpulse {
    public normalImpulses = b2MakeNumberArray(b2_maxManifoldPoints);

    public tangentImpulses = b2MakeNumberArray(b2_maxManifoldPoints);

    public count = 0;
}

/// Implement this class to get contact information. You can use these results for
/// things like sounds and game logic. You can also get contact results by
/// traversing the contact lists after the time step. However, you might miss
/// some contacts because continuous physics leads to sub-stepping.
/// Additionally you may receive multiple callbacks for the same contact in a
/// single time step.
/// You should strive to make your callbacks efficient because there may be
/// many callbacks per time step.
/// @warning You cannot create/destroy Box2D entities inside these callbacks.
export class b2ContactListener {
    /// Called when two fixtures begin to touch.
    public BeginContact(_contact: b2Contact): void {}

    /// Called when two fixtures cease to touch.
    public EndContact(_contact: b2Contact): void {}

    /// This is called after a contact is updated. This allows you to inspect a
    /// contact before it goes to the solver. If you are careful, you can modify the
    /// contact manifold (e.g. disable contact).
    /// A copy of the old manifold is provided so that you can detect changes.
    /// Note: this is called only for awake bodies.
    /// Note: this is called even when the number of contact points is zero.
    /// Note: this is not called for sensors.
    /// Note: if you set the number of contact points to zero, you will not
    /// get an EndContact callback. However, you may get a BeginContact callback
    /// the next step.
    public PreSolve(_contact: b2Contact, _oldManifold: b2Manifold): void {}

    /// This lets you inspect a contact after the solver is finished. This is useful
    /// for inspecting impulses.
    /// Note: the contact manifold does not include time of impact impulses, which can be
    /// arbitrarily large if the sub-step is small. Hence the impulse is provided explicitly
    /// in a separate data structure.
    /// Note: this is only called for contacts that are touching, solid, and awake.
    public PostSolve(_contact: b2Contact, _impulse: b2ContactImpulse): void {}

    public static readonly b2_defaultListener = new b2ContactListener();
}

/// Callback class for AABB queries
/// See b2World::Query
export type b2QueryCallback = (fixture: b2Fixture) => boolean;

/// Callback class for ray casts.
/// See b2World::RayCast
/// Called for each fixture found in the query. You control how the ray cast
/// proceeds by returning a float:
/// return -1: ignore this fixture and continue
/// return 0: terminate the ray cast
/// return fraction: clip the ray to this point
/// return 1: don't clip the ray and continue
/// @param fixture the fixture hit by the ray
/// @param point the point of initial intersection
/// @param normal the normal vector at the point of intersection
/// @return -1 to filter, 0 to terminate, fraction to clip the ray for
/// closest hit, 1 to continue
export type b2RayCastCallback = (fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number) => number;
