import { getById } from '../util/dom-functions'

export class QuestUI {

	constructor(game) {
		this.game        = game
		this.container   = getById('questScreen')
		this.description = getById('questDescription')
		this.gold        = getById('questGold')
		this.experience  = getById('questExperience')
		this.dragon      = getById('questName')
		this.progress    = getById('questProgress')
		this.counter     = 0
		this.init()
	}

	init() {
		this.container.addEventListener('mouseover', () => {
			this.game.mouse.hide()
		})
		this.container.addEventListener('mouseout', () => {
			this.game.mouse.show()
		})
		this.container.oncontextmenu = ev => ev.preventDefault()
		this.setQuest(this.game.self.props.id_quest)
		this.container.style.display = 'block'
	}

	onDragonKill(name) {
		const id     = this.game.self.props.id_quest,
		      target = this.game.quests[id].dragon,
		      goal   = this.game.quests[id].amount
		if(name == target) {
			this.counter++
			if(this.counter >= goal) {
				this.counter = 0
				this.alertQuestCompletition()
				this.nextQuest()
			} else {
				this.setQuestProgress(id, this.counter)
			}
		}
	}

	setQuest(id) {
		if(!this.game.quests[id]) {
			this.container.style.display = 'none'
			return
		}
		this.setQuestDescription(id)
		this.setQuestRewards(id)
		this.setQuestName(id)
		this.setQuestProgress(id)
	}

	setQuestDescription(id) {
		const desc = this.game.quests[id].description
		this.description.innerText = desc
	}

	setQuestRewards(id) {
		const gold = this.game.quests[id].gold,
			  exp  = this.game.quests[id].experience
	 	this.gold.innerText = gold
	 	this.experience.innerText = exp
	}

	setQuestName(id) {
		const name = this.game.quests[id].dragon
		this.dragon.innerText = name
	}

	setQuestProgress(id, val = 0) {
		const goal = this.game.quests[id].amount
		this.progress.innerText = val + ' / ' + goal
	}

	alertQuestCompletition() {
		alert('Quest completed!')
	}

	alertVictoryScreen() {
		alert('A humble victory screen (work in progress!)')
	}

	nextQuest() {
		const id = this.game.self.props.id_quest + 1
		if(!this.game.quests[id]) {
			this.alertVictoryScreen()
			this.container.style.display = 'none'
			this.game.socket.emit('gameWon', this.game.self.props.id)
			return
		}
		this.game.self.props.id_quest++
		this.setQuest(this.game.self.props.id_quest)
	}
}