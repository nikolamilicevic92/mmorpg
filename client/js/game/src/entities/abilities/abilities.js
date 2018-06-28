import { ProjectileEmiter } from './projectile'
import { Block } from './static-abilities/block'
import { SelfHeal } from './static-abilities/self-heal'
import { HealingOrbEmiter } from './static-abilities/healing-orb'
import { LightningBolt } from './static-abilities/lightning-bolt'

export const ABILITIES = {
	'Sword throw'    : ProjectileEmiter,
	'Fireball'       : ProjectileEmiter,
	'Shuriken'       : ProjectileEmiter,
	'Arrow'          : ProjectileEmiter,
	'Double arrow'   : ProjectileEmiter,
	'Super arrow'    : ProjectileEmiter,
	'Energy ball'    : ProjectileEmiter,
	'Block'          : Block,
	'Lightning bolt' : LightningBolt,
	'Healing orb'    : HealingOrbEmiter,
	'Self heal'      : SelfHeal
}