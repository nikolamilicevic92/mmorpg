import { Mouse } from './mouse';
import { Map } from './map';
import { SpriteManager } from './sprite-manager';
import { Settings } from './settings';
import { Camera } from './camera';
import { ajax } from './ajax';

const config = {
	canvasWidth: 790,
	canvasHeight: 575,
	mapWidth: 10000,
	mapHeight: 10000,
	tileSize: 32,
	sprites: [
		'terrain_atlas.png',
		'Castle2.png',
		'PathAndObjects.png',
		'mountain_landscape.png',
		'plants.png',
		'tree-variations.png'
	],
	spritesMargin: [0]
}

const canvas = document.querySelector('canvas');
canvas.width = config.canvasWidth;
canvas.height = config.canvasHeight;

const mouse = new Mouse();
const settings = new Settings();
const mapWidth = config.tileSize * parseInt(config.mapWidth / config.tileSize);
const mapHeight = config.tileSize * parseInt(config.mapHeight / config.tileSize);
const camera = new Camera(canvas, mapWidth, mapHeight, mouse);



const spriteManager = new SpriteManager(config.tileSize, settings);

const mapDependiecies = [
	canvas,
	spriteManager,
	mouse,
	settings,
	camera,
	ajax
];

const map = new Map(config.mapWidth, config.mapHeight, config.tileSize, ...mapDependiecies);

spriteManager.loadNewSprites(config.tileSize, config.sprites, config.spritesMargin);


function animate(t = 0) {
	requestAnimationFrame(animate);
	
	camera.update();
	map.update();
	map.render();
}
animate();