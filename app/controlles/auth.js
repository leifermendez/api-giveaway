const {httpError} = require('../helpers/handleError')
const {encrypt, compare} = require('../helpers/handleBcrypt')
const {tokenSign} = require('../helpers/generateToken')
const {checkSub, checkUser} = require('../helpers/checkSubYt')
const youtubeProvider = require('../../config/oatuh.yt')
const userModel = require('../models/users')

//TODO: Login!
const loginCtrl = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await userModel.findOne({email})

        if (!user) {
            res.status(404)
            res.send({error: 'User not found'})
        }

        const checkPassword = await compare(password, user.password) //TODO: Contraseña!

        //TODO JWT 👉
        const tokenSession = await tokenSign(user) //TODO: 2d2d2d2d2d2d2

        if (checkPassword) { //TODO Contraseña es correcta!
            res.send({
                data: user,
                tokenSession
            })
            return
        }

        if (!checkPassword) {
            res.status(409)
            res.send({
                error: 'Invalid password'
            })
            return
        }

    } catch (e) {
        httpError(res, e)
    }
}

//TODO: Registramos usuario!
const registerCtrl = async (req, res) => {
    try {
        //TODO: Datos que envias desde el front (postman)
        const {email, password, name} = req.body

        const passwordHash = await encrypt(password) //TODO: (123456)<--- Encriptando!!
        const registerUser = await userModel.create({
            email,
            name,
            password: passwordHash
        })

        res.send({data: registerUser})

    } catch (e) {
        httpError(res, e)
    }
}

//TODO: Obtener perfil
const getProfile = async (req, res) => {
    res.send({data: req.user})
}

const loginYtCtrl = (req, res, next) => {
    const {query} = req
    return youtubeProvider(req).authenticate('youtube')(req, res, next)
}

const saveUser = async (user) => {
    const {email} = user
    return userModel.findOneAndUpdate({email}, user, {
        upsert: true,
        new: true
    });
}
/**
 * Login Facebook Callback
 */
const loginCbYt = async (req, res, next) => {
    return youtubeProvider(req).authenticate(
        'youtube',
        {failureRedirect: '/'},
        async (rq, rs) => {
            try {
                if (rq.accessToken) {
                    const subData = await checkSub(rq.accessToken)
                    const userDataRaw = await checkUser(rq.accessToken)
                    const userData = {...userDataRaw.data, ...{name: rq.profile.displayName}}
                    const isSub = subData.data.items.shift() || {id: 0};
                    const newData = {...userData, ...{ytToken: rq.accessToken, isSub: isNaN(isSub.id)}};
                    const userReturn = await saveUser({
                        email: newData.email,
                        idYt: newData.sub,
                        name: newData.name,
                        password: '.........',
                        avatar: '',
                        isSub: newData.isSub
                    })
                    console.log(userReturn)
                    const token = await tokenSign(userReturn)
                    res.redirect(`${process.env.FRONT_URL}/auth/callback?provider=youtube&tok=${token}&sub_confirmation=${isSub.id}`)
                    // res.redirect(`${process.env.FRONT_URL}/test/${objQuery.course}/${objQuery.test}?sub_confirmation=${isSub.id}`)
                } else {
                    console.log('** ERROR **', JSON.stringify(rq))
                    res.redirect(`${process.env.FRONT_URL}?error=SESSION_EXPIRED`)
                }
            } catch (e) {
                console.log(e)
                res.redirect(`${process.env.FRONT_URL}?error_login=youtube`)
            }
        }
    )(req, res, next)
}


module.exports = {loginCtrl, registerCtrl, loginYtCtrl, loginCbYt, getProfile}
