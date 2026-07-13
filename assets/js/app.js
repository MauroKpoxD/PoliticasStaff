document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('open');
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav.links a');

  function highlightNav() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - 140;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', highlightNav);
  highlightNav();

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      header.classList.remove('open');
    });
  });

  console.log('Manual de staff NIXXOSMP cargado.');
});