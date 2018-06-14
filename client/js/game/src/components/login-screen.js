import { getById } from '../util/dom-functions'

export class LoginScreen {

	constructor(game) {
		this.game = game
		this.container = getById('loginScreen')
		this.username = getById('loginUsername')
		this.password = getById('loginPassword')
		this.submit = getById('loginBtn')
		this.link = getById('showRegisterScreen')
		this.errors = getById('loginErrors')
		this.init()
	}

	init() {
		this.submit.addEventListener('click', ev => {
			ev.preventDefault()
			this.trySubmit()
		})
		this.link.addEventListener('click', ev => {
			ev.preventDefault()
			this.hide()
			this.game.registerScreen.show()
		})
	}

	hide() {
		this.clear()
		this.container.style.display = 'none'
	}

	show() {
		this.container.style.display = 'block'
	}

	displayError(error) {
		this.errors.innerText = error
	}

	validate(username, password) {
		if(username.length == 0) {
			this.displayError('Username is required')
			return false
		} else if(password.length == 0) {
			this.displayError('Password is required')
			return false
		}
		return true
	}

	trySubmit() {
		const username = this.username.value.trim(),
			  password = this.password.value.trim()
		
		this.errors.value = ''
		if(this.validate(username, password)) {
			this.send(username, password)
		}
	}

	send(username, password) {
		this.game.socket.emit('/player/login', {
			username, password
		})
	}

	clear() {
		this.errors.innerText = ''
		this.username.value = ''
		this.password.value = ''
	}

	onEvent(data) {
		if(!data.success) {
			this.clear()
			this.displayError(data.message)
		} else {
			this.game.username = this.username.value
			this.clear()
			this.game.ownedHeroes = data.ownedHeroes
			this.game.heroSelection.init(data.ownedHeroes)
			this.hide()
			this.game.heroSelection.show()
		}
	}
}