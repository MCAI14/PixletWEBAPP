import axios from 'axios';

const API_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

export const sendMessage = async (messageData) => {
    try {
        const response = await axios.post(`${API_URL}/messages`, messageData);
        return response.data;
    } catch (error) {
        throw new Error('Error sending message: ' + error.message);
    }
};

export const receiveMessages = async () => {
    try {
        const response = await axios.get(`${API_URL}/messages`);
        return response.data;
    } catch (error) {
        throw new Error('Error receiving messages: ' + error.message);
    }
};

export const authenticateUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth`, credentials);
        return response.data;
    } catch (error) {
        throw new Error('Error authenticating user: ' + error.message);
    }
};