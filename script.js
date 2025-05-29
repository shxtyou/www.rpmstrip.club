window.addEventListener('load', () => {
  const promoDeadline = new Date("2025-05-29T16:00:00");
  if (new Date() < promoDeadline) {
    const promo = document.getElementById("promoPopup");
    promo.style.display = "block";
    setTimeout(() => {
      promo.style.display = "none";
    }, 10000);
  }

  const orderDateInput = document.getElementById('orderDate');
  const todayStr = new Date().toISOString().split('T')[0];
  orderDateInput.min = todayStr;
});

document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tabId = link.getAttribute('data-tab');

    document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));

    const targetCard = document.getElementById(tabId);
    if (targetCard) targetCard.classList.add('active');
    link.classList.add('active');
  });
});

const personTabs = document.querySelectorAll('.person-tab');
const serviceLists = document.querySelectorAll('.service-list');

personTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    personTabs.forEach(t => t.classList.remove('active'));
    serviceLists.forEach(s => s.classList.remove('active'));

    tab.classList.add('active');
    const personId = tab.getAttribute('data-person');
    const targetList = document.getElementById(personId);
    if (targetList) targetList.classList.add('active');

    updateServiceSelect(personId);
  });
});

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
  setTimeout(() => {
    orderPopup.classList.add('show');
  }, 10);
  resetOrderForm();
}

function closeOrderPopup() {
  orderPopup.classList.remove('show');
  setTimeout(() => {
    orderPopup.style.display = 'none';
  }, 400);
}

const personSelect = document.getElementById('personSelect');
const serviceSelect = document.getElementById('serviceSelect');

personSelect.addEventListener('change', () => {
  const selectedPerson = personSelect.value;
  updateServiceSelect(selectedPerson);
});

function updateServiceSelect(personName) {
  if (!personName) {
    serviceSelect.innerHTML = '<option value="" disabled selected>-- Сначала выберите сотрудницу --</option>';
    serviceSelect.disabled = true;
    return;
  }

  let listId = '';
  if (personName.toLowerCase() === 'бриз') listId = 'briz';
  else if (personName.toLowerCase() === 'лиса') listId = 'lisa';
  else listId = personName.toLowerCase();

  const servicesDiv = document.getElementById(listId);
  if (!servicesDiv) {
    serviceSelect.innerHTML = '<option value="" disabled selected>-- Услуги не найдены --</option>';
    serviceSelect.disabled = true;
    return;
  }

  const items = servicesDiv.querySelectorAll('li');
  serviceSelect.innerHTML = '';
  serviceSelect.disabled = false;

  const placeholder = document.createElement('option');
  placeholder.textContent = '-- Выберите услугу --';
  placeholder.disabled = true;
  placeholder.selected = true;
  serviceSelect.appendChild(placeholder);

  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.textContent.trim();
    option.title = item.title || '';
    option.textContent = item.textContent.trim();
    serviceSelect.appendChild(option);
  });
}

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

  if (orderDate) {
    const selectedDate = new Date(orderDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert('Дата не может быть в прошлом.');
      return;
    }
  } else {
    alert('Пожалуйста, выберите дату.');
    return;
  }

  const webhookURL = 'https://discord.com/api/webhooks/1377624414471852172/HIY-_AxbHDRFv8KrRd9ILuLrASl8PHk4_Xnh2TJxhQO_oGorfULQU-8ABR1wqpRB4Gko';

  let content = `Новый заказ от **${discordNick}** (РПМ: ${rpmNick})\n` +
                `Сотрудница: **${person}**\n` +
                `Услуга: **${service}**\n` +
                `Дата: ${orderDate}\n` +
                `Промокод: ${promoCode || 'нет'}`;

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
      console.error('Ошибка Discord webhook, статус:', res.status);
    }
  } catch (err) {
    alert('Ошибка при отправке заказа. Проверьте подключение к интернету.');
    console.error('Ошибка webhook:', err);
  }
});

function resetOrderForm() {
  form.reset();

  serviceSelect.innerHTML = '<option value="" disabled selected>-- Сначала выберите сотрудницу --</option>';
  serviceSelect.disabled = true;

  personSelect.value = "";

  const orderDateInput = document.getElementById('orderDate');
  const todayStr = new Date().toISOString().split('T')[0];
  orderDateInput.min = todayStr;
}
