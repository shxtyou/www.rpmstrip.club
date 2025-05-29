// Обновлённый script.js с фильтрацией по девушкам и логикой второй эскортницы
window.addEventListener('DOMContentLoaded', () => {
  const services = {
    briz: [
      { name: 'Минет', price: 25000 },
      { name: 'Фемдом', price: 38000 },
      { name: 'Шибари', price: 20000 },
      { name: 'Фут Джоб', price: 20000 },
      { name: 'Бондаж', price: 20000 },
      { name: 'Ролевая игра (Сценарий + 4,000$)', price: 24000 },
      { name: 'Ночь со мной (до 8 часов)', price: 100000 },
    ],
    lisa: [
      { name: 'Подчинение', price: 80000 },
      { name: 'BDSM', price: 40000 },
      { name: 'Спанкинг', price: 15000 },
      { name: 'Пеггинг', price: 15000 },
      { name: 'Игры с воском', price: 17000 },
      { name: 'МейлДом', price: 22000 },
    ],
    both: [
      { name: 'Стриптиз / Приват-танец', price: 10000 },
      { name: 'Совместная ванна + массаж', price: 25000 },
      { name: 'Фото-/видеосъёмка + сопровождение', price: 80000 },
      { name: 'Групповой секс (партнёр на выбор: Вторая эскортница/Ваш человек)', price: 40000, isGroup: true },
    ]
  };

  const orderDateInput = document.getElementById('orderDate');
  orderDateInput.min = new Date().toISOString().split('T')[0];

  const container = document.getElementById('servicesContainer');
  const tabs = document.querySelectorAll('.person-tab');
  const groupOption = document.getElementById('groupOption');
  const groupPartnerSelect = document.getElementById('groupPartnerSelect');
  const customPartnerName = document.getElementById('customPartnerName');
  const serviceSelect = document.getElementById('serviceSelect');
  const personSelect = document.getElementById('personSelect');
  const finalPrice = document.getElementById('finalPrice');
  const promoInput = document.getElementById('promoCode');

  let currentPerson = 'briz';

  function renderServices() {
    container.innerHTML = '';
    const all = [...services[currentPerson], ...services.both];
    all.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `<h4>${s.name}</h4><p>${s.price.toLocaleString()}$</p><button data-index="${i}">Выбрать</button>`;
      card.dataset.index = i;
      card.dataset.person = currentPerson;
      container.appendChild(card);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentPerson = tab.dataset.person;
      renderServices();
    });
  });

  container.addEventListener('click', e => {
    const btn = e.target.closest('button[data-index]');
    if (!btn) return;
    const index = +btn.dataset.index;
    const list = [...services[currentPerson], ...services.both];
    const service = list[index];
    openOrderPopup();
    personSelect.value = currentPerson === 'briz' ? 'Бриз' : 'Лиса';
    updateServiceSelect(personSelect.value);
    setTimeout(() => {
      [...serviceSelect.options].forEach(opt => {
        if (opt.textContent === service.name) serviceSelect.value = opt.value;
      });
      serviceSelect.dispatchEvent(new Event('change'));
    }, 100);
  });

  personSelect.addEventListener('change', () => {
    updateServiceSelect(personSelect.value);
  });

  serviceSelect.addEventListener('change', () => {
    const selected = serviceSelect.value;
    if (selected.includes('Групповой секс')) {
      groupOption.style.display = 'block';
    } else {
      groupOption.style.display = 'none';
      customPartnerName.style.display = 'none';
    }
    updateFinalPrice();
  });

  groupPartnerSelect.addEventListener('change', () => {
    const show = groupPartnerSelect.value === 'custom';
    customPartnerName.style.display = show ? 'block' : 'none';
  });

  promoInput.addEventListener('input', updateFinalPrice);

  function updateServiceSelect(name) {
    const key = name.toLowerCase() === 'бриз' ? 'briz' : 'lisa';
    const all = [...services[key], ...services.both];
    serviceSelect.innerHTML = '<option disabled selected>-- Выберите услугу --</option>';
    all.forEach(s => {
      const opt = document.createElement('option');
      opt.textContent = s.name;
      opt.value = s.name;
      serviceSelect.appendChild(opt);
    });
    serviceSelect.disabled = false;
  }

  function updateFinalPrice() {
    const selected = serviceSelect.value;
    const all = [...services.briz, ...services.lisa, ...services.both];
    const promo = promoInput.value.trim();
    const s = all.find(x => x.name === selected);
    if (!s) return finalPrice.textContent = '';
    let price = s.price;
    if (promo.toUpperCase() === 'YRA') price *= 0.95;
    finalPrice.textContent = `Итоговая цена: ${Math.round(price).toLocaleString()}$`;
  }

  function openOrderPopup() {
    document.getElementById('order').style.display = 'block';
    setTimeout(() => document.getElementById('order').classList.add('show'), 10);
  }

  document.getElementById('closeOrder').addEventListener('click', () => {
    document.getElementById('order').classList.remove('show');
    setTimeout(() => document.getElementById('order').style.display = 'none', 400);
  });

  document.getElementById('orderForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      discordNick: e.target.discordNick.value.trim(),
      rpmNick: e.target.rpmNick.value.trim(),
      person: e.target.person.value,
      service: e.target.service.value,
      orderDate: e.target.orderDate.value,
      orderTime: e.target.orderTime.value,
      promoCode: e.target.promoCode.value.trim(),
      partnerType: groupPartnerSelect.value,
      partnerName: customPartnerName.value.trim()
    };

    if (!data.discordNick || !data.rpmNick || !data.person || !data.service || !data.orderDate || !data.orderTime) {
      alert('Заполните все поля.');
      return;
    }

    if (data.service.includes('Групповой секс')) {
      if (data.partnerType === 'custom' && !data.partnerName) {
        alert('Укажите ник партнёра.');
        return;
      }
      if (data.partnerType === 'escort') {
        data.partnerName = data.person === 'Бриз' ? 'Лиса' : 'Бриз';
      }
    }

    let summary = `Новый заказ от **${data.discordNick}** (РПМ: ${data.rpmNick})\nСотрудница: **${data.person}**\nУслуга: **${data.service}**\nДата: ${data.orderDate} в ${data.orderTime}`;
    if (data.service.includes('Групповой секс')) {
      summary += `\nПартнёр: ${data.partnerName}`;
    }
    if (data.promoCode) summary += `\nПромокод: ${data.promoCode}`;

    const webhookURL = 'https://discord.com/api/webhooks/1377624414471852172/HIY-_AxbHDRFv8KrRd9ILuLrASl8PHk4_Xnh2TJxhQO_oGorfULQU-8ABR1wqpRB4Gko';

    try {
      const res = await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: summary })
      });
      if (res.ok) {
        alert('Заказ отправлен!');
        e.target.reset();
        finalPrice.textContent = '';
        customPartnerName.style.display = 'none';
        document.getElementById('order').classList.remove('show');
        setTimeout(() => document.getElementById('order').style.display = 'none', 400);
      } else alert('Ошибка отправки.');
    } catch {
      alert('Ошибка подключения.');
    }
  });

  renderServices(); // начальная отрисовка
});
