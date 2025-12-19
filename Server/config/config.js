let config = {
	//production
	dbUrl: "mongodb+srv://enquiryuser:enquiry%40123@cluster0.esurrc1.mongodb.net/enquiry_prod?retryWrites=true&w=majority", port: 3001,
	baseUrl: "http://159.65.150.181:3001/",
	localbaseUrl: "http://localhost:3001/",


	//stage

	// dbUrl: "mongodb+srv://enquiryuser:enquiry%40123@cluster0.esurrc1.mongodb.net/enquiry_stage?retryWrites=true&w=majority",
	// port: 3001,
	// baseUrl: "http://159.65.155.33:3001/",
	// localbaseUrl: "http://localhost:3001/",



	
	razorpay: {          //production key
		key_id: 'rzp_live_V1n09M9PWstAsa',
		key_secret: 'zlcevG5Aj7XKT8OUmCRS57kS',
	} ,
    // razorpay: {          //test key
	// 	key_id: 'rzp_test_7kR3yfeidd6bgP',
	// 	key_secret: 'OLY5x8i3ZDvhaTzbViNG9Gvo',
	// },


	jwt: {
		expiration: '30d',
		secretKey: '23232#@#@3434#$#$$%$%^&*&(545434us,ghdkghgkdtger54%$%$$#$@$%$^%%^&^*6767%&^&*&*&*U&*())_)_()*(^&%^^$%#$#$#%$%RETYRFGd fgrtyfgfktglfgjf.gjrlktrj.,d mgflyjtljfg,hjghjg,hghl',
		algorithms: process.env.JWT_ALGORITHMS,
	},
	sendGrid: {
		SENDGRID_API_KEY: " ",
		from_email: "neophrontechangular@gmail.com",
		from_name: " Enquiry Management",
		bcc: "",
	},
	paymentGateway: {
		merchant_id: "3122865",
		access_code: "AVBX43KL06BR32XBRB",
		working_key: "73B8F5ADB4D6A96EB0F44F913A90CBF4"
	},
	nodemailer: {
		user: 'neophrontechangular@gmail.com',
		pass: 'kuel cjhy ppef hdqu',
		from_name: " Enquiry Management"
	},



}


module.exports = config;