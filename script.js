document.addEventListener("DOMContentLoaded", () => {
  const openPopup = document.getElementById("open-popup");
  const popup = document.getElementById("order-popup");
  const overlay = document.getElementById("overlay");
  const form = document.getElementById("order-form");
  const soundOpen = document.getElementById("ui-open");
  const soundSuccess = document.getElementById("ui-success");

  openPopup.addEventListener("click", () => {
    popup.classList.remove("hidden");
    popup.classList.add("visible");
    overlay.classList.add("active");
    popup.querySelector('form').classList.add('neon-card');
    soundOpen.play();
  });

  overlay.addEventListener("click", () => {
    popup.classList.remove("visible");
    popup.classList.add("hidden");
    overlay.classList.remove("active");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const service = form.service.value;
    const time = form.time.value;

    if (!name || !service || !time) {
      alert("Заполните все поля.");
      if (navigator.vibrate) navigator.vibrate(150);
      return;
    }

    alert("Заказ отправлен! Мы с вами свяжемся.");
    soundSuccess.play();

    popup.classList.remove("visible");
    popup.classList.add("hidden");
    overlay.classList.remove("active");
    form.reset();
  });
});