const colors = {
    red     : 0xFF0000, 
    green   : 0x00FF00, 
    blue    : 0x00FF00,
    white   : 0xFFFFFF,
    black   : 0x000000,
    yellow  : 0xFFFF00,
    violet  : 0xEE82EE,
    snow    : 0xFFFAFA,
    skyblue : 0x87CEEB,
    purple  : 0x800080,
    pink    : 0xFFC0CB,
    orange  : 0xFFA500,
    gray    : 0x808080,
    indigo  : 0x4B0082,
    gold    : 0xFFD700,
    cyan    : 0x00008B,
    brown   : 0xA52A2A,
    aqua    : 0x00FFFF
}

export class Renderer {

    constructor(PIXI, settings = {}) {
        this.PIXI      = PIXI
        this.settings  = settings
        this.colors    = colors
        this.app       = new PIXI.Application(settings)
        this.canvas    = this.app.view
        this.loader    = PIXI.loader
        this.resources = PIXI.loader.resources
        this.Sprite    = PIXI.Sprite
        this.stage     = this.app.stage
        this.renderer  = this.app.renderer
        this.Graphics  = PIXI.Graphics
        this.Text      = PIXI.Text
        this.Rectangle = PIXI.Rectangle
        this.Texture   = PIXI.Texture
        this.container = document.getElementById('gameContainer')
        this.stroke    = true
        this.rotation  = false
        this.prefix    = ''
        this.init()
    }

    init() {
        this.canvas.oncontextmenu    = ev => ev.preventDefault()
        this.container.style.width   = this.canvas.width  + 'px'
		this.container.style.height  = this.canvas.height + 'px'
        this.app.renderer.autoResize = true
        this.app.view.style.position = 'absolute'
        this.app.view.style.display  = 'block'
        this.container.appendChild(this.canvas)
    }

    load(_sources, prefix = '') {
        this.prefix = prefix
        return new Promise((resolve, reject) => {
            let sources = []
            _sources.forEach(src => sources.push(prefix + src)) 
            this.loader.add(sources).load(resolve())
       })
    }

    show() {
        this.container.style.display = 'block'
    }

    hide() {
        this.container.style.display = 'none'
    }

    defaultToStroke() {
        this.stroke = true
    }

    defaultToFill() {
        this.stroke = false
    }

    rotate(angle) {
    	this.rotation = angle
    }

    backgroundColor(color) {
        this.app.renderer.backgroundColor = color
    }

    enableFullScreen() {
        this.resize(window.innerWidth, window.innerHeight)
        window.addEventListener('resize', () => {
            this.resize(window.innerWidth, window.innerHeight)
        })
    }

    resize(X, Y) {
        this.renderer.resize(X, Y)
        this.container.style.width   = this.canvas.width  + 'px'
		this.container.style.height  = this.canvas.height + 'px'
    }

    add(obj) {
        this.stage.addChild(obj)
    }

    clear() {
        this.stage.removeChildren()
    }

    render() {
        this.renderer.render(this.stage)
    }

    strokeRect(X, Y, width, height, color, lineWidth = 1) {
        color = this.resolveColor(color)
        if(!color) return false
        const rectangle = new this.Graphics()
        rectangle.lineStyle(lineWidth, color, 1)
        rectangle.drawRect(X, Y, width, height)
        this.add(rectangle)
    }

    fillRect(X, Y, width, height, color) {
        color = this.resolveColor(color)
        if(!color) return false
        const rectangle = new this.Graphics()
        rectangle.beginFill(color)
        rectangle.drawRect(X, Y, width, height)
        rectangle.endFill()
        this.add(rectangle)
    }

    rect(...data) {
        if(this.stroke) {
            this.strokeRect(...data)
        } else {
            this.fillRect(...data)
        }
    }

    strokeRoundedRect(X, Y, width, height, color, radius, lineWidth = 1) {
        color = this.resolveColor(color)
        if(!color) return false
        const rectangle = new this.Graphics()
        rectangle.lineStyle(lineWidth, color, 1)
        rectangle.drawRoundedRect(X, Y, width, height, radius)
        this.add(rectangle)
    }

    fillRoundedRect(X, Y, width, height, color, radius) {
        color = this.resolveColor(color)
        if(!color) return false
        const rectangle = new this.Graphics()
        rectangle.beginFill(color)
        rectangle.drawRoundedRect(X, Y, width, height, radius)
        rectangle.endFill()
        this.add(rectangle)
    }

    roundedRect(...data) {
        if(this.stroke) {
            this.strokeRoundedRect(...data)
        } else {
            this.fillRoundedRect(...data)
        }
    }

     strokeCircle(X, Y, r, color, lineWidth = 1) {
        color = this.resolveColor(color)
        if(!color) return false
        const rectangle = new this.Graphics()
        rectangle.lineStyle(lineWidth, color, 1)
        rectangle.drawCircle(X, Y, r)
        this.add(rectangle)
    }

    fillCircle(X, Y, r, color) {
        color = this.resolveColor(color)
        if(!color) return false
        const rectangle = new this.Graphics()
        rectangle.beginFill(color)
        rectangle.drawCircle(X, Y, r)
        rectangle.endFill();
        this.add(rectangle)
    }

     circle(...data) {
        if(this.stroke) {
            this.strokeCircle(...data)
        } else {
            this.fillCircle(...data)
        }
    }

    strokeEllipse(X, Y, width, height, color, lineWidth = 1) {
        color = this.resolveColor(color)
        if(!color) return false
        const rectangle = new this.Graphics()
        rectangle.lineStyle(lineWidth, color, 1)
        rectangle.drawEllipse(X, Y, width, height)
        this.add(rectangle)
    }

    fillEllipse(X, Y, width, height, color) {
        color = this.resolveColor(color)
        if(!color) return false
        const rectangle = new this.Graphics()
        rectangle.beginFill(color)
        rectangle.drawEllipse(X, Y, width, height)
        rectangle.endFill()
        this.add(rectangle)
    }

    ellipse(...data) {
        if(this.stroke) {
            this.strokeEllipse(...data)
        } else {
            this.fillEllipse(...data)
        }
    }

    strokeLine(X1, X2, Y1, Y2, color, lineWidth = 1) {
        color = this.resolveColor(color)
        if(!color) return false
        const line = new this.Graphics()
        line.lineStyle(lineWidth, color, 1)
        line.moveTo(X1, Y2)
        line.lineTo(X2, Y2)
        this.add(line)
    }

    line(...data) {
        this.strokeLine(...data)
    }

    strokePolygon(points, color, lineWidth = 1) {
        color = this.resolveColor(color)
        if(!color) return false
        const polygon = new this.Graphics()
        polygon.lineStyle(lineWidth, color, 1)
        polygon.moveTo(points[0], points[1])
        for(let i = 2; i < points.length; i+=2) {
            polygon.lineTo(points[i], points[i+1])
        }
        polygon.lineTo(points[0], points[1])
        this.add(polygon)
    }

    fillPolygon(points, color) {
        color = this.resolveColor(color)
        if(!color) return false
        const polygon = new this.Graphics()
        polygon.beginFill(color)
        polygon.drawPolygon(points)
        polygon.endFill()
        this.add(polygon)
    }

    polygon(...data) {
        if(this.stroke) {
            this.strokePolygon(...data)
        } else {
            this.fillPolygon(...data)
        }
    }

    image(src, sX, sY, sWidth, sHeight, dX, dY, dWidth = false, dHeight = false) {
        const texture = this.getTexture(src, sX, sY, sWidth, sHeight),
              sprite  = new this.Sprite(texture)
        sprite.position.set(dX, dY)
        if(dWidth) {
            sprite.width  = dWidth
            sprite.height = dHeight
        } else {
        	sprite.width  = sWidth
        	sprite.height = sHeight
        }
      	if(this.rotation) {
      		sprite.anchor.set(0.5, 0.5)
      		sprite.rotation = this.rotation
      		this.rotation   = false
      	}
        this.add(sprite)
    }

    imageBasic(src, dX, dY, width, height) {
    	const texture = this.getTextureBasic(src),
    	      sprite  = new this.Sprite(texture)
    	sprite.position.set(dX, dY)
    	sprite.width  = width
    	sprite.height = height
    	if(this.rotation) {
      		sprite.anchor.set(0.5, 0.5)
      		sprite.rotation = this.rotation
      		this.rotation   = false
      	}
        this.add(sprite)
    }

    text(_text, X, Y, style) {
        const text = new this.Text(_text, style)
        text.position.set(X, Y)
        this.add(text)
    }

    getTexture(src, sX, sY, sWidth, sHeight) {
        return  new this.Texture(
            this.resources[this.prefix + src].texture, 
            new this.Rectangle(sX + 1, sY + 1, sWidth - 2, sHeight - 2)
        )
    }

    getTextureBasic(src) {
    	return new this.Texture(this.resources[this.prefix + src].texture)
    }

    resolveColor(color) {
        color = color.trim().replace(/ /g, '')
        if(color.startsWith('#')) {
            if(color.length == 7) {
                return '0x' + color.substring(1)
            } else {
                return '0x' + color.charAt(1) + color.charAt(1)
                            + color.charAt(2) + color.charAt(2) 
                            + color.charAt(3) + color.charAt(3)
            }
        } else if(color.startsWith('rgb(')) {
            const pattern = /(\d+),(\d+),(\d+)/,
                  matches = color.match(pattern),
                        r = parseInt(matches[1]),
                        g = parseInt(matches[2]),
                        b = parseInt(matches[3])
            return '0x' + this.rgbToHex(r, g, b)
        } else {
            color = this.colors[color.toLowerCase()]
            if(!color) {
                console.log('Color not found')
                return false
            }
            return color
        }
    }

    //Credits to stackoverflow \o/
    componentToHex(c) {
        const hex = c.toString(16)
        return hex.length == 1 ? "0" + hex : hex
    }

    rgbToHex(r, g, b) {
        return this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)
    }
}