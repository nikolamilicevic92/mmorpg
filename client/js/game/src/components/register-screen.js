import { getById } from '../util/dom-functions'


export class RegisterScreen {

	constructor(game) {
		this.game = game
		this.container = getById('registerScreen')
		this.email = getById('registerEmail')
		this.username = getById('registerUsername')
		this.password = getById('registerPassword')
		this.passwordConfirm = getById('registerPasswordConfirm')
		this.submit = getById('registerBtn')
		this.link = getById('showLoginScreen')
		this.errors = getById('registerErrors')
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
			this.game.loginScreen.show()
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

	validate(email, username, password, passwordConfirm) {
		if(email.length == 0) {
			this.displayError('Email is required')
			return false
		} else if(username.length == 0) {
			this.displayError('Username is required')
			return false
		} else if(password.length == 0) {
			this.displayError('Password is required')
			return false
		} else if(password != passwordConfirm) {
			this.displayError('Passwords do not match')
			return false
		}
		return true
	}

	trySubmit() {
		const email = this.email.value.trim(),
			  username = this.username.value.trim(),
			  password = this.password.value.trim(),
			  passwordConfirm = this.passwordConfirm.value.trim()
		this.errors.value = ''
		if(this.validate(email, username, password, passwordConfirm)) {
			this.send(email, username, password)
			this.clear()
		}
	}

	send(email, username, password) {
		this.game.socket.emit('/player/register', {
			email, username, password
		})
	}

	clear() {
		this.errors.innerText = ''
		this.email.value = ''
		this.username.value = ''
		this.password.value = ''
		this.passwordConfirm.value = ''
	}

	onEvent(data) {
		if(!data.success) {
			this.displayError(data.message)
		} else {
			this.hide()
			this.game.loginScreen.show()
		}
	}
}