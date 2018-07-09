import { getById, make, getByClass } from '../util/dom-functions'

export class HeroCreation {

	constructor(game) {
		this.game           = game
		this.container      = getById('heroCreationScreen')
		this.heroesDetailed = getById('heroesDetailed')
		this.heroesList     = getById('heroesList')
		this.selectedHero   = getById('selectedHero')
		this.heroName       = getById('heroName'),
		this.create         = getById('create'),
		this.link           = getById('showHeroSelection')
		this.errors         = getById('creationErrors')
	}

	init(heroesData) {
		this.link.addEventListener('click', ev => {
			ev.preventDefault()
			this.hide()
			this.game.heroSelection.show()
		})
		this.create.addEventListener('click', () => {
			const heroType = this.selectedHero.innerText.trim(),
				  heroName = this.heroName.value.trim()

			if(this.validate(heroType, heroName, this.game.username)) {
				this.send(heroType, heroName, this.game.username)
			}
		})
		heroesData.forEach(heroData => {
			const card     = this.makeHeroCard(heroData),
				    detailed = this.makeHeroDetailed(heroData)

			card.addEventListener('click', () => {
				this.hideHeroesDetailed()
				detailed.style.display = 'block'
				this.selectedHero.innerText = heroData.type
			})

			this.heroesList.appendChild(card)
			this.heroesDetailed.appendChild(detailed)
		})
	}

	makeHeroCard(heroData) {
		const card 		        = make('div.hero-card clearfix'),
			  stats             = make('div'),
			  heroImgContainer  = make('div.hero-img-container'),
			  type              = make('h4', heroData.type),
			  attackContainer   = make('div'),
			  defenceContainer  = make('div'),
			  mobilityContainer = make('div'),
			  heroImg           = make('div.hero-img'),
			  attackLabel       = make('label', 'Attack'),
			  defenceLabel      = make('label', 'Defence'),
			  mobilityLabel     = make('label', 'Mobility'),
			  attack            = make('span.red'),
			  defence           = make('span.red'),
			  mobility          = make('span.red')

		attack.style.width   = this.getStatWidth(heroData.base_attack)
		defence.style.width  = this.getStatWidth(heroData.base_defence)
		mobility.style.width = this.getStatWidth(heroData.base_mobility)

		attackContainer.appendChild(attackLabel)
		defenceContainer.appendChild(defenceLabel)
		mobilityContainer.appendChild(mobilityLabel)

		attackContainer.appendChild(attack)
		defenceContainer.appendChild(defence)
		mobilityContainer.appendChild(mobility)

		stats.appendChild(type)
		stats.appendChild(attackContainer)
		stats.appendChild(defenceContainer)
		stats.appendChild(mobilityContainer)

		this.setBackgroundImage(heroImg, heroData.sprite)
		heroImgContainer.appendChild(heroImg)

		card.appendChild(stats)
		card.appendChild(heroImgContainer)

		return card
	}

	getStatWidth(stat) {
		const maxWidth = 130
		return parseInt((stat / 100) * maxWidth) + 'px'
	}

	makeHeroDetailed(heroData) {
		const heroDetailed       = make('div.hero-detailed'),
					type               = make('h1', heroData.type),
					desc 		           = make('div.hero-description', heroData.description),
					abilitiesContainer = make('div')

		heroData.abilities.forEach(ability => {
			const abilityContainer = make('div.ability'),
			      abilityHeader    = make('div.ability-header'),
			      abilityIcon      = make('div.creation-ability-icon'),
			      abilityName      = make('div.ability-name', ability.name),
			      abilityDesc      = make('p.ability-description', ability.description)

			this.setBackgroundImage(abilityIcon, ability.sprite)

			abilityHeader.appendChild(abilityIcon)
			abilityHeader.appendChild(abilityName)
			abilityContainer.appendChild(abilityHeader)
			abilityContainer.appendChild(abilityDesc)

			abilitiesContainer.appendChild(abilityContainer)
		})

		heroDetailed.appendChild(type)
		heroDetailed.appendChild(desc)
		heroDetailed.appendChild(abilitiesContainer)
		
		return heroDetailed
	}

	setBackgroundImage(element, img) {
		element.style.backgroundImage = `url(client/assets/images/${img})`
	}

	hideHeroesDetailed() {
		const heroesDetailed = getByClass('hero-detailed')
		for(let i = 0; i < heroesDetailed.length; i++) {
			heroesDetailed[i].style.display = 'none'
		}
	}

	clear() {
		this.selectedHero.innerText = ''
		this.heroName.value = ''
	}

	hide() {
		this.clear()
		this.errors.innerText = ''
		this.container.style.display = 'none'
	}

	show() {
		this.container.style.display = 'block'
	}

	die() {
		document.querySelector('body').removeChild(this.container)
	}

	displayError(error) {
		this.errors.innerText = error
		this.errors.style.color = 'red'
	}

	displaySuccess() {
		this.errors.innerText = 'Successfully created new hero!'
		this.errors.style.color = 'green'
	}

	validate(heroType, heroName, username) {
		if(username == '') {
			this.displayError('Account is not logged in')
			return false
		}
		if(heroType == '') {
			this.displayError('Hero not selected')
			return false
		} else if(heroName.length == 0) {
			this.displayError('Hero name is required')
			return false
		}
		return true
	}

	send(heroType, heroName, username) {
		this.game.socket.emit('/player/addHero', {
			heroType, heroName, username
		})
	}

	onEvent(data) {
		if(data.success) {
			this.clear()
			this.displaySuccess()
			this.game.heroSelection.init(data.ownedHeroes)
			this.game.ownedHeroes = data.ownedHeroes
		} else {
			this.displayError(data.message)
		}
	}
}