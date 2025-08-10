document.getElementById('drug-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const drugName = document.getElementById('drug-name').value;
    const opeDay = document.getElementById('ope-day').value;

    if (!drugName || !opeDay) {
        alert('薬剤名と手術日を入力してください。');
        return;
    }

    const data = {
        inputs: {
            drug_name: drugName,
            ope_day: opeDay
        },
        response_mode: 'blocking',
        user: 'test-user-123'
    };

    fetch('/api/check-drug', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'サーバーから無効な応答がありました。' }));
            throw new Error(errorData.error || `サーバーエラー: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const resultList = document.getElementById('result-list');
        resultList.innerHTML = ''; // Clear previous results

        if (data && data.data && data.data.outputs && data.data.outputs.text) {
            const items = data.data.outputs.text.split('\n');
            items.forEach(item => {
                if (item) {
                    const li = document.createElement('li');
                    li.textContent = item;
                    resultList.appendChild(li);
                }
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '有効な結果が得られませんでした。';
            resultList.appendChild(li);
        }
    })
    .catch(error => {
        console.error('エラー:', error);
        const resultList = document.getElementById('result-list');
        resultList.innerHTML = '';
        const li = document.createElement('li');
        li.textContent = `エラーが発生しました: ${error.message}`;
        resultList.appendChild(li);
    });
});