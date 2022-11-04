const { ROL_ADMIN, ROL_USER } = require('../constants');
const db = require('../database/models');
const {sign} = require("jsonwebtoken")

module.exports = {
    register: async (req, res) => {
        try {
          const {name, surname, email, password, street, city, province} = req.body

          if (!email || !password) {
            res.status(412).json({
                ok: false,
                status: 401
            })
          }
          const { id, rolId } = await db.User.create({
            name: name?.trim(),
            surname: surname?.trim(),
            email: email?.trim(),
            password: password?.trim(),
            street: street?.trim(),
            city: city?.trim(),
            province: province?.trim(),
            avatar: req.file?.filename || "default.png",
            rolId: ROL_USER,
          }); 
          await db.Address.create({
            street: name?.trim(),
            city: city?.trim(),
            province: province?.trim(),
            userId: id,
            active: true,
          });

          const token = await sign({ id, rolId}, process.env.SECRET_KEY_JWT, {
            expiresIn: "4h",
          });
    
          return res.status(201).json({
            ok: true,
            status: 201,
            token
          })
          

        } catch (error) {
            res.status(500).json({
                ok:false,
                status: 500,
                mge: "error en el server"
            });
        }
    },
    login: (req, res) => {

    },
    getUserAuthenticated: (req, res) => {
        
    }
}