function removeAbilityFromHero(heroTypeID, heroTypeAbilityID) {
	ajax({
		url: 'admin/removeAbilityFromHero',
		method: 'post',
		query: 'id=' + heroTypeAbilityID,
		callback: () => {
			 document.getElementById(`${heroTypeID}-${heroTypeAbilityID}`)
			.style.display = 'none'
		}
	})
}

// function addAbilityToHero(heroTypeID, abilityID) {
// 	ajax({
// 		url: 'admin/addAbilityToHero',
// 		method: 'post',
// 		query: `heroTypeID=${heroTypeID}&abilityID=${abilityID}`,
// 		callback
// 	})
// }