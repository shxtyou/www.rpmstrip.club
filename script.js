// Отправка формы на Discord webhook
const form = document.getElementById('orderForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const discordNick = form.discordNick.value.trim();
  const rpmNick = form.rpmNick.value.trim();
  const service = form.selectedService.value.trim();
  const orderDate = form.orderDate.value;
  const promoCode = form.promoCode.value.trim();

  if (!discordNick || !rpmNick || !service) {
    alert('Пожалуйста, заполните все обязательные поля.');
    return;
  }

  // Новый webhook URL
  const webhookURL = 'https://discord.com/api/webhooks/1377624414471852172/HIY-_AxbHDRFv8KrRd9ILuLrASl8PHk4_Xnh2TJxhQO_oGorfULQU-8ABR1wqpRB4Gko';

  let content = `Новый заказ от **${discordNick}** (РПМ: ${rpmNick})\nУслуга: **${service}**`;
  if (!service.toLowerCase().includes('vip')) {
    content += `\nДата: ${orderDate || 'не указана'}`;
    content += `\nПромокод: ${promoCode || 'нет'}`;
  }

  try {
    const res = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (res.ok) {
      alert('Заказ успешно отправлен! Спасибо.');
      form.reset();
      document.getElementById('order').style.display = 'none'; // закрываем форму
    } else {
      alert('Ошибка при отправке заказа. Попробуйте позже.');
      console.log('Ошибка Discord webhook, статус:', res.status);
    }
  } catch (err) {
    alert('Ошибка при отправке заказа. Проверьте подключение к интернету.');
    console.error('Ошибка webhook:', err);
  }
});

window.addEventListener('load', () => {
  // Показываем промокод до 29 мая 2025 16:00
  const promoDeadline = new Date("2025-05-29T16:00:00");
  if (new Date() < promoDeadline) {
    const promo = document.getElementById("promoPopup");
    promo.style.display = "block";
    setTimeout(() => {
      promo.style.display = "none";
    }, 10000);
  }

  // Установка min для даты (сегодня)
  const orderDateInput = document.getElementById('orderDate');
  const todayStr = new Date().toISOString().split('T')[0];
  orderDateInput.min = todayStr;
});

// Вкладки основного меню
document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tabId = link.getAttribute('data-tab');

    document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    link.classList.add('active');
  });
});

// Вкладки с сотрудницами в прайсе
const personTabs = document.querySelectorAll('.person-tab');
const serviceLists = document.querySelectorAll('.service-list');

personTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    personTabs.forEach(t => t.classList.remove('active'));
    serviceLists.forEach(s => s.classList.remove('active'));

    tab.classList.add('active');
    const personId = tab.getAttribute('data-person');
    document.getElementById(personId).classList.add('active');

    // Обновим выпадающий список услуг в форме при смене сотрудницы
    if (personId === 'briz' || personId === 'lisa') {
      updateServiceSelect(personId);
    }
  });
});

// Кнопка открытия формы заказа
const orderToggle = document.getElementById('orderToggle');
const orderPopup = document.getElementById('order');
const closeOrderBtn = document.getElementById('closeOrder');

orderToggle.addEventListener('click', () => {
  openOrderPopup();
});

closeOrderBtn.addEventListener('click', () => {
  closeOrderPopup();
});

function openOrderPopup() {
  orderPopup.style.display = 'block';
  setTimeout(() => orderPopup.classList.add('show'), 10);
  // Сброс формы и списков
  resetOrderForm();
}

function closeOrderPopup() {
  orderPopup.classList.remove('show');
  setTimeout(() => {
    orderPopup.style.display = 'none';
  }, 400);
}

// Обновление списка услуг при выборе сотрудницы
const personSelect = document.getElementById('personSelect');
const serviceSelect = document.getElementById('serviceSelect');

personSelect.addEventListener('change', () => {
  const selectedPerson = personSelect.value;
  updateServiceSelect(selectedPerson);
});

// Обновляет <select> услуг в форме согласно выбранной сотруднице
function updateServiceSelect(personName) {
  // Найдем нужный список услуг из DOM
  const listId = personName.toLowerCase() === 'бриз' ? 'briz' : 'lisa';
  const servicesDiv = document.getElementById(listId);
  const items = servicesDiv.querySelectorAll('li');

  // Очистим select
  serviceSelect.innerHTML = '';
  serviceSelect.disabled = false;

  // Добавим placeholder
  const placeholder = document.createElement('option');
  placeholder.textContent = '-- Выберите услугу --';
  placeholder.disabled = true;
  placeholder.selected = true;
  serviceSelect.appendChild(placeholder);

  // Добавляем услуги из списка
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.textContent.trim();
    option.title = item.title || '';
    option.textContent = item.textContent.trim();
    serviceSelect.appendChild(option);
  });
}

// Валидируем форму и отправляем на Discord webhook
const form = document.getElementById('orderForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const discordNick = form.discordNick.value.trim();
  const rpmNick = form.rpmNick.value.trim();
  const person = form.person.value.trim();
  const service = form.service.value.trim();
  const orderDate = form.orderDate.value;
  const promoCode = form.promoCode.value.trim();

  if (!discordNick || !rpmNick || !person || !service) {
    alert('Пожалуйста, заполните все обязательные поля.');
    return;
  }

  // Проверка даты — не в прошлом
  if (orderDate) {
    const selectedDate = new Date(orderDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) {
      alert('Дата не может быть в прошлом.');
      return;
    }
  } else {
    alert('Пожалуйста, выберите дату.');
    return;
  }

  const webhookURL = 'https://discord.com/api/webhooks/1377196690099933279/o4XKVX179xTD6IV9FIG-kRg9w_t8XDlBG_xewTh2uRVLJfxvgzUpJtS6rFwOw5eXSID1';

  let content = `Новый заказ от **${discordNick}** (РПМ: ${rpmNick})\nСотрудница: **${person}**\nУслуга: **${service}**\nДата: ${orderDate}\nПромокод: ${promoCode || 'нет'}`;

  try {
    const res = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (res.ok) {
      alert('Заказ успешно отправлен! Спасибо.');
      form.reset();
      closeOrderPopup();
    } else {
      alert('Ошибка при отправке заказа. Попробуйте позже.');
    }
  } catch (err) {
    alert('Ошибка при отправке заказа. Проверьте подключение к интернету.');
  }
});

// Сбрасываем форму при открытии
function resetOrderForm() {
  form.reset();
  serviceSelect.innerHTML = '<option value="" disabled selected>-- Сначала выберите сотрудницу --</option>';
  serviceSelect.disabled = true;
  personSelect.value = "";
  // Сброс даты min
  const todayStr = new Date().toISOString().split('T')[0];
  orderDateInput.min = todayStr;
}
