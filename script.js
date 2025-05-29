window.addEventListener('DOMContentLoaded', () => {
  const promoDeadline = new Date("2025-05-29T16:00:00");
  if (new Date() < promoDeadline) {
    const promo = document.getElementById("promoPopup");
    promo.style.display = "block";
    setTimeout(() => promo.style.display = "none", 10000);
  }

  const orderDateInput = document.getElementById('orderDate');
  const todayStr = new Date().toISOString().split('T')[0];
  orderDateInput.min = todayStr;

  // Переключение вкладок
  document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const tabId = link.dataset.tab;
      document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
      document.getElementById(tabId)?.classList.add('active');
      link.classList.add('active');
    });
  });

  // Переключение девушек
  const personTabs = document.querySelectorAll('.person-tab');
  const serviceLists = document.querySelectorAll('.service-list');

  personTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      personTabs.forEach(t => t.classList.remove('active'));
      serviceLists.forEach(s => s.classList.remove('active'));

      const personId = tab.dataset.person;
      document.getElementById(personId)?.classList.add('active');
      tab.classList.add('active');
      updateServiceSelect(personId);
    });
  });

  // Автозаполнение формы при клике на услугу
  document.querySelectorAll('.service-list li').forEach(item => {
    item.addEventListener('click', () => {
      document.getElementById('orderToggle').click();
      const activePerson = document.querySelector('.person-tab.active')?.textContent.trim();
      const personSelect = document.getElementById('personSelect');
      const serviceSelect = document.getElementById('serviceSelect');

      personSelect.value = activePerson;
      updateServiceSelect(activePerson);
      setTimeout(() => {
        [...serviceSelect.options].forEach(opt => {
          if (opt.value === item.textContent.trim()) serviceSelect.value = opt.value;
        });
      }, 100);
    });
  });

  // Модальное окно заказа
  const orderToggle = document.getElementById('orderToggle');
  const orderPopup = document.getElementById('order');
  const closeOrderBtn = document.getElementById('closeOrder');

  orderToggle.addEventListener('click', () => openOrderPopup());
  closeOrderBtn.addEventListener('click', () => closeOrderPopup());

  function openOrderPopup() {
    orderPopup.style.display = 'block';
    setTimeout(() => orderPopup.classList.add('show'), 10);
    resetOrderForm();
  }

  function closeOrderPopup() {
    orderPopup.classList.remove('show');
    setTimeout(() => orderPopup.style.display = 'none', 400);
  }

  // Выбор услуги по сотруднице
  const personSelect = document.getElementById('personSelect');
  const serviceSelect = document.getElementById('serviceSelect');

  personSelect.addEventListener('change', () => {
    updateServiceSelect(personSelect.value);
  });

  function updateServiceSelect(personName) {
    if (!personName) {
      serviceSelect.innerHTML = '<option value="" disabled selected>-- Сначала выберите сотрудницу --</option>';
      serviceSelect.disabled = true;
      return;
    }

    const id = personName.toLowerCase() === 'бриз' ? 'briz' : 'lisa';
    const list = document.getElementById(id);
    const items = list?.querySelectorAll('li') || [];

    serviceSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.textContent = '-- Выберите услугу --';
    placeholder.disabled = true;
    placeholder.selected = true;
    serviceSelect.appendChild(placeholder);

    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = item.textContent.trim();
      opt.title = item.title;
      serviceSelect.appendChild(opt);
    });

    serviceSelect.disabled = false;
  }

  // Отправка формы
  const form = document.getElementById('orderForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
      discordNick: form.discordNick.value.trim(),
      rpmNick: form.rpmNick.value.trim(),
      person: form.person.value,
      service: form.service.value,
      orderDate: form.orderDate.value,
      orderTime: form.orderTime.value,
      promoCode: form.promoCode.value.trim()
    };

    if (!data.discordNick || !data.rpmNick || !data.person || !data.service || !data.orderDate || !data.orderTime) {
      alert('Заполните все поля.');
      return;
    }

    const content = `Новый заказ от **${data.discordNick}** (РПМ: ${data.rpmNick})\nСотрудница: **${data.person}**\nУслуга: **${data.service}**\nДата: ${data.orderDate} в ${data.orderTime}\nПромокод: ${data.promoCode || 'нет'}`;
    const webhookURL = 'https://discord.com/api/webhooks/1377624414471852172/HIY-_AxbHDRFv8KrRd9ILuLrASl8PHk4_Xnh2TJxhQO_oGorfULQU-8ABR1wqpRB4Gko';

    try {
      const res = await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (res.ok) {
        alert('Заказ отправлен!');
        form.reset();
        closeOrderPopup();
      } else {
        alert('Ошибка отправки.');
      }
    } catch (err) {
      alert('Ошибка подключения.');
    }
  });

  function resetOrderForm() {
    form.reset();
    updateServiceSelect();
  }

  // Переключение темы
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
});