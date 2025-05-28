const webhookURL = 'https://discord.com/api/webhooks/1377196690099933279/o4XKVX179xTD6IV9FIG-kRg9w_t8XDlBG_xewTh2uRVLJfxvgzUpJtS6rFwOw5eXSID1';

// Переключение вкладок
document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tabId = link.getAttribute('data-tab');

    document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));

    const tab = document.getElementById(tabId);
    if (tab) {
      tab.classList.add('active');
      link.classList.add('active');
    }
  });
});

// Открытие формы заказа при выборе услуги
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const selectedService = card.dataset.service;
    const selectedServiceInput = document.getElementById('selectedService');
    const selectedServiceDisplay = document.getElementById('selectedServiceDisplay');
    const orderFormBlock = document.getElementById('order');

    if (selectedServiceInput) selectedServiceInput.value = selectedService;
    if (selectedServiceDisplay) selectedServiceDisplay.value = selectedService;
    if (orderFormBlock) orderFormBlock.style.display = 'block';
  });
});

// Закрытие формы заказа
const closeOrder = document.getElementById('closeOrder');
if (closeOrder) {
  closeOrder.addEventListener('click', () => {
    const orderFormBlock = document.getElementById('order');
    if (orderFormBlock) orderFormBlock.style.display = 'none';
  });
}

// Отправка заказа
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const discordNick = document.getElementById('discordNick')?.value.trim();
    const rpmNick = document.getElementById('rpmNick')?.value.trim();
    const service = document.getElementById('selectedService')?.value.trim();
    const date = document.getElementById('orderDate')?.value;
    const promo = document.getElementById('promoCode')?.value.trim();

    const content = `📦 Новый заказ:
**Discord:** ${discordNick}
**РПМ:** ${rpmNick}
**Услуга:** ${service}
**Дата:** ${date || 'не указана'}
**Промокод:** ${promo || 'нет'}`;

    try {
      await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      alert('Заказ отправлен!');
      e.target.reset();
      const orderFormBlock = document.getElementById('order');
      if (orderFormBlock) orderFormBlock.style.display = 'none';
    } catch (err) {
      alert('Ошибка отправки заказа!');
      console.error('Ошибка при отправке заказа:', err);
    }
  });
}

// Рендер отзывов
function renderReviews() {
  const reviewsList = document.getElementById("reviewsList");
  if (!reviewsList) return;

  const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  reviewsList.innerHTML = reviews.map(r => `
    <div class="review">
      <strong>${r.name}</strong> <span class="review-date">${r.date}</span><br/>
      <p>${r.text}</p>
    </div>
  `).join("");
}

renderReviews();

// Добавление отзыва
const reviewForm = document.getElementById("reviewForm");
if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("reviewName")?.value.trim();
    const text = document.getElementById("reviewText")?.value.trim();
    const date = new Date().toLocaleString();

    if (!name || !text) return alert("Заполните все поля!");

    const review = { name, text, date };
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviews.unshift(review);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    renderReviews();

    const content = `💬 Новый отзыв от **${name}** (${date}):\n${text}`;
    try {
      await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
    } catch (err) {
      console.error("Ошибка отправки отзыва:", err);
    }

    reviewForm.reset();
  });
}
