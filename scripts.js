// Показ промокода при загрузке
window.addEventListener('load', () => {
  const promoDeadline = new Date("2025-05-29T16:00:00");
  if (new Date() < promoDeadline) {
    const promo = document.getElementById("promoPopup");
    promo.style.display = "block";
    setTimeout(() => {
      promo.style.display = "none";
    }, 10000);
  }
});

// Вкладки
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

// Открытие и закрытие окна заказа
const orderToggle = document.getElementById('orderToggle');
const orderPopup = document.getElementById('order');
const closeOrderBtn = document.getElementById('closeOrder');

orderToggle.addEventListener('click', () => {
  orderPopup.style.display = orderPopup.style.display === 'block' ? 'none' : 'block';
});

closeOrderBtn.addEventListener('click', () => {
  orderPopup.style.display = 'none';
});

// Открытие формы при клике на карточку
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const selectedService = card.dataset.service;
    document.getElementById('selectedService').value = selectedService;
    document.getElementById('selectedServiceDisplay').value = selectedService;

    document.getElementById('order').style.display = 'block';
    toggleFieldsVisibility(selectedService);
  });
});

function toggleFieldsVisibility(serviceName) {
  const promoGroup = document.getElementById('promoGroup');
  const orderDate = document.getElementById('orderDate');

  if (serviceName.toLowerCase().includes('vip')) {
    promoGroup.style.display = 'none';
    orderDate.style.display = 'none';
    orderDate.removeAttribute('required');
  } else {
    promoGroup.style.display = 'block';
    orderDate.style.display = 'block';
    orderDate.setAttribute('required', 'true');
  }
}

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

  const webhookURL = 'https://discord.com/api/webhooks/1377196690099933279/o4XKVX179xTD6IV9FIG-kRg9w_t8XDlBG_xewTh2uRVLJfxvgzUpJtS6rFwOw5eXSID1';

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
      orderPopup.style.display = 'none';
    } else {
      alert('Ошибка при отправке заказа. Попробуйте позже.');
    }
  } catch (err) {
    alert('Ошибка при отправке заказа. Проверьте подключение к интернету.');
  }
});
