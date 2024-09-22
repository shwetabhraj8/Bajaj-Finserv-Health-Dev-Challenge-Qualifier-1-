const express = require('express');
const bodyParser = require('body-parser');
const mime = require('mime-types');
const cors = require('cors'); // Import cors

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Utility function to check if the input is a valid number
const isNumber = (str) => /^\d+$/.test(str);

// POST /bfhl endpoint
app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;
        const userId = "john_doe_17091999"; // Hardcoded user ID
        const email = "john@xyz.com";
        const rollNumber = "ABCD123";

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid data array" });
        }

        const numbers = [];
        const alphabets = [];
        let highestLowercaseAlphabet = '';

        data.forEach(item => {
            if (isNumber(item)) {
                numbers.push(item);
            } else if (/^[a-zA-Z]$/.test(item)) {
                alphabets.push(item);
                if (item === item.toLowerCase()) {
                    if (!highestLowercaseAlphabet || item > highestLowercaseAlphabet) {
                        highestLowercaseAlphabet = item;
                    }
                }
            }
        });

        let fileValid = false;
        let fileMimeType = null;
        let fileSizeKb = null;

        if (file_b64) {
            const buffer = Buffer.from(file_b64, 'base64');
            fileMimeType = mime.lookup(buffer) || null;
            fileSizeKb = (buffer.length / 1024).toFixed(2);
            fileValid = !!fileMimeType;
        }

        return res.json({
            is_success: true,
            user_id: userId,
            email: email,
            roll_number: rollNumber,
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
            file_valid: fileValid,
            file_mime_type: fileMimeType || '',
            file_size_kb: fileSizeKb || ''
        });
    } catch (error) {
        return res.status(500).json({ is_success: false, message: "Server error" });
    }
});

// GET /bfhl endpoint
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
