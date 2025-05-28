const webhookURL = 'https://discord.com/api/webhooks/XXXXXXXXX/REDACTED';

// Прайс и промокоды
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
  "Ролевая игра (Сценарий + 4,000$)": 24000,
  "МейлДом": 22000,
  "Стриптиз / Приват-танец": 10000,
  "Совместная ванна + массаж": 25000,
  "Ночь со мной (до 8 часов)": 100000,
  "Фото-/видеосъёмка + сопровождение": 80000
};

const promoCodes = {
  "YPA": { discount: 5, expires: new Date("2025-05-29T16:00:00") },
  "ONYX-2025-ELITE-XR": { discount: 10, expires: new Date("2099-12-31") }
};

function updatePrice() {
  const selected = document.getElementById("selectedService").value;
  const base = services[selected] || 0;
  const promo = document.getElementById("promoCode").value.trim();
  let final = base;
  const warning = document.getElementById("promoWarning");
  warning.style.display = "none";

  if (promoCodes[promo]) {
    const { discount, expires } = promoCodes[promo];
    const now = new Date();
    if (now <= expires) {
      final -= (base * discount) / 100;
    } else {
      warning.style.display = "block";
    }
  } else if (promo.length > 0) {
    warning.style.display = "block";
  }

  document.getElementById("finalPrice").textContent = final.toLocaleString() + "$";
  return final;
}

// Заполнение списка услуг
const serviceSelect = document.getElementById("selectedService");
Object.keys(services).forEach(name => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = `${name} — ${services[name].toLocaleString()}$`;
  serviceSelect.appendChild(option);
});
document.getElementById("selectedService").addEventListener("change", updatePrice);
document.getElementById("promoCode").addEventListener("input", updatePrice);

// Вкладки
document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tab = link.dataset.tab;
    document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    link.classList.add('active');
  });
});

// Заказ
document.getElementById("orderForm").addEventListener("submit", async e => {
  e.preventDefault();
  const service = document.getElementById("selectedService").value;
  const price = updatePrice();
  const promo = document.getElementById("promoCode").value.trim();
  const discordNick = document.getElementById("discordNick").value.trim();
  const rpmNick = document.getElementById("rpmNick").value.trim();
  const date = document.getElementById("orderDate").value;

  const content = `📦 Новый заказ:
**Discord:** ${discordNick}
**РПМ:** ${rpmNick}
**Услуга:** ${service}
**Дата:** ${date || "не указана"}
**Промокод:** ${promo || "нет"}
**Итоговая цена:** ${price.toLocaleString()}$`;

  try {
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    alert("Заказ отправлен!");
    e.target.reset();
    document.getElementById("order").style.display = "none";
    document.getElementById("finalPrice").textContent = "0$";
  } catch {
    alert("Ошибка отправки заказа.");
  }
});

// Закрытие формы
document.getElementById("closeOrder").addEventListener("click", () => {
  document.getElementById("order").style.display = "none";
});

// Отзывы
document.getElementById("reviewForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("reviewName").value.trim();
  const text = document.getElementById("reviewText").value.trim();
  const date = new Date().toLocaleString();
  if (!name || !text) return alert("Заполните все поля!");
  const review = { name, text, date };
  const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  reviews.unshift(review);
  localStorage.setItem("reviews", JSON.stringify(reviews));
  renderReviews();
  e.target.reset();
});

function renderReviews() {
  const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  const container = document.getElementById("reviewsList");
  container.innerHTML = reviews.map(r =>
    `<div class="review"><strong>${r.name}</strong> <span>${r.date}</span><p>${r.text}</p></div>`
  ).join("");
}

renderReviews();
