// Объект с ценами услуг (ключ — название услуги, значение — цена в рублях)
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
  "Ролевая игра": 20000, // по твоему описанию 20,000$
  "МейлДом": 22000,
  "Стриптиз / Приват-танец": 10000,
  "Совместная ванна + массаж": 25000,
  "Ночь со мной": 100000,
  "Фото-/видеосъёмка + сопровождение": 80000,
  "VIP Клиент": 200000 // учитывая, что у тебя в HTML написано "200.000%" — тут лучше просто число
};

// Объект с промокодами и скидками (10% = 0.9, 20% = 0.8 и т.п.)
const promoCodes = {
  "YRA": 0.95,          // 5% скидка
  "DISCOUNT10": 0.9,
  "SALE20": 0.8
};

// Функция пересчёта итоговой цены
function calculateFinalPrice() {
  const selectedService = document.getElementById('selectedService').value;
  const promoCodeInput = document.getElementById('promoCode').value.trim().toUpperCase();

  const basePrice = servicesPrices[selectedService] || 0;
  const discount = promoCodes[promoCodeInput] || 1; // если промокода нет, скидка 1 (0%)

  const finalPrice = Math.round(basePrice * discount);

  // Показываем цену в форме (создаем или обновляем элемент с итоговой ценой)
  let priceDisplay = document.getElementById('finalPriceDisplay');
  if (!priceDisplay) {
    priceDisplay = document.createElement('div');
    priceDisplay.id = 'finalPriceDisplay';
    priceDisplay.style.marginTop = '10px';
    priceDisplay.style.fontWeight = 'bold';
    priceDisplay.style.fontSize = '1.2em';
    priceDisplay.style.color = '#cba0ff';

    const orderForm = document.getElementById('orderForm');
    orderForm.appendChild(priceDisplay);
  }
  priceDisplay.textContent = `Итоговая цена: ${finalPrice.toLocaleString('ru-RU')} руб.`;

  return finalPrice;
}

// При клике на карточку услуги
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const serviceName = card.dataset.service;
    document.getElementById('selectedService').value = serviceName;
    document.getElementById('selectedServiceDisplay').value = serviceName;
    document.getElementById('order').style.display = 'block';

    // Переключаем видимость полей, если нужно (из твоего кода)
    toggleFieldsVisibility(serviceName);

    calculateFinalPrice();
  });
});

// При вводе промокода пересчитываем цену
document.getElementById('promoCode').addEventListener('input', calculateFinalPrice);

// Обработчик отправки формы
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
      body: JSON.stringify({ content }),
    });

    alert("Ваш заказ успешно отправлен!");
    document.getElementById('orderForm').reset();
    document.getElementById('order').style.display = 'none';

    // Сбрасываем отображение цены
    const priceDisplay = document.getElementById('finalPriceDisplay');
    if (priceDisplay) priceDisplay.textContent = 'Итоговая цена: 0 руб.';
  } catch (error) {
    alert("Ошибка отправки заказа. Повторите позже.");
    console.error(error);
  }
});

// Показ промокода при загрузке (из твоего кода)
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

// Вкладки и другие твои обработчики
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

document.getElementById('orderToggle').addEventListener('click', () => {
  const orderPopup = document.getElementById('order');
  orderPopup.style.display = orderPopup.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('closeOrder').addEventListener('click', () => {
  document.getElementById('order').style.display = 'none';
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
