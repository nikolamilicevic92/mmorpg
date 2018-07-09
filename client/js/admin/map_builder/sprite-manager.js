import { Sprite } from './sprite';

export class SpriteManager {

	constructor(tileSize, settings) {
		this.sprites = [];
		this.spriteSources = [];
		this.spritesMargin = [];
		this.activeSpriteIndex = 0;
		this.activeSprite = null;
		this.settings = settings;
		this.tileSize = tileSize;
		this.selectRef = document.getElementById('sprites');
		this.selectRef.addEventListener('change', (ev) => {
			this.activeSprite.container.style.display = 'none';
			this.activeSpriteIndex = parseInt(ev.target.value);
			this.activeSprite = this.sprites[this.activeSpriteIndex];
			this.activeSprite.container.style.display = 'block';
		});
	}
	
	add(imgSrc, margin = 0) {
		const sprite = new Sprite(imgSrc, this.tileSize, margin, this.settings);
		this.sprites.push(sprite);
		this.spriteSources.push(imgSrc);
		this.spritesMargin.push(margin);
		this.activeSpriteIndex = this.sprites.length - 1;
		if(this.activeSprite) {
			this.activeSprite.container.style.display = 'none';
		}
		this.activeSprite = sprite;
		this.activeSprite.container.style.display = 'block';
		const option = document.createElement('option');
		option.setAttribute('value', this.activeSpriteIndex);
		option.innerText = imgSrc.replace('.png', '');
		this.selectRef.appendChild(option);
		this.selectRef.value = this.activeSpriteIndex;
	}
	clear() {
		this.sprites = [];
		this.spriteSources = [];
		this.spritesMargin = [];
		this.activeSpriteIndex = 0;
		this.activeSprite = null;
		this.selectRef.innerHTML = '';
		document.getElementById('spritesContainer').innerHTML = '';
	}
	loadNewSprites(tileSize, sources, margins) {
		this.clear();
		this.tileSize = tileSize;
		for(let i = 0; i < sources.length; i++) {
			this.add(sources[i], margins[i]);
		}
	}

}