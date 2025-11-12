// import axios from 'axios';

// const API_URL = 'http://localhost:5000'; // Adjust the URL if your Flask backend is hosted elsewhere

// export const predict = async (audioFile) => {
//     const formData = new FormData();
//     formData.append('audio', audioFile);

//     try {
//         const response = await axios.post(`${API_URL}/predict`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response ? error.response.data.error : 'An error occurred while making the prediction');
//     }
// };

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
});

export const predict = async (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
        const response = await api.post('/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || 'An error occurred';
        throw new Error(errorMsg);
    }
};

// Alias for backwards compatibility
export const predictAudio = predict;

export default api;