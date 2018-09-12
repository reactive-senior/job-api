const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(session({
	secret: 'cbce55c1c6c35f101470cf9260f4a8bb',
	resave: false,
	saveUninitialized: true
}))

port = process.env.PORT || 8080;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/session', (req, res) => {
	req.session.count = 1;
	res.json({
		session: req.session
	});
})


const messageRoutes = require('./com/smp/chat/messagebox/api/routes/MessageRoutes');
const userRoutes = require('./com/smp/chat/messagebox/api/routes/UserRoutes');
app.use('/userAPI', userRoutes);
app.use('/messageAPI', messageRoutes);

const AuthRoutes = require('./com/smp/auth/api/routes/vendor/AuthRoutes');
app.use('/authAPI/vendor_auth', AuthRoutes);
app.use('/authAPI/customer_auth', AuthRoutes);

const authGuardRoutes = require('./com/smp/auth/api/authGuard');
app.use('/authAPI/authGuard', authGuardRoutes);

const profileRoutes = require('./com/smp/profile/api/routes/profileRoutes');
app.use('/profileAPI', profileRoutes);

// const cloudSearchRoutes = require('./com/smp/cloudSearch/api/routes/cloudSearchRoutes');
// app.use('/cloudSearchAPI', cloudSearchRoutes);

const elasticSearchRoutes = require('./com/elasticSearch/api/routes/elasticSearchRoutes');
app.use('/elasticSearchAPI', elasticSearchRoutes);

const serviceRoutes = require('./com/smp/serviceRequest/api/routes/serviceRoutes');
app.use('/serviceAPI', serviceRoutes);

app.get('/', (req, res) => {
	res.send('API PANEL');
})

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	// application specific logging, throwing an error, or other logic here
});

app.listen(port, () => {
	console.log('Express is listening on port', 8080);
});