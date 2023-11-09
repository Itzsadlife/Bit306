const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Merchant = require('./models/register'); 
const User = require('./models/user')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Product = require('./models/product');
const Admin = require('./models/admin');
const details = {
    email: 'helptourcare@gmail.com',
    password: 'brpqhrygzstzjeno'
};
const Purchase = require('./models/purchase');
const Review = require('./models/review');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, './uploads'));
    },     
    filename: function(req, file, cb) {
        const date = new Date().toISOString().replace(/:/g, '_').split('.')[0];
        const extension = path.extname(file.originalname);
        cb(null, date + extension);

    }    
});

const upload = multer({ storage: storage });





mongoose.connect("mongodb+srv://bit306:assignment@cluster0.uulatfu.mongodb.net/TourCare?retryWrites=true&w=majority")
.then(()=>{
    console.log('connected to database');
})
.catch(()=>{
    console.log('connection failed');
});


app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


function generateRandomPassword(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const randomPassword = generateRandomPassword();

//merchant register
app.post("/api/merchants/register", (req, res, next) => {
    console.log('Incoming request data:', req.body);
    // First, check if the email already exists in the database
    Merchant.findOne({ email: req.body.email })
        .then(existingMerchant => {
            if (existingMerchant) {
                // If a merchant with the email already exists, return an error response
                return res.status(401).json({
                    message: "Email already in use"
                });
                // Return here to prevent further execution after response is sent
            }

            // Generate a random password here or ensure it's generated before this block
            const randomPassword = generateRandomPassword();

            // If the email does not exist, proceed to hash the password
            return bcrypt.hash(randomPassword, 10);
        })
        .then(hash => {
            if (!hash) {
                // If hash wasn't created, throw an error to skip to the catch block
                throw new Error('Password hash not generated');
            }

            // Create a new merchant with the hashed password
            
            const { firstName, lastName, email, contactNumber, description } = req.body;

            const merchant = new Merchant({
                firstName,
                lastName,
                email,
                contactNumber,
                description,
                password: hash, // the hashed password
            });

            // Save the new merchant to the database
            return merchant.save();
        })
        .then(result => {
            if (result) {
                // Convert the Mongoose document to a plain JavaScript object and remove sensitive fields
                const resultObject = result.toObject();
                delete resultObject.password;

                // If the merchant was saved successfully, return a success response
                return res.status(201).json({
                    message: 'Merchant registered successfully!',
                    result: resultObject
                });
                // Return here to prevent further execution after response is sent
            }
        })
        .catch(err => {
            console.error(err)
            // If a response was already sent, don't try to send another one
            if (!res.headersSent) {
                res.status(500).json({
                    message: 'Internal Server Error during merchant registration!',
                    error: err.message
                });
            }
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

//user
app.post("/api/users/register", (req, res, next) => {
    // Check if the email already exists in the database
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(409).json({
                    message: "Email already in use"
                });
            }
            return bcrypt.hash(req.body.password, 10);
        })
        .then(hash => {
            if (!hash) {
                throw new Error('Password hashing failed'); // Throw an error to be caught by the catch block.
            }
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                contactNumber: req.body.contactNumber,
                password: hash
            });

            return user.save();
        })
        .then(result => {
            if (result) {
                const resultObject = result.toObject();
                delete resultObject.password; // Remove the password before sending the result.

                res.status(201).json({
                    message: 'User registered successfully!',
                    result: resultObject
                });
            }
        })
        .catch(err => {
            if (!res.headersSent) {
                res.status(500).json({
                    message: 'User email is already use! Please Check Your Email',
                    error: err.message
                });
            }
        });
});



//login

app.post("/api/user/login", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

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

app.post("/api/admin/login", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    Admin.findOne({ email: email }).then(admin => {
        if (!admin) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        if (admin.password !== password) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        res.status(200).json({
            message: 'Admin logged in successfully',
            admin: {
                _id: admin._id,
                email: admin.email,
            }
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
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
        imageUrl: req.file.filename
    });
    console.log(product.imageUrl);
    product.save().then(result=>{
        res.status(200).json(result);
        console.log(product);
    }).catch(err=>{
        console.error(err);
        res.status(500).send(err);
    });
});
app.patch("/api/product/edit-product/:id", upload.single('imageUrl'), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product fields
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.imageUrl = req.file.filename;
      console.log(product.imageUrl);
      // Save the updated product
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});


// Endpoint to get the list of products from the database
app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find();
        res.json(products);
        console.log(products);
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





module.exports = app; 