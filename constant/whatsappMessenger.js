const axios = require('axios');

/**
 * Send a WhatsApp message.
 * @param {string} recipientNumber - The recipient's WhatsApp number (e.g., 8012470714).
 * @param {string} message - The message content.
 * @returns {Promise<object>} - The response object from the API.
 */
const sendMessage = async (recipientNumber, message) => {
    const apiKey = '13ced37bb6bc475ea45e962da54f9559';
    const url = `http://148.251.129.118/wapp/api/send?apikey=${apiKey}&mobile=${recipientNumber}&msg=${encodeURIComponent(message)}`;
    console.log("errorerrorerrorerror",recipientNumber)
    console.log("errorerrorerrorerror",message)

    try {
        const response = await axios.post(url);

        console.log("errorerrorerrorerror",response.data)

        return {
            success: true,
            data: response.data,
            message: 'Message sent successfully.',
        };
    } catch (error) {

        console.log("errorerrorerrorerror",error)
        return {
            success: false,
            error: error.message,
        };
    }
};

module.exports = sendMessage;
