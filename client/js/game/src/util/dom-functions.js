export function getById(id) {
	return document.getElementById(id)
}

export function getByClass(className) {
	return document.getElementsByClassName(className)
}

export function make(data, text = '') {
	data = data.split('.')
	const element = document.createElement(data[0])
	if(data.length == 2) {
		data = data[1].split(' ')
		element.classList.add(data[0])
		if(data.length == 2) {
			element.classList.add(data[1])
		}
	}
	element.innerText = text
	
	return element
}

export function hide(el) {
	el.style.display = 'none'
}
export function show(el) {
	el.style.display = 'block'
}