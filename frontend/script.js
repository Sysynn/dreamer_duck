let userMessage = [];
let assistantMessage = [];

function displayMessage(role, content) {
    const chatMessages = document.querySelector('.chat-messages');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.classList.add(role);
    newMessage.innerHTML = `<div class="message-content">${content}</div>`;
    chatMessages.appendChild(newMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight; // 스크롤 맨 아래로 이동
}

async function sendMessage() {
    const input = document.querySelector('.chat-input input');
    const message = input.value.trim();

    if (message === '') {
        return;
    }

    displayMessage('user', message);
    input.value = '';

    try {
        const response = await fetch('http://localhost:3000/dreamTell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: input.value
            })
        });

        if (!response.ok) {
            throw new Error('서버 응답이 실패했습니다.');
        }

        const data = await response.json();
        const assistantMessage = data.assistant;
        displayMessage('assistant', assistantMessage);
    } catch (error) {
        console.error('오류 발생:', error);
        throw error;
    }
}
