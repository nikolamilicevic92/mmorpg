import { Point } from '../tools/geometry'
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
		this.msgCount     = [0, 0, 0, 0, 0]
		this.msgsPerCard  = 50
		this.maxMsgLength = 100
		this.areaRange    = 1500
		this.badgeCont    = getById('whisperUnseenCounter')
		this.badge        = getById('whisperUnseenCounterValue')
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
		this.container.addEventListener('mouseover', () => {
			this.game.mouse.hide()
		})
		this.container.addEventListener('mouseout', () => {
			this.game.mouse.show()
		})
		this.partyUI.addEventListener('mouseover', () => {
			this.game.mouse.hide()
		})
		this.partyUI.addEventListener('mouseout', () => {
			this.game.mouse.show()
		})
		this.container.oncontextmenu = ev => ev.preventDefault()
		this.partyUI.oncontextmenu   = ev => ev.preventDefault()
		this.showPartyUI.addEventListener('click', () => {
			show(this.partyUI)
			this.partyName.focus()
		})
		this.closePartyUI.addEventListener('click', () => hide(this.partyUI))
		this.createParty.addEventListener('click', () => {
			 this.isValidPartyName()
			.then(name => this.emitPartyEvent({code: 'make', name}))
			.catch(err => this.alertPartyInfo(err, true))
		})
		this.joinParty.addEventListener('click', () => {
			 this.isValidPartyName()
			.then(name => this.emitPartyEvent({code: 'join', name}))
			.catch(err => this.alertPartyInfo(err, true))
		})
		this.leaveParty.addEventListener('click', () => {
			this.emitPartyEvent({code: 'leave', name: this.party})
			this.party = ''
			this.resetPartyChat()
			hide(this.leaveParty)
			show(this.showPartyUI)
		})
		for(let i = 0; i < this.allLinks.length; i++) {
			this.allLinks[i].addEventListener('click', () => {
				show(this.chatContent)
				hide(this.maximize)
				show(this.minimize)
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
		this.partyName.addEventListener('focus', () => this.game.self.props.canMove = false)
		this.partyName.addEventListener('blur' , () => this.game.self.props.canMove = true)
		this.input.setAttribute('maxlength', this.maxMsgLength)
		this.input.addEventListener('focus', () => this.game.self.props.canMove = false)
		this.input.addEventListener('blur' , () => this.game.self.props.canMove = true)
		this.input.addEventListener('keyup', ev => {
			if(ev.keyCode == 13 && this.input.value != '') {
				this.sendMessage()
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
		const card = this.allCards[i], link = this.allLinks[i]
		show(card)
		if(i == 3) {
			this.badgeValue = 0
			this.badge.innerText = ''
			hide(this.badgeCont)
		}
		this.scrollCardDown(card)
		link.classList.add('selected-chat-link')
		this.input.value = this.inputValues[i]
		//Disabling input in combat chat
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
			if(!data) return
			data.message = this.validateMessage(data.message)
			if(!data.message) return	
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

			//If it is a party
		} else if(this.activeCard == 2) {
			this.clear()
			message = this.validateMessage(message)
			if(!message) return
			if(this.party != '') {
				this.socket.emit('party', {
					code    : 'message',
					sender  : this.game.selectedHero,
					message : message,
					name    : this.party
				})
			} else {
				this.alertChatError('You are not in a party')
			}
			//If it is area chat we're sending our coordinates as well
		} else if(this.activeCard == 1) {
			this.clear()
			message = this.validateMessage(message)
			if(!message) return
			this.socket.emit('chat', {
				activeCard : this.activeCard,
				sender     : this.game.selectedHero,
				message    : message,
				X          : this.game.self.props.X,
				Y          : this.game.self.props.Y
			})
		} else {
			this.clear()
			message = this.validateMessage(message)
			if(!message) return
			this.socket.emit('chat', {
				activeCard : this.activeCard,
				sender     : this.game.selectedHero,
				message    : message
			})
		}
	}

	clear(value = '') {
		this.inputValues[this.activeCard] = value
		this.input.value = value
	}

	parseWhisperInput(text) {
		if(!text.startsWith('@')) {
			this.alertChatError('Invalid format, use @name my message')
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

	appendMessage(data, combat = false) {
		//If it is area chat, checking if sender is within range
		if(data.activeCard == 1) {
			if(Point.distance({
				X: data.X, Y: data.Y
			}, {
				X: this.game.self.props.X,
				Y: this.game.self.props.Y
			}) > this.areaRange) {
				return
			}
		}

		const sender  = make('span.sender', combat ? '' : '(' + data.sender + ') : '),
			  message = make('span', data.message),
			  p       = make('p')

		//When clicking on a sender name in whisper, @sender is placed in input
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

		//Removing first message if card has too many messages
		if(++this.msgCount[data.activeCard] > this.msgsPerCard) {
			card.removeChild(card.querySelector('p:first-child'))
		}

		if(!this.playerMovedScroll(card)) {
			this.scrollCardDown(card)
		}

		//Displaying whisper counter
		if(data.activeCard == 3 && this.activeCard != 3) {
			this.badgeValue++
			this.badge.innerText = this.badgeValue
			show(this.badgeCont)
		}
	}

	validateMessage(message) {
		message = message.trim().substring(0, this.maxMsgLength)
		if(message == '') return false

		return message.replace(/fuck/g, '****')
	}

	isValidPartyName() {
		return new Promise((resolve, reject) => {
			const name = this.partyName.value.trim()
			if(name == '') {
				reject('Party name missing')
			} else {
				resolve(name)
			}
		})
	}

	emitPartyEvent(data) {
		const pack = Object.assign(
			{}, data, {
				id       : this.game.self.props.id,
				heroName : this.game.self.props.name
			})
		this.socket.emit('party', pack)
		this.partyName.value = ''
	}

	onPartyEvent(data) {
		if(data.code == 'created') {
			this.party = data.name
			this.hidePartyUI()
		} else if(data.code == 'nameTaken') {
			this.alertPartyInfo('Party already exists', true)
		} else if(data.code == 'joined') {
			this.party = data.name
			this.hidePartyUI()
		} else if(data.code == 'notFound') {
			this.alertPartyInfo('Party not found', true)
		}
	}

	hidePartyUI() {
		hide(this.partyUI)
		hide(this.showPartyUI)
		show(this.leaveParty)
	}

	resetPartyChat() {
		this.allCards[2].innerHTML = ''
		this.inputValues[2]        = ''
		this.msgCount[2]           = 0
		if(this.activeCard == 2) {
			this.input.value = ''
		}
	}

	alertChatError(msg) {
		this.input.value = msg
		this.input.style.color = '#ff3200'
		setTimeout(() => {
			this.input.value = ''
			this.input.style.color = 'white'
		}, 3000)
	}

	alertPartyInfo(msg, err = false) {
		this.partyName.value = msg
		this.partyName.style.color = err ? 'red' : 'green'
		setTimeout(() => {
			this.partyName.value = ''
			this.partyName.style.color = 'black'
		}, 3000)
	}
}