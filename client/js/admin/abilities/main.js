const forms = getByClass('ability')

function filterAbilities(name) {
	if(name == '') {
		showAllForms()
		return
	}
	for(let i = 0; i < forms.length; i++) {
		const abilityName = forms[i].querySelector('[name="name"]').value
		console.log(abilityName)
		if(abilityName.includes(name)) {
			showForm(forms[i])
		} else {
			hideForm(forms[i])
		}
	}
}

function showAllForms() {
	for(let i = 0; i < forms.length; i++) {
		showForm(forms[i])
	}
}

function hideAllForms() {
	for(let i = 0; i < forms.length; i++) {
		hideForm(forms[i])
	}
}

function showForm(form) {
	form.style.display = 'block'
}

function hideForm(form) {
	form.style.display = 'none'
}

function deleteAbility(id) {
	ajax({
		url: 'admin/deleteAbility',
		query: 'id=' + id,
		method: 'post',
		callback: () => {
			const c = getByClass('abilities-container')[0],
				  a = getById('ability-' + id)
			c.removeChild(a)
		}
	})
}