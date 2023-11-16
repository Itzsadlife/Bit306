const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Merchant = require('./models/register'); 
const User = require('./models/user')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Product = require('./models/product');
const details = {
    email: 'helptourcare@gmail.com',
    password: 'brpqhrygzstzjeno'
};
const multer = require('multer');
const path = require('path');
const Purchase = require('./models/purchase')
const Review = require('./models/review');



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, './uploads'));
     },     
    filename: function(req, file, cb) {
        const date = new Date().toISOString().replace(/:/g, '_').split('.')[0];
        const extension = path.extname(file.originalname);
        cb(null, extension + date + '.jpg');
    }    
});

const upload = multer({ storage: storage });


const cors = require('cors');


const app = express();


mongoose.connect("mongodb+srv://bit306:assignment@cluster0.uulatfu.mongodb.net/TourCare?retryWrites=true&w=majority")
.then(()=>{
    console.log('connected to database');
})
.catch(()=>{
    console.log('connection failed');
});

app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    next();
});

app.use(cors());

function generateRandomPassword(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const randomPassword = generateRandomPassword();
app.post("/api/merchants/register", (req, res, next) => {
    bcrypt.hash(randomPassword, 10).then(hash => {
    const merchant = new Merchant({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        description: req.body.description,
        password: hash,
    });

    // Log the data to CMD
    console.log('Received registration data:', req.body,randomPassword);

    merchant.save().then(result => {
        res.status(201).json({
            message: 'User registered successfully!',
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Failed to register user!',
            error: err
        });
    });
});
});

//done register send email
app.post("/api/register/sendmail",(req,res)=>{
    let merchant = req.body;
    sendMail(merchant,info=>{
        res.send(info);
    });

    async function sendMail(merchant,callback){
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port:587,
            secure: false,
            auth: {
                user: details.email,
                pass: details.password
            }
        });

        let mailOptions ={
            from: `Tour Care`,
            to: merchant.email,
            subject: `Sucessfully registered`,
            html:`<h1>Thank you for registering as a Merchant<br>
                  <h4> We will review your request <br>
                  <h4> You will be able to login once we approved your request
                  <h4> Email: ${merchant.email} Password: ${randomPassword};`
        };

        
        let info = await transporter.sendMail(mailOptions);

        callback(info);

    }
});

//after review send email
//accepted email
app.post("/api/review-register/accepted/sendmail",(req,res)=>{
    let merchant = req.body;
    sendMail(merchant,info=>{
        res.send(info);
    });

    async function sendMail(merchant,callback){
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port:587,
            secure: false,
            auth: {
                user: details.email,
                pass: details.password
            }
        });

        let mailOptions ={
            from: `Tour Care`,
            to: merchant.email,
            subject: `Registration Approved`,
            html:`<h1>Thank you for joining us as a Merchant<br>
                  <h4> You can now login <br>
                  <h4> Email: ${merchant.email} Password: ${randomPassword};`
        };
        
        let info = await transporter.sendMail(mailOptions);

        callback(info);

    }
});

//rejected

app.post("/api/review-request/rejected/sendmail",(req,res)=>{
    let merchant = req.body;
    sendMail(merchant,info=>{
        res.send(info);
    });

    async function sendMail(merchant,callback){
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port:587,
            secure: false,
            auth: {
                user: details.email,
                pass: details.password
            }
        });

        let mailOptions ={
            from: `Tour Care`,
            to: merchant.email,
            subject: `Registration Rejected`,
            html:`<h1>Thank you for registering as a Merchant<br>
                  <h4> We have decided to reject your registration <br>
                  <h4> You can register again if you wish`
        };
        
        let info = await transporter.sendMail(mailOptions);

        callback(info);

    }
});

app.get("/api/register", (req, res) => {
    res.send("This is the /api/register endpoint. Use POST to send data.");
});



// Fetch all merchants
app.get('/api/merchants', (req, res) => {
    Merchant.find({}).then(merchants => {
        console.log("Fetched merchants:", merchants);
        res.json(merchants);
    }).catch(err => {
        console.error("Error occurred:", err);
        res.status(500).send(err);
    });
});

app.get("/api/merchants/:merchantId", (req, res) => {
    console.log("Inside the merchant route");
    const merchantId = req.params.merchantId;
    Merchant.findById(merchantId).then(merchants =>{
        res.json(merchants);
    })
    console.log("Fetching merchant with ID:", merchantId);
    // Your logic to fetch merchant by ID goes here
});


// Update a merchant's status
app.patch('/api/merchants/:id', (req, res) => {
    const status = req.body.status;
    Merchant.updateOne({ _id: req.params.id }, { status: status })
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(500).send(err);
    });

    });

// Fetch all merchants
app.get('/api/merchants', (req, res) => {
    Merchant.find({}).then(merchants => {
        console.log("Fetched merchants:", merchants);
        res.json(merchants);
    }).catch(err => {
        console.error("Error occurred:", err);
        res.status(500).send(err);
    });
});


//users
app.post("/api/users/register", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            contactNumber: req.body.contactNumber,
            password: hash
        });

    // Log the data to CMD
    console.log('Received registration data:', req.body);

    user.save().then(result => {
        res.status(201).json({
            message: 'User registered successfully!',
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Failed to register user!',
            error: err
        });
    });
});
});

//login

app.post("/api/user/login", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("Email user",email)

    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Email not found.' });
        }
        return bcrypt.compare(password, user.password)
            .then(result => {
                if (!result) {
                    return res.status(401).json({ message: 'Incorrect password.' });
                }
                res.status(200).json({ message: 'Authentication successful!' });
            });
    })
    .catch(err => {
        // Log the error for debugging purposes
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
    });
});

app.post("/api/merchant/login", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const accept = "Accepted";
    const pending = "Pending";
    const reject = "Rejected";
    Merchant.findOne({ email: email })
    .then(merchant => {
        if (!merchant) {
            return res.status(401).json({ message: 'Email not found.' });
        }
        return bcrypt.compare(password, merchant.password)
            .then(result => {
                if (!result) {
                    return res.status(401).json({ message: 'Incorrect password.' });
                }
                else if (accept == merchant.status && merchant.isFirstLogin) {
                    return res.status(200).json({
                        message: 'Authentication successful! First login detected.',
                        _id: merchant._id  // Add this line to send back the merchant's _id
                    });
                } 
                else if (accept == merchant.status && !merchant.isFirstLogin) {
                    return res.status(200).json({
                        message: 'Authentication successful!',
                        _id: merchant._id  // Also send back the merchant's _id for normal logins
                    });
                }
                else if (pending == merchant.status){
                    return res.status(401).json({message: 'Registration is still under reviewing'});
                }
                else if (reject==merchant.status){
                    return res.status(401).json({message: 'Registration is rejected'});
                }
            });
    })
    .catch(err => {
        // Log the error for debugging purposes
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
    });
});

app.post("/api/change-password/merchants", (req, res, next) => {
    console.log(req.body);
    const merchantId = req.body.id;
    const newPassword = req.body.newPassword;

    if(!merchantId || !newPassword) {
        return res.status(400).json({ message: 'Merchant ID and password are required.' });
    }
    
    bcrypt.hash(newPassword, 10).then(hash => {
      Merchant.findByIdAndUpdate(merchantId, {
        password: hash,
        isFirstLogin: false
      }).then(() => {
        res.status(200).json({ message: 'Password updated successfully.' });
      }).catch(err => {
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
      });
    });
});

app.get("/api/products", (req, res, next) => {
    const merchantId = req.query.merchantId;
    console.log("Received merchantId:", merchantId);
    // If merchantId is provided in the query params, filter the products by that ID
    if (merchantId) {
        Product.find({ merchant_id: merchantId }).then(products => {
            res.json(products);
        }).catch(err => {
            console.error('Error fetching products from DB for merchant:', merchantId, err);
            res.status(500).send(err);
        });
    } else {
        // If no merchantId is provided, return all products
        Product.find({}).then(products => {
            res.json(products);
        }).catch(err => {
            console.error('Error fetching all products from DB:', err);
            res.status(500).send(err);
        });
    }
});

  
app.post("/api/product/add-product", upload.single('imageUrl'), (req, res, next) => {
    const product = new Product({
      ...req.body,
      merchantId : req.body.merchantId,
      imageUrl: req.file.path
    });
    product.save().then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        console.error(err);
        res.status(500).send(err);
    });
});

app.put("/api/product/edit-product/:id",(req,res,next)=>{
    Product.findById(req.params.id,req.body,{new:true}).then(product=>{
        res.json(product);
    }).catch(err=>{
        console.error(err);
        res.status(500).send(err);
    })
})

// Endpoint to get the list of products from the database
app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

    // Endpoint to record a purchase
app.post('/api/purchase', async (req, res) => {
    const { productName, customerName, customerEmail, paymentAmount } = req.body;
    const product = await Product.findOne({ name: productName });
  
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
  
    // Inside your POST request to /api/purchase
const purchase = new Purchase({
    product: productName, // Assuming productName contains the product name
    customerName,
    customerEmail,
    productId: product._id, // Assuming product contains the product details
    //userId: user._id, // Assuming user contains the user details
    price: paymentAmount,
  });
  
  

    try {
        await purchase.save();
        res.status(201).json({ message: 'Purchase recorded successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    // Route to get purchased products by user email
app.get('/api/purchases/:email', async (req, res) => {
    try {
        console.log(req.params.email)
      const userEmail = req.params.email;
      const userPurchases = await Purchase.find({ customerEmail: userEmail })
        .populate('productId') // Make sure the Product model is correctly referenced
        .exec();
  
      // Extract the product details from the purchases
      const purchasedProducts = userPurchases.map(purchase => purchase.productId);
  
      res.json(purchasedProducts);
    } catch (error) {
      console.error('Error fetching purchased products:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // In your app.js or wherever you handle your routes

// Endpoint to create a review
app.post('/api/reviews', async (req, res) => {
  try {
    const { productId, customerEmail, rating, comment } = req.body;

    // Create a new review
    const newReview = new Review({
      productId,
      customerEmail,
      rating,
      comment
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).send(error.message || 'An error occurred while saving the review.');
  }
});

// Fetch all purchases
app.get('/api/purchases', async (req, res) => {
    try {
        const purchases = await Purchase.find({});
        res.json(purchases);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/purchases/by-merchant/:merchantId', async (req, res) => {
    const merchantId = req.params.merchantId;

    try {
        // First, fetch product IDs for the given merchant
        const products = await Product.find({ merchant_id: merchantId }).select('_id');

        // Extract just the IDs from the product documents
        const productIds = products.map(product => product._id);

        // Now, fetch purchases that have a productId in the productIds array
        const purchases = await Purchase.find({ productId: { $in: productIds } });

        res.json(purchases);
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Fetch all merchants
app.get('/api/merchants', (req, res) => {
    Merchant.find({}).then(merchants => {
        res.json(merchants);
    }).catch(err => {
        res.status(500).send(err);
    });
});


module.exports = app; 