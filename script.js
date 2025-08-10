document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const drugForm = document.getElementById('drug-form');
    const drugNameInput = document.getElementById('drug-name');
    const opeDayInput = document.getElementById('ope-day');
    const resultsList = document.getElementById('results-list');
    const loadingMessage = document.getElementById('loading-message');
    const checkButton = document.getElementById('check-button');

    // --- Dify APIの情報 ---
    const difyApiUrl = 'https://api.dify.ai/v1/workflows/run';
    const difyApiKey = 'Bearer app-2fcGZ28n4KYd5xH0cKTlMbjA';

    // --- フォーム送信時のイベントリスナー ---
    drugForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // デフォルトのフォーム送信をキャンセル

        // --- 入力値の取得 ---
        const drugName = drugNameInput.value;
        const opeDay = opeDayInput.value;

        // --- デバッグ用ログ ---
        console.log('入力された薬:', drugName);
        console.log('入力された手術日:', opeDay);

        // --- 結果表示エリアとボタンの状態を初期化 ---
        resultsList.innerHTML = '';
        loadingMessage.style.display = 'block';
        checkButton.disabled = true;
        checkButton.textContent = '確認中...';

        // --- Difyに送信するデータを作成 ---
        const requestData = {
            inputs: {
                drug_name: drugName,
                ope_day: opeDay
            },
            response_mode: 'blocking',
            user: 'webapp-user' // ユーザーを識別するための一意のID
        };

        // --- デバッグ用ログ ---
        console.log('Difyへの送信データ:', JSON.stringify(requestData, null, 2));

        try {
            // --- Dify APIへリクエストを送信 ---
            const response = await fetch(difyApiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': difyApiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            // --- デバッグ用ログ ---
            console.log('Difyからのレスポンスステータス:', response.status);

            if (!response.ok) {
                throw new Error(`APIエラーが発生しました。ステータス: ${response.status}`);
            }

            const result = await response.json();

            // --- デバッグ用ログ ---
            console.log('Difyからのレスポンス(JSON):', result);

            // --- 結果のテキストを取得 ---
            // 応答JSONから data.outputs.text の値を取得
            const resultText = result.data && result.data.outputs && result.data.outputs.text 
                ? result.data.outputs.text 
                : '結果のテキストが見つかりませんでした。';

            // --- 結果をリスト形式で表示 ---
            const lines = resultText.split('\n');
            lines.forEach(line => {
                if (line.trim() !== '') {
                    const listItem = document.createElement('li');
                    listItem.textContent = line;
                    resultsList.appendChild(listItem);
                }
            });

        } catch (error) {
            // --- エラーハンドリング ---
            console.error('Dify APIとの通信中にエラーが発生しました:', error);
            const errorItem = document.createElement('li');
            errorItem.textContent = `エラーが発生しました: ${error.message}`;
            errorItem.style.color = 'red';
            resultsList.appendChild(errorItem);
        } finally {
            // --- 後処理 ---
            loadingMessage.style.display = 'none';
            checkButton.disabled = false;
            checkButton.textContent = '確認する';
        }
    });
});
