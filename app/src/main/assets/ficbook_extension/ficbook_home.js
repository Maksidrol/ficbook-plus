(() => {
    'use strict';

    const path = window.location.pathname;
    // Исключаем все URL которые обслуживает reader.js (читалка):
    // — /readfic/число          — старый числовой ficId (однотомник, сразу читалка)
    // — /readfic/число/что-угодно
    // — /readfic/UUID           — UUID-однотомник
    // — /readfic/UUID/глава
    // — /readfic/slug/глава     — slug + число или UUID глава
    // НЕ исключаем: /readfic/slug (UUID-slug без главы) — это страница описания
    if (/^\/readfic\/(?:\d+(?:\/(?:[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\d+)(?:\/.*)?)?|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}(?:\/(?:[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\d+)(?:\/.*)?)?|[^/?#]+\/(?:[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\d+)(?:\/.*)?)$/.test(path)) return;

    // Форсируем тёмную тему ficbook — до того как сайт читает localStorage.
    // Ficbook проверяет +localStorage.darkTheme === 1 при каждой загрузке.
    try { localStorage.setItem('darkTheme', '1'); } catch (_) {}

    // ─── localStorage helpers ────────────────────────────────────────────────────
    const SETTINGS_KEYS = {
        promo:          'fb_hide_promo',
        categories:     'fb_hide_categories',
        hotWorks:       'fb_hide_hot_works',
        hotRequests:    'fb_hide_hot_requests',
        promoCarousels: 'fb_hide_promo_carousels',
        footer:         'fb_hide_footer',
    };

    function isHidden(key) {
        try { return localStorage.getItem(key) === '1'; } catch (_) { return false; }
    }
    function setHidden(key, val) {
        try { localStorage.setItem(key, val ? '1' : '0'); } catch (_) {}
    }

    // Дефолты — применяются только если ключ ещё не задан пользователем.
    try {
        if (localStorage.getItem(SETTINGS_KEYS.footer) === null) {
            localStorage.setItem(SETTINGS_KEYS.footer, '1');
        }
        if (localStorage.getItem(SETTINGS_KEYS.promoCarousels) === null) {
            localStorage.setItem(SETTINGS_KEYS.promoCarousels, '1');
        }
    } catch (_) {}

    // ─── CSS ─────────────────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.id = 'ficbook-home-cleanup';
    style.textContent = `
        /* ── M3 скругления — переопределяем радиус-токены глобально ── */
        :root {
            --m3-font-scale: 1;
            --radius-4: 10px !important;
            --radius-6: 12px !important;
            --radius-8: 14px !important;
            /* ── M3 цветовые токены (совпадают с ficbook_reader.js) ── */
            --md-surface: #000000;
            --md-surface-container: #1B1B1B;
            --md-surface-container-high: #2B2B2B;
            --md-primary: #D0BCFF;
            --md-primary-container: #4F378B;
            --md-on-primary-container: #EADDFF;
            --md-on-surface: #E6E1E5;
            --md-on-surface-variant: #9E9E9E;
            --md-on-surface-muted: #938F99;
            --md-secondary: #CEB8FF;
            --md-outline: #79747E;
            --md-outline-variant: #49454F;
            --md-surface-nav: #1B1B1B;
            --md-surface-tint: #2A2A3E;
            --md-surface-tint-high: #32324A;
            --md-surface-tint-active: #3D3558;
            --md-error: #FFB4AB;
        }
        /* Острые элементы с хардкодом радиуса */
        .tag, .pairing-link { border-radius: 8px !important; }
        .fanfic-hat-body { border-radius: 16px !important; }
        .fanfic-promo-carousel { border-radius: 16px !important; }

        /* ── Глобальная замена серых токенов сайта на M3 палитру ── */
        .dark-theme,
        .dark-theme[data-v-60e7ba6e],
        .dark-theme[data-v-aecb2001],
        .dark-theme[data-v-b6a3bbec] {
            --primary-0: var(--md-surface-container) !important;
            --primary-1: var(--md-surface-container-high) !important;
            --primary-2: #141414 !important;
            --primary-3: var(--md-surface-container) !important;
            --primary-4: var(--md-primary-container) !important;
            --primary-light: var(--md-surface-container) !important;
            --content-box-background: var(--md-surface-container) !important;
            --night-background-secondary-color: var(--md-surface-container) !important;
            /* Светло-серый для рамок/hover в коллекциях и других компонентах */
            --gray-lighter-color: var(--md-surface-container-high) !important;
            --gray-light-color: var(--md-surface-container-high) !important;
        }
        /* Хардкод фонов не через переменные */
        .dark-theme .fanfic-inline,
        .dark-theme .nav-info ul a,
        .dark-theme .subscription-plan,
        .dark-theme .find-form .form-group .sub-category,
        .dark-theme .present-thumb,
        .dark-theme .if-you-were-premium,
        .dark-theme .support-thumb,
        .dark-theme .ProseMirror .footnote-tooltip,
        .dark-theme .part_text .footnote-tooltip {
            background-color: var(--md-surface-container) !important;
        }
        .dark-theme .panel { background-color: var(--md-surface-container) !important; }
        /* Кнопка "начать читать" */
        .dark-theme .chapter-info .start-reading { background-color: var(--md-primary-container) !important; color: var(--md-on-primary-container) !important; }
        .dark-theme .chapter-info .start-reading:hover,
        .dark-theme .chapter-info .start-reading:focus { background-color: var(--md-primary-container) !important; }
        /* Кнопки btn-default */
        .dark-theme .btn-default, .dark-theme a.btn-default { background-color: var(--md-surface-container-high) !important; color: var(--md-on-surface-variant) !important; border-color: rgba(255,255,255,0.12) !important; }
        .dark-theme .btn-default:hover, .dark-theme a.btn-default:hover,
        .dark-theme .btn-default:focus, .dark-theme a.btn-default:focus { background-color: var(--md-primary-container) !important; color: var(--md-on-surface) !important; }
        .dark-theme .btn-default.active, .dark-theme a.btn-default.active { background-color: var(--md-primary-container) !important; color: var(--md-on-surface) !important; }
        /* Выбор количества */
        .dark-theme .select-amount { background: var(--md-surface-container-high) !important; border-color: rgba(255,255,255,0.12) !important; }
        .dark-theme .select-amount.active, .dark-theme .select-amount:hover,
        .dark-theme .select-amount:focus { background: var(--md-primary-container) !important; color: var(--md-on-surface) !important; }
        /* Поисковый инпут — сейчас бежевый #d8d4ca, делаем тёмным */
        .dark-theme #searchDiv .search-input { background-color: var(--md-surface-container) !important; color: var(--md-on-surface-variant) !important; border-color: rgba(255,255,255,0.12) !important; }
        /* Кнопка монет при hover */
        .dark-theme .coins-counter button:hover { background: var(--md-primary-container) !important; color: var(--md-on-surface) !important; }
        /* Промо карусель — коричневая через --secondary-1, не покрывается --primary-* */
        .dark-theme .fanfic-promo-carousel { background: var(--md-surface-container) !important; }
        /* Прочитанный фанфик — более специфичный селектор перебивает наш .fanfic-inline */
        .dark-theme .fanfic-inline.fanfic-block-read,
        .dark-theme article.block.fanfic-block-read { background-color: var(--md-surface-container) !important; }
        /* Hover акцентной кнопки — серый */
        .dark-theme .btn-primary:hover, .dark-theme .btn-primary:focus,
        .dark-theme .btn-primary:active, .dark-theme a.btn-primary:hover,
        .dark-theme a.btn-primary:focus, .dark-theme a.btn-primary:active { background-color: var(--md-primary-container) !important; border-color: var(--md-primary-container) !important; color: var(--md-on-surface) !important; }
        /* Кнопка "Показать все" в поиске */
        .dark-theme #searchDiv .common-search .show-all-button { background-color: var(--md-surface-container-high) !important; color: var(--md-on-surface-variant) !important; }
        /* Hover/active в боковой навигации — коричневый */
        .dark-theme .nav-info ul a:hover { background-color: var(--md-primary-container) !important; color: var(--md-primary) !important; }
        /* Плашка "Прочитано" */
        .dark-theme .read-notification .read-decoration-text { background-color: var(--md-primary-container) !important; color: var(--md-primary) !important; border-color: rgba(255,255,255,0.12) !important; border-radius: 9999px !important; }
        /* Фон за иконками платёжных систем */
        .dark-theme .payment-option-container img { background: var(--md-surface-container-high) !important; border-radius: 8px !important; }
        /* Активный пункт в боковой навигации — коричневый хардкод */
        .dark-theme .nav-info ul li.active a { background-color: var(--md-primary-container) !important; color: var(--md-primary) !important; }
        /* Стрелочка-треугольник после кнопки "Показать все" */
        .dark-theme #searchDiv .common-search .show-all-button:after { border-left-color: var(--md-surface-container-high) !important; }
        /* Заголовок блока rkl — серый текст */
        .dark-theme .rkl-block .rkl-block-head { color: var(--md-on-surface-muted) !important; }
        /* Колесо фортуны — кастомная переменная не через --primary-* */
        .dark-theme .wheel-of-fortune-modal-frame.dialog-frame-root { --back-main: var(--md-surface-container) !important; }
        /* Vue-диалоги (dialog-frame-root) — прямой фон, не через переменную */
        .dark-theme .dialog-frame-root:not(.wheel-of-fortune-modal-frame) { background-color: var(--md-surface-container-high) !important; }
        /* SVG иконки внутри btn-default при hover/active становятся тёмными — невидимы на нашем фоне */
        .dark-theme .btn-default:hover svg, .dark-theme .btn-default:focus svg,
        .dark-theme .btn-default.active svg, .dark-theme a.btn-default:hover svg,
        .dark-theme a.btn-default:focus svg, .dark-theme a.btn-default.active svg { color: var(--md-on-surface) !important; }

        .js-fb-ad-slot, .fb-ad-slot, [class*="tds-sticky"],
        [id*="ad_container"], #sticky_container_BOTTOM,
        .sticky-bottom-block, #toTop, .global-banner-2 { display: none !important; }

        html { background-color: #141414 !important; color: var(--md-on-surface-variant) !important; }
        body { background-color: #141414 !important; color: #E0E0E0 !important; }
        .main-holder, main { background-color: #141414 !important; color: var(--md-on-surface-variant) !important; }
        body { padding-bottom: calc(52px + env(safe-area-inset-bottom, 0px)) !important; }

        /* ── Оригинальная шапка — полностью скрыта ── */
        .header-holder,
        .header-holder.js-collapsible {
            display: none !important;
        }

        /* ── top-bar ficbook — полностью скрыт, элементы перемещены ── */
        .top-bar { display: none !important; }

        /* ── book-inner — тёмный фон (раньше давался через header-holder) ── */
        .book-inner {
            background: #141414 !important;
            color: var(--md-on-surface-variant) !important;
        }
        .book-inner a { color: var(--md-secondary) !important; }

        /* ── Новый M3 top bar — одна строка ── */
        #m3-top-bar {
            position: sticky; top: 0; left: 0; right: 0;
            z-index: 100;
            background: var(--md-surface-nav);
            border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex; align-items: center;
            height: 56px;
            padding: 0 8px;
            gap: 6px;
            box-sizing: border-box;
        }

        /* Чипы — занимают оставшееся место слева, равномерно растягиваются */
        #m3-chips-row {
            flex: 1; min-width: 0;
            display: flex; align-items: center;
            gap: 4px;
        }

        /* ── Кнопки перемещены в #m3-search-row — делаем их видимыми ── */
        #m3-search-row .site-search,
        #m3-search-row .d-contents,
        #m3-search-row .notifications-dropdown,
        #m3-search-row .v-dropdown-menu-toggle,
        #m3-search-row .btn-top-bar,
        #m3-search-row .site-search-toggle {
            display: flex !important; align-items: center !important;
            visibility: visible !important; opacity: 1 !important;
        }
        /* Кнопки в search-row — единый стиль */
        #m3-search-row .v-dropdown-menu-toggle,
        #m3-search-row .site-search-toggle,
        #m3-search-row .btn-top-bar {
            background: none !important;
            border: none !important;
            padding: 6px !important;
            cursor: pointer !important;
            color: var(--md-on-surface-variant) !important;
            border-radius: 8px !important;
        }
        #m3-search-row .v-dropdown-menu-toggle:active,
        #m3-search-row .site-search-toggle:active,
        #m3-search-row .btn-top-bar:active {
            background: rgba(255,255,255,0.08) !important;
        }
        #m3-search-row svg { fill: var(--md-on-surface-variant) !important; width: 22px !important; height: 22px !important; }
        /* Бейджи уведомлений */
        #m3-search-row .top-bar-badge,
        #m3-search-row .count-badge {
            background: var(--md-primary) !important;
            color: var(--md-surface-nav) !important;
            border-radius: 9999px !important;
        }
        /* Скрываем выпадающую панель поиска — она встроена в .site-search */
        #m3-search-row .site-search-panel { display: none !important; }
        #m3-search-row .site-search.is-open .site-search-panel { display: flex !important; }
        /* Placeholder кнопки поиска — держит место пока Vue не смонтировал .site-search */
        #m3-search-placeholder {
            width: 44px; height: 44px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        #m3-search-placeholder svg { fill: var(--md-on-surface-variant); width: 22px; height: 22px; }

        /* ── Поиск + уведомления — правая часть, фиксированная */
        #m3-search-row {
            flex-shrink: 0;
            display: flex; align-items: center; gap: 4px;
        }

        .m3-chip {
            flex: 1; min-width: 0;
            display: block;
            padding: 0 4px;
            line-height: 32px;
            height: 32px;
            border-radius: 20px;
            background: var(--md-surface-tint);
            border: 1px solid rgba(255,255,255,0.10);
            color: var(--md-on-surface-variant);
            font-size: calc(var(--m3-font-scale, 1) * 12px); font-weight: 500;
            font-family: system-ui, -apple-system, sans-serif;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-decoration: none;
            text-align: center;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            transition: color 0.15s, background 0.15s, border-color 0.15s;
            box-sizing: border-box;
        }
        .m3-chip:active {
            background: var(--md-surface-tint-active) !important;
            color: var(--md-secondary) !important;
        }
        .m3-chip.is-active {
            background: var(--md-primary-container);
            border-color: var(--md-primary);
            color: var(--md-primary);
        }

        /* ── Хлебные крошки / навигация ── */
        nav.breadcrumb a, .breadcrumb a,
        .breadcrumb-holder a { color: var(--md-secondary) !important; text-decoration: none !important; }
        .breadcrumb-separator, .breadcrumb .separator { color: var(--md-on-surface-muted) !important; }

        /* ── Поиск / инпуты ── */
        .input-group,
        input[type="text"], input[type="search"], input[type="email"],
        input[type="number"], input[type="password"],
        textarea, select {
            background: var(--md-surface-tint) !important;
            border-color: rgba(255,255,255,0.12) !important;
            color: var(--md-on-surface-variant) !important;
        }

        /* ── Автодополнение поиска (хедер) ── */
        body .search-dropdown {
            background: var(--md-surface-container) !important;
            border: 1px solid rgba(255,255,255,0.12) !important;
            color: var(--md-on-surface-variant) !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6) !important;
        }
        body .search-dropdown .list-title {
            color: var(--md-on-surface-variant) !important;
            font-size: calc(var(--m3-font-scale, 1) * 11px) !important;
        }
        body .search-dropdown ul a,
        body .search-dropdown .search-dropdown-list a {
            color: var(--md-on-surface-variant) !important;
            background: transparent !important;
        }
        body .search-dropdown ul a:active,
        body .search-dropdown .search-dropdown-list a:active {
            background: rgba(255,255,255,0.06) !important;
        }
        body .search-dropdown .link-txt {
            color: var(--md-secondary) !important;
        }
        body .search-dropdown .count-label {
            background: var(--md-primary-container) !important;
            color: var(--md-primary) !important;
            border-radius: 8px !important;
        }
        body .search-dropdown svg { fill: var(--md-on-surface-variant) !important; }
        /* Строки списка — убираем белый фон на hover/active */
        body .search-dropdown li,
        body .search-dropdown .search-dropdown-list li {
            background: transparent !important;
            color: var(--md-on-surface-variant) !important;
        }
        body .search-dropdown li:hover,
        body .search-dropdown .search-dropdown-list li:hover {
            background: rgba(255,255,255,0.06) !important;
        }
        /* Промо-блок в автодополнении поиска */
        .site-search-panel .site-search-section:has(.site-search-promo-item) { display: none !important; }

        /* ── Z-index: нативные оверлеи сайта поверх наших элементов ── */
        /* top-bar=100, bottom-nav=200, settings=300/301 — нативные должны быть выше всего */
        body .search-dropdown { z-index: 500 !important; }
        .vue-dropdown__menu { z-index: 500 !important; }
        /* .dropdown-menu намеренно НЕ переопределяем — Bootstrap 3 использует z-index
           как часть transition-анимации открытия; override на 500 схлопывает меню */

        /* ── Профильное выпадающее меню — тёмная стилизация ── */
        .dropdown-menu.profile-area,
        .js-top-bar-dropdown .dropdown-menu {
            background: var(--md-surface-container) !important;
            border: 1px solid rgba(255,255,255,0.12) !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6) !important;
        }
        .dropdown-menu.profile-area li,
        .dropdown-menu.profile-area li a,
        .js-top-bar-dropdown .dropdown-menu li,
        .js-top-bar-dropdown .dropdown-menu li a {
            background: var(--md-surface-container) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .dropdown-menu.profile-area li a:hover,
        .dropdown-menu.profile-area li a:focus,
        .js-top-bar-dropdown .dropdown-menu li a:hover {
            background: rgba(255,255,255,0.08) !important;
            color: var(--md-on-surface) !important;
        }
        .dropdown-menu.profile-area li.premium-button,
        .dropdown-menu.profile-area li.premium-button a {
            background: rgba(208,188,255,0.08) !important;
            color: var(--md-primary) !important;
        }
        .dropdown-menu.profile-area .divider,
        .js-top-bar-dropdown .dropdown-menu .divider {
            background: rgba(255,255,255,0.12) !important;
            border: none !important;
        }
        /* ── Панель уведомлений ── */
        .notifications-dropdown-content {
            background: var(--md-surface-container) !important;
            border: 1px solid rgba(255,255,255,0.12) !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6) !important;
        }
        .notifications-header {
            background: var(--md-surface-tint) !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
            color: var(--md-on-surface) !important;
        }
        .notifications-header .font-bold { color: var(--md-on-surface) !important; }
        .notifications-header .action-btn {
            background: rgba(255,255,255,0.06) !important;
            color: var(--md-on-surface-variant) !important;
            border-radius: 8px !important;
        }
        .notifications-header .action-btn:hover {
            background: rgba(255,255,255,0.12) !important;
            color: var(--md-on-surface) !important;
        }
        .notification {
            color: var(--md-on-surface-variant) !important;
            border-bottom: 1px solid rgba(255,255,255,0.06) !important;
        }
        .notification:hover { background: rgba(255,255,255,0.06) !important; }
        .notification svg.icon { color: var(--md-primary) !important; }
        .notification .font-bold { color: var(--md-on-surface) !important; }
        .notification .date { color: var(--md-on-surface-muted) !important; }
        .notification .word-break { color: var(--md-on-surface-variant) !important; }
        .img-circle { border-radius: 50% !important; }
        .notification .user-photo img,
        .notification .user-avatar img,
        .notification .avatar img,
        .notification .avatar-cropper img { border-radius: 50% !important; }
        .all-notification-link { border-top: 1px solid rgba(255,255,255,0.08) !important; }
        .all-notification-link a { color: var(--md-primary) !important; }
        .all-notification-link a:hover { color: var(--md-primary) !important; }
        .notifications-badge {
            background: var(--md-primary) !important;
            color: var(--md-surface-container) !important;
            border-radius: 9999px !important;
        }
        .badge { border-radius: 9999px !important; }

        /* Bootstrap модалки и их backdrop — выше settings sheet */
        .modal-backdrop { z-index: 400 !important; }
        .modal { z-index: 401 !important; }
        .dark-theme .modal .close { color: var(--md-on-surface-variant) !important; opacity: 0.7 !important; text-shadow: none !important; }
        /* Нативный <dialog> / Vue-оверлей .dialog-frame-root — явный z-index поверх наших fixed-элементов.
           Та же логика что в reader.js: без explicit z-index GeckoView top layer ненадёжен. */
        dialog, .dialog-frame-root { z-index: 6000 !important; }
        /* Убираем наши fixed UI пока диалог открыт. display:none (не visibility:hidden) —
           GeckoView требует полного удаления из paint tree чтобы диалог был виден. */
        body:has(dialog[open]) #m3-bottom-nav,
        body:has(dialog[open]) #m3-profile-scrim,
        body:has(dialog[open]) #m3-profile-sheet,
        body:has(dialog[open]) #m3-top-bar { display: none !important; }
        /* Bootstrap-модалы: убираем filter:brightness(.7) и задаём M3 фон */
        .dark-theme .modal-content { background-color: var(--md-surface-container-high) !important; filter: none !important; color: var(--md-on-surface-variant) !important; }
        .dark-theme .modal-header { border-bottom-color: rgba(255,255,255,0.1) !important; }
        .dark-theme .modal-footer { border-top-color: rgba(255,255,255,0.1) !important; }
        .dark-theme .modal-title { color: var(--md-on-surface) !important; }
        /* Инпуты внутри модалов — убираем filter, уже темнее через base-input */
        .dark-theme .modal input:not([type=button],[type=submit],[type=reset]),
        .dark-theme .modal select,
        .dark-theme .modal textarea { filter: none !important; background-color: var(--md-surface-container) !important; color: var(--md-on-surface-variant) !important; border-color: rgba(255,255,255,0.15) !important; }
        .dark-theme .modal .v-select:not(.common-select) { filter: none !important; }
        /* Кнопка закрытия модала (Bootstrap ×) — ficbook задаёт #000, на нашем тёмном фоне невидима */
        .dark-theme .modal .close { color: var(--md-on-surface-variant) !important; opacity: 0.7 !important; text-shadow: none !important; }
        .dark-theme .modal .close:hover { color: var(--md-on-surface) !important; opacity: 1 !important; }
        /* Bootstrap form-control — покрывает инпуты без явного type */
        .dark-theme .form-control { background-color: var(--md-surface-tint) !important; color: var(--md-on-surface-variant) !important; border-color: rgba(255,255,255,0.12) !important; }
        .dark-theme .form-control:focus { background-color: var(--md-surface-tint-high) !important; color: var(--md-on-surface) !important; border-color: var(--md-primary) !important; box-shadow: none !important; }
        .dark-theme .collection-button:not(:disabled):hover { background-color: var(--md-surface-tint-high) !important; color: var(--md-on-surface) !important; }
        /* Toastr / flash-уведомления */
        #toast-container, .toast-container,
        [id*="toastr"], [class*="toastr"] { z-index: 500 !important; }
        /* FancyBox / lightbox */
        .fancybox-overlay, .fancybox-wrap,
        [class*="fancybox"] { z-index: 500 !important; }

        /* ── Страница поиска (/search_fanfics и др.) ── */
        .search-field {
            background: var(--md-surface-tint) !important;
            border-color: rgba(255,255,255,0.12) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .search-field input, .search-field-input,
        input.search-field-input { color: var(--md-on-surface-variant) !important; }
        .search-field svg { fill: var(--md-on-surface-variant) !important; }

        /* ── Вкладки (ds-tab) ── */
        .ds-tab-item, a.ds-tab-item {
            background: transparent !important;
            color: var(--md-on-surface-variant) !important;
            border-bottom-color: transparent !important;
        }
        .ds-tab-item:hover, a.ds-tab-item:hover,
        .ds-tab-item:focus, a.ds-tab-item:focus {
            background: rgba(255,255,255,0.06) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .ds-tab-item.active, a.ds-tab-item.active {
            background: var(--md-primary-container) !important;
            color: var(--md-secondary) !important;
            border-bottom-color: var(--md-primary) !important;
        }

        /* ── Фильтры ── */
        .filter-group {
            background: var(--md-surface-container) !important;
            border-color: rgba(255,255,255,0.08) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .filter-group label, .filter-group .filter-label { color: var(--md-on-surface-muted) !important; }

        /* ── Кнопки (ds-btn) ── */
        a.ds-btn, button.ds-btn {
            background: var(--md-surface-tint) !important;
            color: var(--md-on-surface-variant) !important;
            border-color: rgba(255,255,255,0.12) !important;
            border-radius: 20px !important;
        }
        a.ds-btn:hover, button.ds-btn:hover,
        a.ds-btn:focus, button.ds-btn:focus {
            background: var(--md-surface-tint-high) !important;
            color: var(--md-on-surface) !important;
        }
        a.ds-btn.ds-btn-regular, button.ds-btn.ds-btn-regular {
            background: var(--md-surface-tint) !important;
            color: var(--md-on-surface-variant) !important;
            border-color: rgba(255,255,255,0.15) !important;
        }
        a.ds-btn.ds-btn-regular:hover, button.ds-btn.ds-btn-regular:hover,
        a.ds-btn.ds-btn-regular:focus, button.ds-btn.ds-btn-regular:focus {
            background: var(--md-surface-tint-high) !important;
            color: var(--md-on-surface) !important;
        }
        /* Активные состояния кнопок */
        a.ds-btn.ds-btn-success, button.ds-btn.ds-btn-success {
            background: #0D2B0D !important;
            color: #6FCF6F !important;
            border-color: #2D5A2D !important;
        }
        /* ds-btn-critic — активный дизлайк фандома */
        a.ds-btn.ds-btn-critic, button.ds-btn.ds-btn-critic {
            background: #2B0D0D !important;
            color: #EF6C6C !important;
            border-color: #5A2D2D !important;
        }
        /* ds-btn: loading / disabled */
        .ds-btn.loading { opacity: 0.6 !important; pointer-events: none !important; }
        .ds-btn.disabled, .ds-btn[disabled] { opacity: 0.4 !important; pointer-events: none !important; }
        /* Кнопки оценки отзывов */
        .btn-assessment { background: var(--md-surface-tint) !important; color: var(--md-on-surface-variant) !important; border-color: rgba(255,255,255,0.15) !important; border-radius: 20px !important; }
        .btn-assessment.active { color: #fff !important; border-color: transparent !important; }
        .btn-assessment.btn-good-assessment.active { background: #0D2B0D !important; }
        .btn-assessment.btn-neutral-assessment.active { background: #3A3A4A !important; }
        .btn-assessment.btn-bad-assessment.active { background: #2B0D0D !important; }
        /* follow-toggle */
        .follow-toggle { background: var(--md-surface-tint) !important; border-color: rgba(255,255,255,0.12) !important; }
        .follow-toggle-option { color: var(--md-on-surface-muted) !important; }
        .follow-toggle-option:has(input:checked) { color: var(--md-secondary) !important; }
        /* Кнопки-иконки (карусели и прочее) */
        button.ds-btn-icon, button.ds-btn.ds-btn-icon,
        button.ds-btn.ds-btn-mini.ds-btn-icon {
            background: var(--md-surface-tint) !important;
            color: var(--md-on-surface-variant) !important;
            border-color: rgba(255,255,255,0.12) !important;
            border-radius: 50% !important;
        }
        button.ds-btn-icon svg, button.ds-btn.ds-btn-icon svg { fill: var(--md-on-surface-variant) !important; }

        /* ── Пагинация ── */
        .pagination li a, .pagination li span,
        .ds-pagination a, .ds-pagination span,
        .pagination span.active, .ds-pagination span.active { background: var(--md-surface-tint) !important; color: var(--md-on-surface-variant) !important; border-color: rgba(255,255,255,0.12) !important; border-radius: 8px !important; }
        .pagination li.active a, .ds-pagination .active { background: var(--md-primary-container) !important; color: var(--md-secondary) !important; }

        /* ── Bottom Nav ── */
        #m3-bottom-nav {
            position: fixed; bottom: 0; left: 0; right: 0;
            height: calc(52px + env(safe-area-inset-bottom, 0px));
            padding-bottom: env(safe-area-inset-bottom, 0px);
            background-color: var(--md-surface-nav);
            display: flex; align-items: stretch;
            z-index: 200;
            border-top: 1px solid rgba(255,255,255,0.08);
        }
        #m3-bottom-nav a {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 2px;
            text-decoration: none; color: var(--md-on-surface-variant);
            font-size: calc(var(--m3-font-scale, 1) * 10px); font-family: system-ui, -apple-system, sans-serif;
            font-weight: 500; letter-spacing: 0.2px;
            padding: 6px 4px 4px; position: relative;
            transition: color 0.15s;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation; box-sizing: border-box;
            overflow: hidden;
        }
        #m3-bottom-nav a:active { background-color: rgba(255,255,255,0.06); }
        #m3-bottom-nav a.is-active { color: var(--md-primary); }
        #m3-bottom-nav svg { width: 20px; height: 20px; fill: currentColor; flex-shrink: 0; }
        .m3-nav-indicator { display: none; }
        #m3-bottom-nav .m3-nav-icon { display: flex; align-items: center; justify-content: center; }
        #m3-bottom-nav .m3-nav-label {
            line-height: 1;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* ── Sheet shared ── */
        .m3-sheet-handle-row {
            width: 100%; height: 32px;
            display: flex; align-items: center; justify-content: center;
        }
        .m3-sheet-handle { width: 32px; height: 4px; background: var(--md-outline-variant); border-radius: 2px; }
        .m3-sheet-section-title {
            font-size: calc(var(--m3-font-scale, 1) * 11px); font-weight: 600; color: var(--md-on-surface-variant);
            text-transform: uppercase; letter-spacing: 0.8px;
            padding: 16px 20px 4px;
            font-family: system-ui, -apple-system, sans-serif;
        }
        .m3-nav-row {
            display: flex; align-items: center;
            padding: 14px 20px;
            border-top: 1px solid rgba(255,255,255,0.06);
            font-family: system-ui, -apple-system, sans-serif;
            text-decoration: none; color: var(--md-on-surface);
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation; cursor: pointer;
            user-select: none; -webkit-user-select: none;
            gap: 16px;
        }
        /* ── Switch — управляется JS-классом .on на враппере ── */
        .m3-nav-row-icon {
            width: 24px; height: 24px; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            color: var(--md-on-surface-variant);
        }
        .m3-nav-row-icon svg { width: 22px; height: 22px; fill: currentColor; }
        .m3-nav-row-text { flex: 1; font-size: calc(var(--m3-font-scale, 1) * 15px); font-weight: 500; }
        .m3-nav-row-arrow {
            width: 16px; height: 16px; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            opacity: 0.4;
        }
        .m3-nav-row-arrow svg { width: 16px; height: 16px; fill: var(--md-on-surface-variant); }

        .m3-toggle-label { font-size: calc(var(--m3-font-scale, 1) * 15px); font-weight: 500; color: var(--md-on-surface); }

        /* ── Switch — управляется JS-классом .on на враппере ── */
        .m3-sw {
            position: relative; width: 52px; height: 32px;
            flex-shrink: 0; pointer-events: none;
        }
        .m3-sw-track {
            position: absolute; inset: 0; border-radius: 16px;
            background: var(--md-outline-variant); border: 2px solid var(--md-on-surface-muted);
            transition: background 0.2s, border-color 0.2s;
            box-sizing: border-box;
        }
        .m3-sw.on .m3-sw-track { background: var(--md-primary-container); border-color: var(--md-primary-container); }
        .m3-sw-thumb {
            position: absolute;
            top: 50%; left: 4px;
            transform: translateY(-50%);
            width: 16px; height: 16px;
            border-radius: 50%; background: var(--md-on-surface-muted);
            transition: left 0.2s cubic-bezier(0.2,0,0,1),
                        width 0.2s cubic-bezier(0.2,0,0,1),
                        background 0.2s;
        }
        .m3-sw.on .m3-sw-thumb {
            left: 24px; width: 24px; background: #FFFFFF;
            border-radius: 12px;
        }

        /* ── Profile Sheet ── */
        #m3-profile-scrim {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 300; opacity: 0; visibility: hidden;
            pointer-events: none;
            transition: opacity 0.24s, visibility 0.24s;
        }
        #m3-profile-scrim.open { opacity: 1; visibility: visible; pointer-events: auto; touch-action: none; }
        #m3-profile-sheet {
            position: fixed; left: 0; right: 0; bottom: 0;
            background: var(--md-surface-container); border-radius: 28px 28px 0 0;
            z-index: 301;
            padding: 0 0 max(24px, env(safe-area-inset-bottom, 0px));
            box-shadow: 0 -4px 24px rgba(0,0,0,0.6);
            transform: translateY(105%);
            transition: transform 0.28s cubic-bezier(0.2,0,0,1);
            max-height: 85vh; overflow-y: auto;
            pointer-events: none;
            touch-action: none;
        }
        #m3-profile-sheet.open { transform: translateY(0); pointer-events: auto; touch-action: pan-y; overscroll-behavior: contain; }

        /* Шапка профиля — аватар + никнейм */
        .m3-profile-header {
            display: flex; align-items: center; gap: 14px;
            padding: 20px 20px 16px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .m3-profile-avatar {
            width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
            background: var(--md-primary-container); overflow: hidden;
            display: flex; align-items: center; justify-content: center;
        }
        .m3-profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .m3-profile-avatar svg { width: 26px; height: 26px; fill: var(--md-on-surface-variant); }
        .m3-profile-name {
            font-size: calc(var(--m3-font-scale, 1) * 16px); font-weight: 600; color: var(--md-on-surface);
            font-family: system-ui, -apple-system, sans-serif;
        }
        .m3-profile-subname {
            font-size: calc(var(--m3-font-scale, 1) * 12px); color: var(--md-on-surface-variant); margin-top: 2px;
            font-family: system-ui, -apple-system, sans-serif;
        }

        /* Коллапсируемые секции */
        .m3-profile-section-btn {
            display: flex; align-items: center; width: 100%;
            padding: 12px 16px; gap: 14px; border: none;
            background: transparent; cursor: pointer; text-align: left;
            color: var(--md-on-surface-variant); font-size: calc(var(--m3-font-scale, 1) * 15px);
            font-family: system-ui, -apple-system, sans-serif;
        }
        .m3-profile-section-btn .m3-nav-row-icon svg { fill: var(--md-on-surface-variant); width: 20px; height: 20px; }
        .m3-profile-section-btn .m3-nav-row-text { flex: 1; color: var(--md-on-surface-variant); font-weight: 500; }
        .m3-section-chevron { flex-shrink: 0; display: flex; align-items: center; }
        .m3-section-chevron svg { width: 18px; height: 18px; fill: var(--md-on-surface-variant); transition: transform 0.2s; }
        .m3-profile-section-btn.expanded .m3-section-chevron svg { transform: rotate(180deg); }
        .m3-profile-section-btn.expanded { background: rgba(208,188,255,0.06); }
        .m3-profile-section-btn.expanded .m3-nav-row-text { color: var(--md-primary); }
        .m3-profile-section-btn.expanded .m3-nav-row-icon svg { fill: var(--md-primary); }

        /* Тело секции */
        .m3-profile-section-body {
            display: none; background: rgba(0,0,0,0.15);
        }
        .m3-profile-section-body.expanded { display: block; }
        .m3-profile-section-body .m3-nav-row { padding-left: 48px; }
        /* Скрываем иконки у обычных подпунктов, но НЕ у строк Вид-секции */
        .m3-profile-section-body .m3-nav-row-sub:not(.m3-view-toggle-row) .m3-nav-row-icon { display: none; }

        /* Вид-строки: текст слева, switch справа */
        .m3-view-toggle-row { padding-left: 16px !important; justify-content: space-between !important; }
        .m3-view-toggle-row .m3-nav-row-text { flex: 1; }

        /* Подпункты в секции — без иконки */
        .m3-nav-row-sub { }

        /* Разделитель перед футером */
        .m3-profile-divider {
            height: 1px; background: rgba(255,255,255,0.08);
            margin: 4px 0;
        }

        /* Logout-ряд — красный акцент */
        .m3-nav-row.m3-logout .m3-nav-row-text { color: #EF6C6C !important; }
        .m3-nav-row.m3-logout .m3-nav-row-icon svg { fill: #EF6C6C !important; }

        /* ════════════════════════════════════════════════════════
           Material 3 — стилизация главной страницы ficbook
           Только CSS, DOM не изменяется, функциональность не трогается
           ════════════════════════════════════════════════════════ */

        /* ── Карточки фанфиков ── */
        article.fanfic-inline {
            background: var(--md-surface-container) !important;
            border-radius: 12px !important;
            padding: 14px 16px 12px !important;
            margin: 0 0 8px !important;
            border: 1px solid rgba(255,255,255,0.08) !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important;
            color: var(--md-on-surface-variant) !important;
        }
        article.fanfic-inline::before {
            display: none !important;
            content: none !important;
        }
        article.fanfic-inline .with-before-line::before {
            display: none !important;
            content: none !important;
        }
        article.fanfic-inline.direction-het     { border-color: #2D5538 !important; }
        article.fanfic-inline.direction-slash   { border-color: #1A4A5E !important; }
        article.fanfic-inline.direction-gen     { border-color: #4A3520 !important; }
        article.fanfic-inline.direction-femslash{ border-color: #4E2038 !important; }
        article.fanfic-inline.direction-mixed   { border-color: #4A3800 !important; }
        article.fanfic-inline.direction-other   { border-color: #303050 !important; }
        article.fanfic-inline.direction-article { border-color: #404040 !important; }

        /* Заголовок фанфика */
        .fanfic-inline-title a,
        .fanfic-inline-title a.visit-link {
            color: var(--md-primary) !important;
            text-decoration: none !important;
            font-size: calc(var(--m3-font-scale, 1) * 15px) !important;
            font-weight: 600 !important;
            line-height: 1.35 !important;
        }
        /* Посещённые ссылки — приглушённый фиолетовый, как у ficbook base-6 но в нашей палитре */
        .fanfic-inline-title a:visited,
        .fanfic-inline-title a.visit-link:visited {
            color: var(--md-primary) !important;
        }

        /* Описание */
        .fanfic-description,
        .fanfic-description-text {
            color: var(--md-on-surface-variant) !important;
            font-size: calc(var(--m3-font-scale, 1) * 13px) !important;
            line-height: 1.5 !important;
            margin-top: 8px !important;
        }
        .fanfic-description {
            border-top-style: solid !important;
            border-top-width: 1px !important;
            border-image: linear-gradient(to right, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, transparent) 1 !important;
        }
        .fanfic-description-text {
            border-top: none !important;
        }

        /* Метаданные dl/dt/dd */
        dl.fanfic-inline-info {
            margin: 2px 0 !important;
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 0 4px !important;
        }
        dl.fanfic-inline-info dt {
            color: var(--md-on-surface-muted) !important;
            font-size: calc(var(--m3-font-scale, 1) * 12px) !important;
            font-weight: 400 !important;
            margin: 0 !important;
        }
        dl.fanfic-inline-info dd {
            color: var(--md-on-surface-variant) !important;
            font-size: calc(var(--m3-font-scale, 1) * 12px) !important;
            margin: 0 !important;
        }
        dl.fanfic-inline-info dd a {
            color: var(--md-secondary) !important;
            text-decoration: none !important;
        }

        /* ── Чипы / бейджи (ds-label) ── */
        .ds-label {
            border-radius: 8px !important;
            padding: 3px 8px !important;
            font-size: calc(var(--m3-font-scale, 1) * 11px) !important;
            font-weight: 500 !important;
            line-height: 1.4 !important;
            border: 1px solid transparent !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 3px !important;
        }
        .ds-label svg { width: 12px !important; height: 12px !important; }

        /* Направленности */
        .ds-label.direction-het,    .direction-het    { background: #1A3320 !important; color: #6BCB77 !important; border-color: #2D5538 !important; }
        .ds-label.direction-slash,  .direction-slash  { background: #0D2B38 !important; color: #82C8E5 !important; border-color: #1A4A5E !important; }
        .ds-label.direction-gen,    .direction-gen    { background: #2A1F0E !important; color: #E8A44A !important; border-color: #4A3520 !important; }
        .ds-label.direction-femslash, .direction-femslash { background: #2D1220 !important; color: #F08EAE !important; border-color: #4E2038 !important; }
        .ds-label.direction-mixed,  .direction-mixed  { background: #2A2000 !important; color: #FFD966 !important; border-color: #4A3800 !important; }
        .ds-label.direction-other,  .direction-other  { background: #1A1A2E !important; color: #9E9EC8 !important; border-color: #303050 !important; }
        .ds-label.direction-article, .direction-article { background: #252525 !important; color: #B0B0B0 !important; border-color: #404040 !important; }

        /* Рейтинги */
        .ds-label.ds-label-rating-G,     .ds-label-rating-G     { background: #0E2A1A !important; color: #66BB6A !important; border-color: #1A4A2A !important; }
        .ds-label.ds-label-rating-PG-13, .ds-label-rating-PG-13 { background: #0E2A1A !important; color: #81C784 !important; border-color: #1A4A2A !important; }
        .ds-label.ds-label-rating-R,     .ds-label-rating-R     { background: #2A1800 !important; color: #FFA040 !important; border-color: #4A2E00 !important; }
        .ds-label.ds-label-rating-NC-17, .ds-label-rating-NC-17 { background: #2A0E0E !important; color: #EF6C6C !important; border-color: #4A1A1A !important; }
        .ds-label.ds-label-rating-NC-21, .ds-label-rating-NC-21 { background: #2A0A0A !important; color: #FF5252 !important; border-color: #4A1010 !important; }

        /* Статусы */
        .ds-label.ds-label-status-finished,    .ds-label-status-finished    { background: #1A1A2E !important; color: #9E9EC8 !important; border-color: #303050 !important; }
        .ds-label.ds-label-status-in-progress, .ds-label-status-in-progress { background: #2A2200 !important; color: #FFCC40 !important; border-color: #4A3C00 !important; }

        /* Лайки и обычные — включая button.ds-label (jsVueComponent) */
        .ds-label.ds-label-regular, .ds-label-regular,
        button.ds-label.ds-label-regular, a.ds-label.ds-label-regular { background: var(--md-surface-container) !important; color: var(--md-on-surface-variant) !important; border-color: var(--md-surface-tint-active) !important; }

        /* Горячее */
        .ds-label.ds-label-hot, .ds-label-hot { background: #2A1500 !important; color: #FF8A65 !important; border-color: #4A2A00 !important; }

        /* Перевод */
        .ds-label.ds-label-translate, .ds-label-translate { background: #0A2030 !important; color: #60C8DC !important; border-color: #1A4050 !important; }

        /* ── Метки (теги) ── */
        a.tag {
            background: var(--md-surface-container) !important;
            color: var(--md-on-surface) !important;
            border: 1px solid rgba(255,255,255,0.12) !important;
            border-radius: 8px !important;
            padding: 5px 10px !important;
            font-size: calc(var(--m3-font-scale, 1) * 12.5px) !important;
            text-decoration: none !important;
            display: inline-block !important;
        }
        a.tag.hidden { display: none !important; }
        a.tag:active { background: var(--md-surface-tint-active) !important; }
        a.tag.tag-adult { background: rgba(255,80,80,0.06) !important; color: var(--md-error) !important; border-color: rgba(255,180,171,0.6) !important; }
        a.tag.tag-adult::after { display: none !important; }
        /* Теги-спойлеры — показываем с блюром вместо скрытой кнопки */
        a.tag.tag-spoiler { background: #1A2A1A !important; color: #80C080 !important; border-color: #2A4A2A !important; }
        a.tag.tag-spoiler::after { background: transparent !important; color: #80C080 !important; border-radius: 0 2px 2px 0 !important; }
        /* Переопределяем Bootstrap .hidden для спойлеров — показываем их сразу с блюром без ожидания JS */
        a.tag.tag-spoiler.hidden { display: inline-block !important; filter: blur(4px) !important; cursor: pointer !important; user-select: none !important; }
        a.tag.tag-spoiler.m3-spoiler-hidden { filter: blur(4px) !important; cursor: pointer !important; user-select: none !important; transition: filter 0.2s ease !important; }
        a.tag.tag-spoiler.m3-spoiler-hidden:active { filter: blur(0px) !important; }
        /* Кнопка "Спойлеры ..." — скрываем, т.к. показываем теги блюром */
        .show-hidden-tags-btn, .js-show-hidden-tags { display: none !important; }

        .tags { margin-top: 8px !important; line-height: 2 !important; }
        .tags .font-bold { color: var(--md-on-surface-muted) !important; font-size: calc(var(--m3-font-scale, 1) * 11px) !important; }

        /* ── Vue select (сортировка, выпадающие) ── */
        .v-select, .vs__dropdown-toggle,
        .vs__dropdown-menu {
            background: var(--md-surface-tint) !important;
            border-color: rgba(255,255,255,0.12) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .v-select * { background: inherit; }
        .vs__selected, .vs__search { color: var(--md-on-surface-variant) !important; background: transparent !important; }
        .vs__open-indicator svg { fill: var(--md-on-surface-variant) !important; }
        .vs__dropdown-option { color: var(--md-on-surface-variant) !important; background: var(--md-surface-tint) !important; }
        .vs__dropdown-option--highlight { background: var(--md-surface-tint-active) !important; color: var(--md-secondary) !important; }

        /* ── Меню «три точки» (fanfic-more-actions) ── */
        .fanfic-more-actions .fanfic-more-actions-btn,
        .fanfic-more-actions-btn {
            background: transparent !important;
            border-radius: 8px !important;
            color: var(--md-on-surface-variant) !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            -webkit-touch-callout: none !important;
            visibility: hidden !important;
        }
        .fanfic-more-actions:not(.open) .fanfic-more-actions-btn { visibility: visible !important; }
        .fanfic-more-actions-btn svg,
        .fanfic-more-actions .fanfic-more-actions-btn svg { fill: var(--md-on-surface-variant) !important; }
        ul.fanfic-more-actions-body,
        .fanfic-more-actions .fanfic-more-actions-body,
        .fanfic-more-actions-body {
            background: var(--md-surface-container-high) !important;
            color: var(--md-on-surface-variant) !important;
            border-radius: 12px !important;
            border: 1px solid rgba(255,255,255,0.08) !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        .fanfic-more-actions-body li {
            color: var(--md-on-surface-variant) !important;
        }
        .fanfic-more-actions-body li svg { fill: var(--md-on-surface-variant) !important; }
        .fanfic-more-actions-body li:hover { background: rgba(255,255,255,0.06) !important; }
        .fanfic-more-actions-body li:active { background: rgba(255,255,255,0.10) !important; }
        /* Bootstrap text-success (#3c763d) — активный пункт: только цвет */
        .fanfic-more-actions-body li.text-success {
            color: #81C784 !important;
            background: transparent !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
        }
        .fanfic-more-actions-body li.text-success svg { fill: #81C784 !important; }
        .fanfic-more-actions-body li.text-success:hover { background: rgba(255,255,255,0.06) !important; }
        .fanfic-more-actions-body li.text-success:active { background: rgba(255,255,255,0.10) !important; }

        /* ── Страница профиля ── */
        .profile-header {
            background: #141414 !important;
        }
        .profile-cover {
            background: #141414 !important;
            background-color: #141414 !important;
        }
        /* Активный таб в боковой навигации профиля */
        .sidebar-nav-list li.active {
            background: var(--md-primary-container) !important;
            border-radius: 8px !important;
        }
        .sidebar-nav-list li.active a { color: var(--md-primary) !important; }
        /* Счётчик на табах профиля (Сборники 3, Блог 5 и т.д.) */
        .counter {
            background: var(--md-primary-container) !important;
            color: var(--md-primary) !important;
            border-radius: 8px !important;
        }
        /* Группа достижений */
        .achievement-group {
            background: var(--md-surface-container) !important;
            border-radius: 12px !important;
            border: none !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .achievement-group h3 { color: var(--md-on-surface) !important; }
        /* Отдельный элемент достижения */
        .achievement-item {
            background: #141414 !important;
            border-radius: 8px !important;
            opacity: 0.45 !important;
        }
        /* Полученное достижение — полная яркость + лёгкий тинт */
        .achievement-item.css-received {
            background: var(--md-primary-container) !important;
            border-radius: 8px !important;
            opacity: 1 !important;
        }

        /* ── Карточки конкурсов ── */
        .competition-list-item {
            background: var(--md-surface-container) !important;
            border-radius: 12px !important;
            border: none !important;
            margin-bottom: 8px !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important;
            color: var(--md-on-surface-variant) !important;
            overflow: hidden !important;
        }
        .competition-list-item a { color: var(--md-primary) !important; text-decoration: none !important; }
        .competition-list-item .text-muted { color: var(--md-on-surface-muted) !important; }

        /* ── Карточки бейджей ── */
        .user-badges-block {
            background: var(--md-surface-container) !important;
            border-radius: 12px !important;
            border: none !important;
            padding: 14px 16px !important;
            margin-bottom: 8px !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .user-badges-block a { color: var(--md-secondary) !important; text-decoration: none !important; }

        /* ── Карточки помощников (беты, гамма-ридеры и т.д.) ── */
        .assistant-card {
            background: var(--md-surface-container) !important;
            border-radius: 12px !important;
            border: none !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important;
            color: var(--md-on-surface-variant) !important;
            overflow: hidden !important;
        }
        .assistant-card-header {
            background: var(--md-surface-container-high) !important;
        }
        .assistant-card a { color: var(--md-secondary) !important; text-decoration: none !important; }
        .assistant-card .text-muted,
        .assistant-card .small { color: var(--md-on-surface-muted) !important; }
        .assistant-card .text-bold { color: var(--md-on-surface) !important; }
        /* Кнопка «Развернуть/Свернуть» описание */
        .assistant-card .opener {
            color: var(--md-secondary) !important;
            background: none !important;
            border: none !important;
        }

        /* ── Карточки сборников ── */
        .collection-card {
            background: var(--md-surface-container) !important;
            border-radius: 12px !important;
            padding: 14px 16px !important;
            margin-bottom: 8px !important;
            border: none !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .collection-card:active {
            background: var(--md-surface-container-high) !important;
        }
        .collection-card a {
            color: var(--md-primary) !important;
            text-decoration: none !important;
        }
        .collection-card .text-muted,
        .collection-card .small {
            color: var(--md-on-surface-muted) !important;
        }

        .read-notification {
            background: transparent !important;
        }

        /* ── Пэйринги/персонажи ── */
        a.pairing-link {
            color: var(--md-secondary) !important;
            text-decoration: none !important;
        }
        a.pairing-link.pairing-highlight {
            background: var(--md-primary-container) !important;
            border-radius: 4px !important;
            padding: 1px 4px !important;
            color: var(--md-secondary) !important;
        }

        /* ── Значок автора (user-badge) ── */
        .user-badge {
            border-radius: 4px !important;
        }
        /* Используем --user-badge-fg заданный сайтом — правильный контраст для любого фона */
        .user-badge-text {
            color: var(--user-badge-fg, var(--md-on-surface-variant)) !important;
            text-shadow: 0 1px 3px rgba(0,0,0,0.5) !important;
        }

        /* ── Заголовки секций ── */
        h2.heading {
            color: var(--md-on-surface) !important;
            font-size: calc(var(--m3-font-scale, 1) * 18px) !important;
            font-weight: 600 !important;
            letter-spacing: 0 !important;
            padding: 16px 0 10px !important;
            border-bottom: none !important;
        }

        /* ── Категории и все regular-box ── */
        .categories-container { margin-bottom: 8px !important; }
        .regular-box {
            background: var(--md-surface-container) !important;
            border-radius: 12px !important;
            border: none !important;
            padding: 14px 16px !important;
            margin-bottom: 8px !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .regular-box h3, .regular-box h2 {
            color: var(--md-on-surface) !important;
            font-size: calc(var(--m3-font-scale, 1) * 13px) !important;
            font-weight: 600 !important;
            margin: 0 0 10px !important;
            letter-spacing: 0.3px !important;
        }
        .regular-box a {
            color: var(--md-secondary) !important;
            text-decoration: none !important;
            font-size: calc(var(--m3-font-scale, 1) * 13px) !important;
        }
        .regular-box a:active { color: var(--md-primary) !important; }

        /* ── Карточки заявок ── */
        .request-card {
            background: var(--md-surface-container) !important;
            border-radius: 12px !important;
            border: none !important;
            padding: 14px 16px !important;
            margin-bottom: 8px !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .request-card-title,
        .request-card h3 a {
            color: var(--md-primary) !important;
            text-decoration: none !important;
            font-size: calc(var(--m3-font-scale, 1) * 14px) !important;
            font-weight: 600 !important;
        }
        .request-card .text-t1 { margin: 0 0 8px !important; }
        .request-card strong { color: var(--md-on-surface-muted) !important; font-weight: 500 !important; }
        .request-card .word-break { color: var(--md-on-surface-variant) !important; }
        .request-card span:not([class]) { color: var(--md-on-surface-variant) !important; }
        .request-card svg { fill: var(--md-on-surface-variant) !important; }
        .request-card .ds-hr { border-color: rgba(255,255,255,0.08) !important; }

        /* ── Кнопки "Ещё" (primary-box) ── */
        .primary-box.box-with-button {
            background: #141414 !important;
            border: none !important;
            padding: 4px 0 8px !important;
            text-align: center !important;
        }
        .primary-box.box-with-button .text-n1 {
            display: none !important;
        }
        a.ds-btn.ds-btn-primary, button.ds-btn.ds-btn-primary,
        a.ds-btn.ds-btn-mini.ds-btn-primary {
            background: var(--md-surface-container) !important;
            color: var(--md-secondary) !important;
            border: 1px solid var(--md-primary) !important;
            border-radius: 20px !important;
            padding: 8px 24px !important;
            font-size: calc(var(--m3-font-scale, 1) * 13px) !important;
            font-weight: 500 !important;
            text-decoration: none !important;
            display: inline-block !important;
        }
        a.ds-btn.ds-btn-primary:active,
        a.ds-btn.ds-btn-mini.ds-btn-primary:active {
            background: rgba(208,188,255,0.12) !important;
        }
        /* Активное состояние (Vue добавляет ds-btn-success-filled после нажатия) */
        button.ds-btn.ds-btn-success-filled,
        a.ds-btn.ds-btn-success-filled {
            background: #0D2B0D !important;
            color: #6FCF6F !important;
            border-color: #2D5A2D !important;
        }
        /* Кнопка "Подписаться на автора" (btn-default icon-button) */
        button.btn-default.icon-button, a.btn-default.icon-button {
            background: var(--md-surface-tint) !important;
            color: var(--md-on-surface-variant) !important;
            border-color: rgba(255,255,255,0.15) !important;
            border-radius: 50% !important;
        }

        /* ── Промо сетка обложек ── */
        section.home-promo h1 {
            color: var(--md-on-surface) !important;
            font-size: calc(var(--m3-font-scale, 1) * 20px) !important;
            font-weight: 600 !important;
            margin-bottom: 12px !important;
        }
        /* Карточки-ссылки промо-карусели — убираем сайтовые фоны направлений */
        a.fanfic-promo-item,
        a.js-promo-fanfic {
            background: var(--md-surface-container) !important;
        }
        .fanfic-promo-item {
            border-radius: 8px !important;
            overflow: hidden !important;
        }


        /* ── Промо-карусель toolbar ── */
        .fanfic-promo-carousel__toolbar { color: var(--md-on-surface) !important; }
        .fanfic-promo-carousel__toolbar .text-bold { color: var(--md-on-surface) !important; }
        button.ds-btn-icon.fanfic-promo-carousel__nav-btn,
        .fanfic-promo-carousel__toolbar .ds-btn-icon {
            background: var(--md-surface-tint) !important;
            border: 1px solid rgba(255,255,255,0.12) !important;
            color: var(--md-on-surface-variant) !important;
        }
        .fanfic-promo-carousel__toolbar .ds-btn-icon svg { fill: var(--md-on-surface-variant) !important; }
        /* Кнопки навигации карусели (класс на /buy-promo отличается от главной) */
        .fanfic-promo-carousel-button {
            background: var(--md-surface-tint) !important;
            color: var(--md-on-surface-variant) !important;
            border-color: rgba(255,255,255,0.12) !important;
        }
        .fanfic-promo-carousel-button svg { fill: var(--md-on-surface-variant) !important; }
        /* Фон самой секции карусели — убираем коричневый */
        section.fanfic-promo-carousel,
        section.js-fanfic-promo-carousel,
        section.home-promo {
            background: #141414 !important;
            color: var(--md-on-surface-variant) !important;
        }
        /* content-box — общий контейнер ficbook, переменная не всегда применяется */
        .content-box {
            background: var(--md-surface-container) !important;
            color: var(--md-on-surface-variant) !important;
            border-color: rgba(255,255,255,0.08) !important;
        }
        /* Карточки внутри карусели */
        .fanfic-promo-carousel-card-container { color: var(--md-on-surface-variant) !important; }

        /* ── ТОП-страница: строка с рейтингом ── */
        .top-item-rating {
            background: var(--md-primary-container) !important;
            border-radius: 12px !important;
            border: none !important;
            color: var(--md-on-primary-container) !important;
        }
        .top-item-rating .font-bold { color: var(--md-primary) !important; }
        .top-item-rating .top-count-data { color: var(--md-on-surface-muted) !important; }
        .top-item-rating svg { fill: var(--md-on-surface-muted) !important; }

        /* ── Информационный блок-подсказка ── */
        .help-box {
            background: var(--md-surface-container) !important;
            border-radius: 12px !important;
            border: 1px solid rgba(255,255,255,0.08) !important;
            padding: 14px 16px !important;
            color: var(--md-on-surface-variant) !important;
        }
        .help-box strong { color: var(--md-on-surface) !important; }
        .help-box a { color: var(--md-secondary) !important; }

        /* ── Футерные кнопки ── */
        .btn-footer {
            background: var(--md-surface-container) !important;
            color: var(--md-on-surface-variant) !important;
            border-color: rgba(255,255,255,0.08) !important;
        }
        .btn-footer svg { fill: var(--md-on-surface-variant) !important; }

        /* ── Общие ссылки и текст ── */
        .main-holder a:not([class]),
        .main-holder a.word-break {
            color: var(--md-secondary) !important;
            text-decoration: none !important;
        }
        .main-holder .text-bold { color: var(--md-on-surface) !important; }

        /* ── Степпер масштаба текста ── */
        .m3-zoom-row {
            display: flex; align-items: center; justify-content: space-between;
            padding: 14px 20px;
            border-top: 1px solid rgba(255,255,255,0.06);
            font-family: system-ui, -apple-system, sans-serif;
            user-select: none; -webkit-user-select: none;
        }
        .m3-zoom-stepper {
            display: flex; align-items: center; gap: 4px; flex-shrink: 0;
        }
        .m3-zoom-btn {
            width: 36px; height: 36px; border-radius: 50%; border: none;
            background: rgba(202,196,208,0.12); color: var(--md-on-surface-variant);
            font-size: calc(var(--m3-font-scale, 1) * 20px); line-height: 1; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            -webkit-tap-highlight-color: transparent; touch-action: manipulation;
        }
        .m3-zoom-btn:active { background: rgba(202,196,208,0.22); }
        .m3-zoom-val {
            min-width: 48px; text-align: center;
            font-size: calc(var(--m3-font-scale, 1) * 15px); font-weight: 500; color: var(--md-on-surface);
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    // Применяем сохранённый масштаб текста
    try {
        const savedScale = parseFloat(localStorage.getItem('fb_text_zoom'));
        if (!isNaN(savedScale) && savedScale >= 0.5 && savedScale <= 2.0) {
            document.documentElement.style.setProperty('--m3-font-scale', String(savedScale));
        }
    } catch (_) {}

    // Anti-FOUC: скрываем html до тех пор пока наш top bar не вставлен.
    // Без этого пользователь видит оригинальную светлую шапку ficbook, которая
    // потом резко заменяется нашим тёмным интерфейсом.
    // Используем html (не body) чтобы не нарушать ограничение на body visibility.
    const antiFoucStyle = document.createElement('style');
    antiFoucStyle.id = 'm3-home-anti-fouc';
    antiFoucStyle.textContent = 'html{opacity:0!important}';
    (document.head || document.documentElement).appendChild(antiFoucStyle);

    let antiFoucRemoved = false;
    function revealPage() {
        if (antiFoucRemoved) return;
        antiFoucRemoved = true;
        antiFoucStyle.remove();
    }
    // Жёсткий fallback — если что-то пошло не так, страница всё равно появится
    setTimeout(revealPage, 800);

    // Следим за появлением Vue-компонентов — когда они монтируют <style>,
    // переставляем наш style в самый конец head чтобы наш CSS побеждал в каскаде.
    // Флаг reordering предотвращает холостой повторный вызов на наше же перемещение.
    let reordering = false;
    const styleReorderObserver = new MutationObserver(() => {
        if (reordering) return;
        if (style.parentNode && style !== style.parentNode.lastElementChild) {
            reordering = true;
            style.parentNode.appendChild(style);
            reordering = false;
        }
    });
    styleReorderObserver.observe(document.head || document.documentElement, { childList: true });

    // ─── Блоки главной ───────────────────────────────────────────────────────────
    const BLOCKS = [
        {
            key:   'promo',
            label: 'Промо-подборка',
            sub:   'Блок «Книга фанфиков» с обложками',
            find:  () => document.querySelectorAll('section.home-promo'),
        },
        {
            key:   'categories',
            label: 'Категории',
            sub:   'Жанры и фэндомы',
            find:  () => document.querySelectorAll('div.categories-container'),
        },
        {
            key:   'hotWorks',
            label: 'Горячие работы',
            sub:   'Список популярных фанфиков',
            find:  () => {
                const result = [];
                document.querySelectorAll('main section').forEach(s => {
                    if (!s.querySelector(':scope > h2.heading')) return;
                    if (s.querySelector(':scope > div.request-card')) return;
                    if (s.classList.contains('fanfic-promo-carousel')) return;
                    result.push(s);
                });
                return result;
            },
        },
        {
            key:   'hotRequests',
            label: 'Горячие заявки',
            sub:   'Список читательских заявок',
            find:  () => {
                const result = [];
                document.querySelectorAll('main section').forEach(s => {
                    if (!s.querySelector(':scope > h2.heading')) return;
                    if (!s.querySelector(':scope > div.request-card')) return;
                    result.push(s);
                });
                return result;
            },
        },
        {
            key:   'promoCarousels',
            label: 'Промо-карусели',
            sub:   'Рекламные карусели ficbook',
            find:  () => document.querySelectorAll('section.fanfic-promo-carousel, section.js-fanfic-promo-carousel'),
        },
        {
            key:   'footer',
            label: 'Футер',
            sub:   'Нижний колонтитул сайта',
            find:  () => document.querySelectorAll('footer'),
        },
    ];

    function applyBlock(block) {
        const hide = isHidden(SETTINGS_KEYS[block.key]);
        block.find().forEach(el => {
            if (hide) {
                el.style.setProperty('display', 'none', 'important');
            } else {
                el.style.removeProperty('display');
            }
        });
    }

    function applyAllBlocks() { BLOCKS.forEach(applyBlock); }

    // ─── Реклама (всегда удаляется, не настраивается) ────────────────────────────
    const AD_RULES = [
        {
            selectors: [
                '.js-fb-ad-slot', '.fb-ad-slot',
                '[class*="tds-sticky_container"]',
                '#sticky_container_BOTTOM', '[id*="ad_container"]',
                '.global-banner-2',
            ],
        },
        {
            selectors: ['.page-footer-apps'],
            contentCheck: el => !!el.querySelector(
                'a[href*="play.google.com"], a[href*="apps.apple.com"], a[href*="app-store"], a[href*="google-play"]'
            ),
        },
    ];

    function removeAds() {
        AD_RULES.forEach(rule => {
            rule.selectors.forEach(sel => {
                try { document.querySelectorAll(sel).forEach(el => el.remove()); } catch (_) {}
            });
            if (rule.contentCheck) {
                document.querySelectorAll('section').forEach(el => {
                    if (rule.contentCheck(el)) el.remove();
                });
            }
        });
        document.querySelectorAll('noscript').forEach(el => el.remove());
        document.querySelector('meta[name="apple-itunes-app"]')?.remove();
    }

    const ALL_AD_SEL = AD_RULES.flatMap(r => r.selectors).join(',');

    function matchesAd(el) {
        if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
        for (const rule of AD_RULES) {
            for (const sel of rule.selectors) {
                try { if (el.matches(sel)) return true; } catch (_) {}
            }
            if (rule.contentCheck && rule.contentCheck(el)) return true;
        }
        return false;
    }

    const DIRECTION_CLASSES = ['direction-het','direction-slash','direction-gen','direction-femslash','direction-mixed','direction-other','direction-article'];

    function applyDirectionToCard(article) {
        if (!article.matches('article.fanfic-inline')) return;
        const label = article.querySelector('.ds-label[class*="direction-"]');
        if (!label) return;
        const dir = DIRECTION_CLASSES.find(c => label.classList.contains(c));
        if (dir && !article.classList.contains(dir)) {
            DIRECTION_CLASSES.forEach(c => article.classList.remove(c));
            article.classList.add(dir);
        }
    }

    function applySpoilerTags(root) {
        // Ficbook скрывает спойлер-теги через Bootstrap .hidden.
        // Мы убираем hidden, показываем тег с блюром, клик снимает блюр.
        const tags = (root.matches && root.matches('a.tag.tag-spoiler'))
            ? [root]
            : [...(root.querySelectorAll ? root.querySelectorAll('a.tag.tag-spoiler') : [])];
        tags.forEach(tag => {
            if (tag.dataset.m3Spoiler) return;
            tag.dataset.m3Spoiler = '1';
            tag.classList.remove('hidden');
            tag.classList.add('m3-spoiler-hidden');
            tag.addEventListener('click', e => {
                if (tag.classList.contains('m3-spoiler-hidden')) {
                    e.preventDefault();
                    tag.classList.remove('m3-spoiler-hidden');
                }
            });
        });
    }

    function tagCardsWithDirection() {
        document.querySelectorAll('article.fanfic-inline').forEach(applyDirectionToCard);
    }

    function applyAllSpoilerTags() {
        applySpoilerTags(document.body);
    }

    const adObserver = new MutationObserver(mutations => {
        for (const { addedNodes } of mutations) {
            for (const node of addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;
                if (node.id === 'm3-top-bar' || node.id === 'm3-bottom-nav' || node.id === 'm3-profile-scrim' || node.id === 'm3-profile-sheet') continue;
                applyDirectionToCard(node);
                try { node.querySelectorAll('article.fanfic-inline').forEach(applyDirectionToCard); } catch (_) {}
                applySpoilerTags(node);
                if (matchesAd(node)) {
                    node.remove();
                } else {
                    try { node.querySelectorAll(ALL_AD_SEL).forEach(el => el.remove()); } catch (_) {}
                    AD_RULES.forEach(rule => {
                        if (!rule.contentCheck) return;
                        node.querySelectorAll('section').forEach(el => {
                            if (rule.contentCheck(el)) el.remove();
                        });
                    });
                }
            }
        }
    });

    // ─── Sheet: swipe-to-dismiss ─────────────────────────────────────────────────
    function bindSwipeToDismiss(sheetNode, closeFn) {
        let startY = 0, deltaY = 0, isDragging = false;
        const bar = sheetNode.querySelector('.m3-sheet-handle-row') || sheetNode;

        bar.addEventListener('touchstart', e => {
            if (e.touches.length !== 1) return;
            startY = e.touches[0].clientY;
            deltaY = 0;
            isDragging = true;
            sheetNode.style.transition = 'none';
        }, { passive: true });

        bar.addEventListener('touchmove', e => {
            if (!isDragging || e.touches.length !== 1) return;
            const diff = e.touches[0].clientY - startY;
            if (diff > 0) { deltaY = diff; sheetNode.style.transform = `translateY(${diff}px)`; }
        }, { passive: true });

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            sheetNode.style.transition = '';
            sheetNode.style.transform = '';
            if (deltaY > 80) {
                closeFn();
            } else if (deltaY > 10) {
                bar.dataset.swiped = '1';
                setTimeout(() => { delete bar.dataset.swiped; }, 300);
            }
        };
        bar.addEventListener('touchend', onEnd);
        bar.addEventListener('touchcancel', onEnd);
    }

    // ─── Масштаб текста (общий модуль) ──────────────────────────────────────────
    const ZOOM_KEY     = 'fb_text_zoom';
    const ZOOM_MIN     = 0.5;
    const ZOOM_MAX     = 2.0;
    const ZOOM_STEP    = 0.05;
    const ZOOM_DEFAULT = 1.0;

    function readZoom() {
        try {
            const v = parseFloat(localStorage.getItem(ZOOM_KEY));
            if (!isNaN(v) && v >= ZOOM_MIN && v <= ZOOM_MAX) return v;
        } catch (_) {}
        return ZOOM_DEFAULT;
    }
    function fmtZoom(v) { return Math.round(v * 100) + '%'; }
    function applyZoom(v, valEl) {
        try { localStorage.setItem(ZOOM_KEY, v.toFixed(2)); } catch (_) {}
        if (valEl) valEl.textContent = fmtZoom(v);
        document.documentElement.style.setProperty('--m3-font-scale', String(v));
    }

    function buildZoomStepper() {
        const zoomRow = document.createElement('div');
        zoomRow.className = 'm3-zoom-row';

        const zoomLabel = document.createElement('div');
        zoomLabel.className = 'm3-toggle-label';
        zoomLabel.textContent = 'Масштаб текста';

        const zoomStepper = document.createElement('div');
        zoomStepper.className = 'm3-zoom-stepper';

        const zoomMinus = document.createElement('button');
        zoomMinus.className = 'm3-zoom-btn';
        zoomMinus.textContent = '−';
        zoomMinus.setAttribute('aria-label', 'Уменьшить');

        const zoomValEl = document.createElement('span');
        zoomValEl.className = 'm3-zoom-val';
        zoomValEl.textContent = fmtZoom(readZoom());

        const zoomPlus = document.createElement('button');
        zoomPlus.className = 'm3-zoom-btn';
        zoomPlus.textContent = '+';
        zoomPlus.setAttribute('aria-label', 'Увеличить');

        zoomStepper.append(zoomMinus, zoomValEl, zoomPlus);
        zoomRow.append(zoomLabel, zoomStepper);

        zoomMinus.addEventListener('click', (e) => {
            e.stopPropagation();
            const cur = readZoom();
            const next = Math.max(ZOOM_MIN, Math.round((cur - ZOOM_STEP) * 100) / 100);
            if (next !== cur) applyZoom(next, zoomValEl);
        });
        zoomPlus.addEventListener('click', (e) => {
            e.stopPropagation();
            const cur = readZoom();
            const next = Math.min(ZOOM_MAX, Math.round((cur + ZOOM_STEP) * 100) / 100);
            if (next !== cur) applyZoom(next, zoomValEl);
        });

        return zoomRow;
    }

    if (!window._ficbookSheetPopstate) {
        window._ficbookSheetPopstate = true;
        window.addEventListener('popstate', e => {
            const pscrim = document.getElementById('m3-profile-scrim');
            if (pscrim && pscrim.classList.contains('open') && e.state?.ficbookProfileSheet === true) {
                closeProfileSheet(true);
            }
        });
    }

    // ─── Profile Sheet ───────────────────────────────────────────────────────────
    const SVG_LOGOUT    = `<svg viewBox="0 0 24 24"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>`;
    const SVG_SEARCH    = `<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;
    const SVG_SETTINGS  = `<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;
    const SVG_STAR      = `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    const SVG_BELL      = `<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`;
    const SVG_PEN       = `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
    const SVG_BOOKMARK  = `<svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>`;
    const SVG_GIFT      = `<svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.07-.31.18-.62.18-.98C18 3.36 16.64 2 14.98 2c-.96 0-1.77.49-2.38 1.19L12 3.85l-.59-.66C10.79 2.49 9.98 2 9.02 2 7.36 2 6 3.36 6 5.02c0 .36.1.67.18.98H4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h.5v6c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-6H20c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5.02-2c.55 0 1.02.47 1.02 1.02S15.53 6.04 14.98 6H13c0-1.09.89-2 1.98-2zM9.02 4C10.11 4 11 4.91 11 6H9.02C8.47 6 8 5.53 8 4.98S8.47 4 9.02 4zM4 8h16v3H4V8zm2.5 11v-6h11v6h-11z"/></svg>`;

    // SVG-иконки для профильного меню
    const SVG_NEWS      = `<svg viewBox="0 0 24 24"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>`;
    const SVG_MSG       = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;
    const SVG_BADGE     = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`;
    const SVG_BLOG      = `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34l-3.75-3.75-2.66 2.65 3.75 3.75z"/></svg>`;
    const SVG_REVIEWS   = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v14l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/></svg>`;
    const SVG_COLL      = `<svg viewBox="0 0 24 24"><path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/></svg>`;
    const SVG_DISCUSS   = `<svg viewBox="0 0 24 24"><path d="M21 15c0 1.1-.9 2-2 2H7l-4 4V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v10z"/></svg>`;
    const SVG_SUBS      = `<svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`;
    const SVG_LIKED     = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    const SVG_READED    = `<svg viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>`;
    const SVG_HISTORY   = `<svg viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`;
    const SVG_VISITED   = `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
    const SVG_FEEDS     = `<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`;
    const SVG_REQUEST   = `<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-2 9l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L17 11l-7 7z"/></svg>`;
    const SVG_SUPPORT   = `<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;
    const SVG_SYSMSGS   = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
    const SVG_SITENEWS  = `<svg viewBox="0 0 24 24"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>`;
    const SVG_PREMIUM   = `<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>`;
    const SVG_COINS     = `<svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>`;
    const SVG_HELPER    = `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>`;
    const SVG_CHEVRON   = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`;
    const SVG_PROFILE   = `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
    const SVG_REQUESTS_NAV = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`;
    const SVG_HELPERS_NAV  = `<svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`;
    const SVG_CONTESTS_NAV = `<svg viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>`;
    const SVG_FAQ_NAV      = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>`;
    const SVG_RULES_NAV    = `<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`;
    const SVG_MORE         = `<svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`;
    const SVG_VIEW         = `<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>`;

    // Структура профильного меню
    const PROFILE_MENU = {
        top: [
            { label: 'Улучшить аккаунт', href: '/home/premium/coins', svg: SVG_PREMIUM, card: true },
            { label: 'Купить монеты',     href: '/home/money',          svg: SVG_COINS,   card: true },
        ],
        flat: [
            { label: 'Мои новости',       href: '/home/news',      svg: SVG_NEWS    },
            { label: 'Мой профиль',       href: null,              svg: SVG_PROFILE, id: 'myprofile' },
            { label: 'Личные сообщения',  href: '/home/messaging', svg: SVG_MSG     },
        ],
        groups: [
            {
                label: 'Бейджи', svg: SVG_BADGE,
                items: [
                    { label: 'Создать бейдж',     href: '/home/badges/create'       },
                    { label: 'Мои бейджи',        href: '/home/badges'              },
                    { label: 'Популярные бейджи', href: '/home/badges/popular/week' },
                ],
            },
            {
                label: 'Кабинет автора', svg: SVG_PEN,
                items: [
                    { label: 'Добавить фанфик',      href: '/home/addfic'            },
                    { label: 'Мои фанфики',          href: '/home/myfics'            },
                    { label: 'Мой блог',             href: '/home/blog'              },
                    { label: 'Отзывы',               href: '/home/comments'          },
                    { label: 'История изменений',    href: '/home/versions'          },
                    { label: 'Сообщения об ошибках', href: '/home/typos'             },
                ],
            },
            {
                label: 'Кабинет читателя', svg: SVG_READED,
                items: [
                    { label: 'Сборники',              href: '/home/collections'   },
                    { label: 'Закладки',              href: '/home/bookmarks'     },
                    { label: 'Обсуждения',            href: '/home/fallows/fanfics' },
                    { label: 'Подписки на авторов',   href: '/home/favourites'    },
                    { label: 'Понравившиеся работы',  href: '/home/liked_fanfics' },
                    { label: 'Прочитанные работы',    href: '/home/readedList'    },
                    { label: 'История подписок',      href: '/home/followList'    },
                    { label: 'Просмотренные работы',  href: '/home/visitedList'   },
                    { label: 'Мои ленты',             href: '/home/feeds'         },
                ],
            },
            {
                label: 'Кабинет помощника', svg: SVG_HELPER,
                items: [
                    { label: 'Анкета помощника',    href: '/home/questionary/beta/show'    },
                    { label: 'Фанфики помощника',   href: '/home/assistant_fanfics/coauthor' },
                ],
            },
            {
                label: 'Заявки', svg: SVG_REQUEST,
                items: [
                    { label: 'Добавить заявку',              href: '/home/requests/add'         },
                    { label: 'Мои заявки',                   href: '/home/my_requests'          },
                    { label: 'Фанфики по моим заявкам',      href: '/home/my_requests_fanfics'  },
                    { label: 'Интересные заявки',            href: '/home/liked_requests'       },
                    { label: 'Заявки в закладках',           href: '/home/bookmarked_requests'  },
                ],
            },
            {
                label: 'Связь', svg: SVG_SUPPORT,
                items: [
                    { label: 'Служба поддержки',    href: '/home/support'    },
                    { label: 'Системные сообщения', href: '/sysmessages'     },
                    { label: 'Новости сайта',       href: '/sitenews'        },
                ],
            },
            {
                label: 'Разделы', svg: SVG_MORE,
                items: [
                    { label: 'Заявки',    href: '/requests'               },
                    { label: 'Помощники', href: '/questionary/beta/search' },
                    { label: 'Конкурсы',  href: '/competitions'            },
                    { label: 'FAQ',       href: '/faq'                     },
                    { label: 'Правила',   href: '/rules'                   },
                ],
            },
        ],
        footer: [
            { label: 'Настройки', href: '/home/settings', svg: SVG_SETTINGS },
            { label: 'Выйти',     href: '/logout',         svg: SVG_LOGOUT,  id: 'logout' },
        ],
    };

    function buildProfileSheet(profileInfo) {
        const scrim = document.createElement('div');
        scrim.id = 'm3-profile-scrim';
        scrim.addEventListener('click', () => closeProfileSheet(false));

        const sheet = document.createElement('div');
        sheet.id = 'm3-profile-sheet';

        // Ручка
        const handleRow = document.createElement('div');
        handleRow.className = 'm3-sheet-handle-row';
        handleRow.appendChild(Object.assign(document.createElement('div'), { className: 'm3-sheet-handle' }));
        sheet.appendChild(handleRow);

        const isLoggedIn = profileInfo.isLoggedIn;

        if (!isLoggedIn) {
            // Не залогинен — показываем только кнопку входа
            const loginRow = document.createElement('a');
            loginRow.className = 'm3-nav-row';
            loginRow.href = '/login';
            loginRow.innerHTML = `<span class="m3-nav-row-icon">${SVG_PROFILE}</span><span class="m3-nav-row-text">Войти в аккаунт</span>`;
            loginRow.addEventListener('click', () => closeProfileSheet(false));
            sheet.appendChild(loginRow);

            document.body.appendChild(scrim);
            document.body.appendChild(sheet);
            return;
        }
        // Шапка: аватар + никнейм
        const header = document.createElement('div');
        header.className = 'm3-profile-header';

        const avatarEl = document.createElement('div');
        avatarEl.className = 'm3-profile-avatar';
        const avatarImg = document.querySelector('.top-bar img, .btn-top-bar-profile-menu img');
        if (avatarImg && avatarImg.src) {
            const img = document.createElement('img');
            img.src = avatarImg.src;
            img.alt = profileInfo.name || '';
            avatarEl.appendChild(img);
        } else {
            avatarEl.innerHTML = SVG_PROFILE;
        }

        const nameCol = document.createElement('div');
        const nameEl = document.createElement('div');
        nameEl.className = 'm3-profile-name';
        nameEl.id = 'm3-profile-sheet-name';
        nameEl.textContent = profileInfo.name || 'Профиль';
        nameCol.appendChild(nameEl);

        header.appendChild(avatarEl);
        header.appendChild(nameCol);
        sheet.appendChild(header);

        const SVG_ARROW = `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>`;

        function makeRow(item, extraClass) {
            const a = document.createElement('a');
            a.className = 'm3-nav-row' + (extraClass ? ' ' + extraClass : '') + (item.id === 'logout' ? ' m3-logout' : '');
            a.href = (item.id === 'myprofile' && profileInfo.href && profileInfo.href !== '#')
                ? profileInfo.href
                : (item.href || '#');
            const iconEl = document.createElement('span');
            iconEl.className = 'm3-nav-row-icon';
            iconEl.innerHTML = item.svg || '';
            const textEl = document.createElement('span');
            textEl.className = 'm3-nav-row-text';
            textEl.textContent = item.label;
            const arrowEl = document.createElement('span');
            arrowEl.className = 'm3-nav-row-arrow';
            arrowEl.innerHTML = SVG_ARROW;
            a.append(iconEl, textEl, arrowEl);
            a.addEventListener('click', () => {
                closeProfileSheet(true);
            });
            return a;
        }


        // Плоские пункты
        PROFILE_MENU.flat.forEach(item => sheet.appendChild(makeRow(item)));

        // Коллапсируемые секции
        PROFILE_MENU.groups.forEach((group, idx) => {
            const sectionId = 'm3-profile-section-' + idx;
            const stored = localStorage.getItem('m3ps_' + idx);
            const expanded = stored === 'open';

            // Заголовок секции — кнопка
            const sectionBtn = document.createElement('button');
            sectionBtn.className = 'm3-profile-section-btn' + (expanded ? ' expanded' : '');
            sectionBtn.setAttribute('aria-expanded', String(expanded));
            sectionBtn.setAttribute('aria-controls', sectionId);
            const sBtnIcon = document.createElement('span');
            sBtnIcon.className = 'm3-nav-row-icon';
            sBtnIcon.innerHTML = group.svg;
            const sBtnText = document.createElement('span');
            sBtnText.className = 'm3-nav-row-text';
            sBtnText.textContent = group.label;
            const sBtnChevron = document.createElement('span');
            sBtnChevron.className = 'm3-section-chevron';
            sBtnChevron.innerHTML = SVG_CHEVRON;
            sectionBtn.append(sBtnIcon, sBtnText, sBtnChevron);
            sheet.appendChild(sectionBtn);

            // Контейнер дочерних пунктов
            const sectionBody = document.createElement('div');
            sectionBody.className = 'm3-profile-section-body' + (expanded ? ' expanded' : '');
            sectionBody.id = sectionId;
            group.items.forEach(item => {
                const row = makeRow({ ...item, svg: '' }, 'm3-nav-row-sub');
                sectionBody.appendChild(row);
            });
            sheet.appendChild(sectionBody);

            sectionBtn.addEventListener('click', () => {
                const isOpen = sectionBtn.classList.toggle('expanded');
                sectionBody.classList.toggle('expanded', isOpen);
                sectionBtn.setAttribute('aria-expanded', String(isOpen));
                try { localStorage.setItem('m3ps_' + idx, isOpen ? 'open' : 'closed'); } catch (_) {}
            });
        });

        // Секция «Вид» — раскрывающаяся, с тоглами видимости блоков главной страницы
        const viewSectionId = 'm3-profile-view-section';
        const viewStored = localStorage.getItem('m3ps_view');
        const viewExpanded = viewStored === 'open';

        const viewBtn = document.createElement('button');
        viewBtn.className = 'm3-profile-section-btn' + (viewExpanded ? ' expanded' : '');
        viewBtn.setAttribute('aria-expanded', String(viewExpanded));
        viewBtn.setAttribute('aria-controls', viewSectionId);
        viewBtn.innerHTML = `<span class="m3-nav-row-icon">${SVG_VIEW}</span><span class="m3-nav-row-text">Вид</span><span class="m3-section-chevron">${SVG_CHEVRON}</span>`;
        sheet.appendChild(viewBtn);

        const viewBody = document.createElement('div');
        viewBody.className = 'm3-profile-section-body' + (viewExpanded ? ' expanded' : '');
        viewBody.id = viewSectionId;
        BLOCKS.forEach(block => {
            const key = SETTINGS_KEYS[block.key];
            const row = document.createElement('div');
            row.className = 'm3-nav-row m3-nav-row-sub m3-view-toggle-row';
            row.style.cursor = 'pointer';

            const textEl = document.createElement('span');
            textEl.className = 'm3-nav-row-text';
            textEl.textContent = block.label;

            const sw = document.createElement('div');
            sw.className = 'm3-sw' + (isHidden(key) ? '' : ' on');
            sw.innerHTML = '<div class="m3-sw-track"></div><div class="m3-sw-thumb"></div>';

            row.append(textEl, sw);
            row.addEventListener('click', () => {
                const nowHidden = isHidden(key);
                setHidden(key, !nowHidden);
                sw.classList.toggle('on', nowHidden);
                applyBlock(block);
            });
            viewBody.appendChild(row);
        });
        viewBody.appendChild(buildZoomStepper());
        sheet.appendChild(viewBody);

        viewBtn.addEventListener('click', () => {
            const isOpen = viewBtn.classList.toggle('expanded');
            viewBody.classList.toggle('expanded', isOpen);
            viewBtn.setAttribute('aria-expanded', String(isOpen));
            try { localStorage.setItem('m3ps_view', isOpen ? 'open' : 'closed'); } catch (_) {}
        });

        // Футер: Настройки + Выйти
        PROFILE_MENU.footer.forEach(item => sheet.appendChild(makeRow(item)));

        document.body.appendChild(scrim);
        document.body.appendChild(sheet);
        bindSwipeToDismiss(sheet, () => closeProfileSheet(false));
    }

    let profileSheetOpenedWithPush = false;

    function openProfileSheet() {
        const info = getProfileInfo();

        // Если шит уже есть — проверяем не изменился ли статус авторизации.
        // Признак незалогиненного шита: нет #m3-profile-sheet-name (он создаётся только для залогиненных).
        const existingScrim = document.getElementById('m3-profile-scrim');
        const wasGuest = existingScrim && !document.getElementById('m3-profile-sheet-name');
        const isLoggedIn = info.isLoggedIn;

        if (existingScrim && wasGuest && isLoggedIn) {
            // Был гостевой шит, теперь залогинены — перестраиваем
            existingScrim.remove();
            const existingSheet = document.getElementById('m3-profile-sheet');
            if (existingSheet) existingSheet.remove();
            buildProfileSheet(info);
        } else if (!existingScrim) {
            buildProfileSheet(info);
        }

        const scrim = document.getElementById('m3-profile-scrim');
        const sheet = document.getElementById('m3-profile-sheet');
        if (!scrim || !sheet) return;
        if (scrim.classList.contains('open')) return;

        // Обновляем имя если стало доступно
        if (info.name) {
            const nameEl = document.getElementById('m3-profile-sheet-name');
            if (nameEl) nameEl.textContent = info.name;
        }
        try {
            history.pushState({ ficbookProfileSheet: true }, '');
            profileSheetOpenedWithPush = true;
        } catch (_) {
            profileSheetOpenedWithPush = false;
        }
        scrim.classList.add('open');
        sheet.classList.add('open');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    function closeProfileSheet(fromPopstate) {
        const scrim = document.getElementById('m3-profile-scrim');
        const sheet = document.getElementById('m3-profile-sheet');
        if (!scrim || !sheet) return;
        if (!scrim.classList.contains('open')) return;
        scrim.classList.remove('open');
        sheet.classList.remove('open');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        // Сброс раскрытых секций — схлопываем DOM и чистим localStorage
        sheet.querySelectorAll('.m3-profile-section-btn.expanded').forEach(btn => {
            btn.classList.remove('expanded');
            btn.setAttribute('aria-expanded', 'false');
        });
        sheet.querySelectorAll('.m3-profile-section-body.expanded').forEach(body => {
            body.classList.remove('expanded');
        });
        try {
            PROFILE_MENU.groups.forEach((_, idx) => localStorage.removeItem('m3ps_' + idx));
            localStorage.removeItem('m3ps_view');
        } catch (_) {}
        if (!fromPopstate && profileSheetOpenedWithPush) {
            profileSheetOpenedWithPush = false;
            history.back();
        } else {
            profileSheetOpenedWithPush = false;
        }
    }

    const TOP_CHIPS = [
        { label: 'Рекомендации', href: '/recommendation' },
        { label: 'Фанфики',      href: '/fanfiction' },
        { label: 'Авторы',       href: '/authors' },
        { label: 'ТОП',          href: '/popular-fanfics-376846' },
    ];

    function getActiveChip() {
        for (const chip of TOP_CHIPS) {
            if (path === chip.href || path.startsWith(chip.href + '/')) return chip.href;
        }
        return null;
    }

    function buildTopBar() {
        const bar = document.createElement('div');
        bar.id = 'm3-top-bar';

        // Чипы — левая часть (flex:1)
        const chipsRow = document.createElement('div');
        chipsRow.id = 'm3-chips-row';
        const activeHref = getActiveChip();
        TOP_CHIPS.forEach(chip => {
            const a = document.createElement('a');
            a.className = 'm3-chip' + (chip.href === activeHref ? ' is-active' : '');
            a.href = chip.href;
            a.textContent = chip.label;
            chipsRow.appendChild(a);
        });
        bar.appendChild(chipsRow);

        // Правая часть — placeholder кнопки поиска сразу + уведомления когда Vue смонтирует
        const searchRow = document.createElement('div');
        searchRow.id = 'm3-search-row';

        // Placeholder кнопки поиска — 44×44px как у уведомлений, заменится реальным .site-search
        const searchPlaceholder = document.createElement('div');
        searchPlaceholder.id = 'm3-search-placeholder';
        searchPlaceholder.innerHTML = SVG_SEARCH;
        searchRow.appendChild(searchPlaceholder);

        bar.appendChild(searchRow);

        return bar;
    }

    // ─── Bottom Nav ──────────────────────────────────────────────────────────────
    function getActiveTab() {
        if (path === '/' || path === '') return 'home';
        if (path.startsWith('/home/collections')) return 'collections';
        if (path.startsWith('/authors/')) return 'profile';
        return 'home';
    }

    function getProfileInfo() {
        // Когда залогинен, ficbook показывает .user-menu в .top-bar (всегда в DOM).
        // Внутри — img[alt] с именем пользователя и аватар.
        // a[href="/logout"] появляется только когда дропдаун открыт (v-if), поэтому не надёжен.
        const userMenu = document.querySelector('.top-bar .user-menu');
        const isLoggedIn = !!userMenu;

        let name = '';
        let href = '#';

        if (isLoggedIn) {
            // Имя из alt аватара
            const img = userMenu.querySelector('.user-avatar img, .avatar-cropper img');
            if (img && img.alt) name = img.alt.trim();

            // Slug из script-тега (window.ficbook недоступен в content script из-за изоляции)
            const ficbookScript = [...document.querySelectorAll('script')].find(s =>
                s.textContent.includes('window.ficbook') && s.textContent.includes('slug')
            );
            const slugMatch = ficbookScript?.textContent.match(/slug:\s*['"]([^'"]+)['"]/);
            const slug = slugMatch?.[1];
            if (slug) href = `/authors/${slug}`;
        }

        return { href, name, isLoggedIn };
    }

    const SVG_HOME = `<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;
    const SVG_COLLECTIONS = `<svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z"/></svg>`;

    function buildNav(profileInfo) {
        const active = getActiveTab();
        const nav = document.createElement('nav');
        nav.id = 'm3-bottom-nav';

        const tabs = [
            { id: 'home',        href: '/',                 label: 'Главная',              svg: SVG_HOME },
            { id: 'collections', href: '/home/collections', label: 'Сборники',             svg: SVG_COLLECTIONS },
            { id: 'profile',     href: null,                label: profileInfo.name || 'Профиль', svg: SVG_PROFILE },
        ];

        tabs.forEach(tab => {
            const a = document.createElement('a');
            a.href = tab.href || '#';
            a.dataset.tab = tab.id;
            if (tab.id === 'profile') {
                a.addEventListener('click', e => {
                    e.preventDefault();
                    const info = getProfileInfo();
                    if (!info.isLoggedIn) {
                        window.location.href = '/login';
                    } else {
                        openProfileSheet();
                    }
                });
            }
            if (tab.id === active) a.classList.add('is-active');

            const indicator = document.createElement('span');
            indicator.className = 'm3-nav-indicator';

            const iconWrap = document.createElement('span');
            iconWrap.className = 'm3-nav-icon';
            iconWrap.innerHTML = tab.svg;

            const label = document.createElement('span');
            label.className = 'm3-nav-label';
            label.textContent = tab.label;

            a.append(indicator, iconWrap, label);
            nav.appendChild(a);
        });

        return nav;
    }

    // ─── Init ────────────────────────────────────────────────────────────────────
    function init() {
        // Если наши элементы уже в DOM когда вызывается init — JS-процесс был
        // убит и восстановлен после блокировки экрана, listeners мертвы.
        // reload() убьёт наш DOM → следующий вызов init() пройдёт чисто.
        if (document.getElementById('m3-top-bar') || document.getElementById('m3-bottom-nav')) {
            location.reload();
            return;
        }
        removeAds();
        applyAllBlocks();
        tagCardsWithDirection();
        applyAllSpoilerTags();
        adObserver.observe(document.body, { childList: true, subtree: true });

        // Баннер "скачай приложение" — ищем по содержимому, не по Vue scoped hash
        // (hash вида data-v-* меняется при любом обновлении компонента ficbook)
        const appBannerEl = (() => {
            const a = document.querySelector('a[href*="play.google.com"], a[href*="apps.apple.com"]');
            return a ? a.closest('section, div[class], div[id]') : null;
        })();
        if (appBannerEl) {
            const w = new MutationObserver(() => {
                if (appBannerEl.children.length > 0) { appBannerEl.remove(); w.disconnect(); }
            });
            w.observe(appBannerEl, { childList: true });
            setTimeout(() => w.disconnect(), 15000);
        }

        if (!document.getElementById('m3-top-bar')) {
            const main = document.querySelector('main') || document.querySelector('.book-inner') || document.body;

            // Вставляем top bar немедленно — без ожидания Vue-компонентов.
            // Поиск и уведомления переместятся позже когда Vue их смонтирует.
            main.insertBefore(buildTopBar(), main.firstChild);
            revealPage();

            // Перемещаем .site-search и .d-contents (уведомления) в #m3-search-row
            // когда Vue их смонтирует. Ficbook использует эти классы (не устаревшие
            // .header-search / .vue-dropdown).
            const attachTopBarActions = () => {
                const searchRow = document.getElementById('m3-search-row');
                if (!searchRow) return false;
                const topBarActions = document.querySelector('.top-bar .top-bar-actions');
                if (!topBarActions) return false;

                const siteSearch = topBarActions.querySelector('.site-search');
                const dContents = topBarActions.querySelector('.d-contents');

                if (siteSearch && !searchRow.contains(siteSearch)) {
                    searchRow.insertBefore(siteSearch, searchRow.firstChild);
                    document.getElementById('m3-search-placeholder')?.remove();
                }
                if (dContents && !searchRow.contains(dContents)) {
                    searchRow.appendChild(dContents);
                }
                // Отключаем только когда оба на месте
                return searchRow.contains(siteSearch) && searchRow.contains(dContents);
            };

            if (!attachTopBarActions()) {
                const actionsObs = new MutationObserver(() => {
                    if (attachTopBarActions()) actionsObs.disconnect();
                });
                actionsObs.observe(document.body, { childList: true, subtree: true });
                setTimeout(() => actionsObs.disconnect(), 10000);
            }
        } else {
            // top bar уже в DOM — страницу можно показывать немедленно
            revealPage();
        }

        if (!document.getElementById('m3-bottom-nav')) {
            const profileInfo = getProfileInfo();
            document.body.appendChild(buildNav(profileInfo));
            // Если Vue ещё не отрисовал ссылку профиля — ждём и обновляем имя/href.
            if (!profileInfo.name || profileInfo.href === '#') {
                let profileRetryTimer;
                const profileRetry = new MutationObserver(() => {
                    const info = getProfileInfo();
                    if (info.isLoggedIn) {
                        clearTimeout(profileRetryTimer);
                        profileRetry.disconnect();
                        const labelEl = document.querySelector('#m3-bottom-nav a[data-tab="profile"] .m3-nav-label');
                        if (labelEl && info.name) labelEl.textContent = info.name;
                    }
                });
                const topBar = document.querySelector('.top-bar');
                if (topBar) profileRetry.observe(topBar, { childList: true, subtree: true });
                profileRetryTimer = setTimeout(() => profileRetry.disconnect(), 10000);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
