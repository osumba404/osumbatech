(function () {
    'use strict';

    var html = document.documentElement;
    var navToggle = document.querySelector('.mw-nav-toggle');
    var sidebar = document.querySelector('.mw-sidebar');
    var overlay = document.querySelector('.mw-sidebar-overlay');
    var themeToggle = document.querySelector('.mw-theme-toggle');
    var searchInputs = document.querySelectorAll('.mw-search input');
    var STORAGE_KEY = 'osumbawiki-theme';

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
        document.body.classList.add('sidebar-open');
        navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.classList.remove('sidebar-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    function toggleSidebar() {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    if (navToggle && sidebar && overlay) {
        navToggle.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', closeSidebar);

        sidebar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.matchMedia('(max-width: 720px)').matches) {
                    closeSidebar();
                }
            });
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 720) {
                closeSidebar();
            }
        });
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) { /* ignore */ }
    }

    function initTheme() {
        var saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (e) { /* ignore */ }

        if (saved === 'dark' || saved === 'light') {
            applyTheme(saved);
            return;
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var isDark = html.getAttribute('data-theme') === 'dark';
            applyTheme(isDark ? 'light' : 'dark');
        });
    }

    function runSearch(query) {
        query = query.trim().toLowerCase();
        if (!query) return;

        var headings = document.querySelectorAll('.mw-content h2[id], .mw-content h3[id]');
        for (var i = 0; i < headings.length; i++) {
            if (headings[i].textContent.toLowerCase().indexOf(query) !== -1) {
                headings[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }

        var links = document.querySelectorAll('.mw-content a');
        for (var j = 0; j < links.length; j++) {
            if (links[j].textContent.toLowerCase().indexOf(query) !== -1) {
                links[j].scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        }
    }

    searchInputs.forEach(function (input) {
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                runSearch(input.value);
            }
        });

        var form = input.closest('.mw-search');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                runSearch(input.value);
            });
        }
    });

    initTheme();
})();
