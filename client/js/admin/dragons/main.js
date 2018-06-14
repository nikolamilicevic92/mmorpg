const newDragonForm  = getById('newDragonType'),
	  dragonTypes    = getById('dragonTypesContainer'),
	  spawnedDragons = getById('spawnedDragonsContainer'),
	  spawnNewDragon = getById('spawnNewDragon'),
	  searchX        = getById('searchX'),
	  searchY        = getById('searchY'),
	  searchWidth    = getById('searchWidth'),
	  searchHeight   = getById('searchHeight')

function showTypes() {
	hideAll()
	show(newDragonForm)
	show(dragonTypes)
}

function showSpawned() {
	hideAll()
	show(spawnNewDragon)
	show(spawnedDragons)
}

function hideAll() {
	hide(newDragonForm)
	hide(dragonTypes)
	hide(spawnedDragons)
	hide(spawnNewDragon)
}

function deleteSpawnedDragon(id) {
	ajax({
		url: '/admin/deleteSpawnedDragon',
		method: 'post',
		query: 'id=' + id,
		callback: () => {
			const spawnedDragon = getById(`spawnedDragon-${id}`)
			spawnedDragons.removeChild(spawnedDragon)
		}
	})
}

function deleteDragonType(id) {
		ajax({
		url: 'admin/deleteDragonType',
		method: 'post',
		query: 'id=' + id,
		callback: (info) => {
			info = JSON.parse(info)
			if(!info.success) {
				alert(info.message)
			} else {
				dragonTypes.removeChild(getById('dragonType-' + id))
			}
		}
	})
}

function filterSpawned() {
	const dragons = getByClass('spawned-dragon')
	for(let i = 0; i < dragons.length; i++) {
		const dX = dragons[i].querySelector('[name="X"]'),
		      dY = dragons[i].querySelector('[name="Y"]')
		if(isInRect(parseInt(dX.value), parseInt(dY.value))) {
			show(dragons[i])
		} else {
			hide(dragons[i])
		}
	}
}

function resetSpawned() {
	searchX.value = 0
	searchY.value = 0
	searchWidth.value  = 10000
	searchHeight.value = 10000
	const dragons = getByClass('spawned-dragon')
	for(let i = 0; i < dragons.length; i++) {
		show(dragons[i])
	}
}

function isInRect(dX, dY) {
	const X      = parseInt(searchX.value),
	      Y      = parseInt(searchY.value),
	      width  = parseInt(searchWidth.value),
	      height = parseInt(searchHeight.value)

	return (dX >= X && dX <= X + width && dY > Y && dY <= Y + height)
}

function searchType(type) {
	const dragons = getByClass('dragon-type')
	if(type == '') {
		for(let i = 0; i < dragons.length; i++) {
			show(dragons[i])
		}
		return
	}
	for(let i = 0; i < dragons.length; i++) {
		const name = dragons[i].querySelector('[name="name"]')
		if(name.value.includes(type)) {
			show(dragons[i])
		} else {
			hide(dragons[i])
		}
	}
}


