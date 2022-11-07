const path = require('path')
const db = require("../database/models");
const { literal } = require("sequelize");
const { literalQueryUrlImage } = require("../helpers/literalQueryUrlImage");

module.exports = {
    image: (req, res) => {
        res.sendFile(path.join(__dirname,`../../public/images/avatars/${req.params.img}`))
    },
    update: async (req, res) => {
        try {
            const options =  {
                include: [{
                  association: 'addresses',
                  attributes: {
                    exclude: ['userId', 'deletedAt']
                  }
                }],
                attributes: {
                  exclude: ['deletedAt','password'],
                  include: [literalQueryUrlImage(req, "avatar", "avatar", "/users")]
                }
              }
            const {id} = req.userToken
            const {name, surname, street, city, province} = req.body
             
            const user = await db.User.findByPk(id, options)

            user.name = name?.trim() || user.name 
            user.surname = surname?.trim() || user.surname
            user.avatar = req.file?.filename || user.avatar 

            const indexAddressActive = user.addresses.findIndex(address => address.active === true)
            const address = user.addresses[indexAddressActive]
            address.street = street?.trim() || address.street
            address.city = city?.trim() || address.city
            address.province = province?.trim() || address.province

            await user.save()
            await user.addresses[indexAddressActive].save()

            return res.status(200).json({
                ok: true,
                status: 200,
                data: user
            })

        } catch (error) {
            res.status(500).json({
              ok: false,
              status: 500,
              mge: error.message || "Ocurrio un error"
            })
        }

    },
    remove: async (req, res) => {
        try {
          const userId = req.params.id || req.UserToken.id
          const removeAddress = await db.Address.destroy({
            where: {userId}
          })
          const removeUser = await db.User.destroy({
            where: {id: userId}
          })

          if (!removeUser || !removeAddress) {
            return res.status(404).json({
              ok: false,
              status: 404,
              mge: "Es probable que el usuario no exista"
            })
          }

          res.status(200).json({
            ok: true,
            status: 200
          })

        } catch (error) {
          res.status(500).json({
            ok: false,
            status: 500,
            mge: error.mesage || "Server error"
          })          
        }
    }
}