document.getElementById('orderForm').addEventListener('submit', async e => {
  e.preventDefault();

  const webhookUrl = 'https://discord.com/api/webhooks/1377196690099933279/o4XKVX179xTD6IV9FIG-kRg9w_t8XDlBG_xewTh2uRVLJfxvgzUpJtS6rFwOw5eXSID1';

  const discordNick = document.getElementById('discordNick').value.trim();
  const rpmNick = document.getElementById('rpmNick').value.trim();
  const selectedService = document.getElementById('selectedService').value;
  const orderDate = document.getElementById('orderDate').value;
  const promoCode = document.getElementById('promoCode').value.trim();

  const content = `📝 **Новый заказ**\n` +
    `**Discord:** ${discordNick}\n` +
    `**РПМ Ник:** ${rpmNick}\n` +
    `**Услуга:** ${selectedService}\n` +
    (orderDate ? `**Дата:** ${orderDate}\n` : ``) +
    (promoCode ? `**Промокод:** ${promoCode}` : ``);

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    alert("Ваш заказ успешно отправлен!");
    document.getElementById('orderForm').reset();
    document.getElementById('order').style.display = 'none';
  } catch (error) {
    alert("Ошибка отправки заказа. Повторите позже.");
    console.error(error);
  }
});

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
document.getElementById('orderToggle').addEventListener('click', () => {
  const orderPopup = document.getElementById('order');
  orderPopup.style.display = orderPopup.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('closeOrder').addEventListener('click', () => {
  document.getElementById('order').style.display = 'none';
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

// Переключение под-вкладок
document.querySelectorAll('.sub-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-subtab');
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sub-card').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});
