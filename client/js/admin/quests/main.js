const container = getByClass('update-quests-page')[0]

function deleteQuest(id) {
	ajax({
		url       : 'admin/delete-quest',
		method    : 'post',
		query     : 'id=' + id,
		callback  : () => {
			container.removeChild(getById(`quest-${id}`))
		}
	})
}