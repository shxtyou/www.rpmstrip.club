document.addEventListener('DOMContentLoaded', () => {
  // --- Навигация по вкладкам ---
  const tabLinks = document.querySelectorAll('nav a.tab-link');
  const cards = document.querySelectorAll('.card');

  tabLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      // Снимаем активность со всех вкладок и карточек
      tabLinks.forEach(l => l.classList.remove('active'));
      cards.forEach(c => c.classList.remove('active'));

      // Активируем выбранную вкладку и карточку
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
    promoPopup.style.opacity = '1';

    setTimeout(() => {
      promoPopup.style.opacity = '0';
      setTimeout(() => {
        promoPopup.style.display = 'none';
      }, 1000);
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
      // Подсветка выбранной услуги
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      currentSelectedService = card.getAttribute('data-service');
      selectedServiceInput.value = currentSelectedService;
      selectedServiceDisplay.value = currentSelectedService;

      // Автоматически открыть форму заказа при выборе услуги
      showOrderPopup();
    });
  });

  // --- Открытие и закрытие формы заказа ---
  function showOrderPopup() {
    if (!orderPopup) return;
    orderPopup.style.display = 'block';
    setTimeout(() => {
      orderPopup.style.opacity = '1';
      orderPopup.style.transform = 'translate(-50%, 0)';
      orderPopup.setAttribute('aria-hidden', 'false');
    }, 10);
  }

  function hideOrderPopup() {
    if (!orderPopup) return;
    orderPopup.style.opacity = '0';
    orderPopup.style.transform = 'translate(-50%, -20px)';
    orderPopup.setAttribute('aria-hidden', 'true');
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
    if (promoCode.toUpperCase() === 'YRA') {
      discount = 5; // 5% скидка
    }

    let message = `Заказ оформлен!\n\nУслуга: ${selectedServiceInput.value}\nDiscord: ${discordNick}\nRPM Ник: ${rpmNick}\nДата: ${orderDate}`;
    if (discount > 0) message += `\nПромокод: ${promoCode} (скидка ${discount}%)`;

    alert(message);

    // Сброс формы и закрытие
    orderForm.reset();
    selectedServiceInput.value = '';
    selectedServiceDisplay.value = '';
    serviceCards.forEach(c => c.classList.remove('selected'));
    hideOrderPopup();
  });

  // --- Форма отзывов ---
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

    const reviews = JSON.parse(localStorage.getItem('rpmReviews') || '[]');
    reviews.unshift({
      name,
      text,
      date: new Date().toISOString()
    });

    localStorage.setItem('rpmReviews', JSON.stringify(reviews));
    loadReviews();

    reviewForm.reset();
    alert('Спасибо за отзыв!');
  });

  // Загрузка отзывов при старте
  loadReviews();
});
