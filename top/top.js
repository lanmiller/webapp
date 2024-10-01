// top/top.js

document.addEventListener('DOMContentLoaded', () => {
    class TopModule {
        constructor() {
            this.topElement = document.querySelector('.top');
            if (!this.topElement) {
                console.error('Элемент .top не найден');
                return;
            }
            this.nicknameElement = this.topElement.querySelector('.top__nickname');
            this.levelNumberElement = this.topElement.querySelector('.top__lvl');
            this.statsElements = {
                cards: this.topElement.querySelectorAll('.top__stat-value')[0],
                gn: this.topElement.querySelectorAll('.top__stat-value')[1],
                energy: this.topElement.querySelectorAll('.top__stat-value')[2],
            };
            this.apiEndpoint = '/api/user/stats'; // Замените на ваш реальный эндпоинт
            this.pollInterval = 5000; // 5 секунд
            this.init();
        }

        init() {
            this.fetchData();
            this.startPolling();
        }

        async fetchData() {
            try {
                const response = await fetch(this.apiEndpoint);
                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }
                const data = await response.json();
                this.updateUI(data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }

        updateUI(data) {
            // Обновление никнейма
            this.nicknameElement.textContent = data.nickname || 'Nickname';

            // Обновление уровня
            this.levelNumberElement.textContent = data.level || '1';

            // Обновление статистики
            this.statsElements.cards.textContent = data.cards !== undefined ? data.cards : '0';
            this.statsElements.gn.textContent = data.gn !== undefined ? data.gn : '0';
            this.statsElements.energy.textContent = data.energy !== undefined ? data.energy : '0';
        }

        startPolling() {
            this.polling = setInterval(() => {
                this.fetchData();
            }, this.pollInterval);
        }

        stopPolling() {
            clearInterval(this.polling);
        }
    }

    // Инициализация модуля Top
    new TopModule();
});
