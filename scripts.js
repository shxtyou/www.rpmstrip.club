const webhookURL = 'https://discord.com/api/webhooks/XXXXXXXXX/REDACTED';

// Прайс
const services = {
  "Стандарт (1 час)": 40000,
  "Минет": 25000,
  "Фемдом": 38000,
  "Подчинение": 80000,
  "Шибари": 20000,
  "BDSM": 40000,
  "Фут Джоб": 20000,
  "Тит Джоб": 20000,
  "Спанкинг": 15000,
  "Пеггинг": 15000,
  "Бондаж": 20000,
  "Игры с воском": 17000,
  "Ролевая игра": 24000, // 20k + 4k за сценарий
  "МейлДом": 22000,
  "Стриптиз / Приват-танец": 10000,
  "Совместная ванна + массаж": 25000,
  "Ночь со мной": 100000,
  "Фото-/видеосъёмка + сопровождение": 80000,
  "VIP Клиент": 0 // Убрал ошибку с "200.000%"
};

const promoCodes = {
  "YPA": { discount: 5, expires: new Date("2025-05-29T16:00:00") },
  "ONYX-2025-ELITE-XR": { discount: 10, expires: new Date("2099-12-31T23:59:59") }
};

// --- Табы ---
document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tab = link.dataset.tab;
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    link.classList.add('active');
  });
});

// --- Субтабы ---
document.querySelectorAll('.sub-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const subtab = btn.dataset.subtab;
    document.querySelectorAll('.sub-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(subtab).classList.add('active');
    btn.classList.add('active');
  });
});

// --- Заполнение селекта услуг ---
const serviceSelect = document.getElementById("selectedService");

function fillServiceSelect() {
  serviceSelect.innerHTML = "";
  // Добавим сначала интимные услуги
  Object.entries(services).forEach(([name, price]) => {
    // Пропускаем VIP Клиент, он не для заказа
    if (name === "VIP Клиент") return;

    const option = document.createElement("option");
    option.value = name;
    option.textContent = `${name} — ${price.toLocaleString()}$`;
    serviceSelect.appendChild(option);
  });
}

fillServiceSelect();

// --- Проверка и подсчёт цены ---
function updatePrice() {
  const selected = serviceSelect.value;
  const base = services[selected] || 0;
  const promo = document.getElementById("promoCode").value.trim();
  const warning = document.getElementById("promoWarning");
  warning.style.display = "none";

  let final = base;

  if (promo.length > 0) {
    if (promoCodes[promo]) {
      const { discount, expires } = promoCodes[promo];
      const now = new Date();
      if (now <= expires) {
        final -= (base * discount) / 100;
      } else {
        warning.textContent = "Промокод просрочен";
        warning.style.display = "block";
      }
    } else {
      warning.textContent = "Промокод неверен";
      warning.style.display = "block";
    }
  }

  document.getElementById("finalPrice").textContent = final.toLocaleString() + "$";
  return final;
}

serviceSelect.addEventListener("change", updatePrice);
document.getElementById("promoCode").addEventListener("input", updatePrice);

// --- Заказ ---
document.getElementById("orderForm").addEventListener("submit", async e => {
  e.preventDefault();

  const discordNick = document.getElementById("discordNick").value.trim();
  const rpmNick = document.getElementById("rpmNick").value.trim();
  const selectedService = serviceSelect.value;
  const orderDate = document.getElementById("orderDate").value;
  const promoCode = document.getElementById("promoCode").value.trim();
  const finalPrice = updatePrice();

  if (!discordNick || !rpmNick || !selectedService || !orderDate) {
    alert("Пожалуйста, заполните все обязательные поля.");
    return;
  }

  const message = 
    `📦 Новый заказ:\n` +
    `**Discord:** ${discordNick}\n` +
    `**РПМ:** ${rpmNick}\n` +
    `**Услуга:** ${selectedService}\n` +
    `**Дата:** ${orderDate}\n` +
    `**Промокод:** ${promoCode || "нет"}\n` +
    `**Итоговая цена:** ${finalPrice.toLocaleString()}$`;

  try {
    const resp = await fetch(webhookURL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ content: message })
    });
    if (!resp.ok) throw new Error("Ошибка сети");
    alert("Заказ успешно отправлен!");
    e.target.reset();
    document.getElementById("finalPrice").textContent = "0$";
    document.getElementById("order").style.display = "none";
  } catch (err) {
    alert("Ошибка при отправке заказа.");
  }
});

// --- Закрытие окна заказа ---
document.getElementById("closeOrder").addEventListener("click", () => {
  document.getElementById("order").style.display = "none";
});

// --- Отзывы ---
document.getElementById("reviewForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("reviewName").value.trim();
  const text = document.getElementById("reviewText").value.trim();
  const date = new Date().toLocaleString();

  if (!name || !text) {
    alert("Пожалуйста, заполните все поля в отзыве.");
    return;
  }

  const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  reviews.unshift({name, text, date});
  localStorage.setItem("reviews", JSON.stringify(reviews));

  renderReviews();
  e.target.reset();
});

function renderReviews() {
  const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  const container = document.getElementById("reviewsList");
  container.innerHTML = reviews.map(r =>
    `<div class="review">
      <strong>${r.name}</strong> <span>${r.date}</span>
      <p>${r.text}</p>
    </div>`
  ).join("");
}

renderReviews();
