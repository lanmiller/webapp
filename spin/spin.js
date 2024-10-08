// spin/spin.js

document.addEventListener('DOMContentLoaded', () => {


});

document.getElementById('spin-button').addEventListener('click', () => {
    // Функция для начала анимации вращения
    function startSpinAnimation() {
        const spinImage = document.getElementById('spin-image');
        const frameFaceDown = document.getElementById('frame-facedown-all');
        if (frameFaceDown) {
            spinImage.classList.add('rotating');
            frameFaceDown.classList.add('rotating');
        }
    }

    // Функция для остановки анимации вращения
    function stopSpinAnimation() {
        const spinImage = document.getElementById('spin-image');
        const frameFaceDown = document.getElementById('frame-facedown-all');
        if (frameFaceDown) {
            spinImage.classList.remove('rotating');
            frameFaceDown.classList.remove('rotating');
        }
    }

    // Функция для обработки ответа от API
    async function handleSpin() {
        try {
            // Начало анимации
            startSpinAnimation();

            // Запрос к API /spin
            const response = await fetch('https://wildly-certain-oarfish.ngrok-free.app/spin', {

                method: 'GET',
                headers: {
                    // Убедитесь, что у вас настроена авторизация или удалите этот заголовок, если он не нужен
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }

            const data = await response.json();

            // Кэширование данных (например, game_url и game_img)
            localStorage.setItem(`card_${data.card_id}_img`, data.game_img);
            localStorage.setItem(`card_${data.card_id}_url`, data.game_url);

            // Остановка анимации после получения данных
            stopSpinAnimation();

            // Переход к отображению второго состояния с использованием game-card
            displayGameCard(data);

        } catch (error) {
            console.error('Ошибка при выполнении спина:', error);
            // Остановка анимации в случае ошибки
            stopSpinAnimation();
        }
    }

    // Функция для отображения новой карты
   async function displayGameCard(data) {
        const cardPlaceholder = document.getElementById('card-placeholder');
        cardPlaceholder.querySelectorAll('div').forEach(div => div.remove());
        if (!cardPlaceholder) {
            console.error('Элемент с ID "card-placeholder" не найден.');
            return;
        }

        // Удаляем только существующие <game-card> элементы
        const existingGameCards = cardPlaceholder.querySelectorAll('game-card');
        existingGameCards.forEach(card => card.remove());


        // Создаём новый элемент <game-card>
        const gameCard = document.createElement('game-card');

        // Устанавливаем атрибуты для карточки
        gameCard.setAttribute('grade', data.grade);
        gameCard.setAttribute('game-image', data.game_img);
        if (data.notification) {
            gameCard.setAttribute('notification', '');
        }

        // Добавляем новый <game-card> в DOM
        cardPlaceholder.appendChild(gameCard);
    }

    handleSpin(); // Ваша функция для спина
});
