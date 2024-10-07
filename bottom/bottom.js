// bottom/bottom.js

document.addEventListener('DOMContentLoaded', () => {
    // Переключение активного состояния
    function toggleActiveState(target) {
        // Убираем активное состояние со всех кнопок
        document.querySelectorAll('.bottom__item').forEach(item => {
            item.classList.remove('bottom__item--active');
            const icon = item.querySelector('.bottom__icon');
            const type = item.getAttribute('data-type');
            // Меняем иконку на неактивную
            icon.src = `assets/images/bottom-${type}-false.svg`;
        });

        // Устанавливаем активное состояние на выбранной кнопке
        target.classList.add('bottom__item--active');
        const targetIcon = target.querySelector('.bottom__icon');
        const targetType = target.getAttribute('data-type');
        // Меняем иконку на активную
        targetIcon.src = `assets/images/bottom-${targetType}-true.svg`;

        // Загружаем соответствующий модуль контента
        if (targetType === 'home') {
            // Если кнопка "home", загружаем модуль Spin
            loadContentModule('spin/spin.html');
        } else {
            // Для других кнопок загружаем соответствующие модули
            loadContentModule(`content/${targetType}.html`);
        }
    }

    // Установка статуса уведомления
    function setNotificationStatus(type, hasNotification) {
        const button = document.querySelector(`.bottom__item[data-type="${type}"]`);
        if (button) {
            if (hasNotification) {
                button.classList.add('bottom__item--notification');
            } else {
                button.classList.remove('bottom__item--notification');
            }
        }
    }

    // Обработчик клика для переключения активного состояния
    document.querySelectorAll('.bottom__item').forEach(item => {
        item.addEventListener('click', () => {
            toggleActiveState(item);
        });
    });

    // Обработка статусов уведомлений из backend
    function updateNotifications(statuses) {
        statuses.forEach(({ type, hasNotification }) => {
            setNotificationStatus(type, hasNotification);
        });
    }

    // Функция для получения статусов уведомлений с backend
    async function fetchNotificationStatuses() {
        try {
            const response = await fetch(window.backendUrl.concat('/api/notifications/status'));
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }
            const data = await response.json();
            updateNotifications(data);
        } catch (error) {
            console.error('Ошибка при получении статусов уведомлений:', error);
        }
    }

    // Первоначальное получение статусов уведомлений
    fetchNotificationStatuses();

    // Запрашиваем статусы уведомлений с интервалом
    setInterval(fetchNotificationStatuses, 10000); // Каждые 10 секунд

    // Инициализируем активную вкладку "home" при загрузке
    const initialTab = document.querySelector('.bottom__item[data-type="home"]');
    if (initialTab) {
        toggleActiveState(initialTab);
    }
});
