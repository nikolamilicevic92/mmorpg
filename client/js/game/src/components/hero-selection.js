import { getById, make, getByClass } from '../util/dom-functions'

export class HeroSelection {
	
	constructor(game) {
		this.game         = game
		this.container    = getById('heroSelectionScreen')
		this.welcome      = getById('heroSelectionWelcome')
		this.ownedHeroes  = getById('ownedHeroes')
		this.play         = getById('play')
		this.delete       = getById('deleteHero')
		this.link         = getById('showHeroCreation')
		this.selectedHero = ''
		this.initDefault()
	}

	initDefault() {
		this.disableButtons()
		this.link.addEventListener('click', () => {
			this.hide()
			this.game.heroCreation.show()
		})
		let height = window.innerHeight - 200
		if(height < 500) height = 500
		this.ownedHeroes.style.height = height + 'px'
		this.play.addEventListener('click', () => {
			if(this.selectedHero != '') {
				console.log(this.game.ownedHeroes, this.selectedHero)
				let index = 0
				for(let i = 0; i < this.game.ownedHeroes.length; i++) {
					if(this.game.ownedHeroes[i].name == this.selectedHero) {
						index = i
						break
					}
				}
				//send request for init package...
				this.hide()
				this.game.makeSelf(this.game.ownedHeroes[index])
			}
		})
		this.delete.addEventListener('click', () => {
			if(this.selectedHero != '') {
				this.game.socket.emit('/player/deleteHero', {
					heroName: this.selectedHero,
					username: this.game.username
				})
				for(let i = 0; i < this.game.ownedHeroes.length; i++) {
					if(this.game.ownedHeroes[i].name == this.selectedHero) {
						this.game.ownedHeroes.splice(i, 1)
						break
					}
				}
			}
		})
	}

	init(ownedHeroes) {
		this.disableButtons()
		this.ownedHeroes.innerHTML = ''
		this.welcome.innerText = 'Welcome ' + this.game.username
		ownedHeroes.forEach(hero => {
			const card 			= make('div.my-hero'),
			      h3            = make('h3', hero.name),
			      img           = make('div.hero-img'),
			      progress      = make('div.my-hero-progress'),
			      lvlContainer  = make('div'),
			      lvlLabel      = make('label', 'Level:'),
			      goldContainer = make('div'),
			      goldLabel     = make('label', 'Gold:'),
			      questContainer= make('div'),
			      questLabel    = make('label', 'Quests done:'),
			      lvlValue      = make('span', hero.level),
			      goldValue     = make('span', hero.gold),
			      questValue    = make('span', hero.won ? hero.id_quest : hero.id_quest - 1)

			this.setBackgroundImage(
				img, this.game.heroesData[hero.type].sprite
			)

			card.appendChild(h3)
			card.appendChild(img)

			lvlContainer.appendChild(lvlLabel)
			lvlContainer.appendChild(lvlValue)

			goldContainer.appendChild(goldLabel)
			goldContainer.appendChild(goldValue)

			questContainer.appendChild(questLabel)
			questContainer.appendChild(questValue)

			progress.appendChild(lvlContainer)
			progress.appendChild(goldContainer)
			progress.appendChild(questContainer)

			card.appendChild(progress)
			this.addCardEventListener(card, hero)

			this.ownedHeroes.appendChild(card)
		})
	} 

	addCardEventListener(card, hero) {
		card.addEventListener('click', () => {
			this.selectedHero = hero.name
			this.removeSelectedStyles()
			card.classList.add('my-hero-selected')
			this.enableButtons()
		})
	}

	removeSelectedStyles() {
		const cards = getByClass('my-hero')
		for(let i = 0; i < cards.length; i++) {
			cards[i].classList.remove('my-hero-selected')
		}
	}

	show() {
		this.container.style.display = 'block'
	}

	hide() {
		this.disableButtons()
		this.removeSelectedStyles()
		this.selectedHero = ''
		this.container.style.display = 'none'
	}

	enableButtons() {
		this.play.disabled = false
		this.play.style.opacity = 1
		this.delete.disabled = false
		this.delete.style.opacity = 1
	}

	disableButtons() {
		this.play.disabled = true
		this.play.style.opacity = 0.5
		this.delete.disabled = true
		this.delete.style.opacity = 0.5
	}

	setBackgroundImage(element, img) {
		element.style.backgroundImage = `url(client/assets/images/${img})`
	}
}