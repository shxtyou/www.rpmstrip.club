document.addEventListener("DOMContentLoaded", () => {
  // Вкладки
  const tabs = document.querySelectorAll(".tab-link");
  const cards = document.querySelectorAll(".card:not(.reviews-list):not(.order-popup)");

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      cards.forEach(c => {
        c.id === target ? c.classList.add("active") : c.classList.remove("active");
      });
    });
  });

  // Сабвкладки прайса
  const subTabs = document.querySelectorAll(".sub-tab");
  const subCards = document.querySelectorAll(".sub-card");

  subTabs.forEach(subTab => {
    subTab.addEventListener("click", () => {
      const target = subTab.dataset.subtab;

      subTabs.forEach(st => st.classList.remove("active"));
      subTab.classList.add("active");

      subCards.forEach(sc => {
        sc.id === target ? sc.classList.add("active") : sc.classList.remove("active");
      });

      populateServicesDropdown(target);
    });
  });

  // Элементы формы заказа
  const orderPopup = document.getElementById("order");
  const selectedService = document.getElementById("selectedService");
  const finalPriceEl = document.getElementById("finalPrice");
  const promoCodeInput = document.getElementById("promoCode");
  const promoWarning = document.getElementById("promoWarning");
  const orderForm = document.getElementById("orderForm");
  const closeOrderBtn = document.getElementById("closeOrder");

  // Данные по услугам с ценами
  const servicesData = {
    intim: [
      {name: "Минет", price: 25000},
      {name: "Фемдом", price: 38000},
      {name: "Подчинение", price: 80000},
      {name: "Шибари", price: 20000},
      {name: "BDSM", price: 40000},
      {name: "Фут Джоб", price: 20000},
      {name: "Тит Джоб", price: 20000},
      {name: "Спанкинг", price: 15000},
      {name: "Пеггинг", price: 15000},
      {name: "Бондаж", price: 20000},
      {name: "Игры с воском", price: 17000},
      {name: "Ролевая игра (Сценарий + 4,000$)", price: 20000},
      {name: "МейлДом", price: 22000}
    ],
    extra: [
      {name: "Стриптиз / Приват-танец", price: 10000},
      {name: "Совместная ванна + массаж", price: 25000},
      {name: "Ночь со мной", price: 100000},
      {name: "Фото-/видеосъёмка + сопровождение", price: 80000},
      {name: "VIP Клиент", price: 200000}
    ]
  };

  // Промокоды с датой истечения и скидкой в процентах
  const promoCodes = {
    "VELVET10": {expires: "2025-12-31", discountPercent: 10},
    "SPRING20": {expires: "2024-05-31", discountPercent: 20},
    "OLD50": {expires: "2023-01-01", discountPercent: 50}
  };

  // Заполнить dropdown услугами
  function populateServicesDropdown(category) {
    selectedService.innerHTML = "";
    servicesData[category].forEach(s => {
      const option = document.createElement("option");
      option.value = s.name;
      option.textContent = `${s.name} — ${s.price.toLocaleString()}$`;
      selectedService.appendChild(option);
    });
    calculatePrice();
  }

  // Открыть popup заказа с выбранной услугой
  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("click", () => {
      const serviceName = card.dataset.service;
      let category = "intim";
      if (servicesData.extra.some(s => s.name === serviceName)) category = "extra";
      if (servicesData.intim.some(s => s.name === serviceName)) category = "intim";

      subTabs.forEach(st => st.classList.toggle("active", st.dataset.subtab === category));
      subCards.forEach(sc => sc.classList.toggle("active", sc.id === category));

      populateServicesDropdown(category);

      selectedService.value = serviceName;
      calculatePrice();

      orderPopup.style.display = "block";
    });
  });

  // Закрыть заказ
  closeOrderBtn.addEventListener("click", () => {
    orderPopup.style.display = "none";
    promoWarning.style.display = "none";
    promoCodeInput.value = "";
    finalPriceEl.textContent = "0$";
    orderForm.reset();
  });

  // Проверка и расчет цены с промокодом
  function calculatePrice() {
    const serviceName = selectedService.value;
    const promoCode = promoCodeInput.value.trim().toUpperCase();

    let price = 0;
    for (const cat of Object.values(servicesData)) {
      const service = cat.find(s => s.name === serviceName);
      if (service) {
        price = service.price;
        break;
      }
    }

    promoWarning.style.display = "none";

    if (promoCode) {
      if (promoCodes[promoCode]) {
        const now = new Date();
        const exp = new Date(promoCodes[promoCode].expires);
        if (exp >= now) {
          const discount = promoCodes[promoCode].discountPercent;
          price = Math.round(price * (1 - discount / 100));
        } else {
          promoWarning.style.display = "block";
        }
      } else {
        promoWarning.style.display = "block";
      }
    }

    finalPriceEl.textContent = price.toLocaleString() + "$";
  }

  selectedService.addEventListener("change", calculatePrice);
  promoCodeInput.addEventListener("input", calculatePrice);

  // Инициализация dropdown при загрузке (интим услуги)
  populateServicesDropdown("intim");
});
