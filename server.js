// FOR default stripe behaviour

// const stripe = require('stripe')('sk_test_51HRuezHkbzSCimCfJ7kHjfyXogOLSrUfVFOFqBiGxqL0OhBGQGH1ySWQBgffpr83AVQetioaiuBmFIsxwXQaP8LZ00MNVO8iiY');

// const express = require('express');

// const app = express();

// app.use(express.static('.'));

// const YOUR_DOMAIN = 'http://localhost:3000';

// app.get('/', (req, res) => {
//     res.render('home.ejs')
// })

// app.get('/cancel.html', (req,res)=>{
//     res.render('cancel.ejs')
// })

// app.get('/success.html', (req, res) => {
//     res.render('success.ejs')
// })

// app.post('/create-checkout-session', async (req, res) => {
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         submit_type: 'donate',
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'inr',
//                     product_data: {
//                         name: 'Stubborn Attachments',
//                         images: ['https://i.imgur.com/EHyR2nP.png'],
//                     },
//                     unit_amount: 2000,
//                 },
//                 quantity: 1,
//             },
//         ],
//         mode: 'payment',
//         success_url: `${YOUR_DOMAIN}/success.html`,
//         cancel_url: `${YOUR_DOMAIN}/cancel.html`,
//     });
//     res.json({ id: session.id });
// });

const express = require('express')
const path = require('path')
const stripe = require("stripe")('sk_test_51HRuezHkbzSCimCfJ7kHjfyXogOLSrUfVFOFqBiGxqL0OhBGQGH1ySWQBgffpr83AVQetioaiuBmFIsxwXQaP8LZ00MNVO8iiY');
const httpPort = 3000
const httpsPort = 8000
const app = express()
const fs = require('fs')
const https = require('https')
const key = fs.readFileSync('./certs/localhost.key');
const cert = fs.readFileSync('./certs/localhost.crt');
const server = https.createServer({key: key, cert: cert }, app);
const port = process.env.PORT || 5000

// app.use((req, res, next) => {
//   if (!req.secure) {
//     return res.redirect(`https://${req.headers.host}`)
//   }
//   next();
// })

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.post('/payments', async (req, res) => {
   const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'inr'
   })
   res.send({
      clientSecret: paymentIntent.client_secret
   })
});

app.listen(port, function () {
  console.log(`Listening on port ${port}!`)
})
