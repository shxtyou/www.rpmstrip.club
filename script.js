window.addEventListener('DOMContentLoaded', () => {
  const services = {
    briz: [
      { name: '💋 Минет', price: 25000 },
      { name: '👠 Фемдом', price: 38000 },
      { name: '🪢 Шибари', price: 20000 },
      { name: '🦶 Фут Джоб', price: 20000 },
      { name: '🎀 Тит Джоб', price: 20000 },
      { name: '🔗 Бондаж', price: 20000 },
      { name: '🎭 Ролевая игра (Сценарий + 4,000$)', price: 24000 },
      { name: '🌙 Ночь со мной (до 8 часов)', price: 100000 },
    ],
    lisa: [
      { name: '🫦 Подчинение', price: 80000 },
      { name: '⛓ BDSM', price: 40000 },
      { name: '🍑 Спанкинг', price: 15000 },
      { name: '🔞 Пеггинг', price: 15000 },
      { name: '🕯 Игры с воском', price: 17000 },
      { name: '🕴 МейлДом', price: 22000 },
    ],
    both: [
      { name: '💃 Стриптиз / Приват-танец', price: 10000 },
      { name: '🛁 Совместная ванна + массаж', price: 25000 },
      { name: '📸 Фото-/видеосъёмка + сопровождение', price: 80000 },
      { name: '🎨 Арт / Позинг', price: 70000 },
    ]
  };

  const container = document.getElementById('servicesContainer');
  const groupOption = document.getElementById('groupOption');
  const groupPartnerSelect = document.getElementById('groupPartnerSelect');
  const customPartnerName = document.getElementById('customPartnerName');
  const serviceSelect = document.getElementById('serviceSelect');
  const personSelect = document.getElementById('personSelect');
  const finalPrice = document.getElementById('finalPrice');
  const promoInput = document.getElementById('promoCode');
  const orderDateInput = document.getElementById('orderDate');

  orderDateInput.min = new Date().toISOString().split('T')[0];

  document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const tabId = link.dataset.tab;

      document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
      document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));

      document.getElementById(tabId)?.classList.add('active');
      link.classList.add('active');
    });
  });

  function renderServices() {
    container.innerHTML = '';
    const allServices = [...services.briz, ...services.lisa, ...services.both];
    const gradients = [
      'linear-gradient(135deg, #ff007a, #9e00ff)',
      'linear-gradient(135deg, #ff0088, #ffcc00)',
      'linear-gradient(135deg, #9900ff, #00c3ff)',
      'linear-gradient(135deg, #ff4d00, #ff00c8)',
      'linear-gradient(135deg, #00ffd5, #6a00ff)'
    ];

    allServices.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.style.background = gradients[i % gradients.length];
      card.style.color = '#000';
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
        card.style.boxShadow = '0 0 25px #fff';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 0 15px var(--accent)';
      });
      card.innerHTML = `<h4 style="text-shadow: 0 0 3px #fff">${s.name}</h4><p><strong>${s.price.toLocaleString()}$</strong></p><button data-index="${i}">Выбрать</button>`;
      card.dataset.index = i;
      container.appendChild(card);
    });
  }

  function openOrderPopup() {
    document.getElementById('order').style.display = 'block';
    setTimeout(() => document.getElementById('order').classList.add('show'), 10);
  }

  container.addEventListener('click', e => {
    const btn = e.target.closest('button[data-index]');
    if (!btn) return;
    const index = +btn.dataset.index;
    const all = [...services.briz, ...services.lisa, ...services.both];
    const service = all[index];
    openOrderPopup();
    serviceSelect.innerHTML = `<option selected>${service.name}</option>`;
    serviceSelect.disabled = true;
    updateFinalPrice();
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

  document.getElementById('closeOrder').addEventListener('click', () => {
    document.getElementById('order').classList.remove('show');
    setTimeout(() => document.getElementById('order').style.display = 'none', 400);
  });

  renderServices();
});
