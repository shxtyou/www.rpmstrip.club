// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Вкладки ---
  const tabLinks = document.querySelectorAll('nav a.tab-link');
  const cards = document.querySelectorAll('.card');

  tabLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      tabLinks.forEach(l => l.classList.remove('active'));
      cards.forEach(c => c.classList.remove('active'));

      link.classList.add('active');
      const targetId = link.getAttribute('data-tab');
      const targetCard = document.getElementById(targetId);
      if (targetCard) targetCard.classList.add('active');
    });
  });

  // --- Промо Popup ---
  const promoPopup = document.getElementById('promoPopup');
  if (promoPopup) {
    promoPopup.style.display = 'block';
    setTimeout(() => {
      promoPopup.style.opacity = '0
