require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.post('/api/check-drug', async (req, res) => {
    const { drug_name, ope_day } = req.body.inputs;

    if (!drug_name || !ope_day) {
        return res.status(400).json({ error: '薬剤名と手術日を入力してください。' });
    }

    try {
        const difyResponse = await fetch('https://api.dify.ai/v1/workflows/run', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        if (!difyResponse.ok) {
            const errorBody = await difyResponse.text();
            console.error(`Dify API request failed with status ${difyResponse.status}: ${errorBody}`);
            return res.status(difyResponse.status).json({ error: `Dify API request failed: ${difyResponse.statusText}` });
        }

        const difyResult = await difyResponse.json();
        res.json(difyResult);
    } catch (error) {
        console.error('Error calling Dify API:', error);
        res.status(500).json({ error: 'Dify APIの呼び出し中にエラーが発生しました。' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
