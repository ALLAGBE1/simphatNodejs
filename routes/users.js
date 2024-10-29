var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
const nodemailer = require('nodemailer');
var authenticate = require('../authenticate');

const crypto = require('crypto');

function generateRandomCode() {
  const timestamp = Date.now().toString(); // Utilisation la date actuelle en millisecondes comme composant d'incrémentation
  const randomCode = crypto.randomBytes(3).toString('hex');
  return timestamp + '_' + randomCode;
}

var router = express.Router();
router.use(bodyParser.json());


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Récupère la liste complète des utilisateurs.
 *     responses:
 *       200:
 *         description: Succès - Liste des utilisateurs récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur - Impossible de récupérer la liste des utilisateurs.
 */
router.get('/', (req, res, next) => {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    })
    .catch((err) => next(err));
});


/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     description: Enregistre un nouvel utilisateur avec les informations fournies.
 *     requestBody:
 *       description: Données de l'utilisateur à enregistrer.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Succès - L'utilisateur a été enregistré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *       400:
 *         description: Mauvaise requête - L'adresse e-mail est requise.
 *       500:
 *         description: Erreur serveur - Une erreur s'est produite lors de l'enregistrement de l'utilisateur.
 */
router.post('/register', async (req, res, next) => {
  try {
    console.log("555555555555555555555555555555555555555");
    
    if (!req.body.number || req.body.number.toString().trim() === '') {
      throw new Error('Le numéro est requis.');
    }

    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

    // Vérifiez si l'email existe déjà
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        status: 'Cet email est déjà utilisé.' 
      });
    }

    const user = await User.register(
      new User({ number: req.body.number, email: req.body.email, name: req.body.name }),
      req.body.password
    );

    passport.authenticate('local')(req, res, () => {
      res.status(200).json({ success: true, status: 'Inscription réussie !' });
    });
  } catch (err) {
    console.error(err);

    // Vérification si l'erreur est liée à un email dupliqué
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ 
        success: false, 
        status: 'Cet email est déjà utilisé.'
      });
    }

    res.status(500).json({ 
      success: false, 
      status: 'Une erreur s\'est produite lors de l\'enregistrement.' 
    });
  }
});




// router.post('/register', async (req, res, next) => {
//   try {
//     console.log("555555555555555555555555555555555555555");
//     if (!req.body.number || req.body.number.toString().trim() === '') {
//       throw new Error('Le numéro est requis.'); 
//     }
    
//     console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

//     const user = await User.register(
//       new User({ number: req.body.number, email: req.body.email, name: req.body.name, }),
//       req.body.password
//     );


//     passport.authenticate('local')(req, res, () => {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'application/json');
//       res.json({ success: true, status: 'Inscription réussie !' });
//     });
//   } catch (err) {
//     console.error(err);
//     res.statusCode = 500;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({ success: false, status: 'Une erreur s\'est produite lors de l\'enregistrement.' });
//   }
// });


// router.post('/register', async (req, res, next) => {
//   try {
//     console.log("555555555555555555555555555555555555555");
//     if (!req.body.number || req.body.number.toString().trim() === '') {
//       throw new Error('Le numéro est requis.'); 
//     }
    
//     // if (!req.body.email || req.body.email.trim() === '') {
//     //   throw new Error('L\'adresse e-mail est requise.'); 
//     // }

//     console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

//     // const user = await User.register(
//     //   new User({ email: req.body.email, name: req.body.name, username: req.body.username, }),
//     //   req.body.password
//     // );

//     const user = await User.register(
//       new User({ number: req.body.number, email: req.body.email, name: req.body.name, }),
//       req.body.password
//     );


//     passport.authenticate('local')(req, res, () => {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'application/json');
//       res.json({ success: true, status: 'Inscription réussie !' });
//     });
//   } catch (err) {
//     console.error(err);
//     res.statusCode = 500;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({ success: false, status: 'Une erreur s\'est produite lors de l\'enregistrement.' });
//   }
// });

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     description: Connecte un utilisateur en vérifiant les informations d'identification fournies.
 *     requestBody:
 *       description: Informations d'identification de l'utilisateur pour la connexion.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Succès - L'utilisateur est connecté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Non autorisé - Échec de la connexion en raison d'informations d'identification incorrectes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 err:
 *                   type: string
 *       500:
 *         description: Erreur serveur - Une erreur s'est produite lors de la tentative de connexion.
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      const response = {
        success: false,
        status: 'Connexion échouée !',
        err: info,
      };
      console.log(response);
      res.json(response);
      return;
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: false,
          status: 'Connexion échouée !',
          err: "Impossible de connecter l'utilisateur !",
        });
        console.log(res.json({
          success: false,
          status: 'Connexion échouée !',
          err: "Impossible de connecter l'utilisateur !",
        }));
        return;
      }

      var token = authenticate.getToken({ _id: req.user._id });

      // const { _id, name, username, admin, email, default_currency, crypto, key_word, codeVerify, __v } = user;
      // const sanitizedUser = { _id, name, username, admin, email, default_currency, crypto, key_word, codeVerify, __v };

      const { _id, name, admin, email, number, codeVerify, __v } = user;
      const sanitizedUser = { _id, name, admin, email, number, codeVerify, __v };

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      result = res.json({
        success: true,
        status: 'Connexion réussie !',
        token: token,
        user: sanitizedUser,
      });
      // console.log(result);
      console.log("Super************************");
    });
  })(req, res, next);
});


async function sendResetPasswordEmail(userEmail, userName, verificationCode) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'emailjosue256@gmail.com', 
      pass: 'usrgwuokswffsrek', 
    },
  });

  let mailOptions = {
    from: 'emailjosue256@gmail.com',
    to: userEmail,
    subject: 'Réinitialisation du mot de passe',
    text: `Bonjour ${userName}, vous avez demandé la réinitialisation de votre mot de passe. Votre code de vérification est : ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email de réinitialisation envoyé : ' + info.response);
    }
  });
}

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Envoyer un email de réinitialisation de mot de passe
 *     description: Vérifie l'existence de l'adresse e-mail dans la base de données et envoie un code de réinitialisation du mot de passe par email.
 *     requestBody:
 *       description: Adresse e-mail pour laquelle envoyer le code de réinitialisation.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Succès - Email de réinitialisation envoyé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *       404:
 *         description: Non trouvé - L'adresse e-mail n'existe pas dans la base de données.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *       500:
 *         description: Erreur serveur - Une erreur s'est produite lors de la tentative d'envoi de l'email de réinitialisation.
 */
router.post('/forgot-password', async (req, res, next) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('L\'adresse e-mail n\'existe pas.');
    }

    const verificationCode = generateRandomCode();
    // codeVerify
    // await user.setPassword(verificationCode);
    await user.updateOne({ codeVerify: verificationCode });

    await sendResetPasswordEmail(user.email, user.name, verificationCode);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'Email de réinitialisation envoyé.' });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: false, status: 'Une erreur s\'est produite.' });
  }
});

/**
 * @swagger
 * /users/update/password:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     description: Permet à l'utilisateur de renseigner le code de vérification envoyé et de définir un nouveau mot de passe.
 *     requestBody:
 *       description: Code de vérification et nouveau mot de passe.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codeVerify:
 *                 type: string
 *               newpassword:
 *                 type: string
 *             required:
 *               - codeVerify
 *               - newpassword
 *     responses:
 *       200:
 *         description: Succès - Mot de passe réinitialisé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Non trouvé - Code de vérification incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     status:
 *                       type: integer
 *       500:
 *         description: Erreur serveur - Une erreur s'est produite lors de la tentative de réinitialisation du mot de passe.
 */
router.post('/update/password', async (req, res, next) => {
  try {
    const { codeVerify, newpassword } = req.body;

    const user = await User.findOne({ codeVerify });

    if (!user) {
      const err = new Error('Code de vérification incorrect. Veuillez insérer le bon.');
      err.status = 404;
      console.error('Error:', err.message);
      return next(err);
    }

    user.setPassword(newpassword, async (err) => {
      if (err) {
        return next(err);
      }

      await user.save();

      res.status(200).json(user);
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/update/{user}:
 *   put:
 *     summary: Mettre à jour les informations utilisateur
 *     description: Permet à un utilisateur connecté de mettre à jour ses informations personnelles.
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         description: L'identifiant de l'utilisateur à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Nouvelles informations utilisateur.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Succès - Informations utilisateur mises à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Non trouvé - L'utilisateur à mettre à jour n'a pas été trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     status:
 *                       type: integer
 *       500:
 *         description: Erreur serveur - Une erreur s'est produite lors de la tentative de mise à jour des informations utilisateur.
 */
router.put('/update/:user', authenticate.verifyUser, (req, res, next) => {
  User.findById(req.params.user) 
    .then((user) => {
      if(user != null) {
        User.findByIdAndUpdate(req.params.user, { $set: req.body }, { new: true })
        .then((user) => {
          User.findById(user._id)
          .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user); 
          });
        })
        .catch((err) => next(err));
      }
      else {
        err = new Error('Prestataires ' + req.params.user + ' introuvable');
        err.status = 404;
        return next(err);            
    }
    })
    .catch((err) => next(err));
});


// router.get('/logout', (req, res, next) => {
//   // Utilisation la méthode logout() de Passport pour déconnecter l'utilisateur
//   req.logout();

//   // Déstruction la session si express-session utilisé
//   req.session.destroy();

//   // Efface le cookie de session si j'en utilise un
//   res.clearCookie('session-id');

//   // Redirige l'utilisateur vers la page d'accueil
//   res.redirect('/');
//   console.log("Tu es déconnecté");
// });
// 

module.exports = router;
