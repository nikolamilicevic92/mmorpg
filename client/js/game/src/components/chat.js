import { getById, make, getByClass, show, hide } from '../util/dom-functions'

export class Chat {

	constructor(game) {
		this.game         = game
		this.socket       = game.socket
		this.container    = getById('chatContainer')
		this.header       = getById('chatHeader')
		this.minimize     = getById('chatMinimize')
		this.maximize     = getById('chatMaximize')
		this.chatContent  = getById('chatContent')
		this.allLinks     = getByClass('chat-link')
		this.settings     = getById('chatSettings')
		this.allCards     = getByClass('messages')
		this.input        = getById('chatInput')
		this.inputValues  = ['', '', '', '', '']
		this.cardTypes    = ['global', 'area', 'party', 'whisper', 'combat']
		this.badgeCont    = getById('whisperUnseenCounter')
		this.badge        = getById('whisperUnseenCounterValue')
		this.inFocus      = false
		this.badgeValue   = 0
		this.activeCard   = 0
		this.party        = false
		this.partyUI      = getById('partyUI')
		this.showPartyUI  = getById('showPartyUI')
		this.closePartyUI = getById('closePartyUI')
		this.partyName    = getById('partyName')
		this.createParty  = getById('createParty')
		this.joinParty    = getById('joinParty')
		this.leaveParty   = getById('leaveParty')
		this.init()
	}

	init() {
		this.showPartyUI.addEventListener('click', () => {
			show(this.partyUI)
		})
		this.closePartyUI.addEventListener('click', () => {
			hide(this.partyUI)
		})
		this.createParty.addEventListener('click', () => {
			const name = this.partyName.value.trim()
			if(name == '') return
			this.socket.emit('party', {
				code: 'make',
				name: name,
				id  : this.game.self.props.id
			})
			this.partyName.value = ''
		})
		this.joinParty.addEventListener('click', () => {
			const name = this.partyName.value.trim()
			if(name == '') return
			this.socket.emit('party', {
				code     : 'join', 
				name     : name,
				id       : this.game.self.props.id,
				heroName : this.game.self.props.name
			})
			this.partyName.value = ''
		})
		this.leaveParty.addEventListener('click', () => {
			this.socket.emit('party', {
				code     : 'leave',
				name     : this.party,
				id       : this.game.self.props.id,
				heroName : this.game.self.props.name
			})
			this.party                 = ''
			this.allCards[2].innerHTML = ''
			this.inputValues[2]        = ''
			if(this.activeCard == 2) {
				this.input.value = ''
			}
			hide(this.leaveParty)
			show(this.showPartyUI)
		})
		for(let i = 0; i < this.allLinks.length; i++) {
			const link = this.allLinks[i]
			link.addEventListener('click', () => {
				this.activeCard = i
				this.hideAll()
				this.showCard(i)
			})
		}
		this.minimize.addEventListener('click', () => {		
			hide(this.chatContent)
			hide(this.minimize)
			show(this.maximize)
		})
		this.maximize.addEventListener('click', () => {			
			show(this.chatContent)
			hide(this.maximize)
			show(this.minimize)
		})
		this.input.addEventListener('focus', () => this.inFocus = true)
		this.input.addEventListener('blur' , () => this.inFocus = false)
		this.input.addEventListener('keyup', ev => {
			if(ev.keyCode == 13) {
				if(this.input.value != '') {
					this.sendMessage()
				}
			} else {
				this.inputValues[this.activeCard] = this.input.value
			}
		})
	}

	playerMovedScroll(card) {
		return card.scrollTop + 290 < card.scrollHeight
	}

	scrollCardDown(card) {
		card.scrollTop = card.scrollHeight - 245
	}

	hideAll() {
		for(let i = 0; i < this.allCards.length; i++) {
			this.hideCard(i)
		}
	}

	showCard(i) {
		show(this.allCards[i])
		if(i == 3) {
			this.badgeValue = 0
			this.badge.innerText = ''
			hide(this.badgeCont)
		}
		this.scrollCardDown(this.allCards[i])
		this.allLinks[i].classList.add('selected-chat-link')
		this.input.value = this.inputValues[i]
		if(i == 4) {
			this.input.style.borderTop = '1px solid transparent'
			this.input.disabled = true
		} else {
			this.input.style.borderTop = '1px dashed gray'
			this.input.disabled = false
		}
	}

	hideCard(i) {
		hide(this.allCards[i])
		this.allLinks[i].classList.remove('selected-chat-link')
	}

	sendMessage() {
		let message = this.inputValues[this.activeCard]
		//If it is a whisper
		let data = {}
		if(this.activeCard == 3) {
			data = this.parseWhisperInput(message)
			if(data) {
				this.socket.emit('chat', Object.assign(
					{}, data, {
						sender: this.game.selectedHero,
						activeCard: 3
					}
				))
				this.appendMessage({
					sender: '@' + data.to,
					message: data.message,
					activeCard: 3
				})
				this.clear(`@${data.to} `)
			}
			//If it is a party
		} else if(this.activeCard == 2) {
			if(this.party != '') {
				this.socket.emit('party', {
					code    : 'message',
					sender  : this.game.selectedHero,
					message : message,
					name    : this.party
				})
			} else {
				alert('You are not in a party')
			}
			this.clear()
		} else {
			this.socket.emit('chat', {
				activeCard : this.activeCard,
				sender     : this.game.selectedHero,
				message    : message
			})
			this.clear()
		}
	}

	clear(value = '') {
		this.inputValues[this.activeCard] = value
		this.input.value = value
	}

	parseWhisperInput(text) {
		if(!text.startsWith('@')) {
			this.input.value = 'Invalid format, use @name my message'
			this.input.style.color = '#ff3200'
			setTimeout(() => {
				this.input.value = ''
				this.input.style.color = 'white'
			}, 3000)
			return false
		} else {
			const arr = text.split(' '),
			      to  = arr[0].substring(1),
			      msg = arr.slice(1).join(' ')

			return {
				to, message: msg
			}
		}
	}

	appendMessage(data) {
		const sender  = make('span.sender', '(' + data.sender + ') : '),
			  message = make('span', data.message),
			  p       = make('p')
		if(data.activeCard == 3) {
			sender.addEventListener('click', () => {
				this.clear(`@${data.sender} `)
				this.input.focus()
				this.inFocus = true
			})
			sender.classList.add('whisper-sender')
		}
		p.appendChild(sender)
		p.appendChild(message)
		const card = this.allCards[data.activeCard]
		card.appendChild(p) 
		if(!this.playerMovedScroll(card)) {
			this.scrollCardDown(card)
		}
		if(data.activeCard == 3 && this.activeCard != 3) {
			this.badgeValue++
			this.badge.innerText = this.badgeValue
			show(this.badgeCont)
		}
	}

	onPartyEvent(data) {
		if(data.code == 'created') {
			this.party = data.name
			hide(this.partyUI)
			hide(this.showPartyUI)
			show(this.leaveParty)
			alert('Successfully created a party! ' + data.name)
		} else if(data.code == 'nameTaken') {
			alert('A party with that name already exists')
		} else if(data.code == 'joined') {
			this.party = data.name
			hide(this.partyUI)
			hide(this.showPartyUI)
			show(this.leaveParty)
			alert('You have joined a party! ' + data.name)
		} else if(data.code == 'notFound') {
			alert('Party with that name does not exist')
		}
	}
}