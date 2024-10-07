// spin/spin.js

document.addEventListener('DOMContentLoaded', () => {


});

document.getElementById('spin-button').addEventListener('click', () => {


    // Функция для начала анимации вращения
    function startSpinAnimation() {
        const spinImage = document.getElementById('spin-image');
        const frameFaceDown = document.getElementById('frame-facedown-all');
        spinImage.classList.add('rotating');
        frameFaceDown.classList.add('rotating');
    }

    // Функция для остановки анимации вращения
    function stopSpinAnimation() {
        const spinImage = document.getElementById('spin-image');
        const frameFaceDown = document.getElementById('frame-facedown-all');
        spinImage.classList.remove('rotating');
        frameFaceDown.classList.remove('rotating');
    }

    // Функция для обработки ответа от API
    async function handleSpin() {
        try {
            // Начало анимации
            startSpinAnimation();

            // Запрос к API /spin
            const response = await fetch(window.backendUrl.concat('/spin'), {
                method: 'GET',
                headers: {
                    // Убедитесь, что у вас настроена авторизация или удалите этот заголовок, если он не нужен
                    'Content-Type': 'application/json',
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
    function displayGameCard(data) {
        const cardPlaceholder = document.getElementById('card-placeholder');

        // Удаляем только существующие <game-card> элементы
        const existingGameCards = cardPlaceholder.querySelectorAll('game-card');
        existingGameCards.forEach(card => card.remove());

        // Создаём новый элемент <game-card>
        const gameCard = document.createElement('game-card');

        // Устанавливаем необходимые атрибуты
        gameCard.setAttribute('grade', data.grade);
        gameCard.setAttribute('game-image', data.game_img);
        if (data.notification) {
            gameCard.setAttribute('notification', '');
        }

        // Устанавливаем размер через CSS или атрибуты, если необходимо
        gameCard.style.width = '200px';
        gameCard.style.height = '200px';

        // Очищаем placeholder и добавляем новую карточку
        cardPlaceholder.appendChild(gameCard);
    }

    handleSpin(); // Ваша функция для спина
});