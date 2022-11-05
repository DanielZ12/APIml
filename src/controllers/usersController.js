const path = require('path')

module.exports = {
    image: (req, res) => {
        res.sendFile(path.join(__dirname,`../../public/images/avatars/${req.params.img}`))
    },
    update: (req, res) => {

    },
    remove: (req, res) => {
        
    }
}