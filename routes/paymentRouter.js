const express = require('express');
const FedaPay = require('fedapay');
const bodyParser = require('body-parser');

const paymentRouter = express.Router();
paymentRouter.use(bodyParser.json());

// Assurez-vous de configurer la clé API de FedaPay
FedaPay.apiKey = 'sk_live_FyP-YPnJ1dS20ur7KKB9wx6S';

// Endpoint pour créer une transaction FedaPay
paymentRouter.post('/initiate', async (req, res) => {
  const { amount, name, email, number } = req.body;

  try {
    // Créer un client pour le paiement
    const customer = await FedaPay.Customer.create({
      firstname: name,
      email: email,
      phone_number: {
        number: number,
        country: 'BJ', // BJ pour le Bénin, à ajuster selon votre région
      },
    });

    // Créer la transaction
    const transaction = await FedaPay.Transaction.create({
      description: 'Inscription à une activité',
      amount: amount,
      currency: 'XOF', // ou 'XOF' pour Franc CFA
      callback_url: 'http://localhost:3000/payment-success', // URL de succès après paiement
      customer: customer.id,
    });

    // Renvoyer l'URL de paiement à l'utilisateur
    res.status(200).json({ payment_url: transaction.generateToken().url });
  } catch (error) {
    console.error("Erreur lors de la création de la transaction FedaPay :", error);
    res.status(500).json({ error: "Erreur de transaction" });
  }
});

module.exports = paymentRouter;
