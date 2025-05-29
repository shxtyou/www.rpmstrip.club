// --- Промо-окно ---
window.addEventListener('load', () => {
  const promoDeadline = new Date("2025-05-29T16:00:00");
  const promo = document.getElementById("promoPopup");

  if (new Date() < promoDeadline) {
    promo.classList.add('show');
    setTimeout(() => {
      promo.classList.remove('show');
    }, 10000);
  }
});

// --- Основные вкладки ---
document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tabId = link.getAttribute('data-tab');

    document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('active');
    });
    document.querySelectorAll('.tab-link').forEach(l => {
      l.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    link.classList.add('active');
  });
});

// --- Подвкладки (сотрудницы) ---
document.querySelectorAll('.subtab-link').forEach(button => {
  button.addEventListener('click', () => {
    const subtabId = button.getAttribute('data-subtab');

    document.querySelectorAll('.subtab').forEach(st => {
      st.classList.remove('active');
    });
    document.querySelectorAll('.subtab-link').forEach(btn => {
      btn.classList.remove('active');
    });

    document.getElementById(subtabId).classList.add('active');
    button.classList.add('active');
  });
});

// --- Открытие/закрытие окна заказа ---
const orderToggle = document.getElementById('orderToggle');
const orderPopup = document.getElementById('order');
const closeOrderBtn = document.getElementById('closeOrder');

function showOrderPopup() {
  orderPopup.classList.add('show');
  // Фокусируем первый input при открытии
  document.getElementById('discordNick').focus();
}
function hideOrderPopup() {
  orderPopup.classList.remove('show');
}

orderToggle.addEventListener('click', () => {
  if (orderPopup.classList.contains('show')) {
    hideOrderPopup();
  } else {
    showOrderPopup();
  }
});
closeOrderBtn.addEventListener('click', hideOrderPopup);

// --- Открытие формы при клике на услугу ---
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const service = card.dataset.service;
    const employee = card.dataset.employee;

    // Заполняем значения в форме
    document.getElementById('selectedService').value = service;
    document.getElementById('selectedServiceDisplay').value = service;
    document.getElementById('employeeSelect').value = employee;

    showOrderPopup();

    toggleFieldsVisibility(service);
  });

  // Для accessibility - выбор по Enter и Space
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// --- Управление видимостью полей ---
function toggleFieldsVisibility(serviceName) {
  const promoGroup = document.getElementById('promoGroup');
  const orderDateGroup = document.getElementById('orderDateGroup');
  const orderDate = document.getElementById('orderDate');

  if (serviceName.toLowerCase().includes('vip')) {
    promoGroup.style.display = 'none';
    orderDateGroup.style.display = 'none';
    orderDate.removeAttribute('required');
  } else {
    promoGroup.style.display = 'block';
    orderDateGroup.style.display = 'block';
    orderDate.setAttribute('required', 'true');
  }
}

// --- Валидация даты (не в прошлом) ---
const orderDateInput = document.getElementById('orderDate');
if (orderDateInput) {
  orderDateInput.min = new Date().toISOString().split('T')[0]; // сегодня и далее

  // Обновлять минимум при открытии окна (если форма долго не открывалась)
  orderToggle.addEventListener('click', () => {
    orderDateInput.min = new Date().toISOString().split('T')[0];
  });
}

// --- Отправка формы ---
const form = document.getElementById('orderForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const discordNick = form.discordNick.value.trim();
  const rpmNick = form.rpmNick.value.trim();
  const service = form.selectedService.value.trim();
  const employee = form.employee.value.trim();
  const orderDate = form.orderDate.value;
  const promoCode = form.promoCode.value.trim();

  // Простая валидация даты
  if (orderDate && new Date(orderDate) < new Date(new Date().toISOString().split('T')[0])) {
    alert('Дата заказа не может быть в прошлом.');
    return;
  }

  if (!discordNick || !rpmNick || !service || !employee) {
    alert('Пожалуйста, заполните все обязательные поля.');
    return;
  }

  // Здесь можете отправлять данные на сервер или webhook
  // Пример вывода в консоль:
  console.log('Заказ:', {discordNick, rpmNick, service, employee, orderDate, promoCode});

  alert(`Заказ успешно отправлен!\n\nСотрудница: ${employee}\nУслуга: ${service}`);

  form.reset();
  hideOrderPopup();
});
