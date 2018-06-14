export class MovableDom {

	constructor() {
		this.elements = {}
	}

	//Independant part, change moveElement method if needed
	enableMovement(elToMove, elToHold = false) {
		if(!elToHold) elToHold = elToMove
		const ID = Math.random() + ''
		this.elements[ID] = {
			held: false, 
			mouseXStart: null, mouseYStart: null
		}
		const element = this.elements[ID]
		elToHold.addEventListener('mousedown', ev => {
			if(ev.button != 0) return
			element.held = true
			this.saveState(elToMove, ID, ev)
		})
		window.addEventListener('mouseup', ev => {
			if(ev.button != 0) return
			element.held = false
		})
		document.addEventListener('mousemove', ev => {
			if(element.held) {
				const deltaX = parseInt(ev.clientX - element.mouseOriginX)
				const deltaY = parseInt(ev.clientY - element.mouseOriginY)
				this.moveElement(elToMove, ID, deltaX, deltaY)
			}
		})
	}

	saveState(element, ID, ev) {
		const cs = window.getComputedStyle(element)
		const Y = parseInt(cs.getPropertyValue('bottom'))
		const X = parseInt(cs.getPropertyValue('left'))
		this.elements[ID].originX = X
		this.elements[ID].originY = Y
		this.elements[ID].mouseOriginX = ev.clientX
		this.elements[ID].mouseOriginY = ev.clientY
	}

	moveElement(element, ID, deltaX, deltaY) {
		const X = this.elements[ID].originX + deltaX
		const Y = this.elements[ID].originY - deltaY
		element.style.bottom = Y + 'px'
		element.style.left = X + 'px'
	}
}