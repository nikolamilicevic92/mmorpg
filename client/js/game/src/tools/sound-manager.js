export class SoundManager {

	constructor() {
		this.sounds = null
		this.soundsEnded = {}
		this.soundsToLoop = {}
		this.soundsPlaying = {}
	}

	init(sounds) {
		this.sounds = sounds
		for(let src in sounds) {
			this.soundsEnded[src] = false
			sounds[src].addEventListener('ended', () => {
				this.soundsEnded[src] = true
			})
		}
	}

	play(src, loop = false) {
		if(!this.sounds[src]) {
			console.error('Sound ' + src + ' not found')
			return
		}
		this.soundsEnded[src] = false
		this.soundsPlaying[src] = true
		this.sounds[src].currentTime = 0
		this.sounds[src].play()
		if(loop) {
			this.soundsToLoop[src] = true
		}
	}

	stop(src) {
		if(!this.sounds[src]) {
			console.error('Sound ' + src + ' not found')
			return
		}
		this.soundsEnded[src] = true
		this.soundsPlaying[src] = false
		this.sounds[src].pause()
		this.sounds[src].currentTime = 0
		if(this.soundsToLoop[src]) {
			delete this.soundsToLoop[src]
		}
	}

	setVolume(src, volume) {
		this.sounds[src].volume = volume
	}

	update() {
		for(let src in this.soundsPlaying) {
			if(this.soundsEnded[src]){
				if(this.soundsToLoop[src]) {
					this.soundsEnded[src] = false
					this.sounds[src].currentTime = 0
					this.sounds[src].play()
				} else {
					delete this.soundsPlaying[src]
				}
			}
		}
	}
}