import { getById } from '../util/dom-functions'

export class LoginScreen {

	constructor(game) {
		this.game = game
		this.container = getById('loginScreen')
		this.username = getById('loginUsername')
		this.password = getById('loginPassword')
		this.submit = getById('loginBtn')
		this.rememberMe = getById('rememberMe')
		this.remember = false
		this.link = getById('showRegisterScreen')
		this.errors = getById('loginErrors')
		this.init()
	}

	init() {
		const username = localStorage.getItem('username'),
					password = localStorage.getItem('password')
		if(username && password) {
			this.username.value = username
			this.password.value = password
			this.rememberMe.checked = true
		}
		this.submit.addEventListener('click', ev => {
			ev.preventDefault()
			if(this.remember) {
				localStorage.setItem('username', this.username.value)
				localStorage.setItem('password', this.password.value)
			}
			this.trySubmit()
		})
		this.link.addEventListener('click', ev => {
			ev.preventDefault()
			this.hide()
			this.game.registerScreen.show()
		})
		this.rememberMe.addEventListener('change', () => {
			if(this.rememberMe.checked) {
				this.remember = true;
			} else {
				this.remember = false;
				localStorage.removeItem('username')
				localStorage.removeItem('password')
			}
		})
	}

	hide() {
		this.clear()
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