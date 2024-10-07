// spin/spin.js

document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spin-button');
    const spinImage = document.getElementById('spin-image');
    const frameFaceDown = document.getElementById('frame-facedown-all');

    // Функция для начала анимации вращения
    function startSpinAnimation() {
        spinImage.classList.add('rotating');
        frameFaceDown.classList.add('rotating');
    }

    // Функция для остановки анимации вращения
    function stopSpinAnimation() {
        spinImage.classList.remove('rotating');
        frameFaceDown.classList.remove('rotating');
    }

    // Функция для обработки ответа от API
    async function handleSpin() {
        try {
            // Начало анимации
            startSpinAnimation();

            // Запрос к API /spin
            const response = await fetch('/spin', {
                method: 'GET',
                headers: {
                    // Убедитесь, что у вас настроена авторизация или удалите этот заголовок, если он не нужен
                    'Content-Type': 'application/json', 
                },
                mode: 'cors', // Добавляем режим CORS
                credentials: 'include', // Добавляем, если необходимо передавать куки
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

        // Создаем новый элемент карточки с использованием game-card.js
        const gameCard = new GameCard({
            grade: data.grade,
            gameImage: data.game_img,
            notification: data.notification,
            size: 200
        });

        // Очищаем placeholder и добавляем новую карточку
        cardPlaceholder.innerHTML = '';
        cardPlaceholder.appendChild(gameCard.getElement());
    }

    // Привязываем обработчик к кнопке
    spinButton.addEventListener('click', handleSpin);
});
