const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors')
const cookieParser = require('cookie-parser'); // Import cookie-parser


const app = express();
const port = 5000;

const corsOptions = {
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
    credentials: true, // Update this with the actual URL of your frontend
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });
  
app.use(cookieParser()); // Use cookie-parser middleware



app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Login_page', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const User = mongoose.model('User', {
    email: String,
    name: String,
    password: String,
});

// Login or Register based on email existence
app.post('/auth', async (req, res) => {
    try {
        const { email, name, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            // Register the user if not found
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ email, name, password: hashedPassword });
            await user.save();
        } else {
            // Check password and create JWT if user exists
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
        }

        const token = jwt.sign({ userId: user._id }, 'secretKey');

        //set JWT cookie
        res.cookie('jwt', token, { httpOnly: true,sameSite:'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// Add this endpoint to your backend code
app.get('/user-info', async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decodedToken = jwt.verify(token, 'secretKey');
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
