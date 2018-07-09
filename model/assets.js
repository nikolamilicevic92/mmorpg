const fs = require('fs')
const formidable = require('formidable')
const imagesPath = __dirname + '/../client/assets/images'
const soundsPath = __dirname + '/../client/assets/sounds'
const allowedSoundExtensions = ['.ogg', '.wav', '.mp3']
const allowedImageExtensions = ['.png', 'jpg', '.jpeg']

module.exports = class Assets {

  static deleteImage(image) {
    return new Promise((resolve, reject) => {
      fs.unlink(imagesPath + '/' + image, err => {
        if(err) {
          reject(err)
        } else {
          resolve(image)
        }
      })
    })
  }

  static deleteSound(sound) {
    return new Promise((resolve, reject) => {
      fs.unlink(soundsPath + '/' + sound, err => {
        if(err) {
          reject(err)
        } else {
          resolve(sound)
        }
      })
    })
  }

  static uploadImage(req) {    
    return new Promise((resolve, reject) => {      
      const form = new formidable.IncomingForm()      
      form.parse(req, (err, fields, files) => {                
        if(err) {
          reject(err)
        }
        const oldpath = files.filetoupload.path
        const newpath = imagesPath + '/' + files.filetoupload.name
        fs.rename(oldpath, newpath, err => {
          if(err) {
            reject(err)
          } else {
            resolve(files.filetoupload.name)
          }
        })
      })
    })
  }

  static uploadSound(req) {
    return new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm()
      form.parse(req, (err, fields, files) => {
        if(err) {
          reject(err)
        }
        const oldpath = files.filetoupload.path
        const newpath = soundsPath + '/' + files.filetoupload.name
        fs.rename(oldpath, newpath, err => {
          if(err) {
            reject(err)
          } else {
            resolve(files.filetoupload.name)
          }
        })
      })
    })
  }


  static renameSound(oldName, newName) {
    return new Promise((resolve, reject) => {
      const path = soundsPath + '/'
      fs.rename(path + oldName, path + newName, err => {
        if(err) {
          reject(err)
        } else {
          resolve(newName)
        }
      })
    })
  }

  static renameImage(oldName, newName) {
    return new Promise((resolve, reject) => {
      const path = imagesPath + '/'
      fs.rename(path + oldName, path + newName, err => {
        if(err) {
          reject(err)
        } else {
          resolve(newName)
        }
      })
    })
  }

  static getSounds() {
    return new Promise((resolve, reject) => {
      fs.readdir(soundsPath, (err, files) => {
        if(err) {
          reject(err)
        }
        for(let i = 0; i < files.length; i++) {
          const sound = files[i]
          const valid = Assets.validSound(sound)
          if(!valid) {
            files.splice(i, 1)
          }
        }
        resolve(files)
      })
    })
  }

  static validSound(sound) {
    let valid = false
    for(let j = 0; j < allowedSoundExtensions.length; j++) {
      if(sound.endsWith(allowedSoundExtensions[j])) {
        valid = true
        break
      }
    }
    return valid
  }

  static validImage(image) {
    let valid = false
    for(let j = 0; j < allowedImageExtensions.length; j++) {
      if(image.endsWith(allowedImageExtensions[j])) {
        valid = true
        break
      }
    }
    return valid
  }

  static getImages() {
    return new Promise((resolve, reject) => {
      fs.readdir(imagesPath, (err, files) => {
        if(err) {
          reject(err)
        }
        for(let i = 0; i < files.length; i++) {
          const image = files[i]
          const valid = Assets.validImage(image)
          if(!valid) {
            files.splice(i, 1)
          }
        }
        resolve(files)
      })
    })
  }
}