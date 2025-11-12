import axios from 'axios';

const API_URL = 'http://localhost:5000/predict'; // Update with your Flask API URL

export const uploadAudio = async (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error uploading audio: ' + error.message);
    }
};