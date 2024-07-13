const PORT = 3000; 

// Dependencies
const express = require('express'),
      hbs = require('express-handlebars'),
      bodyParser = require('body-parser'),
      bcrypt = require('bcrypt'),
      passport = require('passport'),
      flash = require('express-flash'),
      session = require('express-session'),
      methodOverride = require('method-override'),
      multer = require('multer'),
      path = require('path');
      
const app = express();

// Views
const layoutsDir = __dirname + '/views/layouts/';
const partialsDir = __dirname + '/views/partials/'; 

// Database
const { connect } = require('./src/models/conn.js');
const User = require("./src/models/User");
const Review = require("./src/models/Review");
const Establishment = require("./src/models/Establishment.js")
const File = require("./src/models/File");

let establishments = [];

// Multer
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dest = './public/data/uploads/';
        // check if the directory exists, create if not
        if(!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
});

const upload = multer({
    storage: storage
})

// Passport
const initializePassport = require('./passport');
initializePassport(passport, 
    async (username) => {
    try {
        const user = await User.findOne({ username: '@' + username }).exec();
        return user;
    } catch (error) {
        console.error("Error finding user:", error);
        return null; 
    }}, 
    async (id) => {
        try {
            const user = await User.findOne({ id: id }).exec();
            return user;
        } catch (error) {
            console.error("Error finding id:", error);
            return null; 
        }
    }
);

// HBS
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'home',
    layoutsDir: layoutsDir,
    partialsDir: partialsDir
}));

app.set('view engine', 'hbs');
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + '/public/'));
app.use(express.json());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.urlencoded({ extended: true }));

// Session Management
app.use(flash());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())

// Functions
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/guest-view')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }

    next()
}

async function findEstablishmentReviews() {
    try {
        const ownerInfo = await User.findOne({ username: req.user.username }).exec();
        const establishmentNames = ownerInfo.establishments;
        const estReviews = await Review.find({ 'reviews.establishmentName': { $in: establishmentNames }}).exec();
        
        return estReviews;

    } catch(e) {
        console.log(e.message);
        return null;
    }
}

const getUsername = (req) => {
    return req.user.username; 
};

let currentUserName = " "; 
let hasUser = false;                // checks if a user is currently logged in
let printUsernameErr = false;       // for username validation
let printEditErr = false;           // for edit profile validation

/****************************************************************
 *                    HOME, SIGN-IN, SIGN-UP
 ***************************************************************/

// home with current user
app.get('/', checkAuthenticated, async (req, res) => {
    console.log("GET request received for /");

    try {
        // query all establishments from the database
        establishments = await Establishment.find();
        // console.log("Retrieved: " + establishments);
    } catch (error) {
        console.error("Error retrieving establishments:", error);

    }

    if(!req.user) {
        hasUser = false;
    } else {
        hasUser = true;
    }

    res.render('main', {
        title: 'Taft 10',
        css: '/home-page-section/css/home-index.css',
        userExists: hasUser,
        currUsername: req.user.username,
        addcss: false,
        needHeader: true,
        needHeader2: false,
        needFooter: true,
        searchIcon: '/global-assets/header/search-icon.png',
        taft10Logo: '/global-assets/header/taft-10.png',
        ateRica: '/home-page-section/assets/ate-rica.png',
        chefBab: '/home-page-section/assets/chef-bab.png',
    });

    console.log("curr un: " + req.user.username);
    console.log("has user: " + hasUser);
    console.log("is owner: " + req.user.isOwner);
});

// home without current user <- redirect here
app.get('/guest-view', checkNotAuthenticated, (req, res) => {
    console.log("GET request received for /guest-view");

    res.render('main', {
        title: 'Taft 10',
        css: '/home-page-section/css/home-index.css',
        userExists: false,
        currUsername: null,
        addcss: false,
        needHeader: true,
        needHeader2: false,
        needFooter: true,
        searchIcon: '/global-assets/header/search-icon.png',
        taft10Logo: '/global-assets/header/taft-10.png',
        ateRica: '/home-page-section/assets/ate-rica.png',
        chefBab: '/home-page-section/assets/chef-bab.png',
    });

    console.log("has user: " + hasUser);
});

// home 
app.get('/home', checkAuthenticated, (req, res) => {
    console.log("GET request received for /home");

    res.redirect('/');
});

// log-out
app.get('/log-out', checkAuthenticated, (req, res) => {
    console.log("GET request received for /log-out");

    printUsernameErr = false;
    hasUser = false;
    
    req.logOut(function(err) {
        if (err) {
            console.error("Error logging out:", err);
            return res.status(500);
        }
        
        res.redirect('/guest-view');
    });
});

// sign-in
app.get('/sign-in', checkNotAuthenticated, async (req, res) => {
    console.log("GET request received for /sign-in");

    res.render('sign-in', {
        title: 'Sign In',
        css: '/home-page-section/css/sign-up-in-index.css',
        js: '/home-page-section/js/sign-in.js',
        userExists: false,
        needHeader: false,
        needHeader2: false,
        needFooter: false,
    });
});

// sign-in
app.post('/sign-in', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-in',
    failureFlash: true
}), (req, res) => {
    console.log("POST request received for /sign-in");
});

// sign-up
app.get('/sign-up', checkNotAuthenticated, async (req, res) => {
    console.log("Get Request received for /sign-up");
    
    res.render('sign-up', {
        title: 'Sign Up',
        css: '/home-page-section/css/sign-up-in-index.css',
        css2: '/base-index.css',
        js: '/home-page-section/js/sign-up.js',
        userExists: false,
        needHeader: false,
        needHeader2: false,
        needFooter: false,
        isValid: printUsernameErr
    });
});

app.post('/sign-up', upload.single("file"), async (req, res) => {
    console.log("POST request received for /sign-up");

    const { username, email, lname, fname, description, number, password, file, checkbox } = req.body;
    const usernameInput = '@' + username;
    const emailInput = email;
    const lastNameInput = lname;
    const firstNameInput = fname;
    const bioInput = description;
    const phoneInput = number;
    const isOwnerInput = (checkbox === 'checkbox'); 

    const fileData = {
        path: req.file.path,
        fileName: req.file.originalname
    }

    console.log(req.file);

    const profilePictureInput = await File.create(fileData);
    console.log(profilePictureInput)

    await profilePictureInput.save();

    try {
        // check if the username already exists in the database
        const existingUser = await User.findOne({ username: usernameInput });
        if(existingUser) {
            console.log('Username already exists.');
            printUsernameErr = true;
            
            return res.redirect('/sign-up');
        }

        // generate hash for password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user
        const newUser = await User.create({
            username: usernameInput,
            email: emailInput,
            lastName: lastNameInput,
            firstName: firstNameInput,
            bio: bioInput,
            number: phoneInput,
            password: hashedPassword,
            profilePicture: profilePictureInput,
            isOwner: isOwnerInput
        });

        await newUser.save()

        console.log("New user created");
        console.log(newUser);
        
        console.log("File");
        console.log(newUser.profilePicture);

        console.log('Success sign-up');
        console.log('Hashed password: ' + hashedPassword);
        
        // log in the user after sign-up
        req.login(newUser, function(err) {
            if(err) {
                console.error("Error logging in after sign-up:", err);
                return res.status(500);
            }
            
            res.redirect('/');
        });
    } catch(e) {
        console.log("Error during sign-up:", e.message);
        return res.status(500);
    }
});


// recover-account
app.get('/forgot-pw', (req, res) => {
    console.log("GET request received for /forgot-pw");

    res.render('forgot-pw', {
        title: 'Recover Account',
        css: '/home-page-section/css/sign-up-in-index.css',
        js: '',
        userExists: false,
        needHeader: false,
        needHeader2: false,
        needFooter: false,
    });
});

// forgot-pw
app.post('/forgot-pw', (req, res) => {
    console.log("POST request received for /forgot-pw");

    console.log(req.body);
    res.redirect("/success-msg");
});

// success-msg
app.get('/success-msg', (req, res) => {
    console.log("GET request received for /success-msg");
    
    res.render('forgot-pw-response', {
        title: 'Recover Account Success',
        css: '/home-page-section/css/sign-up-in-index.css',
        js: '/home-page-section/js/sign-up.js',
        needHeader: false,
        needHeader2: false,
        needFooter: false,
    });
});

/****************************************************************
 *                         PROFILE       
 ***************************************************************/

let reply = "";
let replies = [];
let showReply = false;
let editSuccessful = false;
let reviewCount = 0;
let populate = false;

// profile
app.get('/profile', checkAuthenticated, async (req, res) => {
    console.log("GET request received for /profile");
    populate = false;

    try {
        let reviews = [];

        console.log("is owner: " + req.user.isOwner);

        if(req.user.isOwner) { // establishment owner
            console.log("test first if statement");
            const estReviews = await findEstablishmentReviews();   
            if (estReviews) {
                for (let i = 0; i < estReviews.length; i++) {
                    console.log(i);
                    console.log("\n");
                    let review = reviews.push({
                        nameDisplay: estReviews[i].username,
                        ratingDisplay: estReviews[i].reviews.rating,
                        dateDisplay: estReviews[i].reviews.date,
                        upvotesDisplay: estReviews[i].reviews.upvotes,
                        reviewDisplay: estReviews[i].reviews.review
                    });
                    console.log(review);
                }
                reviewCount = estReviews.length;
            } else {
                reviews = null;
            }
        } else { // non-owner user
            console.log("test else statement");
            // const userReviews = await findUserReviews();
            const userReviews = await Review.find({ username: req.user.username }).exec();
            
            //const userReviews = userInfo.reviews;
            console.log("FUNCTION TEST");
            //console.log(userReviews);

        
            if(userReviews) {
                for (let i = 0; i < userReviews.length; i++) {
                    console.log(i);
                    let userInfo = await User.findOne({ username: userReviews[i].username }).exec();
                    let fileID = userInfo.profilePicture;
                    let filePath = await File.findById(fileID).exec();

                    let rawDate = userReviews[i].reviews[0].date;
                    let date = new Date(rawDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                    reviews.push({
                        nameDisplay: userReviews[i].username,
                        ratingDisplay: userReviews[i].reviews[0].rating,
                        dateDisplay: date,
                        upvotesDisplay: userReviews[i].reviews[0].upvotes,
                        reviewDisplay: userReviews[i].reviews[0].review,
                        profilePictureDisplay: path.basename(filePath.path)
                    });
                    console.log(reviews[i]);
                }
                reviewCount = userReviews.length;
            } else {
                reviews = null;
            }
        }
        
        // TODO update this
        if(!replies) {
            showReply = true;
        }

    if(reviewCount > 0) {
        populate = true
    }
    //////////////////////////////////////////////////////////////////////////
    // NOTES: USE THIS CODE TO DISPLAY PROFILE PICTURE
    
    // inside GET add this:
    const file_id = req.user.profilePicture;
    const pfp_path = await File.findById(file_id).exec();

    console.log("pfp-path " + __dirname + pfp_path);
    console.log(pfp_path);

    // OTHER CODES:
    // inside hbs file: <img src = "../../data/uploads/{{currentUserPic}}"
    // inside res.render: currentUserPic: path.basename(pfp_path.path), 
    // inside POST method: *CHECK app.post('/sign-up') CODE 
    //                      FOR SAVING FILES INSIDE THE DB

    ///////////////////////////////////////////////////////////////////////////

    res.render('view-profile', {
        title: 'View Account Success',
        css: '/view-profile-section/css/profile-index.css',
        css2: '/base-index.css',
        css3: '/view-establishments-section/css/est-index.css',
        currentUserPic: path.basename(pfp_path.path), 
        myName: '<h1>' + req.user.firstName + " " + req.user.lastName + '</h1>',
        numReviews: reviewCount + ' review/s', 
        userDescription: req.user.bio,
        isOwner: req.user.isOwner,
        userExists: true, 
        currUsername: req.user.username,
        needHeader: false,
        needHeader2: true,
        needFooter: true,
        searchIcon: '/global-assets/header/search-icon.png',
        taft10Logo: '/global-assets/header/taft-10.png',
        displayReplies: showReply,
        username: req.user.username,
        ownerReply: reply,
        // reviews display if owner:
        displayReviews: reviews,
        populateReviewsContainer: populate
    });

    } catch(e) {
        console.log(e.message);
    }
});

// edit profile
app.get('/edit', checkAuthenticated, async (req, res) => {
    console.log("GET request received for /edit");

    const file_id = req.user.profilePicture;
    const pfp_path = await File.findById(file_id).exec();

    console.log("pfp-path " + __dirname + pfp_path);
    console.log(pfp_path);

    res.render('edit-profile', {
        title: 'Edit Profile',
        css: '/view-profile-section/css/edit-profile-index.css',
        css2: '/base-index.css',
        js: '/home-page-section/js/sign-up.js',
        currentUserPic: path.basename(pfp_path.path), 
        userExists: hasUser,
        needHeader: false,
        needHeader2: false,
        needFooter: false,
        errorMsg: printEditErr,
        usernamePlaceholder: req.user.username,
        bioPlaceholder: req.user.bio
    });
});

app.post('/edit', checkAuthenticated, async (req, res) => {
    console.log("POST request received for /edit");

    try {
        let existingUsers = await User.find({ username: req.user.username });
        let currUserID = existingUsers[0]._id;
        let filter = { _id: currUserID };
        let usernameInput = req.body.username;
        let bioInput = req.body.description;

        let updateFields = {};

        if(usernameInput && bioInput) { // update username and bio
            updateFields = { username: '@' + usernameInput, bio: bioInput };
        } else if(usernameInput && !bioInput) { // update username only
            updateFields = { username: '@' + usernameInput };
        } else if(bioInput && !usernameInput) { // update bio only
            updateFields = { bio: bioInput };
        }

        if(Object.keys(updateFields).length > 0) {
            let userDoc = await User.findOneAndUpdate(filter, updateFields, {
                new: true
            });

            if(usernameInput) {
                req.user.username = '@' + usernameInput;
            }

            if(bioInput) {
                req.user.bio = bioInput;
            }

            await userDoc.save();
            console.log("Success edit");
        } else {
            console.log("No fields to update");
        }

        res.redirect('/profile');
        printEditErr = false;

    } catch(e) {
        printEditErr = true;
        console.error("Error editing profile:", e.message);
        res.redirect('/edit');
    }
});

app.get('/cancel-edit', (req, res) => {
    console.log("GET request received for /cancel-edit");
    res.redirect('/profile');
});

app.post('/cancel-edit', (req, res) => {
    console.log("POST request received for /cancel-edit");
    console.log(req.body);
    res.redirect('/profile');
});

app.get('/reply', (req, res) => {
    console.log("Request received for /reply");
});

app.post('/reply', (req, res) => {
    console.log("POST request received for /post");
    reply = req.body.description;
    console.log(reply);
    
    replies.push(reply);
    showReply = true;
    res.redirect('/profile');
});


/****************************************************************
 *                         ESTABLISHMENTS       
 ***************************************************************/

// view all establishments
app.get('/all-establishments', checkAuthenticated, (req, res) => {
    console.log("Request received for /all-establishments");

    res.render('all-establishments', {
        title: 'All Establishments',
        css: '/view-establishments-section/css/est-index.css',
        css2: '/base-index.css',
        css3: '/view-establishments-section/css/add-review.css',
        css4: '/view-establishments-section/css/view-review.css',
        css5: '/view-establishments-section/css/crude-index.css',
        js: '/view-establishments-section/js/est-index.js',
        userExists: hasUser,
        currUsername: req.user.username,
        needHeader: false,
        needHeader2: true,
        needFooter: true,
        searchIcon: '/global-assets/header/search-icon.png',
        taft10Logo: '/global-assets/header/taft-10.png',
    });
});

app.get('/load-establishments', checkAuthenticated, (req, res) => {
    console.log("Request received for /load-establishments");

    res.status(200).json({ establishments });
});

app.get('/add-review', checkAuthenticated, (req, res) => {
    console.log("Request received for /add-review"); 
});

// route handler for POST request to '/add-review'
app.post('/add-review', checkAuthenticated, async (req, res) => {
    console.log("Request received for POST /add-review"); 
    
    const { rating, date, review, establishmentName } = req.body;
    console.log("Username:", req.user.username);
    console.log("Rating:", rating);
    console.log("Review:", review);
    console.log("Establishment Name:", establishmentName);

    try {
        const reviewCount = await Review.countDocuments();
        console.log("ID:", reviewCount + 1);
        
        const newReview = new Review({
            username: req.user.username,
            reviews: [{
                id: reviewCount + 1, 
                rating: rating,
                date: date,
                review: review,
                establishmentName: establishmentName
            }]
        });
        await newReview.save();

        // Return the newly created review data in the response
        res.status(200).json({ newReview });

    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).send("Error adding review");
    }
});

// view taft picks
app.get('/taft-picks', (req, res) => {
    console.log("Request received for /taft-picks");
    res.render('taft-picks', {
        title: 'Taft Picks',
        css: '/view-establishments-section/css/est-index.css',
        css2: '/base-index.css',
        css3: '/view-establishments-section/css/add-review.css',
        css4: '/view-establishments-section/css/view-review.css',
        js: '/view-establishments-section/js/est-index.js',
        userExists: hasUser,
        currUsername: currentUserName,
        needHeader: false,
        needHeader2: true,
        needFooter: true,
        searchIcon: '/global-assets/header/search-icon.png',
        taft10Logo: '/global-assets/header/taft-10.png'
    });
});

// port
app.listen(PORT, async function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
    try {
        await connect();
        console.log(`Now connected to MongoDB`);
    } catch (err) {
        console.log('Connection to MongoDB failed: ');
        console.error(err);
    }
});

