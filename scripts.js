// Цены услуг
const servicesPrices = {
  "Минет": 25000,
  "Фемдом": 38000,
  "Подчинение": 80000,
  "Шибари": 20000,
  "BDSM": 40000,
  "Фут Джоб": 20000,
  "Тит Джоб": 20000,
  "Спанкинг": 15000,
  "Пеггинг": 15000,
  "Бондаж": 20000,
  "Игры с воском": 17000,
  "Ролевая игра (Сценарий + 4,000$)": 20000,
  "МейлДом": 22000,
  "Стриптиз / Приват-танец": 10000,
  "Совместная ванна + массаж": 25000,
  "Ночь со мной": 100000,
  "Фото-/видеосъёмка + сопровождение": 80000,
  "VIP Клиент": 200000
};

// Промокоды
const promoCodes = {
  "YRA": 0.95,
  "ONYX-2025-ELITE-XR": 0.90
};

function calculateFinalPrice() {
  const selectedService = document.getElementById('selectedService').value;
  const promoCodeInput = document.getElementById('promoCode').value.trim().toUpperCase();

  const basePrice = servicesPrices[selectedService] || 0;
  const discount = promoCodes[promoCodeInput] || 1;
  const finalPrice = Math.round(basePrice * discount);

  let priceDisplay = document.getElementById('finalPriceDisplay');
  if (!priceDisplay) {
    priceDisplay = document.createElement('div');
    priceDisplay.id = 'finalPriceDisplay';
    priceDisplay.style.marginTop = '10px';
    priceDisplay.style.fontWeight = 'bold';
    priceDisplay.style.fontSize = '1.2em';
    priceDisplay.style.color = '#cba0ff';
    document.getElementById('orderForm').appendChild(priceDisplay);
  }
  priceDisplay.textContent = `Итоговая цена: ${finalPrice.toLocaleString('ru-RU')} руб.`;

  return finalPrice;
}

// Выбор услуги
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const serviceName = card.querySelector('.service-name').textContent;
    document.getElementById('selectedService').value = serviceName;
    document.getElementById('selectedServiceDisplay').value = serviceName;
    document.getElementById('order').style.display = 'block';

    toggleFieldsVisibility(serviceName);
    calculateFinalPrice();
  });
});

// При изменении промокода
document.getElementById('promoCode').addEventListener('input', calculateFinalPrice);

// Отправка заказа
document.getElementById('orderForm').addEventListener('submit', async e => {
  e.preventDefault();

  const webhookUrl = 'https://discord.com/api/webhooks/1377196690099933279/o4XKVX179xTD6IV9FIG-kRg9w_t8XDlBG_xewTh2uRVLJfxvgzUpJtS6rFwOw5eXSID1';

  const discordNick = document.getElementById('discordNick').value.trim();
  const rpmNick = document.getElementById('rpmNick').value.trim();
  const selectedService = document.getElementById('selectedService').value;
  const orderDate = document.getElementById('orderDate').value;
  const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
  const finalPrice = calculateFinalPrice();

  const content = `📝 **Новый заказ**\n` +
    `**Discord:** ${discordNick}\n` +
    `**РПМ Ник:** ${rpmNick}\n` +
    `**Услуга:** ${selectedService}\n` +
    (orderDate ? `**Дата:** ${orderDate}\n` : ``) +
    (promoCode ? `**Промокод:** ${promoCode}\n` : ``) +
    `**Итоговая цена:** ${finalPrice.toLocaleString('ru-RU')} руб.`;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    alert("Ваш заказ успешно отправлен!");
    document.getElementById('orderForm').reset();
    document.getElementById('order').style.display = 'none';

    const priceDisplay = document.getElementById('finalPriceDisplay');
    if (priceDisplay) priceDisplay.textContent = '';
  } catch (err) {
    console.error(err);
    alert("Ошибка при отправке. Повторите позже.");
  }
});

// Промо при загрузке
window.addEventListener('load', () => {
  const deadline = new Date("2025-05-29T16:00:00");
  const now = new Date();
  if (now < deadline) {
    const popup = document.getElementById('promoPopup');
    popup.style.display = 'block';
    setTimeout(() => {
      popup.style.display = 'none';
    }, 10000);
  }
});

// Вкладки
document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tab = link.getAttribute('data-tab');

    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));

    link.classList.add('active');
    document.getElementById(tab).classList.add('active');
  });
});

// Подвкладки
document.querySelectorAll('.sub-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-subtab');

    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sub-card').forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

// Переключение видимости заказа
document.getElementById('orderToggle').addEventListener('click', () => {
  const order = document.getElementById('order');
  order.style.display = order.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('closeOrder').addEventListener('click', () => {
  document.getElementById('order').style.display = 'none';
});

// Скрытие полей для VIP
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
