﻿using UnityEngine;
using System.Collections;

/* Stun Effect - Knocks back a character away from the current character and stuns them */

public class StunEffect : Effect {
	public float amount;	// Amount (#) multiplier on the movement vector

	private MoveScript targetMoveScript;	// The target's movement script
		
	protected override void ApplyEffect() {
		Knockback(transform, target, amount);
	}

	/* Knockback - Knocks a unit (defender) away from an attacker's position (attackerTransform) by amount */
	public void Knockback(Transform attackerTransform, GameObject defender, float amount) {
		Vector2 direction = (defender.transform.position - attackerTransform.position).normalized;
		
		var defenderMoveScript = defender.GetComponent<MoveScript>();
		defenderMoveScript.Push(direction, amount);
	}
}