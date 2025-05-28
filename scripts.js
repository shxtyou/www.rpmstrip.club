document.addEventListener('DOMContentLoaded', () => {
  // --- Навигация по вкладкам ---
  const tabLinks = document.querySelectorAll('nav a.tab-link');
  const cards = document.querySelectorAll('.card');

  tabLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      tabLinks.forEach(l => l.classList.remove('active'));
      cards.forEach(c => c.classList.remove('active'));

      link.classList.add('active');
      const targetId = link.getAttribute('data-tab');
      const targetCard = document.getElementById(targetId);
      if (targetCard) targetCard.classList.add('active');
    });
  });

  // --- Промокод popup при загрузке ---
  const promoPopup = document.getElementById('promoPopup');
  if (promoPopup) {
    promoPopup.style.display = 'block';
    setTimeout(() => {
      promoPopup.style.opacity = '0';
      setTimeout(() => promoPopup.style.display = 'none', 1000);
    }, 7000);
  }

  // --- Карточки услуг: выбор ---
  const serviceCards = document.querySelectorAll('.service-card');
  const orderPopup = document.getElementById('order');
  const orderToggle = document.getElementById('orderToggle');
  const closeOrderBtn = document.getElementById('closeOrder');
  const selectedServiceInput = document.getElementById('selectedService');
  const selectedServiceDisplay = document.getElementById('selectedServiceDisplay');

  let currentSelectedService = null;

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      currentSelectedService = card.getAttribute('data-service');
      selectedServiceInput.value = currentSelectedService;
      selectedServiceDisplay.value = currentSelectedService;

      showOrderPopup();
    });
  });

  // --- Открытие и закрытие формы заказа ---
  function showOrderPopup() {
    if (!orderPopup) return;
    orderPopup.style.display = 'block';
    setTimeout(() => {
      orderPopup.style.opacity = '1';
      orderPopup.style.transform = 'translate(-50%, -10%)';
    }, 10);
  }

  function hideOrderPopup() {
    if (!orderPopup) return;
    orderPopup.style.opacity = '0';
    orderPopup.style.transform = 'translate(-50%, -20%)';
    setTimeout(() => {
      orderPopup.style.display = 'none';
    }, 300);
  }

  if (orderToggle) {
    orderToggle.addEventListener('click', () => {
      if (orderPopup.style.display === 'block') {
        hideOrderPopup();
      } else {
        showOrderPopup();
      }
    });
  }

  if (closeOrderBtn) {
    closeOrderBtn.addEventListener('click', () => {
      hideOrderPopup();
    });
  }

  // --- Обработка формы заказа ---
  const orderForm = document.getElementById('orderForm');
  orderForm?.addEventListener('submit', e => {
    e.preventDefault();

    if (!selectedServiceInput.value) {
      alert('Пожалуйста, выберите услугу из списка.');
      return;
    }

    const discordNick = orderForm.discordNick.value.trim();
    const rpmNick = orderForm.rpmNick.value.trim();
    const orderDate = orderForm.orderDate.value;
    const promoCode = orderForm.promoCode.value.trim();

    if (!discordNick || !rpmNick || !orderDate) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    let discount = 0;
    if (promoCode.toUpperCase() === 'YRA') discount = 5;

    const message = `**Новый заказ:**\n\n**Услуга:** ${selectedServiceInput.value}\n**Discord:** ${discordNick}\n**RPM Ник:** ${rpmNick}\n**Дата:** ${orderDate}${discount > 0 ? `\n**Промокод:** ${promoCode} (скидка ${discount}%)` : ''}`;

    // Отправка на Discord Webhook
    fetch('https://discord.com/api/webhooks/1377402877525627000/SP6c2slJtULdU-Ejd1tuRlY8HvEeCk_Q72UbfFMOw1FGuEJIoxhWCcoON4tmuxAQpGfO', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    }).then(() => {
      alert('Заказ оформлен!');
    }).catch(err => {
      alert('Ошибка при отправке в Discord: ' + err.message);
    });

    orderForm.reset();
    selectedServiceInput.value = '';
    selectedServiceDisplay.value = '';
    serviceCards.forEach(c => c.classList.remove('selected'));
    hideOrderPopup();
  });

  // --- Обработка отзывов ---
  const reviewForm = document.getElementById('reviewForm');
  const reviewsList = document.getElementById('reviewsList');

  function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('rpmReviews') || '[]');
    reviewsList.innerHTML = '';
    reviews.forEach(({ name, text, date }) => {
      const reviewDiv = document.createElement('div');
      reviewDiv.classList.add('review');

      const dateFormatted = new Date(date).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      reviewDiv.innerHTML = `
        <strong>${name}</strong> <span class="review-date">${dateFormatted}</span>
        <p>${text}</p>
      `;

      reviewsList.appendChild(reviewDiv);
    });
  }

  reviewForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name = reviewForm.reviewName.value.trim();
    const text = reviewForm.reviewText.value.trim();

    if (!name || !text) {
      alert('Пожалуйста, заполните имя и текст отзыва.');
      return;
    }

    const review = {
      name,
      text,
      date: new Date().toISOString()
    };

    const reviews = JSON.parse(localStorage.getItem('rpmReviews') || '[]');
    reviews.unshift(review);
    localStorage.setItem('rpmReviews', JSON.stringify(reviews));
    loadReviews();

    // Отправка отзыва в Discord
    const reviewMessage = `**Новый отзыв:**\n\n**Имя:** ${name}\n**Текст:** ${text}`;
    fetch('https://discord.com/api/webhooks/1377403125828157460/a54wbvTLMZ9ihxRUmFQNM3AYBxHsvtUcF9bKg20d9IZ39AYx4sGB_C2miQBtvnL_LC2u', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: reviewMessage })
    });

    reviewForm.reset();
    alert('Спасибо за отзыв!');
  });

  loadReviews();
});
