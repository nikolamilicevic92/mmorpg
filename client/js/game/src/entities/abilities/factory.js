import { ABILITIES } from './abilities'

export class AbilityFactory {

	static makeAbilities(hero, keybinds) {
		let   abilities        = {}
		const abilitiesData    = hero.props.abilities,
			    triggerFunctions = AbilityFactory.generateTriggerFunctions(
			  	hero.game.keyboard.keys, hero.game.mouse.buttons,
			  	keybinds
			  )

		abilitiesData.forEach((props, i) => {
			abilities[props.id] = AbilityFactory.makeAbility(
				hero, props, triggerFunctions[i]
			)
		})
		return abilities
	}

	static makeAbility(hero, props, triggerFunction) {
		return new ABILITIES[props.name](hero, props, triggerFunction)
	}

	static generateTriggerFunctions(keys, mouse, keybinds) {
		let triggerFunctions = []
		for(let ability in keybinds) {
			triggerFunctions.push(() => {
				for(let i = 0; i < keybinds[ability].length; i++) {
					if(keys[keybinds[ability][i]] || mouse[keybinds[ability][i]]) {
						return true
					}
				}
				return false
			})
		}
		return triggerFunctions
	}
}