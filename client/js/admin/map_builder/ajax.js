const _root = "http://localhost:5000/"

export function ajax(data) {
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