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

  function renderServices() {
    const container = document.getElementById('servicesContainer');
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

    const vipBtn = document.getElementById('vipOrderBtn');
    if (vipBtn) {
      vipBtn.addEventListener('click', () => {
        const order = document.getElementById('order');
        order.style.display = 'block';
        setTimeout(() => order.classList.add('show'), 10);

        document.getElementById('orderTitle').textContent = "Оформление VIP";

        document.getElementById('personSelect').disabled = true;
        document.getElementById('serviceSelect').innerHTML = '<option selected>VIP Клиент</option>';
        document.getElementById('serviceSelect').disabled = true;

        document.getElementById('orderDate').style.display = 'none';
        document.getElementById('promoCode').style.display = 'none';

        document.getElementById('finalPrice').textContent = 'Итоговая цена: 150,000$';
      });
    }
  }

  renderServices();
});