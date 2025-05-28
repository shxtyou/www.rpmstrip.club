const servicesPrices = {
  "Минет": 25000,
  "BDSM": 40000,
  "VIP Клиент": 200000
};

const promoCodes = {
  "YPA": 0.95,
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

document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const serviceName = card.dataset.service;
    document.getElementById('selectedService').value = serviceName;
    document.getElementById('selectedServiceDisplay').value = serviceName;
    document.getElementById('order').style.display = 'block';
    toggleFieldsVisibility(serviceName);
    calculateFinalPrice();
  });
});

document.getElementById('promoCode').addEventListener('input', calculateFinalPrice);

document.getElementById('orderForm').addEventListener('submit', async e => {
  e.preventDefault();
  const webhookUrl = 'https://discord.com/api/webhooks/your-webhook';
  const discordNick = document.getElementById('discordNick').value.trim();
  const rpmNick = document.getElementById('rpmNick').value.trim();
  const selectedService = document.getElementById('selectedService').value;
  const orderDate = document.getElementById('orderDate').value;
  const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
  const finalPrice = calculateFinalPrice();

  const content = `📝 **Новый заказ**\n**Discord:** ${discordNick}\n**РПМ Ник:** ${rpmNick}\n**Услуга:** ${selectedService}\n${orderDate ? `**Дата:** ${orderDate}\n` : ''}${promoCode ? `**Промокод:** ${promoCode}\n` : ''}**Итоговая цена:** ${finalPrice.toLocaleString('ru-RU')} руб.`;

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
    if (priceDisplay) priceDisplay.textContent = 'Итоговая цена: 0 руб.';
  } catch (error) {
    alert("Ошибка отправки заказа. Повторите позже.");
    console.error(error);
  }
});

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
