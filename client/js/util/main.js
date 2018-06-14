const _root = "http://localhost:5000/"

function ajax(data) {
	const xhttp = new XMLHttpRequest();
	if(!data.url.startsWith('http://') && !data.url.startsWith('https://')) {
		if(data.url.startsWith('/')) {
			data.url = data.url.substring(1)
		}
		data.url = _root + data.url
	}
	xhttp.onreadystatechange = () => {
		if(xhttp.readyState == 4 && xhttp.status == 200) {
			if(data.callback) {
				data.callback(xhttp.responseText);
			}
		}
	}
	data.method = data.method.toUpperCase();
	if(data.method == 'GET') {
		if(data.query) {
			xhttp.open("GET", data.url + "?" + data.query)
		} else {
			xhttp.open("GET", data.url)
		}
		xhttp.send();
	} else if(data.method == 'POST') {
		xhttp.open("POST", data.url);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		if(data.query) {
			xhttp.send(data.query);
		} else {
			xhttp.send()
		}
	}
}


function getById(id) {
	return document.getElementById(id)
}

function getByClass(className) {
	return document.getElementsByClassName(className)
}

function make(data, text = '') {
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

function hide(element) {
	element.style.display = 'none'
}

function show(element) {
	element.style.display = 'block'
}

