module.exports = {

	//auth
	AUTH_REGISTER: '/register',
	AUTH_LOGIN: '/login',
	CHANGE_PASSWORD: '/changepassword',
	LOGOUT: '/logout',

	//auth
	SEND_OTP: '/accountverify-otp',
	VERIFY_OTP: '/verify-otp',
	FORGOTPASSWORD_OTP: '/forgotpassword-otp',

	//users
	GET_USERS: '/',
	CREATE_USERS: '/create',
	UPDATE_USERS: '/update',
	DELETE_USERS: '/delete',
	GET_USERS_Id: '/findparticular',


	UPDATE_VERSION :'/updateversion',
	GET_VERSION: '/getversion',

	//enquiry
	GET_ENQUIRY: '/',
	CREATE_ENQUIRY: '/create',
	UPDATE_ENQUIRY: '/update',
	DELETE_ENQUIRY: '/delete',
	GET_ENQUIRY_Id: '/findparticular',
	GET_ENQUIRY_HISTORY: '/enquiry-history',
	GET_ENQUIRY_COUNT: '/enquiry-count',
	GET_ENQUIRY_COUNT_BY_MONTH: '/enquiry-count-by-month',
	GET_ENQUIRY_BY_MONTH: '/enquiry-by-month',
	GET_ENQUIRY_BY_DAY: '/enquiry-by-day',

	// sales
	GET_SALES_BY_MONTH: '/sales-by-month',
	GET_DROP_BY_MONTH: '/dropped-by-month',
	GET_SALESAMOUNT_BY_MONTH:'/salesamount-by-month',

	
	//followup
	GET_FOLLOW_UP: '/',
	CREATE_FOLLOW_UP: '/create',
	UPDATE_FOLLOW_UP: '/update',
	DELETE_FOLLOW_UP: '/delete',
	GET_FOLLOW_UP_Id: '/findparticular',
	GET_FOLLOW_UP_HISTORY: '/followup-history',
	GET_FOLLOW_UP_BY_DATE: '/followup-by-day',
	GET_FOLLOW_UP_BY_DATE_FILTER: '/followup-by-date',
	GET_MISSED_FOLLOWUP: '/missed-followups',

	//notification
	GET_NOTIFICATION: '/',
	CREATE_NOTIFICATION: '/create',
	UPDATE_NOTIFICATION: '/update',
	DELETE_NOTIFICATION: '/delete',

	//plan
	GET_PLAN: '/',
	CREATE_PLAN: '/create',
	UPDATE_PLAN: '/update',
	DELETE_PLAN: '/delete',
	GET_PLAN_Id: '/findparticular',

	//coupon
	GET_COUPON: '/',
	CREATE_COUPON: '/create',
	UPDATE_COUPON: '/update',
	DELETE_COUPON: '/delete',
	GET_COUPON_Id: '/findparticular',
	APPLY_COUPON: '/apply-coupon',

	// razorpay
	VERIFY_RAZORPAY :'/verifyPayment',
	SUCCESS:'/success',
	FAILURE:'/failure',

	//order
	CREATE_ORDER :'/create-order',
	CREATE_DIRECT_ORDER :'/create-direct-order',
	GET_ORDER_ID: '/findparticular',
	DEACTIVATE_ORDER :'/deactivate-order',

	//about content
	CREATE_CONTENT:'/create',
	UPDATE_CONTENT: '/update',
	GET_CONTENT:'/',

		//ticket
		GET_TICKET: '/',
		CREATE_TICKET: '/create',
		UPDATE_TICKET: '/update',
		DELETE_TICKET: '/delete',
		GET_TICKET_Id: '/findparticular',


			//leadSource
	GET_LEAD_SOURCE: '/',
	CREATE_LEAD_SOURCE: '/create',
	UPDATE_LEAD_SOURCE: '/update',
	DELETE_LEAD_SOURCE: '/delete',
	GET_LEAD_SOURCE_Id: '/findparticular',


			//enquiryStatus
			GET_ENQUIRY_STATUS: '/',
			CREATE_ENQUIRY_STATUS: '/create',
			UPDATE_ENQUIRY_STATUS: '/update',
			DELETE_ENQUIRY_STATUS: '/delete',
			GET_ENQUIRY_STATUS_Id: '/findparticular',

}