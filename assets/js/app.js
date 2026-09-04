document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // --- Menú móvil ---
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('navToggle');

    if (toggle) {
        toggle.addEventListener('click', function () {
            header.classList.toggle('open');
        });
    }

    // --- Resaltado de navegación (optimizado) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav.links a');

    function highlightNav() {
        let current = '';
        const scrollY = window.scrollY + 140;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (scrollY >= section.offsetTop) {
                current = section.getAttribute('id');
                break;
            }
        }

        navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + current);
        });
    }

    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) return;
        scrollTimeout = requestAnimationFrame(function () {
            highlightNav();
            scrollTimeout = null;
        });
    });

    highlightNav();

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            header.classList.remove('open');
        });
    });

    document.addEventListener('click', function (e) {
        if (header.classList.contains('open') && !header.contains(e.target)) {
            header.classList.remove('open');
        }
    });

    // ============================================================
    //  OFUSCACIÓN DE CORREOS: Base64 + XOR con clave secreta
    // ============================================================

    const XOR_KEY = 'nixxosmpCLAVEMUYSEGURA2026sandulosestuvoaquiyporsupuestoestoveraproduccion';

    function xorDecrypt(encoded, key) {
        let result = '';
        for (let i = 0; i < encoded.length; i++) {
            const charCode = encoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    }

    function decodeEmail(encodedBase64) {
        try {
            const base64Decoded = atob(encodedBase64);
            return xorDecrypt(base64Decoded, XOR_KEY);
        } catch (e) {
            console.warn('Error al descifrar correo:', e);
            return null;
        }
    }

    const emailElements = document.querySelectorAll('.obfuscated-email');

    if (emailElements.length > 0) {
        // Retraso aleatorio (150-350ms) para evitar scraping instantáneo
        const delay = Math.floor(Math.random() * 200) + 150;

        setTimeout(function () {
            emailElements.forEach(function (el) {
                try {
                    const encoded = el.getAttribute('data-encoded');
                    if (!encoded) {
                        console.warn('Elemento sin data-encoded:', el);
                        return;
                    }

                    const email = decodeEmail(encoded);
                    if (!email) {
                        console.warn('No se pudo descifrar el correo para:', el);
                        return;
                    }

                    // Crear enlace mailto
                    const link = document.createElement('a');
                    link.href = 'mailto:' + email;
                    link.textContent = email;
                    link.setAttribute('rel', 'nofollow noopener');
                    link.setAttribute('aria-label', 'Correo electrónico de contacto');

                    // Reemplazar contenido
                    el.innerHTML = '';
                    el.appendChild(link);
                } catch (error) {
                    console.warn('Error al desofuscar correo:', error);
                }
            });
        }, delay);
    }

    // En producción, silencia los logs para que no sea tan ruidoso
    if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
        console.log = function () {};
    }

    console.log('================================================================');
    console.log('                                                                ');
    console.log('                   ATENCIÓN - NIXXOSMP SYSTEM                   ');
    console.log('EL USO FRAUDULENTO O MALVERSACIÓN DEL HTML DE CUALQUIER POLITICA');
    console.log('   QUEDA EXTRICTAMENTE PROHIBIDO EL MANUAL OFICIAL Y SOLO EL    ');
    console.log('        CONTENIDO ORIGINAL SIN MODIFICAR TIENE USO LEGAL        ');
    console.log('                                                                ');
    console.log('================================================================');
    console.log('✅ Manual de staff NIXXOSMP cargado correctamente.');
});