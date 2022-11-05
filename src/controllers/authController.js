const { ROL_ADMIN, ROL_USER } = require('../constants');
const db = require('../database/models');
const {sign} = require("jsonwebtoken");
const { hashSync, compare } = require('bcryptjs');
const { literalQueryUrlImage } = require("../helpers/literalQueryUrlImage");


module.exports = {
    register: async (req, res) => {
        try {
          const {name, surname, email, password, street, city, province} = req.body

          if (!email || !password) {
            return res.status(412).json({
                ok: false,
                status: 401
            })
          }
          const { id, rolId } = await db.User.create({
            name: name?.trim(),
            surname: surname?.trim(),
            email: email?.trim(),
            password: hashSync(password?.trim(), 12),
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
    login: async(req, res) => {
      try {
        const { email, password } = req.body

        if (!email || !password) {
          return res.status(401).json({
              ok: false,
              status: 401,
              msg: "El email y password son requeridos"
          })
        }

        const {id, rolId, password: passwordHash} = await db.User.findOne({
          where: {email}
        })
        if (!id) {
          return res.status(404).json({
            ok: false,
            status: 404,
            msg: "No existe el usuario"
        })
        }

        const isPassValid = await compare(password, passwordHash)

        if (!isPassValid) {
          return res.status(401).json({
            ok: false,
            status: 401,
            msg: "Credenciales invalidas"
        })
        }

        const token = await sign({ id, rolId}, process.env.SECRET_KEY_JWT, {
          expiresIn: "4h",
        });

        res.status(200).json({
          ok: true,
          status: 200,
          token,
          urlData: `${req.protocol}://${req.get('host')}${req.baseUrl}/me/${token}`
        })

      } catch (error) {
        res.status(500).json({
          ok:false,
          status: 500,
          mge: error.messege
      });
      }
    },
    getUserAuthenticated: async (req, res) => {
        try {
          const {id} = req.userToken
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
          const data = await db.User.findByPk(id,options)

          res.status(200).json({
            ok: true,
            status:200,
            data
          })


        } catch (error) {
          res.status(500).json({
            ok: false,
            status:500,
            msg: error.messege || "Error en el servidor"
          })
        }
    }
}