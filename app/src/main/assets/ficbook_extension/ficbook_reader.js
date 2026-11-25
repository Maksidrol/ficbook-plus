(() => {
    'use strict';

    // Запускаемся только на реальных страницах чтения:
    // /readfic/{ficId}              — однотомное произведение
    // /readfic/{ficId}/{partId}     — глава (partId = UUID или число)
    // Служебные суффиксы (/thanks-author-page, /rate-page и т.п.) не совпадают.
    if (!/^\/readfic\/[^/?#]+(\/(?:[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\d+)(\/.*)?)?$/.test(window.location.pathname)) return;

    try { localStorage.setItem('darkTheme', '1'); } catch (_) {}

    try {
    const style = document.createElement('style');
    style.id = 'ficbook-m3-reader-styles';
    style.textContent = `:root{--m3-font-scale:1;--reader-font-size:19px;--reader-line-height:1.85;--reader-font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;--reader-text-align:justify;--reader-hyphens:none;--reader-bg:#141414;--reader-text:#E0E0E0;--md-surface:#000000;--md-surface-container:#1B1B1B;--md-surface-container-high:#2B2B2B;--md-primary:#D0BCFF;--md-primary-container:#4F378B;--md-on-primary-container:#EADDFF;--md-on-surface:#E6E1E5;--md-on-surface-variant:#9E9E9E;--md-error:#FFB4AB;--sat:env(safe-area-inset-top,0px);--sab:max(24px,env(safe-area-inset-bottom,0px));--sal:max(20px,env(safe-area-inset-left,0px));--sar:max(20px,env(safe-area-inset-right,0px))}html,body{background-color:var(--reader-bg) !important;background:var(--reader-bg) !important;margin:0 !important;padding:0 !important;width:100% !important;min-height:100vh !important;color:var(--reader-text) !important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif !important;-webkit-font-smoothing:antialiased !important;-webkit-tap-highlight-color:transparent !important;overflow-x:hidden !important}#clean-reader-container{display:block;width:100%;max-width:820px;min-height:100vh;margin:0 auto;box-sizing:border-box;overflow-x:hidden;background-color:var(--reader-bg);color:var(--reader-text);padding:var(--sat) max(20px,var(--sar)) max(110px,calc(90px + var(--sab))) max(20px,var(--sal));transition:opacity 0.2s ease}.fanfic-text-promo,.fanfic-text-promo-actions,.js-text-insert,.fb-ad-slot,.js-fb-ad-slot,.open-in-reader,.js-collapsible,.global-banner-2,iframe,app-install-ads{display:none !important}.m3-card{background:transparent !important;padding:6px 10px 18px 10px !important;margin:0 0 16px 0 !important;text-align:center !important;break-inside:avoid !important;page-break-inside:avoid !important;-webkit-column-break-inside:avoid !important;width:100% !important;box-sizing:border-box !important}.m3-fic-title{font-size:calc(var(--m3-font-scale,1)*13px) !important;font-weight:500 !important;color:var(--md-primary,#D0BCFF) !important;letter-spacing:0.2px !important;margin-bottom:6px !important;text-transform:uppercase !important;text-align:center !important;line-height:1.4 !important}.m3-part-title{font-size:calc(var(--m3-font-scale,1)*26px) !important;font-weight:700 !important;color:var(--reader-text) !important;margin:0 0 6px 0 !important;font-family:var(--reader-font-family) !important;text-align:center !important;line-height:1.3 !important}.m3-part-date{font-size:calc(var(--m3-font-scale,1)*12px) !important;color:var(--md-on-surface-variant,#9E9E9E) !important;text-align:center !important;line-height:1.4 !important}#clean-reader-container #content{background:transparent !important;font-family:var(--reader-font-family) !important;font-size:var(--reader-font-size) !important;line-height:var(--reader-line-height) !important;text-align:var(--reader-text-align) !important;text-justify:inter-word !important;hyphens:var(--reader-hyphens) !important;-webkit-hyphens:var(--reader-hyphens) !important;letter-spacing:0.01em !important;color:var(--reader-text) !important;word-break:break-word !important;white-space:pre-wrap !important;overflow-wrap:break-word !important;padding:6px 2px !important;user-select:text !important;-webkit-user-select:text !important}#clean-reader-container #content :is(p,span,div,a,b,strong,i,em,u,s,strike,sub,sup,li,td,th,.part-text):not(.m3-card,.m3-card *,.part-footnote,.footnote-link){font-size:inherit !important;line-height:inherit !important;font-family:inherit !important;color:inherit !important;hyphens:inherit !important;-webkit-hyphens:inherit !important}#clean-reader-container #content a,#clean-reader-container #content .part-footnote,#clean-reader-container #content .footnote-link{color:var(--md-primary,#D0BCFF) !important;text-decoration:underline !important;cursor:pointer !important}#clean-reader-container #content .part-footnote,#clean-reader-container #content .footnote-link{display:inline-block !important;min-width:28px !important;min-height:28px !important;padding:4px 6px !important;vertical-align:middle !important;line-height:1.2 !important;border-radius:4px !important;font-size:calc(var(--m3-font-scale,1)*13px) !important;font-weight:600 !important;touch-action:manipulation !important}#clean-reader-container #content blockquote{background-color:var(--md-surface-container,#1B1B1B) !important;border-left:3px solid var(--md-primary-container,#4F378B) !important;padding:10px 16px !important;margin:14px 0 !important;border-radius:4px !important;font-size:inherit !important;line-height:inherit !important}#clean-reader-container #content :is(img,picture,svg,table,video){max-width:100% !important;height:auto !important;break-inside:avoid !important;page-break-inside:avoid !important;-webkit-column-break-inside:avoid !important;box-sizing:border-box !important}body.is-paged-mode{overflow:hidden !important;height:100vh !important;height:100dvh !important;width:100vw !important}body.is-paged-mode #clean-reader-container{height:100vh !important;height:100dvh !important;max-height:100vh !important;max-height:100dvh !important;width:100vw !important;max-width:100vw !important;overflow:hidden !important;padding:var(--sat) var(--sar) var(--sab) var(--sal) !important;display:flex !important;flex-direction:column !important}body.is-paged-mode #clean-reader-container #content,body.is-paged-mode #content{flex:1 1 0px !important;width:100% !important;height:100% !important;min-height:0 !important;box-sizing:border-box !important;column-width:calc(100vw - var(--sal) - var(--sar)) !important;column-gap:0px !important;column-fill:auto !important;overflow-x:scroll !important;overflow-y:hidden !important;scroll-snap-type:none !important;scrollbar-width:none !important;padding:0 !important;margin:0 !important;word-break:break-word !important;overflow-wrap:break-word !important}body.is-paged-mode #clean-reader-container #content::-webkit-scrollbar,body.is-paged-mode #content::-webkit-scrollbar{display:none !important}body.is-paged-mode .m3-paged-touch-zones{touch-action:none !important}body.is-paged-mode .m3-fab{display:none !important}.m3-paged-touch-zones{position:fixed;inset:0;display:none;z-index:9980;pointer-events:auto;user-select:none;-webkit-user-select:none}body.is-paged-mode .m3-paged-touch-zones{display:block}.m3-bottom-sheet-scrim{position:fixed;inset:0;background-color:rgba(0,0,0,0.6);opacity:0;visibility:hidden;z-index:9998;transition:opacity 0.24s cubic-bezier(0.2,0,0,1),visibility 0.24s;touch-action:none;pointer-events:none}.m3-bottom-sheet-scrim.open{opacity:1;visibility:visible;pointer-events:auto}.m3-bottom-sheet{position:fixed;left:0;right:0;bottom:0;background-color:#1E1E1E;color:var(--md-on-surface);border-radius:28px 28px 0 0;z-index:9999;padding:0 16px max(16px,env(safe-area-inset-bottom,16px)) 16px;box-shadow:0 -4px 24px rgba(0,0,0,0.6);transform:translateY(105%);transition:transform 0.28s cubic-bezier(0.2,0,0,1),background-color 0.2s cubic-bezier(0.2,0,0,1),box-shadow 0.2s cubic-bezier(0.2,0,0,1);box-sizing:border-box;display:flex;flex-direction:column;max-height:90vh;pointer-events:none;touch-action:none}.m3-bottom-sheet.open{transform:translateY(0);pointer-events:auto;touch-action:pan-y}.m3-drag-handle-bar{width:100%;height:32px;display:flex;align-items:center;justify-content:center;cursor:grab;touch-action:none;flex-shrink:0;transition:opacity 0.2s cubic-bezier(0.2,0,0,1)}.m3-drag-handle{width:32px;height:4px;background-color:#555555;border-radius:2px}.m3-sheet-content{display:flex;flex-direction:column;gap:12px;width:100%;flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch}.m3-sheet-content > .m3-connected-group,.m3-sheet-content > .m3-toolbar-auto-grid{transition:opacity 0.2s cubic-bezier(0.2,0,0,1)}body.is-scrubbing .m3-bottom-sheet-scrim{opacity:0 !important;pointer-events:none !important}body.is-scrubbing .m3-bottom-sheet{background-color:transparent !important;box-shadow:none !important}body.is-scrubbing .m3-drag-handle-bar,body.is-scrubbing .m3-sheet-content > .m3-connected-group,body.is-scrubbing .m3-sheet-content > .m3-toolbar-auto-grid{opacity:0 !important;pointer-events:none !important}.m3-scrubber-dock{position:relative;width:100%;height:50px;background-color:#202020;border-radius:9999px;display:flex;align-items:center;padding:0 18px;box-sizing:border-box;box-shadow:0 4px 16px rgba(0,0,0,0.5);margin-bottom:4px}.m3-slider-track-wrap{position:relative;width:100%;height:28px;display:flex;align-items:center;touch-action:none}.m3-slider-track{position:relative;width:100%;height:12px;background-color:#3C3C3C;border-radius:9999px;overflow:hidden}.m3-slider-active-fill{position:absolute;top:0;left:0;bottom:0;width:0%;background-color:#FFFFFF;border-radius:9999px 0 0 9999px !important;pointer-events:none}.m3-slider-thumb-line{position:absolute;top:50%;left:0%;width:4px;height:24px;background-color:#FFFFFF;border-radius:2px;transform:translate(-50%,-50%);z-index:4;pointer-events:none}.m3-slider-ticks{position:absolute;inset:0;pointer-events:none;mix-blend-mode:difference;z-index:2}.m3-slider-tick{position:absolute;top:50%;width:4px;height:4px;border-radius:50%;background-color:#FFFFFF;transform:translate(-50%,-50%)}.m3-slider-bubble{position:absolute;bottom:40px;left:0%;transform:translateX(-50%) scale(0.85);background-color:#FFFFFF;color:#000000;font-size:calc(var(--m3-font-scale,1)*13px);font-weight:700;height:30px;min-width:32px;padding:0 8px;border-radius:9999px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.6);pointer-events:none;z-index:10;opacity:0;transition:opacity 0.15s,transform 0.15s;box-sizing:border-box;white-space:nowrap}.m3-slider-bubble.visible{opacity:1;transform:translateX(-50%) scale(1)}.m3-slider-native-input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:5;margin:0}.m3-fab{position:fixed;right:max(20px,var(--sar));bottom:max(24px,calc(16px + var(--sab)));z-index:9990;width:56px;height:56px;border-radius:16px;background-color:var(--md-surface-container-high,#2B2B2B);color:var(--md-on-surface,#E6E1E5);border:none;box-shadow:0 4px 18px rgba(0,0,0,0.65);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.2s cubic-bezier(0.2,0,0,1),background-color 0.15s;touch-action:manipulation}.m3-fab:active,.m3-fab:focus-visible{background-color:var(--md-primary-container,#4F378B);color:var(--md-on-primary-container,#EADDFF);transform:scale(0.92);outline:none}.m3-fab svg{width:24px;height:24px;fill:currentColor}.m3-connected-group{display:flex;width:100%;gap:2px}.m3-connected-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:44px;padding:0 10px;background-color:var(--md-surface-container-high,#2B2B2B);border:none;color:var(--md-on-surface,#E6E1E5);text-decoration:none;font-size:calc(var(--m3-font-scale,1)*13px);font-weight:500;box-sizing:border-box;touch-action:manipulation;user-select:none;cursor:pointer;transition:background 0.15s}.m3-connected-btn:first-child{border-radius:9999px 4px 4px 9999px}.m3-connected-btn:not(:first-child):not(:last-child){border-radius:4px}.m3-connected-btn:last-child{border-radius:4px 9999px 9999px 4px}.m3-connected-btn:active,.m3-connected-btn:focus-visible{background-color:var(--md-primary-container,#4F378B);color:var(--md-on-primary-container,#EADDFF);outline:none}.m3-connected-btn.disabled{opacity:0.38;pointer-events:none}.m3-connected-btn.icon-only{flex:0 0 56px;padding:0}.m3-connected-btn svg,.m3-standard-btn svg,.m3-split-btn-trailing svg,.m3-pull-indicator svg{width:18px;height:18px;fill:currentColor;flex-shrink:0}.m3-toolbar-auto-grid{display:flex;flex-wrap:wrap;gap:8px;width:100%;justify-content:center;align-items:center}.m3-grid-item{flex:1 1 calc(50% - 4px);min-width:calc(50% - 4px);max-width:calc(50% - 4px);display:flex;justify-content:center;align-items:center;position:relative;box-sizing:border-box}.m3-grid-item.full-width{flex:1 1 100%;min-width:100%;max-width:100%}.m3-split-stepper,.m3-split-button-container{position:relative;display:inline-flex;align-items:center;gap:2px;height:40px;width:100%}.m3-split-stepper-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;height:100%;padding:0 8px;background-color:var(--md-surface-container-high,#2B2B2B);border:none;color:var(--md-on-surface,#E6E1E5);font-size:calc(var(--m3-font-scale,1)*13px);font-weight:700;cursor:pointer;user-select:none;touch-action:manipulation}.m3-split-stepper-btn:active,.m3-split-stepper-btn:focus-visible{background-color:var(--md-primary-container,#4F378B);color:var(--md-on-primary-container,#EADDFF);outline:none}.m3-split-stepper-btn.left{border-radius:9999px 4px 4px 9999px}.m3-split-stepper-btn.right{border-radius:4px 9999px 9999px 4px}.m3-split-stepper-icon{font-size:calc(var(--m3-font-scale,1)*16px);line-height:1;display:inline-block}.m3-split-stepper-val{flex:1.2;display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0 6px;background-color:var(--md-surface-container-high,#2B2B2B);border-radius:4px;font-size:calc(var(--m3-font-scale,1)*13px);font-weight:500;color:var(--md-on-surface,#E6E1E5);box-sizing:border-box;white-space:nowrap}.m3-split-btn-leading{flex:1;display:inline-flex;align-items:center;height:100%;padding:0 12px;background-color:var(--md-surface-container-high,#2B2B2B);border-radius:9999px 4px 4px 9999px;color:var(--md-on-surface,#E6E1E5);font-size:calc(var(--m3-font-scale,1)*13px);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border:none;cursor:pointer;user-select:none;touch-action:manipulation;transition:background-color 0.15s;box-sizing:border-box}.m3-split-btn-leading:active,.m3-split-btn-leading:focus-visible{background-color:var(--md-primary-container,#4F378B);color:var(--md-on-primary-container,#EADDFF);outline:none}.m3-split-btn-trailing{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0 10px;background-color:var(--md-surface-container-high,#2B2B2B);border-radius:4px 9999px 9999px 4px;color:var(--md-on-surface,#E6E1E5);border:none;cursor:pointer;user-select:none;touch-action:manipulation;transition:background-color 0.15s;box-sizing:border-box}.m3-split-btn-trailing:active,.m3-split-btn-trailing:focus-visible{background-color:var(--md-primary-container,#4F378B);color:var(--md-on-primary-container,#EADDFF);outline:none}.m3-split-btn-trailing svg{width:18px;height:18px;fill:currentColor;flex-shrink:0;transform:rotate(0deg);transition:transform 0.25s cubic-bezier(0.2,0,0,1)}.m3-split-button-container.is-open .m3-split-btn-trailing svg{transform:rotate(180deg)}.m3-menu-dropdown{position:absolute;top:calc(100% + 4px);right:0;min-width:160px;max-width:240px;background-color:#282828;border-radius:16px;padding:6px 4px;box-shadow:0 8px 24px rgba(0,0,0,0.75);z-index:1000;display:flex;flex-direction:column;gap:2px;opacity:0;visibility:hidden;overflow:hidden;transform:scale(0.92);transform-origin:top right;transition:opacity 0.2s cubic-bezier(0.2,0,0,1),transform 0.2s cubic-bezier(0.2,0,0,1),visibility 0.2s;pointer-events:none;box-sizing:border-box}.m3-split-button-container.open-up .m3-menu-dropdown{top:auto;bottom:calc(100% + 4px);transform-origin:bottom right}.m3-split-button-container.is-open .m3-menu-dropdown{opacity:1;visibility:visible;transform:scale(1);pointer-events:auto}.m3-menu-item{display:flex;align-items:center;width:100%;min-height:40px;padding:8px 14px;border-radius:10px;border:none;background:transparent;color:var(--md-on-surface,#E6E1E5);font-size:calc(var(--m3-font-scale,1)*14px);font-weight:400;text-align:left;cursor:pointer;user-select:none;box-sizing:border-box;transition:background-color 0.15s;touch-action:manipulation}.m3-menu-item:hover,.m3-menu-item:focus-visible{background-color:rgba(255,255,255,0.08);outline:none}.m3-menu-item:active{background-color:var(--md-primary-container,#4F378B);color:var(--md-on-primary-container,#EADDFF)}.m3-menu-item.is-selected{background-color:rgba(255,255,255,0.14);font-weight:600;color:var(--md-primary,#D0BCFF)}.m3-standard-btn{width:100%;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:40px;padding:0 14px;border-radius:9999px;font-size:calc(var(--m3-font-scale,1)*13px);font-weight:500;cursor:pointer;user-select:none;border:none;background-color:var(--md-surface-container-high,#2B2B2B);color:var(--md-on-surface,#E6E1E5);transition:background-color 0.2s cubic-bezier(0.2,0,0,1);touch-action:manipulation;box-sizing:border-box}.m3-standard-btn.active{background-color:var(--md-primary-container,#4F378B);color:var(--md-on-primary-container,#EADDFF)}.m3-dialog-scrim{position:fixed;inset:0;background-color:rgba(0,0,0,0.7);z-index:10005;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;visibility:hidden;transition:opacity 0.2s cubic-bezier(0.2,0,0,1),visibility 0.2s;box-sizing:border-box}.m3-dialog-scrim.is-open{opacity:1;visibility:visible}.m3-dialog{background-color:#242424;border-radius:28px;padding:24px;width:100%;max-width:320px;box-shadow:0 12px 32px rgba(0,0,0,0.8);display:flex;flex-direction:column;gap:16px;transform:scale(0.92);transition:transform 0.2s cubic-bezier(0.2,0,0,1);box-sizing:border-box}.m3-dialog-scrim.is-open .m3-dialog{transform:scale(1)}.m3-dialog-title{font-size:calc(var(--m3-font-scale,1)*18px);font-weight:600;color:#FFFFFF;margin:0}.m3-dialog-field{display:flex;flex-direction:column;gap:6px}.m3-dialog-label{font-size:calc(var(--m3-font-scale,1)*12px);font-weight:500;color:rgba(255,255,255,0.7)}.m3-color-input-row{display:flex;align-items:center;gap:8px;background-color:#1A1A1A;border-radius:12px;padding:4px 10px;border:1px solid #333333}.m3-color-input-row:focus-within{border-color:var(--md-primary,#D0BCFF)}.m3-color-swatch{width:24px;height:24px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);flex-shrink:0}.m3-hex-input{flex:1;background:transparent;border:none;color:#FFFFFF;font-size:calc(var(--m3-font-scale,1)*14px);font-family:monospace;text-transform:uppercase;outline:none;padding:6px 0}.m3-dialog-preview{border-radius:12px;padding:12px 14px;font-size:calc(var(--m3-font-scale,1)*13px);line-height:1.4;border:1px solid rgba(255,255,255,0.1);transition:background-color 0.15s,color 0.15s;user-select:none}.m3-dialog-actions{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:8px}.m3-dialog-btn{background:transparent;border:none;color:var(--md-primary,#D0BCFF);font-size:calc(var(--m3-font-scale,1)*14px);font-weight:600;padding:8px 12px;border-radius:9999px;cursor:pointer;touch-action:manipulation;transition:background-color 0.15s}.m3-dialog-btn:hover,.m3-dialog-btn:focus-visible{background-color:rgba(255,255,255,0.08);outline:none}.m3-dialog-btn.reset{margin-right:auto;color:rgba(255,255,255,0.6)}.m3-toc-sheet{max-height:85vh;height:85vh;display:flex;flex-direction:column;padding-bottom:max(16px,var(--sab))}.m3-chapters-list-wrapper{position:relative;flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 8px 120px 8px;box-sizing:border-box;display:flex;flex-direction:column;gap:4px;width:100%;scroll-behavior:auto;scrollbar-width:none;-ms-overflow-style:none}.m3-chapters-list-wrapper::-webkit-scrollbar{display:none}.m3-ch-item{display:flex;flex-direction:row;align-items:center;gap:8px;min-height:52px;padding:8px 16px;border-radius:16px;text-decoration:none;color:var(--md-on-surface);background-color:transparent;box-sizing:border-box;transition:background-color 0.15s cubic-bezier(0.2,0,0,1);cursor:pointer;user-select:none}.m3-ch-item-info-col{display:flex;flex-direction:column;justify-content:center;flex:1;min-width:0}@media (hover:hover) and (pointer:fine){.m3-ch-item:hover{background-color:var(--md-surface-container-high)}}.m3-ch-item:focus-visible{outline:none;background-color:var(--md-surface-container-high)}.m3-ch-item.is-selected{background-color:var(--md-surface-container-high);font-weight:600;color:#FFFFFF}.m3-ch-item-title{font-size:calc(var(--m3-font-scale,1)*15px);font-weight:500;color:var(--md-on-surface);line-height:1.3}.m3-ch-item-sub{font-size:calc(var(--m3-font-scale,1)*12px);color:var(--md-on-surface-variant);line-height:1.3;margin-top:3px}.m3-toc-slider-dock{position:absolute;bottom:max(20px,calc(10px + var(--sab)));left:50%;transform:translateX(-50%);width:calc(100% - 32px);max-width:440px;height:50px;background-color:#202020;border-radius:9999px;display:flex;align-items:center;padding:0 18px;box-sizing:border-box;box-shadow:0 8px 24px rgba(0,0,0,0.85);z-index:10}.m3-toc-message{text-align:center;margin-top:40px;color:var(--md-on-surface-variant);font-size:calc(var(--m3-font-scale,1)*14px)}.m3-pull-indicator{position:fixed;z-index:99997;display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:9999px;background-color:#202020;color:var(--md-on-surface);font-size:calc(var(--m3-font-scale,1)*13px);font-weight:500;box-shadow:0 6px 20px rgba(0,0,0,0.75);opacity:0;pointer-events:none;transition:opacity 0.15s,transform 0.15s,background-color 0.2s,color 0.2s}.m3-pull-indicator.top{top:var(--sat);left:50%;transform:translateX(-50%) scale(0.85)}.m3-pull-indicator.bottom{bottom:max(24px,calc(16px + var(--sab)));left:50%;transform:translateX(-50%) scale(0.85)}.m3-pull-indicator.top.visible,.m3-pull-indicator.bottom.visible{opacity:1;transform:translateX(-50%) scale(1)}.m3-pull-indicator.left{left:var(--sal);top:50%;transform:translateY(-50%) scale(0.85)}.m3-pull-indicator.right{right:var(--sar);top:50%;transform:translateY(-50%) scale(0.85)}.m3-pull-indicator.left.visible,.m3-pull-indicator.right.visible{opacity:1;transform:translateY(-50%) scale(1)}.m3-pull-indicator.active{background-color:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:600}.m3-footnote-scrim{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:100000;opacity:0;pointer-events:none;transition:opacity 0.2s cubic-bezier(0.2,0,0,1)}.m3-footnote-scrim.open{opacity:1;pointer-events:auto}.m3-footnote-dialog{position:fixed;left:50%;bottom:max(24px,calc(16px + var(--sab)));transform:translate(-50%,20px) scale(0.95);width:calc(100% - 32px);max-width:520px;background-color:#2B2B2B !important;color:#E6E1E5 !important;border-radius:20px;padding:16px 20px;box-sizing:border-box;box-shadow:0 8px 30px rgba(0,0,0,0.75);z-index:100001;opacity:0;pointer-events:none;transition:opacity 0.2s cubic-bezier(0.2,0,0,1),transform 0.2s cubic-bezier(0.2,0,0,1)}.m3-footnote-dialog.open{opacity:1;pointer-events:auto;transform:translate(-50%,0) scale(1)}.m3-footnote-title{font-size:calc(var(--m3-font-scale,1)*13px);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--md-primary);margin-bottom:8px}.m3-footnote-body{font-size:calc(var(--m3-font-scale,1)*15px);line-height:1.5;color:#E6E1E5 !important;word-break:break-word;max-height:40vh;overflow-y:auto}#m3-book-card-root{--card-dock-collapsed:calc(70px + var(--sab));position:fixed;inset:0;z-index:5000;overflow-y:auto;-webkit-overflow-scrolling:touch;background-color:var(--reader-bg);color:var(--reader-text);box-sizing:border-box;overflow-x:hidden}.modal,.modal-backdrop,.v-overlay__content,.v-dialog,dialog,.dialog-frame-root{z-index:6000!important}.modal-open{overflow:hidden!important}.m3-card-page{width:100%;max-width:680px;margin:0 auto;padding:calc(var(--sat) + 52px) max(16px,var(--sar)) calc(var(--card-dock-collapsed) + 16px) max(16px,var(--sal));box-sizing:border-box;display:flex;flex-direction:column;gap:16px}.m3-card-top-bar{position:fixed;top:0;left:0;right:0;z-index:9980;display:flex;justify-content:space-between;align-items:center;width:100%;max-width:680px;margin:0 auto;padding:calc(var(--sat) + 6px) max(16px,var(--sar)) 10px max(16px,var(--sal));box-sizing:border-box;background:linear-gradient(var(--reader-bg) 60%,rgba(0,0,0,0));pointer-events:none}.m3-card-top-bar-actions{display:flex;gap:4px}.m3-card-top-bar-btn{width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,0.28);border:none;color:var(--md-on-surface,#E6E1E5);display:flex;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation;pointer-events:auto;text-decoration:none;backdrop-filter:blur(6px)}.m3-card-top-bar-btn svg{width:20px;height:20px;fill:currentColor}.m3-card-top-bar-btn:active{background:rgba(0,0,0,0.5)}.m3-card-snackbar{position:fixed;bottom:calc(var(--card-dock-collapsed) + 20px);left:50%;transform:translate(-50%,16px);background:var(--md-surface-container-high,#2B2B2B);color:var(--md-on-surface,#E6E1E5);font-size:calc(var(--m3-font-scale,1)*13.5px);padding:10px 18px;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,0.55);z-index:9995;opacity:0;transition:opacity 0.22s ease,transform 0.22s ease;pointer-events:none;white-space:nowrap}.m3-card-snackbar.visible{opacity:1;transform:translate(-50%,0)}.m3-card-special-badges{display:flex;flex-wrap:wrap;gap:6px}.m3-card-badge{display:inline-flex;align-items:center;gap:4px;border-radius:8px;padding:3px 8px;font-size:calc(var(--m3-font-scale,1)*11.5px);font-weight:600;width:fit-content}.m3-card-badge-hot{background-color:rgba(255,138,101,0.16);color:#FF8A65;border:1px solid rgba(255,138,101,0.35)}.m3-card-badge-award{background-color:rgba(255,193,7,0.12);color:#FFC107;border:1px solid rgba(255,193,7,0.3)}.m3-card-hero{position:relative;padding:2px 0 8px}.m3-card-hero-content{display:flex;gap:16px}.m3-card-cover{width:105px;height:155px;border-radius:12px;overflow:hidden;flex-shrink:0;box-shadow:0 10px 24px rgba(0,0,0,0.7);border:1px solid rgba(255,255,255,0.1);background:var(--md-surface-container,#1B1B1B)}.m3-card-cover img{width:100%;height:100%;object-fit:cover;display:block}.m3-card-cover.is-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:linear-gradient(150deg,var(--md-surface-container-high,#2B2B2B),rgba(208,188,255,0.18));color:var(--md-primary,#D0BCFF)}.m3-card-cover.is-placeholder svg{width:40px;height:40px;fill:currentColor;opacity:0.85}.m3-card-cover-monogram{font-size:calc(var(--m3-font-scale,1)*26px);font-weight:700;line-height:1;color:var(--md-on-surface,#E6E1E5);opacity:0.9}.m3-card-title-col{display:flex;flex-direction:column;gap:12px;min-width:0;justify-content:center}.m3-card-work-title{font-size:calc(var(--m3-font-scale,1)*22px);font-weight:700;line-height:1.25;margin:0;overflow-wrap:break-word}.m3-card-creators{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0}.m3-card-creator-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.06);border-radius:9999px;padding:3px 10px 3px 3px;text-decoration:none;color:inherit}.m3-card-creator-chip:active{opacity:0.8}.m3-card-creator-avatar{width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0}.m3-card-creator-avatar.is-fallback{background:linear-gradient(135deg,var(--md-primary,#D0BCFF),var(--md-surface-container-high,#2B2B2B))}.m3-card-creator-name{font-size:calc(var(--m3-font-scale,1)*12.5px);font-weight:500;color:var(--md-on-surface,#E6E1E5);white-space:nowrap}.m3-card-creator-role{font-size:calc(var(--m3-font-scale,1)*10.5px);font-weight:600;color:var(--md-primary,#D0BCFF);background:rgba(208,188,255,0.12);border-radius:6px;padding:1px 5px;white-space:nowrap}.m3-card-metadata{background:var(--md-surface-container,#1B1B1B);border-radius:16px;padding:14px 16px;display:grid;grid-template-columns:100px 1fr;row-gap:8px;column-gap:12px;font-size:calc(var(--m3-font-scale,1)*13.5px);border:1px solid rgba(255,255,255,0.04)}.m3-card-meta-key{color:var(--md-on-surface-variant,#9E9E9E)}.m3-card-meta-val{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.m3-card-meta-val.is-truncated{cursor:pointer;touch-action:manipulation}.m3-card-meta-val.is-truncated::after{content:'';display:inline-block;width:12px;height:12px;margin-left:4px;vertical-align:-1px;flex-shrink:0;color:var(--md-on-surface-variant,#9E9E9E);background:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239E9E9E'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") center / contain no-repeat}.m3-card-meta-val.expanded{white-space:normal;text-overflow:clip;overflow-wrap:break-word}.m3-card-meta-val.expanded::after{transform:rotate(180deg)}.m3-card-section{display:flex;flex-direction:column}.m3-card-section-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}.m3-card-section-title{font-size:calc(var(--m3-font-scale,1)*15px);font-weight:600}.m3-card-link-action{background:none;border:none;color:var(--md-primary,#D0BCFF);font-size:calc(var(--m3-font-scale,1)*13px);font-weight:600;cursor:pointer;padding:4px 0}.m3-card-description-text{font-size:calc(var(--m3-font-scale,1)*14px);line-height:1.5;color:var(--md-on-surface,#E6E1E5);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.m3-card-description-text.expanded{-webkit-line-clamp:unset;display:block}.m3-card-description-text p{margin:0 0 8px 0}.m3-card-tags{display:flex;flex-wrap:wrap;gap:6px}.m3-card-tag{background:var(--md-surface-container,#1B1B1B);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:var(--md-on-surface,#E6E1E5);padding:5px 10px;font-size:calc(var(--m3-font-scale,1)*12.5px);user-select:none;-webkit-user-select:none;text-decoration:none;display:inline-block}.m3-card-tag.is-adult-tag{border:1px solid rgba(255,180,171,0.6);background-color:rgba(255,80,80,0.06);color:#FFB4AB}.m3-card-tag.is-hidden-tag{filter:blur(4px);cursor:pointer;touch-action:manipulation}.m3-card-tag.is-spoiler-revealed{background:#1A2A1A;border-color:#2A4A2A;color:#80C080}.m3-card-dock-scrim{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:9990;opacity:0;pointer-events:none;transition:opacity 0.3s}.m3-card-dock-scrim.visible{opacity:1;pointer-events:auto}.m3-card-dock{position:fixed;bottom:0;left:0;right:0;height:var(--card-dock-collapsed);background:var(--md-surface-container,#1B1B1B);border-radius:20px 20px 0 0;box-shadow:0 -8px 32px rgba(0,0,0,0.7);z-index:9991;display:flex;flex-direction:column;transition:height 0.35s cubic-bezier(0.2,0,0,1);padding-bottom:var(--sab);box-sizing:border-box;overflow:hidden !important}.m3-card-dock:not(.expanded):not(.is-dragging) .m3-card-dock-chapters,.m3-card-dock:not(.expanded):not(.is-dragging) .m3-card-dock-feedback,.m3-card-dock:not(.expanded):not(.is-dragging) .m3-card-dock-collections{display:none !important}.m3-card-dock.expanded{height:65vh}.m3-card-dock-handle{width:100%;height:16px;display:flex;justify-content:center;align-items:center;cursor:pointer;flex-shrink:0;touch-action:none}.m3-card-dock-drag-pill{width:36px;height:4px;border-radius:2px;background:var(--md-on-surface-variant,#9E9E9E)}.m3-card-dock-controls{min-height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 16px 6px;flex-shrink:0;box-sizing:border-box;touch-action:none;flex-wrap:wrap}.m3-card-dock-btn-group{display:flex;gap:8px}.m3-card-dock-icon-btn{width:40px;height:40px;border-radius:50%;background:none;border:none;color:var(--md-on-surface,#E6E1E5);display:flex;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation}.m3-card-dock-icon-btn svg{width:22px;height:22px;fill:currentColor}.m3-card-dock-icon-btn:active{background:var(--md-surface-container-high,#2B2B2B)}.m3-card-dock-icon-btn.is-active-tab{background:var(--md-surface-container-high,#2B2B2B)}.m3-card-dock-tab-badge{position:absolute;top:2px;right:2px;min-width:15px;height:15px;border-radius:9999px;background:var(--md-primary,#D0BCFF);color:#121212;font-size:calc(var(--m3-font-scale,1)*10px);font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 3px}.m3-card-dock-icon-btn{position:relative}.m3-card-dock-icon-btn[disabled]{opacity:0.35;cursor:default}.m3-card-dock-read-pill{background:var(--md-primary,#D0BCFF);color:#121212;border-radius:9999px;padding:8px 16px;font-size:calc(var(--m3-font-scale,1)*14px);font-weight:600;border:none;cursor:pointer;text-decoration:none;touch-action:manipulation;display:inline-flex;align-items:center;gap:4px}.m3-card-dock-read-pill:active{filter:brightness(1.1)}.m3-card-dock-read-action-pill{background:var(--md-surface-container-high,#2B2B2B);color:var(--md-on-surface,#E6E1E5);border:1px solid rgba(255,255,255,0.14);border-radius:9999px;padding:6px 14px;font-size:calc(var(--m3-font-scale,1)*13px);font-weight:500;cursor:pointer;touch-action:manipulation;display:inline-flex;align-items:center;gap:6px;margin-top:6px;width:100%;justify-content:center}.m3-card-dock-read-action-pill:active{opacity:0.7}.m3-card-dock-read-action-pill svg{width:16px;height:16px;flex-shrink:0}.m3-card-dock-chapters{flex:1;overflow-y:auto;padding:6px 16px 12px;display:flex;flex-direction:column}.m3-card-dock-chapter{padding:12px 4px;border-radius:6px;text-decoration:none;color:inherit;display:flex;flex-direction:column;gap:4px;touch-action:manipulation}.m3-card-dock-chapter:active{background:var(--md-surface-container-high,#2B2B2B)}.m3-card-dock-chapter.is-resume{background:var(--md-primary-container,#4F378B)}.m3-card-dock-chapter.is-resume:active{background:var(--md-primary-container,#4F378B)}.m3-card-dock-chapter-title{font-size:calc(var(--m3-font-scale,1)*14px);font-weight:500;color:var(--md-on-surface,#E6E1E5)}.m3-card-dock-chapter.is-resume .m3-card-dock-chapter-title,.m3-card-dock-chapter.is-resume .m3-card-dock-chapter-info{color:var(--md-on-primary-container,#EADDFF)}.m3-card-dock-chapter-info{font-size:calc(var(--m3-font-scale,1)*12px);color:var(--md-on-surface-variant,#9E9E9E)}.m3-card-dock-chapters-empty{padding:16px 4px;font-size:calc(var(--m3-font-scale,1)*13px);color:var(--md-on-surface-variant,#9E9E9E);text-align:center}.m3-card-dock-feedback{flex:1;overflow-y:auto;padding:6px 16px 12px;display:none;flex-direction:column;gap:12px}.m3-card-dock.tab-feedback .m3-card-dock-feedback{display:flex}.m3-card-dock.tab-feedback .m3-card-dock-chapters{display:none}.m3-card-dock-feedback-stats{display:flex !important;flex-wrap:nowrap !important;gap:6px !important;width:100% !important}.m3-card-dock-feedback-capsule{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:1 1 0 !important;min-width:0 !important;background:var(--md-surface-container-high,#2B2B2B);border:1px solid rgba(255,255,255,0.14);border-radius:9999px;padding:5px 8px}.m3-card-dock-feedback-capsule.is-interactive{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent}.m3-card-dock-feedback-capsule.is-interactive:active{opacity:0.7}.m3-card-dock-feedback-capsule-icon{display:inline-flex;flex-shrink:0;color:var(--md-on-surface-variant,#9E9E9E)}.m3-card-dock-feedback-capsule-icon svg{width:14px;height:14px;fill:currentColor}.m3-card-dock-feedback-capsule-value{font-size:calc(var(--m3-font-scale,1)*13px);font-weight:700;color:var(--md-on-surface,#E6E1E5)}.m3-card-dock-feedback-capsule.is-active{border-color:var(--md-primary,#D0BCFF)}.m3-card-dock-feedback-capsule.is-active .m3-card-dock-feedback-capsule-icon{color:var(--md-primary,#D0BCFF)}.m3-card-dock-feedback-awards{display:flex;flex-direction:column}.m3-card-dock-comments-header{display:flex;align-items:center;gap:10px;padding-top:4px}.m3-card-dock-comments-header::before{content:'';flex:1;height:1px;background:rgba(255,255,255,0.08)}.m3-card-dock-comments-title{font-size:calc(var(--m3-font-scale,1)*13px);font-weight:600;color:var(--md-on-surface-variant,#9E9E9E)}.m3-card-dock-comments-list{display:flex;flex-direction:column;gap:10px;min-height:40px}.m3-card-dock-comment{display:flex;flex-direction:column;gap:6px;background:rgba(255,255,255,0.04);border-radius:12px;padding:10px 12px}.m3-card-dock-comment-header{display:flex;align-items:center;gap:8px}.m3-card-dock-comment-avatar{width:26px;height:26px;border-radius:50%;object-fit:cover;flex-shrink:0}.m3-card-dock-comment-avatar.is-fallback{background:linear-gradient(135deg,var(--md-primary,#D0BCFF),var(--md-surface-container-high,#2B2B2B))}.m3-card-dock-comment-meta{display:flex;flex-direction:column;min-width:0}.m3-card-dock-comment-author{font-size:calc(var(--m3-font-scale,1)*13px);font-weight:600;color:var(--md-on-surface,#E6E1E5);text-decoration:none}a.m3-card-dock-comment-author:active{opacity:0.75}.m3-card-dock-comment-date{font-size:calc(var(--m3-font-scale,1)*11px);color:var(--md-on-surface-variant,#9E9E9E)}.m3-card-dock-comment-body{font-size:calc(var(--m3-font-scale,1)*13px);line-height:1.5;color:var(--md-on-surface,#E6E1E5);word-break:break-word;overflow-wrap:break-word}.m3-card-dock-comment-body p{margin:0 0 6px 0}.m3-card-dock-comment-body p:last-child{margin-bottom:0}.m3-card-dock-award{display:flex;gap:10px;padding:12px 4px;border-radius:6px}.m3-card-dock-award-icon{display:inline-flex;flex-shrink:0;color:var(--md-on-surface-variant,#9E9E9E)}.m3-card-dock-award-icon svg{width:20px;height:20px;fill:currentColor}.m3-card-dock-award-body{display:flex;flex-direction:column;gap:2px;min-width:0}.m3-card-dock-award-title{font-size:calc(var(--m3-font-scale,1)*14px);font-weight:600;color:var(--md-on-surface,#E6E1E5);word-break:break-word}.m3-card-dock-award-giver{font-size:calc(var(--m3-font-scale,1)*12px);color:var(--md-on-surface-variant,#9E9E9E)}.m3-card-dock-award-comment{font-size:calc(var(--m3-font-scale,1)*12.5px);font-style:italic;line-height:1.4;color:var(--md-on-surface-variant,#9E9E9E);word-break:break-word}.m3-card-dock-reward-btn{margin:10px 4px 4px;align-self:center;display:inline-flex;align-items:center;gap:6px;background:var(--md-primary,#D0BCFF);color:#121212;border-radius:9999px;padding:9px 22px;font-size:calc(var(--m3-font-scale,1)*14px);font-weight:600;border:none;cursor:pointer;text-decoration:none;touch-action:manipulation}.m3-card-dock-reward-btn svg{width:16px;height:16px;fill:currentColor}.m3-card-dock-reward-btn:active{filter:brightness(1.1)}.m3-card-notes-text{font-size:calc(var(--m3-font-scale,1)*13.5px);line-height:1.5;color:var(--md-on-surface,#E6E1E5);padding:8px 0}.m3-card-dedication{border-left:3px solid var(--md-primary,#D0BCFF);padding-left:12px}.m3-card-dedication-text{margin:0;font-size:calc(var(--m3-font-scale,1)*14px);line-height:1.5;font-style:italic;color:var(--md-on-surface,#E6E1E5)}.m3-card-promo{border:1px solid rgba(255,193,7,0.4);background:rgba(255,193,7,0.05);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:6px}.m3-card-promo-badge{align-self:flex-start;font-size:calc(var(--m3-font-scale,1)*10.5px);font-weight:700;letter-spacing:0.06em;color:#FFC107;background:rgba(255,193,7,0.14);border-radius:6px;padding:2px 7px}.m3-card-promo-text{font-size:calc(var(--m3-font-scale,1)*13.5px);line-height:1.5;font-style:italic;color:var(--md-on-surface,#E6E1E5)}.m3-card-promo-text p{margin:0}.m3-card-promo-carousel-wrap{display:flex;flex-direction:column;gap:8px;width:100%}.m3-card-promo-carousel{display:flex;gap:12px;overflow-x:auto;padding:4px 2px 10px 2px;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}.m3-card-promo-carousel::-webkit-scrollbar{display:none}.m3-card-promo-item{flex:0 0 100px;width:100px;max-width:100px;min-width:0;overflow:hidden;display:flex;flex-direction:column;gap:6px;text-decoration:none;color:var(--md-on-surface,#E6E1E5);scroll-snap-align:start}.m3-card-promo-cover-wrap{position:relative;width:100px;height:145px;flex-shrink:0}.m3-card-promo-cover{width:100px;height:145px;border-radius:10px;object-fit:cover;background:var(--md-surface-container,#1B1B1B);box-shadow:0 4px 12px rgba(0,0,0,0.5);display:block}.m3-card-promo-cover.is-placeholder{background:linear-gradient(150deg,var(--md-surface-container-high,#2B2B2B),rgba(208,188,255,0.18))}.m3-card-promo-direction{position:absolute;top:6px;left:6px;width:8px;height:8px;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.6)}.m3-card-promo-direction.direction-slash{background:#7C9CFF}.m3-card-promo-direction.direction-het{background:#FF8A65}.m3-card-promo-direction.direction-gen{background:#81C784}.m3-card-promo-direction.direction-femslash{background:#F06292}.m3-card-promo-direction.direction-mixed{background:#FFD54F}.m3-card-promo-title{font-size:calc(var(--m3-font-scale,1)*12.5px);font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.m3-card-promo-fandom{display:block;width:100%;max-width:100%;min-width:0;font-size:calc(var(--m3-font-scale,1)*11px);color:var(--md-on-surface-variant,#9E9E9E);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m3-card-dock-collections{flex:1;overflow-y:auto;padding:16px;display:none;flex-direction:column;gap:12px}.m3-card-dock.tab-collections .m3-card-dock-collections{display:flex}.m3-card-dock.tab-collections .m3-card-dock-chapters,.m3-card-dock.tab-collections .m3-card-dock-feedback{display:none}.m3-card-dock-add-collection-btn{align-self:center;background:var(--md-primary,#D0BCFF);color:#121212;border-radius:9999px;padding:9px 22px;font-size:calc(var(--m3-font-scale,1)*14px);font-weight:600;border:none;cursor:pointer;touch-action:manipulation}.m3-card-dock-add-collection-btn:active{filter:brightness(1.1)}.m3-card-dock-collections-list{display:flex;flex-direction:column;min-height:60px}.m3-card-dock-collections-loading{padding:20px 4px;font-size:calc(var(--m3-font-scale,1)*13px);color:var(--md-on-surface-variant,#9E9E9E);text-align:center}.m3-card-dock-collection-item{display:flex;flex-direction:column;gap:4px;padding:12px 4px;border-bottom:1px solid rgba(255,255,255,0.06)}.m3-card-dock-collection-item:last-child{border-bottom:none}.m3-card-dock-collection-row{display:flex;align-items:baseline;justify-content:space-between;gap:8px;text-decoration:none;color:inherit;touch-action:manipulation}.m3-card-dock-collection-row:active{opacity:0.75}.m3-card-dock-collection-title{font-size:calc(var(--m3-font-scale,1)*14px);font-weight:600;color:var(--md-on-surface,#E6E1E5);word-break:break-word}.m3-card-dock-collection-count{display:inline-flex;align-items:center;gap:4px;font-size:calc(var(--m3-font-scale,1)*12px);color:var(--md-on-surface-variant,#9E9E9E);white-space:nowrap;flex-shrink:0}.m3-card-dock-collection-count svg{width:13px;height:13px;fill:currentColor}.m3-card-dock-collection-author{display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:inherit;align-self:flex-start;border-radius:9999px;padding:2px 8px 2px 2px;touch-action:manipulation}.m3-card-dock-collection-author:active{opacity:0.75}.m3-card-dock-collection-avatar{width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0}.m3-card-dock-collection-avatar.is-fallback{background:linear-gradient(135deg,var(--md-primary,#D0BCFF),var(--md-surface-container-high,#2B2B2B))}.m3-card-dock-collection-author-name{font-size:calc(var(--m3-font-scale,1)*12px);font-weight:500;color:var(--md-on-surface-variant,#9E9E9E)}.m3-card-dock-collection-desc{font-size:calc(var(--m3-font-scale,1)*12.5px);line-height:1.4;color:var(--md-on-surface-variant,#9E9E9E);font-style:italic;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.m3-ch-progress-wrap{position:relative;flex:0 0 24px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.m3-ch-progress-svg{width:24px;height:24px;transform:rotate(-90deg);display:block}.m3-ch-progress-track{stroke:rgba(255,255,255,0.18);fill:none;stroke-width:3.2}.m3-ch-progress-fill{stroke:var(--md-primary,#D0BCFF);fill:none;stroke-width:3.2;stroke-linecap:round;transition:stroke-dashoffset 0.25s ease}.m3-ch-progress-completed{stroke:var(--md-primary,#D0BCFF);fill:none;stroke-width:3.2}.m3-ch-progress-wrap.is-clearable{cursor:pointer;border-radius:50%}.m3-ch-progress-wrap.is-clearable:focus-visible{outline:2px solid var(--md-primary,#D0BCFF);outline-offset:2px}.m3-ch-progress-clear{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;color:var(--md-on-surface,#E6E0E9);transition:opacity 0.15s ease}.m3-ch-progress-clear svg{width:15px;height:15px;display:block}.m3-ch-progress-wrap.is-clearable:hover .m3-ch-progress-svg,.m3-ch-progress-wrap.is-clearable:focus-visible .m3-ch-progress-svg{opacity:0.2}.m3-ch-progress-wrap.is-clearable:hover .m3-ch-progress-clear,.m3-ch-progress-wrap.is-clearable:focus-visible .m3-ch-progress-clear,.m3-ch-progress-wrap.is-clearable.is-armed .m3-ch-progress-clear{opacity:1;pointer-events:auto}.m3-ch-progress-wrap.is-clearable.is-armed .m3-ch-progress-svg{opacity:0.2}.m3-resume-banner{display:flex;align-items:center;gap:4px;padding:6px 6px 6px 14px;border-radius:9999px;background-color:#202020;color:var(--md-on-surface);box-shadow:0 6px 20px rgba(0,0,0,0.75);box-sizing:border-box}.m3-resume-banner-reader{position:fixed;right:max(20px,var(--sar));bottom:max(92px,calc(84px + var(--sab)));z-index:9985;max-width:calc(100vw - 40px)}.m3-resume-banner-card{margin:8px 16px 0;max-width:100%}.m3-resume-banner-action{display:inline-flex;align-items:center;gap:8px;min-width:0;flex:1 1 auto;padding:6px 0;border:none;background:none;color:inherit;font-size:calc(var(--m3-font-scale,1)*13px);font-weight:500;font-family:inherit;cursor:pointer;text-align:left}.m3-resume-banner-action svg{width:18px;height:18px;flex-shrink:0;fill:currentColor}.m3-resume-banner-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.m3-resume-banner-close{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:32px;height:32px;padding:0;border:none;border-radius:50%;background:none;color:var(--md-on-surface-variant);cursor:pointer;transition:background-color 0.15s,color 0.15s}.m3-resume-banner-close svg{width:18px;height:18px;fill:currentColor}.m3-resume-banner-close:hover{background-color:rgba(255,255,255,0.08);color:var(--md-on-surface)}.m3-resume-banner-close:focus-visible,.m3-resume-banner-action:focus-visible{outline:2px solid var(--md-primary,#D0BCFF);outline-offset:2px;border-radius:9999px}.m3-dialog-helper-text{font-size:calc(var(--m3-font-scale,1)*11.5px);line-height:1.4;color:var(--md-on-surface-variant,#9E9E9E);margin:0}.m3-standard-btn.disabled{pointer-events:none;opacity:0.38}.m3-tap-zones-dialog{max-width:360px;width:100%}.m3-tap-zones-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}.m3-zone-card{background-color:#1A1A1A;border:1px solid #333333;border-radius:14px;padding:8px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;user-select:none;touch-action:manipulation;transition:border-color 0.15s,background-color 0.15s}.m3-zone-card:hover,.m3-zone-card:focus-visible{background-color:rgba(255,255,255,0.05);outline:none}.m3-zone-card.is-selected{border-color:var(--md-primary,#D0BCFF);background-color:rgba(208,188,255,0.08)}.m3-zone-schematic{width:100%;height:52px;border-radius:6px;overflow:hidden;display:flex;border:1px solid rgba(255,255,255,0.12)}.m3-zone-col{display:flex;align-items:center;justify-content:center;font-size:calc(var(--m3-font-scale,1)*10px);font-weight:700;line-height:1;text-transform:uppercase;overflow:hidden;white-space:nowrap}.m3-zone-col.prev{background-color:rgba(255,255,255,0.07);color:var(--md-on-surface-variant,#9E9E9E)}.m3-zone-col.next{background-color:var(--md-primary-container,#4F378B);color:var(--md-on-primary-container,#EADDFF)}.m3-zone-col.menu{background-color:rgba(255,255,255,0.15);color:var(--md-primary,#D0BCFF)}.m3-zone-name{font-size:calc(var(--m3-font-scale,1)*12.5px);font-weight:600;color:var(--md-on-surface,#E6E1E5)}.m3-zone-card.is-selected .m3-zone-name{color:var(--md-primary,#D0BCFF)}.dark-theme,.dark-theme[data-v-60e7ba6e],.dark-theme[data-v-aecb2001],.dark-theme[data-v-b6a3bbec]{--primary-0:#1E1E2E !important;--primary-1:#252535 !important;--primary-2:#141414 !important;--primary-3:#1A1A2A !important;--primary-4:#2B2640 !important;--primary-light:#1A1A2A !important;--content-box-background:#1E1E2E !important;--night-background-secondary-color:#1E1E2E !important;--gray-lighter-color:#2A2A3E !important;--gray-light-color:#3A3A4A !important}.dark-theme .btn-default,.dark-theme a.btn-default{background-color:#252535 !important;color:#CAC4D0 !important;border-color:rgba(255,255,255,0.12) !important}.dark-theme .btn-default:hover,.dark-theme a.btn-default:hover,.dark-theme .btn-default:focus,.dark-theme a.btn-default:focus{background-color:#2B2640 !important;color:#E6E1E5 !important}.dark-theme .btn-default.active,.dark-theme a.btn-default.active{background-color:#3D3553 !important;color:#E6E1E5 !important}.dark-theme .btn-default:hover svg,.dark-theme .btn-default:focus svg,.dark-theme .btn-default.active svg,.dark-theme a.btn-default:hover svg,.dark-theme a.btn-default:focus svg,.dark-theme a.btn-default.active svg{color:#E6E1E5 !important}.dark-theme .btn-primary:hover,.dark-theme .btn-primary:focus,.dark-theme .btn-primary:active,.dark-theme a.btn-primary:hover,.dark-theme a.btn-primary:focus,.dark-theme a.btn-primary:active{background-color:#3D3553 !important;border-color:#3D3553 !important}.dark-theme .wheel-of-fortune-modal-frame.dialog-frame-root{--back-main:#1E1E2E !important}.dark-theme .dialog-frame-root:not(.wheel-of-fortune-modal-frame){background-color:#252535 !important}.dark-theme .modal-content{background-color:#252535 !important;filter:none !important;color:#CAC4D0 !important}.dark-theme .modal-header{border-bottom-color:rgba(255,255,255,0.1) !important}.dark-theme .modal-footer{border-top-color:rgba(255,255,255,0.1) !important}.dark-theme .modal-title{color:#E6E1E5 !important}.dark-theme .modal input:not([type=button],[type=submit],[type=reset]),.dark-theme .modal select,.dark-theme .modal textarea{filter:none !important;background-color:#1E1E2E !important;color:#CAC4D0 !important;border-color:rgba(255,255,255,0.15) !important}.dark-theme .modal .v-select:not(.common-select){filter:none !important}.dark-theme .collection-button:not(:disabled):hover{background-color:#32324A !important}`;
    (document.head || document.documentElement).appendChild(style);
    try {
        const savedScale = parseFloat(localStorage.getItem('fb_text_zoom'));
        if (!isNaN(savedScale) && savedScale >= 0.5 && savedScale <= 2.0) {
            document.documentElement.style.setProperty('--m3-font-scale', String(savedScale));
        }
    } catch (_) {}

    // Переставляем style в конец head при каждом добавлении нового элемента
    // (async CSS chunks грузятся при открытии диалогов и уходят после нашего style)
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

    // --- core/anti-fouc.js ---
// Anti-FOUC shield: the first thing the bundle does, before the Ficbook page
// has painted anything. Hides the body until the reader/card DOM mounts, so a
// hard refresh never flashes the native light UI. Removed by
// revealAfterMount() in main.js once the clean DOM replaces the source one.
//
// This module is deliberately first in MODULE_ORDER: the shield must be in
// the document before any layout pass, and every other module can be loaded
// after it without a visible flash.
const antiFoucStyle = document.createElement('style');
antiFoucStyle.id = 'm3-anti-fouc-shield';
antiFoucStyle.textContent = 'html{background:#141414!important}body{visibility:hidden!important}';
(document.head || document.documentElement).appendChild(antiFoucStyle);

// --- core/tokens.js ---
// Базовые цветовые токены темы
const DEFAULT_THEME_COLORS = {
    bg: '#141414',
    text: '#E0E0E0'
};

// Доступные шрифты
const FONTS = [
    { name: 'Системный', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    { name: 'PT Serif', value: '"PT Serif", Georgia, serif' },
    { name: 'PT Sans', value: '"PT Sans", Arial, sans-serif' },
    { name: 'Literata', value: '"Literata", Georgia, serif' },
    { name: 'Roboto', value: '"Roboto", sans-serif' },
    { name: 'Merriweather', value: '"Merriweather", Georgia, serif' }
];

// Режимы выравнивания текста
const ALIGNMENTS = [
    { name: 'По ширине', value: 'justify' },
    { name: 'По левому краю', value: 'left' }
];

// Режимы чтения
const READING_MODES = [
    { name: 'Прокрутка', value: 'scroll' },
    { name: 'По страницам', value: 'paged' }
];

// Диапазоны настроек типографики
const READER_LIMITS = {
    fontSize: { min: 12, max: 36, step: 1 },
    lineHeight: { min: 1.1, max: 2.4, step: 0.1 },
    chapterSwipeEdge: { min: 16, max: 80, step: 4 }
};

// Значения настроек по умолчанию
const DEFAULT_SETTINGS = {
    fontSize: 18,
    lineHeight: 1.6,
    fontFamily: FONTS[0].value,
    textAlign: 'justify',
    hyphens: 'none',
    readingMode: 'scroll',
    tapZones: 'split50',
    chapterSwipeEdge: 28,
    customBg: DEFAULT_THEME_COLORS.bg,
    customText: DEFAULT_THEME_COLORS.text
};

// Единый реестр ключей localStorage/sessionStorage: статические ключи и
// генераторы динамических. Все модули берут ключи отсюда, чтобы строки и
// шаблоны ключей не плодились по коду. Динамические ключи — функции, чтобы
// опечатка в шаблоне была невозможна в принципе.
const STORAGE_KEYS = {
    // localStorage
    settings: 'ficbook_m3_settings',
    chapterPos: (ficId, partId) => `fic_pos_${ficId}_${partId || 'root'}`,
    lastActive: (ficId) => `fic_last_active_${ficId}`,
    // sessionStorage
    readIntent: 'fic_read_intent',
    freshChapter: 'fic_nav_fresh_chapter',
    preReaderUrl: 'fic_pre_reader_url',
    chaptersList: (ficId) => `ficbook_chapters_${ficId}`,
    // Furthest-read record (JSON {partId,pct}) + one-shot resume handoff
    furthestRead: (ficId) => `fic_furthest_read_${ficId}`,
    pendingPos: 'fic_nav_pending_pos',
    resumeBannerDismissed: (ficId) => `fic_resume_dismissed_${ficId}`
};

// Record the page we came from before entering /readfic/.
// Refreshed on every full-page load whose referrer is not /readfic/ itself,
// so navigating card→chapter does not overwrite the original entry point.
try {
    const ref = document.referrer;
    if (ref && !ref.includes('/readfic/')) {
        sessionStorage.setItem(STORAGE_KEYS.preReaderUrl, ref);
    } else if (!ref && !sessionStorage.getItem(STORAGE_KEYS.preReaderUrl)) {
        sessionStorage.setItem(STORAGE_KEYS.preReaderUrl, '');
    }
} catch (_) {}

// Selector for ad/promo/iframe nodes to strip from chapter text — used in both
// the initial mount and every SPA chapter swap.
const AD_CLEANUP_SELECTOR = '.fanfic-text-promo, .fanfic-text-promo-actions, .fb-ad-slot, .js-text-insert, iframe';

// --- core/icons.js ---
const ICONS = {
    tune: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
        </svg>
    `,
    arrowBack: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
    `,
    arrowNext: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
    `,
    menuBook: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.65 1 5.75V19c0 .55.45 1 1 1 .1 0 .2 0 .3-.05C3.7 19.35 5.5 19 7 19c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.1-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.41.21.9-.09.9-.55V5.75C22.85 5.3 22 5 21 5zM11 18.5c-1.1-.65-2.5-1-4-1-1.25 0-2.45.2-3.5.65V7c1-.45 2.25-.7 3.5-.7 1.5 0 2.9.35 4 1v11.2zm10-.85c-1.05-.45-2.25-.65-3.5-.65-1.5 0-2.9.35-4 1V7.3c1.1-.65 2.5-1 4-1 1.25 0 2.45.25 3.5.7v10.65z"/>
        </svg>
    `,
    expandMore: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
        </svg>
    `,
    arrowDropDown: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
        </svg>
    `,
    arrowUp: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
        </svg>
    `,
    arrowDown: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>
        </svg>
    `,
    palette: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61.39.49.98.79 1.63.79H8c.55 0 1-.45 1-1v-1.5c0-.83.67-1.5 1.5-1.5h3c3.86 0 7-3.14 7-7 0-4.97-4.03-9-8.5-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
    `,
    close: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    `,
    menu: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
    `,
    autoStories: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 1l-6 2v18l6-2 4 1.33V2.33L19 1zm-2 15.5l-2 .67V4.83l2-.67v12.34zM5 4c-1.1 0-2 .9-2 2v13.5c0 .55.45 1 1 1h.05c.5 0 .95-.4.95-.95V6.05c1.1 0 2.05.9 2.05 2v9.9c1.1 0 2-.9 2-2V8c0-2.21-1.79-4-4-4H5z"/>
        </svg>
    `,
    share: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
        </svg>
    `,
    download: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
    `,
    bookmark: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
    `,
    forum: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
    `,
    thumbUp: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
        </svg>
    `,
    star: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
    `,
    comment: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
        </svg>
    `,
    trophy: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
        </svg>
    `,
    checkCircle: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
    `,
    touchApp: `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4.5 4.5 0 0 0-9 0c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.44-.72c-.08-.02-.17-.02-.25-.02-.38 0-.73.16-.98.41l-.83.84 4.9 4.9c.36.36.86.59 1.41.59h6.79c.98 0 1.79-.71 1.95-1.68l.74-4.44c.14-.85-.35-1.68-1.15-1.87z"/>
        </svg>
    `
};

// --- core/settings.js ---
class SettingsManager {
    constructor() {
        this.data = { ...DEFAULT_SETTINGS };
        this.listeners = new Map();
        this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.settings);
            if (raw) {
                const parsed = JSON.parse(raw);
                this.data = { ...DEFAULT_SETTINGS, ...parsed };
            }
        } catch (e) {
            console.error('[Settings] Ошибка загрузки настроек:', e);
        }
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(this.data));
        } catch (e) {
            console.error('[Settings] Ошибка сохранения настроек:', e);
        }
    }

    get(key) {
        return this.data[key] !== undefined ? this.data[key] : DEFAULT_SETTINGS[key];
    }

    set(key, value) {
        this.data[key] = value;
        this.save();
        this.notify(key, value);
    }

    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);
        return () => this.listeners.get(key)?.delete(callback);
    }

    notify(key, value) {
        const callbacks = this.listeners.get(key);
        if (callbacks) {
            callbacks.forEach((cb) => {
                try {
                    cb(value);
                } catch (e) {
                    console.error(`[Settings] Ошибка в подписчике ${key}:`, e);
                }
            });
        }
    }
}

const settings = new SettingsManager();

// --- core/overlays.js ---
// OverlayManager: единый реестр и стек модальных окон читалки (палитра,
// сноска, оглавление, настройки). Заменяет разбросанные по модулям
// query-хелперы (isFootnoteOpen/isTocOpen/isSettingsOpen/isPaletteOpen/
// anyOverlayOpen) единым интерфейсом hasActive()/isActive(id).
//
// Окны взаимоисключающие: открытие одного закрывает всё, что открыто под
// ним, без жёстко прописанных межмодульных вызовов (раньше openSettingsSheet
// сама звала closeTocSheet). Стек теоретически содержит не больше одного id,
// но push/pop бухгалтерия делает этот инвариант явным.
const OverlayManager = (() => {
    // id -> { open, close, isOpen }
    const registry = new Map();
    // Открытые id снизу вверх
    const stack = [];

    function register(id, api) {
        registry.set(id, api);
    }

    function isActive(id) {
        const api = registry.get(id);
        return Boolean(api && api.isOpen());
    }

    function hasActive() {
        return stack.length > 0 && isActive(stack[stack.length - 1]);
    }

    // Поднять id на вершину стека, закрыв всё остальное (взаимоисключение).
    // Уже открытый id сначала вынимается из стека, чтобы повторное открытие
    // было no-op для стека, а не close-then-push.
    function promote(id) {
        const at = stack.indexOf(id);
        if (at !== -1) stack.splice(at, 1);

        // Снимаем все элементы стека до того, как вызываем close(), чтобы
        // исключение внутри close() не оставило стек в частично очищенном
        // состоянии: если pop() был бы внутри close(), брошенный из close()
        // exception прерывал бы цикл, оставляя следующие элементы в стеке.
        const toClose = stack.splice(0, stack.length);
        for (const closedId of toClose) {
            const api = registry.get(closedId);
            if (api) {
                try { api.close(); } catch (_) {}
            }
        }

        stack.push(id);
    }

    function open(id) {
        const api = registry.get(id);
        if (!api) return;
        promote(id);
        if (!isActive(id)) api.open();
    }

    // Для окон, чей open() требует аргументов (контент сноски): вызывающий
    // код сам открывает DOM, здесь фиксируется только переход стека.
    function markOpen(id) {
        if (!registry.has(id)) return;
        promote(id);
    }

    function close(id) {
        const at = stack.indexOf(id);
        if (at !== -1) stack.splice(at, 1);

        const api = registry.get(id);
        if (api && api.isOpen()) api.close();
    }

    // Escape-диспетч: закрывает верхнее окно. Возвращает false, когда ничего
    // не открыто, чтобы вызывающий мог провалиться к другим горячим клавишам.
    function closeTop() {
        if (!stack.length) return false;
        close(stack[stack.length - 1]);
        return true;
    }

    return { register, isActive, hasActive, open, markOpen, close, closeTop };
})();

// --- core/dom.js ---
// Гарантируем корректную настройку области просмотра под экраны с вырезами (Safe Area)
function ensureViewportMeta() {
    let metaVp = document.querySelector('meta[name="viewport"]');
    if (!metaVp) {
        metaVp = document.createElement('meta');
        metaVp.name = 'viewport';
        (document.head || document.documentElement).appendChild(metaVp);
    }
    metaVp.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
}

ensureViewportMeta();

// Один парсер на все фрагменты: sanitizeHtml() и API-модули переиспользуют
// его вместо аллокации нового DOMParser на каждый ответ/фрагмент.
// parseFromString не имеет внутреннего состояния — совместный доступ безопасен.
const sharedDomParser = new DOMParser();

// Корни SVG-иконок неизменны (ICONS — константы), поэтому повторные вызовы
// отдают clones закэшированного корня вместо повторного парсинга innerHTML.
const svgTemplateCache = new Map();

function createSvgIcon(svgString) {
    if (!svgString) return document.createDocumentFragment();

    let template = svgTemplateCache.get(svgString);
    if (!template) {
        const temp = document.createElement('div');
        temp.innerHTML = svgString.trim();
        template = temp.firstElementChild;
        if (!template) return document.createDocumentFragment();
        svgTemplateCache.set(svgString, template);
    }

    return template.cloneNode(true);
}

// HTML-фрагменты с сайта (описание, промо, тела отзывов, сноски) —
// непроверенный ввод: мусорная разметка или stray <style>/<script> из
// вёрстки Ficbook может сломать раскладку #clean-reader-container. Фрагмент
// парсится через DOMParser и очищается от исполняемого и от утечек стилей
// до injection через innerHTML.
function sanitizeHtml(html) {
    if (!html) return '';

    const doc = sharedDomParser.parseFromString(`<div>${html}</div>`, 'text/html');
    const root = doc.body.firstElementChild || doc.body;

    root.querySelectorAll('script, style, iframe, object, embed, link, meta, noscript').forEach((node) => {
        node.remove();
    });

    root.querySelectorAll('*').forEach((node) => {
        [...node.attributes].forEach((attr) => {
            const name = attr.name.toLowerCase();
            if (name.startsWith('on')) {
                node.removeAttribute(attr.name);
            } else if ((name === 'href' || name === 'src') && attr.value.trim().toLowerCase().startsWith('javascript:')) {
                node.removeAttribute(attr.name);
            }
        });
    });

    return root.innerHTML;
}

function el(tag, { className = '', text = '', attrs = {}, events = {} } = {}, children = []) {
    const node = document.createElement(tag);

    if (className) {
        node.className = className;
    }

    if (text) {
        node.textContent = text;
    }

    for (const [attr, val] of Object.entries(attrs)) {
        if (val !== undefined && val !== null) {
            node.setAttribute(attr, String(val));
        }
    }

    for (const [event, handler] of Object.entries(events)) {
        if (typeof handler === 'function') {
            node.addEventListener(event, handler);
        }
    }

    const childNodes = Array.isArray(children) ? children : [children];
    for (const child of childNodes) {
        if (child === null || child === undefined || child === false) {
            continue;
        }
        if (typeof child === 'string' || typeof child === 'number') {
            node.appendChild(document.createTextNode(String(child)));
        } else if (child instanceof Node) {
            node.appendChild(child);
        }
    }

    return node;
}

// Кольцо прогресса для записи главы в оглавлении: fraction 0 → пустой трек
// (приглушён), ≥ 0.95 → полное кольцо, иначе частичная дуга. SVG повёрнут на
// -90° классом, чтобы дуга начиналась с 12 часов. Контент числовой/статичный —
// XSS-поверхности нет.
function createCircularProgress(fraction = 0) {
    const wrap = el('div', { className: 'm3-ch-progress-wrap' });
    const clamped = Math.min(Math.max(Number(fraction) || 0, 0), 1);

    if (clamped <= 0.005) {
        wrap.style.opacity = '0.35';
        wrap.innerHTML = `
            <svg class="m3-ch-progress-svg" viewBox="0 0 24 24">
                <circle class="m3-ch-progress-track" cx="12" cy="12" r="9.2" />
            </svg>
        `;
        return wrap;
    }

    if (clamped >= 0.95) {
        wrap.innerHTML = `
            <svg class="m3-ch-progress-svg" viewBox="0 0 24 24">
                <circle class="m3-ch-progress-completed" cx="12" cy="12" r="9.2" />
            </svg>
        `;
        return wrap;
    }

    const radius = 9.2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - clamped);

    wrap.innerHTML = `
        <svg class="m3-ch-progress-svg" viewBox="0 0 24 24">
            <circle class="m3-ch-progress-track" cx="12" cy="12" r="${radius}" />
            <circle class="m3-ch-progress-fill" cx="12" cy="12" r="${radius}"
                stroke-dasharray="${circumference.toFixed(3)}"
                stroke-dashoffset="${offset.toFixed(3)}" />
        </svg>
    `;

    return wrap;
}
let currentPagedIndex = 1;

function getFicParams() {
    const path = window.location.pathname;
    const match = path.match(/\/readfic\/([^/?#]+)(?:\/([^/?#]+))?/);
    return {
        ficId: match ? match[1] : null,
        partId: match && match[2] ? match[2] : null
    };
}

function getPageWidth(element) {
    if (!element) return window.innerWidth;
    return element.clientWidth || window.innerWidth;
}

// Single source of truth for paged-mode math (was duplicated in
// reading-mode.js, scroll-tracker.js, scrubber.js, pull-navigate.js).
// All consumers must go through this function.
function getPaginationMetrics(content) {
    if (!content) return { totalPages: 1, curPage: 1, pageWidth: 0 };
    const w = getPageWidth(content);
    if (w <= 0) return { totalPages: 1, curPage: 1, pageWidth: 0 };

    // Sub-pixel tolerance scales with DPR: on a 2.75× display each CSS pixel
    // spans 2.75 physical pixels, so fractional drift can exceed 2px and the
    // last column's scrollWidth tips just above (N * w), causing Math.round to
    // produce N+1. Clamping the tolerance to Math.ceil(dpr) keeps totalPages
    // exact on all common DPR values (1×, 1.5×, 2×, 2.75×, 3×).
    const dprTolerance = Math.ceil(window.devicePixelRatio || 1);
    const totalPages = Math.max(1, Math.round((content.scrollWidth - dprTolerance) / w));
    const curPage = Math.min(
        totalPages,
        Math.max(1, Math.floor((content.scrollLeft + (w * 0.5)) / w) + 1)
    );
    return { totalPages, curPage, pageWidth: w };
}

// ResizeObserver with rAF throttling (guards against "ResizeObserver loop
// limit exceeded"). Falls back to window resize where RO is unavailable.
function observeResize(element, callback) {
    if (!window.ResizeObserver || !element) {
        window.addEventListener('resize', callback, { passive: true });
        return () => window.removeEventListener('resize', callback);
    }

    let rafId = null;
    const ro = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(callback);
    });
    ro.observe(element);
    return () => {
        if (rafId) cancelAnimationFrame(rafId);
        ro.disconnect();
    };
}

function applyThemeColors(bg, text) {
    const root = document.documentElement;
    if (bg) root.style.setProperty('--reader-bg', bg);
    if (text) root.style.setProperty('--reader-text', text);
}

// On-demand web fonts: remote families load only when selected in settings.
// The default system font triggers zero network requests.
const WEB_FONT_URLS = {
    'PT Serif': 'https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap',
    'Literata': 'https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..700&display=swap',
    'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap',
    'Merriweather': 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&display=swap',
    'PT Sans': 'https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap'
};

const loadedWebFonts = new Set();

function ensureWebFontLoaded(fontFamily) {
    if (!fontFamily) return;

    // Match the first family name inside a CSS font stack
    const firstFamily = fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
    const url = WEB_FONT_URLS[firstFamily];
    if (!url || loadedWebFonts.has(firstFamily)) return;

    loadedWebFonts.add(firstFamily);

    const head = document.head || document.documentElement;
    if (!head.querySelector('link[rel="preconnect"][href^="https://fonts.gstatic.com"]')) {
        const preconnectGstatic = document.createElement('link');
        preconnectGstatic.rel = 'preconnect';
        preconnectGstatic.href = 'https://fonts.gstatic.com';
        preconnectGstatic.crossOrigin = '';
        head.appendChild(preconnectGstatic);
    }
    if (!head.querySelector('link[rel="preconnect"][href^="https://fonts.googleapis.com"]')) {
        const preconnectGoogleapis = document.createElement('link');
        preconnectGoogleapis.rel = 'preconnect';
        preconnectGoogleapis.href = 'https://fonts.googleapis.com';
        head.appendChild(preconnectGoogleapis);
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    // Неблокирующая загрузка: стилевой лист тянется в «печатном» контексте,
    // не стопоря первичный рендер; применившись, он переключается на all.
    // document.fonts.ready в scroll-tracker всё равно дождётся реальной
    // готовности шрифта перед пересчётом позиции.
    link.media = 'print';
    link.onload = () => {
        link.media = 'all';
    };
    head.appendChild(link);
}

function applyTypographySettings() {
    const root = document.documentElement;
    if (!root.getAttribute('lang')) {
        root.setAttribute('lang', 'ru');
    }

    const fontFamily = settings.get('fontFamily');
    ensureWebFontLoaded(fontFamily);

    root.style.setProperty('--reader-font-size', `${settings.get('fontSize')}px`);
    root.style.setProperty('--reader-line-height', String(settings.get('lineHeight')));
    root.style.setProperty('--reader-font-family', fontFamily);
    root.style.setProperty('--reader-text-align', settings.get('textAlign'));

    const rawHyphens = settings.get('hyphens');
    const hyphensValue = (rawHyphens === true || rawHyphens === 'auto' || rawHyphens === 'true') ? 'auto' : 'none';
    root.style.setProperty('--reader-hyphens', hyphensValue);
}

// Bootstrap phase: wired from initReaderMode(), after all modules are
// declared — no typeof guards needed for cross-module calls.
function setupSettingsSubscriptions() {
    settings.subscribe('fontSize', () => {
        applyTypographySettings();
        recalculateMetrics();
    });
    settings.subscribe('lineHeight', () => {
        applyTypographySettings();
        recalculateMetrics();
    });
    settings.subscribe('fontFamily', () => {
        applyTypographySettings();
        recalculateMetrics();
    });
    settings.subscribe('textAlign', applyTypographySettings);
    settings.subscribe('hyphens', () => {
        applyTypographySettings();
        recalculateMetrics();
    });
    settings.subscribe('readingMode', (mode) => {
        applyReadingMode(mode);
    });
    settings.subscribe('customBg', (color) => {
        applyThemeColors(color, null);
    });
    settings.subscribe('customText', (color) => {
        applyThemeColors(null, color);
    });
}

// Первичное применение стилей — сразу при старте скрипта (до инициализации
// ридера), чтобы дефолтная тема применялась и на ожидании SPA-загрузки
applyThemeColors(settings.get('customBg'), settings.get('customText'));
applyTypographySettings();

// --- api/chapters.js ---
const chaptersCache = new Map();

// Background cache warm: pre-populates the in-memory Map from
// sessionStorage before the TOC first asks for the list. No fetch, no
// DOM dependency — pure parsing, safe to run at idle.
function warmChaptersCache() {
    const { ficId } = getFicParams();
    if (!ficId || chaptersCache.has(ficId)) return;

    try {
        const sessionCache = sessionStorage.getItem(STORAGE_KEYS.chaptersList(ficId));
        if (sessionCache) {
            const parsed = JSON.parse(sessionCache);
            if (Array.isArray(parsed) && parsed.length > 0) {
                chaptersCache.set(ficId, parsed);
            }
        }
    } catch (_) {}
}

async function fetchChaptersList(ficId) {
    if (!ficId) return [];
    if (chaptersCache.has(ficId)) return chaptersCache.get(ficId);

    try {
        const sessionCache = sessionStorage.getItem(STORAGE_KEYS.chaptersList(ficId));
        if (sessionCache) {
            const parsed = JSON.parse(sessionCache);
            if (Array.isArray(parsed) && parsed.length > 0) {
                chaptersCache.set(ficId, parsed);
                return parsed;
            }
        }
    } catch (_) {}

    let partElements = document.querySelectorAll('.list-of-fanfic-parts li.part');
    if (!partElements.length) {
        const response = await fetch(`/readfic/${ficId}`);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: HTTP ${response.status}`);
        }
        const html = await response.text();
        const doc = sharedDomParser.parseFromString(html, 'text/html');
        partElements = doc.querySelectorAll('.list-of-fanfic-parts li.part');
    }

    const { partId: currentPartId } = getFicParams();
    const list = parseChapterList(partElements, currentPartId);

    if (list.length > 0) {
        chaptersCache.set(ficId, list);
        try {
            sessionStorage.setItem(STORAGE_KEYS.chaptersList(ficId), JSON.stringify(list));
        } catch (_) {}
    }

    return list;
}

// --- api/work-info.js ---
// Work card state: set on the card page before navigating into the text.
// One-shot — consumed and removed by routePage() on every load. Exists solely
// to disambiguate one-part works, where card and chapter text share the root
// /readfic/{ficId} URL ("always show the card at root" decision).
function consumeReadIntent() {
    let hasIntent = false;
    try {
        hasIntent = sessionStorage.getItem(STORAGE_KEYS.readIntent) === '1';
        sessionStorage.removeItem(STORAGE_KEYS.readIntent);
    } catch (_) {}
    return hasIntent;
}

function setReadIntent() {
    try {
        sessionStorage.setItem(STORAGE_KEYS.readIntent, '1');
    } catch (_) {}
}

// Which ficbook page state are we on? URL shape is primary, DOM presence
// resolves the one-part case where root serves the chapter text.
function detectPageState() {
    const { ficId, partId } = getFicParams();

    const hasChapterText = Boolean(document.querySelector('div#content.js-part-text'));
    const hasWorkHat = Boolean(
        document.querySelector('section.fanfic-hat, section.chapter-info') ||
        document.querySelector('ul.list-of-fanfic-parts')
    );

    if (partId || hasChapterText) {
        return { state: 'chapter', ficId, partId };
    }

    if (hasWorkHat || ficId) {
        return { state: 'work', ficId, partId: null };
    }

    return { state: 'unknown', ficId, partId };
}

// Shared li.part parser: one entry per chapter, used by
// both the card page scrape and the reader TOC's remote fetch path.
function parseChapterList(partElements, currentPartId) {
    const list = [];

    partElements.forEach((node, i) => {
        const link = node.querySelector('a.part-link');
        const titleEl = node.querySelector('.part-title h3, h3');
        const infoEl = node.querySelector('.part-info');

        if (link && titleEl) {
            const rawHref = link.getAttribute('href') || '';
            const cleanHref = rawHref.split('#')[0];
            const linkPartMatch = cleanHref.match(/\/readfic\/[^/?#]+\/([a-zA-Z0-9_\-]+)/);
            const linkPartId = linkPartMatch ? linkPartMatch[1] : null;

            list.push({
                index: i + 1,
                title: titleEl.textContent.trim(),
                info: infoEl ? infoEl.textContent.replace(/\s+/g, ' ').trim() : '',
                href: cleanHref.startsWith('http') ? cleanHref : `https://ficbook.net${cleanHref}`,
                partId: linkPartId,
                isCurrent: Boolean(currentPartId && linkPartId && currentPartId === linkPartId)
            });
        }
    });

    return list;
}

// Scrape the chapter header trio (work title / part title / part date).
// Works on the live document and on a fetched DOMParser document — the
// initial mount (main.js) and the SPA chapter swap (spa-nav.js) share it.
function scrapeChapterHeader(rootDoc) {
    const doc = rootDoc || document;
    return {
        ficTitle: doc.querySelector('.chapter-info h1.heading, h1.heading')?.textContent.trim(),
        partTitle: doc.querySelector('.title-area h2')?.textContent.trim(),
        partDate: doc.querySelector('.title-area .part-date')?.textContent.trim()
    };
}

// Absolute URL for a possibly-relative ficbook href (covers, author links).
function absoluteUrl(href) {
    if (!href) return null;
    const clean = href.split('#')[0];
    if (!clean) return null;
    return clean.startsWith('http') ? clean : `https://ficbook.net${clean}`;
}

// Extract an absolute image URL from an <img> element (lazy-load aware).
function imgSrc(img) {
    if (!img) return null;
    const src = img.getAttribute('data-src') || img.getAttribute('src') || '';
    return src ? absoluteUrl(src) : null;
}

// Extract the work's metadata from a ficbook work/index Document
// into a plain data object. Pure: no DOM writes, no
// storage writes. Fields the source page lacks come back as null/empty —
// the renderer decides how to omit them.
function extractWorkInfo(rootDoc) {
    const doc = rootDoc || document;
    const info = {
        title: null,
        coverUrl: null,
        author: null,
        authorAvatarUrl: null,
        rating: null,
        status: null,
        direction: null,
        directionBadges: [],
        metaRows: [],
        fandoms: [],
        pairings: [],
        characters: [],
        tags: [],
        summaryHtml: null,
        chapters: [],
        firstChapterHref: null,
        chaptersCountLabel: null,
        isDegraded: false,
        stats: {
            likes: null,
            followings: null,
            comments: null,
            awards: null
        },
        notes: null,
        dedication: null,
        promoHtml: null,
        promoCards: [],
        creators: [],
        awards: [],
        specialBadges: [],
        downloadHref: null,
        commentsHref: null,
        rewardHref: null,
        rewardNode: null,
        collections: { count: null, href: null, listHref: null, targetId: null },
        addToCollectionNode: null,
        likeNode: null,
        followNode: null,
        readNode: null,
        permissions: null
    };

    // Degraded mode: one-part work serving text at the root URL — only
    // the chapter header is available, the work hat is absent
    const hat = doc.querySelector('section.fanfic-hat, section.chapter-info');
    if (!hat) {
        info.isDegraded = true;
        info.title = doc.querySelector('h1.heading')?.textContent.trim() || null;
        info.chaptersCountLabel = '1 глава';
        const rootStart = doc.querySelector('#content');
        if (rootStart) {
            info.firstChapterHref = window.location.pathname;
        }
        return info;
    }

    info.title = hat.querySelector('h1.heading[itemprop="headline"], h1.heading[itemprop="name"], h1.heading')?.textContent.trim() || null;

    const coverImg = hat.querySelector('.fanfic-hat-cover picture img, .fanfic-hat-cover img');
    if (coverImg) {
        const src = coverImg.getAttribute('src') || coverImg.getAttribute('data-src') || '';
        if (src) info.coverUrl = absoluteUrl(src);
    }

    // Author + avatar
    const authorLink = hat.querySelector('a[itemprop="author"]');
    if (authorLink) {
        info.author = {
            name: authorLink.textContent.trim(),
            href: absoluteUrl(authorLink.getAttribute('href') || '')
        };
    }
    const avatarImg = hat.querySelector('.user-avatar img');
    if (avatarImg) {
        const avatarSrc = avatarImg.getAttribute('src') || avatarImg.getAttribute('data-src') || '';
        if (avatarSrc) info.authorAvatarUrl = absoluteUrl(avatarSrc);
    }

    // All creators: author, coauthors, betas, gammas, translators. Scan is
    // limited to .fanfic-hat-body (rewards/actions containers hold award
    // givers — never participants). Each flex row carries an avatar link
    // (img only, no text) and a name link (text only); the nickname comes
    // from the link with non-empty textContent. Anything not matching a
    // known role text defaults to Бета.
    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

    const pushCreator = (nameLink, role, avatarImgNode) => {
        const name = nameLink.textContent.trim();
        if (!name) return;
        if (info.creators.some((c) => c.name === name)) return;
        info.creators.push({
            name,
            href: absoluteUrl(nameLink.getAttribute('href') || ''),
            avatarUrl: imgSrc(avatarImgNode) || imgSrc(nameLink.querySelector('img')),
            role
        });
    };

    const roleFromBadge = (badgeText) => {
        const t = (badgeText || '').toLowerCase();
        if (t.includes('автор') || t.includes('author')) return 'Автор';
        if (t.includes('соавтор') || t.includes('coauthor')) return 'Соавтор';
        if (t.includes('бета') || t.includes('beta')) return 'Бета';
        if (t.includes('гамма') || t.includes('gamma')) return 'Гамма';
        if (t.includes('перевод') || t.includes('translat')) return 'Переводчик';
        return badgeText ? capitalize(badgeText.trim()) : null;
    };

    // Rows outside reward/actions blocks — their author links are givers
    const inExcludedZone = (node) => Boolean(node.closest(
        '#rewards, .fanfic-reward-container, .hat-actions-container, .fanfic-hat-aside'
    ));

    const scanZone = hat.querySelector('.fanfic-hat-body') || hat;

    const collectRowCreator = (row) => {
        if (inExcludedZone(row)) return;

        // Name link: /authors/ link with non-empty text (avatar link has
        // only an <img> inside, so its textContent is empty)
        let nameLink = null;
        row.querySelectorAll('a[href*="/authors/"]').forEach((a) => {
            if (a.textContent.trim()) nameLink = a;
        });
        if (!nameLink) return;

        const badge = row.querySelector('.ds-badge, .role-badge');
        const role = roleFromBadge(badge ? badge.textContent : null);
        pushCreator(nameLink, role || 'Бета', row.querySelector('img'));
    };

    scanZone.querySelectorAll('.d-flex.align-items-center.gap-8').forEach(collectRowCreator);
    scanZone.querySelectorAll('.creator-info, .hat-creator, .fanfic-hat-creator').forEach(collectRowCreator);

    if (info.creators.length === 0) {
        if (authorLink) pushCreator(authorLink, 'Автор', hat.querySelector('.user-avatar img'));
        scanZone.querySelectorAll('.coauthor a, a.coauthor').forEach((l) => pushCreator(l, 'Соавтор'));
        scanZone.querySelectorAll('.beta a, a.beta').forEach((l) => pushCreator(l, 'Бета'));
        scanZone.querySelectorAll('.gamma a, a.gamma').forEach((l) => pushCreator(l, 'Гамма'));
        scanZone.querySelectorAll('.translator a, a.translator').forEach((l) => pushCreator(l, 'Переводчик'));
    }
    // Microdata author is authoritative: ensure the author is present
    if (authorLink && !info.creators.some((c) => c.role === 'Автор')) {
        const name = authorLink.textContent.trim();
        const existing = name ? info.creators.find((c) => c.name === name) : null;
        if (existing) {
            existing.role = 'Автор';
        } else {
            pushCreator(authorLink, 'Автор', hat.querySelector('.user-avatar img'));
        }
    }

    // Promo: author's promo quote / hot snippet
    const promoEl = hat.querySelector('.fanfic-hat-promo, .fanfic-hat .promo, .work-promo');
    if (promoEl) {
        info.promoHtml = promoEl.innerHTML.trim() || null;
    }

    // Related-works carousels: the page carries several independent
    // .fanfic-promo-carousel blocks (before and after the TOC) — merge
    // them into one deduped list. 02-base.css must not hide those blocks
    // before the scrape.
    doc.querySelectorAll('.fanfic-promo-item').forEach((item) => {
        const link = item.matches('a') ? item : item.querySelector('a[data-fanfic-id], a');
        const href = link ? link.getAttribute('href') : null;
        const id = link ? link.getAttribute('data-fanfic-id') : null;
        if (!href) return;

        const key = id || href;
        if (info.promoCards.some((c) => c.key === key)) return;

        const title = (item.querySelector('h4')?.textContent || '').trim();
        const fandom = (item.querySelector('.fic-fandom')?.textContent || '').trim();
        const cover = item.querySelector('.fic-cover img, img');
        const coverSrc = cover ? (cover.getAttribute('src') || cover.getAttribute('data-src') || '') : '';
        const directionMatch = item.className.match(/direction-(femslash|slash|het|gen|mixed)/);

        info.promoCards.push({
            key,
            title: title || fandom || 'Без названия',
            fandom: fandom || null,
            coverUrl: coverSrc ? absoluteUrl(coverSrc) : null,
            href: absoluteUrl(href),
            direction: directionMatch ? directionMatch[1] : null
        });
    });

    // Badges: separate into rating / status / direction
    const ratingMap = { 'G': true, 'PG-13': true, 'PG': true, 'R': true, 'NC-17': true, 'NC-18': true };
    const statusMap = { 'закончен': 'Завершён', 'в процессе': 'В процессе', 'заморожен': 'Заморожен', 'перевод': 'Перевод' };
    const directionMap = { 'femslash': 'Фемслэш', 'slash': 'Слэш', 'het': 'Гет', 'gen': 'Джен', 'mixed': 'Смешанная' };

    hat.querySelectorAll('.fanfic-badges .ds-label').forEach((badge) => {
        const text = badge.textContent.trim();
        if (!text) return;

        // Check rating
        if (ratingMap[text]) {
            info.rating = text;
            return;
        }

        // Check status (lowercase matching)
        const statusKey = text.toLowerCase();
        for (const key in statusMap) {
            if (statusKey.includes(key)) {
                info.status = statusMap[key];
                return;
            }
        }

        // Check direction by class
        const directionMatch = badge.className.match(/direction-(femslash|slash|het|gen|mixed)/);
        if (directionMatch) {
            info.direction = directionMap[directionMatch[1]];
            info.directionBadges.push(directionMap[directionMatch[1]]);
            return;
        }

        // Fallback: text as direction
        for (const dir in directionMap) {
            if (text.toLowerCase().includes(dir.toLowerCase())) {
                info.direction = text;
                info.directionBadges.push(text);
                return;
            }
        }
    });

    // Metadata key-value pairs (size, marks, etc.) with filtering.
    // Publication rules are pulled out into a dedicated field instead of
    // being dropped by the blacklist.
    const blacklist = ['описание', 'метки', 'примечания', 'посвящение', 'источник', 'фэндом'];
    hat.querySelectorAll('.description .mb-10, .description.word-break .mb-10').forEach((row) => {
        const text = row.textContent.replace(/\s+/g, ' ').trim();
        if (!text) return;

        if (text.toLowerCase().includes('публикация на других ресурсах')) {
            const permValue = text.split(':').slice(1).join(':').trim();
            if (permValue) info.permissions = permValue;
            return;
        }

        const lowerText = text.toLowerCase();
        const shouldSkip = blacklist.some(banned => lowerText.includes(banned));
        if (!shouldSkip) {
            info.metaRows.push(text);
        }
    });

    hat.querySelectorAll('a[href^="/fanfiction/"], a[href*="ficbook.net/fanfiction/"]').forEach((fandomLink) => {
        const name = fandomLink.textContent.trim();
        if (name && !info.fandoms.some((f) => f.name === name)) {
            info.fandoms.push({ name, href: absoluteUrl(fandomLink.getAttribute('href') || '') });
        }
    });

    hat.querySelectorAll('.pairing-link').forEach((pairingLink) => {
        const name = pairingLink.textContent.trim();
        if (!name) return;
        // Pairings: highlighted links or names containing a slash. Single
        // names without a slash are individual characters.
        if (pairingLink.classList.contains('pairing-highlight') || name.includes('/')) {
            if (!info.pairings.includes(name)) info.pairings.push(name);
        } else if (!info.characters.includes(name)) {
            info.characters.push(name);
        }
    });

    hat.querySelectorAll('.tags a.tag').forEach((tagLink) => {
        const name = tagLink.textContent.trim();
        if (name) {
            info.tags.push({
                name,
                href: tagLink.getAttribute('href') || null,
                isAdult: tagLink.classList.contains('tag-adult'),
                isSpoiler: tagLink.classList.contains('tag-spoiler')
            });
        }
    });

    const summaryEl = hat.querySelector('.js-public-beta-description[itemprop="description"], [itemprop="description"]');
    if (summaryEl) {
        info.summaryHtml = summaryEl.innerHTML.trim() || null;
    }

    // Stats: likes, followings (wait/bookmarks), comments (reviews), awards.
    // Modern markup carries SVG icon classes (ic_thumbs-up, ic_star-empty,
    // ic_comment, ic_trophy) instead of emoji, so both are recognized.
    const statsContainers = hat.querySelectorAll('.hat-actions-container, .fanfic-hat-aside, .fanfic-badges');
    statsContainers.forEach((statsContainer) => {
        const actionNodes = statsContainer.querySelectorAll('button, a[role="button"], a');

        actionNodes.forEach((btn) => {
            const text = btn.textContent.trim();
            const lower = text.toLowerCase();
            const digitMatch = text.match(/\d+/);
            // null = no digit in text (icon-only button); 0 = button shows "0"
            const num = digitMatch ? parseInt(digitMatch[0]) : null;
            const hasIcon = (cls) => Boolean(btn.querySelector(`.${cls}, svg[class*="${cls}"], [class*="${cls}"]`));
            const isCommentsLink = Boolean(btn.matches('a[href*="/comments"]'));

            if (text.includes('❤') || text.includes('♥') || hasIcon('ic_thumbs-up') || lower.includes('нравит')) {
                info.stats.likes = num !== null ? num : (info.stats.likes ?? null);
                if (btn.matches('button.jsVueComponent') && !info.likeNode) info.likeNode = btn;
            } else if (text.includes('⏳') || hasIcon('ic_star-empty') || lower.includes('жду') || lower.includes('заклад')) {
                info.stats.followings = num !== null ? num : (info.stats.followings ?? null);
                if (btn.matches('button.jsVueComponent') && !info.followNode) info.followNode = btn;
            } else if (text.includes('💬') || hasIcon('ic_comment') || isCommentsLink || lower.includes('отзыв')) {
                info.stats.comments = num !== null ? num : (info.stats.comments ?? null);
            } else if (text.includes('🏆') || hasIcon('ic_trophy') || lower.includes('награ')) {
                info.stats.awards = num !== null ? num : (info.stats.awards ?? null);
            } else if (hasIcon('ic_checkbox-unchecked2') || hasIcon('ic_checkbox-checked2') || lower.includes('прочитано') || lower.includes('прочитал')) {
                if (btn.matches('button.jsVueComponent') && !info.readNode) info.readNode = btn;
            } else if (btn.matches('button.jsVueComponent') && num !== null) {
                // Fallback by position: before Vue mounts icons, buttons are
                // identified by order — first numeric jsVueComponent = like, second = followings
                if (!info.likeNode) {
                    info.stats.likes = num !== null ? num : (info.stats.likes ?? null);
                    info.likeNode = btn;
                } else if (!info.followNode) {
                    info.stats.followings = num !== null ? num : (info.stats.followings ?? null);
                    info.followNode = btn;
                }
            }
        });

        // Collections: separate link/counter from the wait-for-continue button
        const collectionLink = statsContainer.querySelector('a[href*="/collections/"]');
        if (collectionLink) {
            const countText = collectionLink.textContent.replace(/\s+/g, ' ').trim();
            const countMatch = countText.match(/([\d\s]+)\+/);
            if (countMatch) {
                info.collections.count = parseInt(countMatch[1].replace(/\s/g, ''), 10);
            } else {
                const plain = countText.match(/\d+/);
                info.collections.count = plain ? parseInt(plain[0], 10) : null;
            }
            info.collections.href = absoluteUrl(collectionLink.getAttribute('href') || '');
            // Full list page: /collections/{id}/list. The endpoint only
            // accepts the work's NUMERIC fanfic ID — a UUID here 404s the
            // fetch, so a non-numeric segment is not used for listHref
            // (the numeric ID is recovered below via data-fanfic-id).
            const collHref = collectionLink.getAttribute('href') || '';
            const collMatch = collHref.match(/\/collections\/(\d+)/);
            if (collMatch) {
                info.collections.targetId = collMatch[1];
                info.collections.listHref = absoluteUrl(`/collections/${collMatch[1]}/list`);
            }
        }

        // Native "add to collection" modal trigger.
        // ficbook renders <fanfic-collections-modal class="jsVueComponent"> which Vue
        // populates with <span class="ds-btn ds-btn-mini"> as the click target.
        if (!info.addToCollectionNode) {
            const modal = statsContainer.querySelector('fanfic-collections-modal.jsVueComponent');
            if (modal) {
                info.addToCollectionNode = modal.querySelector('span.ds-btn, span[class*="ds-btn"], button') || modal;
            }
        }

        // Direct comment-page link
        const commentsLink = statsContainer.querySelector('a[href*="/comments"]') || hat.querySelector('a[href*="/comments"]');
        if (commentsLink) {
            info.commentsHref = absoluteUrl(commentsLink.getAttribute('href') || '');
        }
    });

    // Collections target ID fallback: works served under a UUID URL carry a
    // UUID in the collections link, which the /collections/{id}/list endpoint
    // rejects. The numeric fanfic ID is also present on interaction elements
    // as data-fanfic-id — use it to fill the gap.
    if (!info.collections.targetId) {
        // Search within hat first to avoid grabbing promo-block fanfic IDs
        const fanficIdNode = hat.querySelector('[data-fanfic-id]') || doc.querySelector('section.fanfic-hat [data-fanfic-id], .fanfic-hat [data-fanfic-id], [data-fanfic-id]');
        const attrId = fanficIdNode ? (fanficIdNode.getAttribute('data-fanfic-id') || '') : '';
        if (/^\d+$/.test(attrId)) {
            info.collections.targetId = attrId;
            if (!info.collections.listHref) {
                info.collections.listHref = absoluteUrl(`/collections/${attrId}/list`);
            }
        }
    }

    // Special popularity badges: hot works, top entries
    if (hat.querySelector('.ds-label-hot')) {
        info.specialBadges.push({ type: 'hot', label: 'Горячая работа' });
    }
    hat.querySelectorAll('.ds-badge-award, .ds-label-top').forEach((badge) => {
        const label = badge.textContent.trim();
        if (label) info.specialBadges.push({ type: 'award', label });
    });

    // Download link (from either the hat aside or the hat itself)
    const downloadLink = hat.querySelector('a[href*="/download"]');
    if (downloadLink) {
        info.downloadHref = absoluteUrl(downloadLink.getAttribute('href') || '');
    }

    // Reward anchor for the «Наградить» action
    const rewardBtn = hat.querySelector('.fanfic-reward-container button, .fanfic-reward-container a');
    if (rewardBtn) {
        info.rewardHref = rewardBtn.getAttribute('href')
            ? absoluteUrl(rewardBtn.getAttribute('href'))
            : (window.location.href.split('#')[0] + '#rewards');
        if (rewardBtn.tagName === 'BUTTON') info.rewardNode = rewardBtn;
    }

    // Notes: try to extract author notes from common locations
    const notesEl = hat.querySelector('.fanfic-hat-notes, .part-comment-top, .part-comment-before');
    if (notesEl) {
        const notesText = notesEl.textContent.trim();
        if (notesText) info.notes = notesText;
    }

    // Dedication: look for dedication pattern (usually italic text or blockquote)
    const dedContainers = hat.querySelectorAll('.description p, .description div');
    let foundDedication = null;
    dedContainers.forEach((el) => {
        if (!foundDedication && (el.textContent.includes('Посвящается') || el.textContent.includes('посвящение'))) {
            foundDedication = el.textContent.trim();
        }
    });
    if (foundDedication) info.dedication = foundDedication;

    // Awards: real giver cards from the rewards containers. System actions
    // («Все награды», «Наградить») are filtered out so they don't turn into
    // phantom empty awards.
    const awardsContainers = hat.querySelectorAll('.fanfic-reward-container, #rewards');
    awardsContainers.forEach((awardsEl) => {
        const isSystemNode = (node) => {
            const t = node.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
            return t === 'все награды' || t === 'наградить' || Boolean(node.closest('a, button'));
        };

        const awardNodes = awardsEl.querySelectorAll('.d-flex.flex-row.align-items-center.gap-8, .award-item');
        awardNodes.forEach((award) => {
            if (isSystemNode(award)) return;

            const title = (award.querySelector('.text-bold')?.textContent || '').trim();
            const giver = (award.querySelector('.reward-giver-name, a[href*="/authors/"]')?.textContent || '').trim();
            const commentNode = award.querySelector('.reward-comment, .award-comment, .award-text, [class*="comment"]');
            const comment = commentNode ? commentNode.textContent.replace(/\s+/g, ' ').trim() : '';
            const text = title || award.textContent.replace(/\s+/g, ' ').trim();
            if (text) {
                info.awards.push({
                    title: text,
                    giver: giver || null,
                    comment: comment || null
                });
            }
        });
    });

    // Chapter list
    const { partId: currentPartId } = getFicParams();
    const partElements = doc.querySelectorAll('ul.list-of-fanfic-parts li.part');
    if (partElements.length > 0) {
        info.chapters = parseChapterList(partElements, currentPartId);
    }

    if (info.chapters.length > 0) {
        info.firstChapterHref = info.chapters[0].href;
        const count = info.chapters.length;
        info.chaptersCountLabel = `${count} ${count % 10 === 1 && count % 100 !== 11 ? 'глава' : (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? 'главы' : 'глав')}`;
    } else {
        info.chaptersCountLabel = '1 глава';
        info.firstChapterHref = window.location.pathname;
    }

    return info;
}

// Seed the shared chapter cache from the card page scrape so the reader
// TOC gets the chapter list without a remote fetch.
function seedChaptersCacheFromCard(ficId, chapters) {
    if (!ficId || !Array.isArray(chapters) || chapters.length === 0) return;
    chaptersCache.set(ficId, chapters);
    try {
        sessionStorage.setItem(STORAGE_KEYS.chaptersList(ficId), JSON.stringify(chapters));
    } catch (_) {}
}

// «Продолжить» target. Порядок приоритетов:
// 1. Однотомные / деградированные произведения — позиция под ключом 'root',
//    глава может отсутствовать в списке, поэтому синтезируется.
// 2. fic_last_active_{ficId} — глава, на которой читатель скроллил последней.
// 3. Последняя в порядке списка глава с сохранённой позицией > 0.0005.
// Возвращает null, если ничего не подходит.
function findResumeChapter(ficId, chapters) {
    if (!ficId) return null;

    // Однотомное или деградированное произведение (chapters пуст или 1 элемент)
    if (!Array.isArray(chapters) || chapters.length <= 1) {
        const singlePartId = (chapters && chapters[0]?.partId) || 'root';
        let savedPct = 0;
        try {
            savedPct = parseFloat(localStorage.getItem(STORAGE_KEYS.chapterPos(ficId, singlePartId))) || 0;
        } catch (_) {}

        if (savedPct > 0.0005) {
            return {
                chapter: chapters?.[0] || {
                    index: 1,
                    title: 'Читать',
                    info: '',
                    href: `/readfic/${ficId}`,
                    partId: 'root',
                    isCurrent: true
                },
                pct: savedPct
            };
        }
        return null;
    }

    // Быстрый путь: fic_last_active_{ficId} хранит partId последней
    // читаемой главы — пробуем её первой, чтобы не сканировать весь список
    try {
        const lastPartId = localStorage.getItem(STORAGE_KEYS.lastActive(ficId));
        if (lastPartId) {
            const ch = chapters.find((c) => (c.partId || 'root') === lastPartId);
            if (ch) {
                const savedPct = parseFloat(localStorage.getItem(STORAGE_KEYS.chapterPos(ficId, lastPartId))) || 0;
                if (savedPct > 0.0005) {
                    return { chapter: ch, pct: savedPct };
                }
            }
        }
    } catch (_) {}

    // Медленный путь: сканируем с конца списка (глава с наибольшим индексом)
    for (let i = chapters.length - 1; i >= 0; i--) {
        const ch = chapters[i];
        const targetPartId = ch.partId || 'root';

        let savedPct = 0;
        try {
            savedPct = parseFloat(localStorage.getItem(STORAGE_KEYS.chapterPos(ficId, targetPartId))) || 0;
        } catch (_) {}

        if (savedPct > 0.0005) {
            return { chapter: ch, pct: savedPct };
        }
    }

    return null;
}

// Читает furthest-read запись работы: { partId, pct } или null.
function readFurthestRead(ficId) {
    if (!ficId) return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.furthestRead(ficId));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const pct = Number(parsed && parsed.pct);
        if (!parsed || !parsed.partId || !isFinite(pct) || pct <= 0.05) return null;
        return { partId: parsed.partId, pct };
    } catch (_) {
        return null;
    }
}

// Детектит откат позиции чтения: страница, на которую мы попали (currentPartId
// на currentPct), РАНЬШЕ в списке глав, чем furthest-read точка. Так бывает,
// когда браузер перезапускается на старой вкладке/URL, хотя прошлая сессия уже
// ушла вперёд. Возвращает { chapter, pct } furthest-точки, или null, если
// отката нет (или главы furthest нет в списке).
function findResumeRollback(ficId, chapters, currentPartId, currentPct) {
    const furthest = readFurthestRead(ficId);
    if (!furthest) return null;

    const curPart = currentPartId || 'root';
    const curPct = Number(currentPct) || 0;

    // Нет списка глав (однотомник/деградация): ловим только откат позиции на
    // той же единственной главе
    if (!Array.isArray(chapters) || chapters.length === 0) {
        if (furthest.partId === curPart && furthest.pct - curPct > 0.1) {
            return {
                chapter: {
                    index: 1,
                    title: '',
                    info: '',
                    href: `/readfic/${ficId}`,
                    partId: curPart,
                    isCurrent: true
                },
                pct: furthest.pct
            };
        }
        return null;
    }

    const furthestIdx = chapters.findIndex((ch) => (ch.partId || 'root') === furthest.partId);
    if (furthestIdx === -1) return null;

    // Режим карточки: currentPartId явно не передан (null) — ридер ещё не
    // открыт, «текущей» позиции нет. Любая записанная furthest-точка считается
    // местом, к которому можно вернуться.
    if (currentPartId == null) {
        return { chapter: chapters[furthestIdx], pct: furthest.pct };
    }

    const curIdx = chapters.findIndex((ch) => (ch.partId || 'root') === curPart);

    // Текущей главы нет в списке — упорядочить нельзя, молчим
    if (curIdx === -1) return null;

    if (furthestIdx > curIdx) {
        return { chapter: chapters[furthestIdx], pct: furthest.pct };
    }

    // Та же глава, но записанная точка заметно впереди старта загрузки
    if (furthestIdx === curIdx && furthest.pct - curPct > 0.1) {
        return { chapter: chapters[furthestIdx], pct: furthest.pct };
    }

    return null;
}

// После ресета — выбирает лучший оставшийся furthest-read кандидат из
// кэшированного списка глав: последняя по порядку глава с сохранённым pct > 5%.
function findNextFurthestRead(ficId, excludePartId) {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEYS.chaptersList(ficId));
        if (!raw) return null;
        const chapters = JSON.parse(raw);
        if (!Array.isArray(chapters)) return null;

        for (let i = chapters.length - 1; i >= 0; i--) {
            const partId = chapters[i].partId || 'root';
            if (partId === excludePartId) continue;
            const pct = parseFloat(localStorage.getItem(STORAGE_KEYS.chapterPos(ficId, partId))) || 0;
            if (pct > 0.05) {
                return { partId, pct };
            }
        }
    } catch (_) {}
    return null;
}

// Удаляет сохранённую позицию главы и сохраняет производные записи
// согласованными: если lastActive / furthestRead указывали на эту главу — они
// пере-деривируются (furthest) или сбрасываются (lastActive), чтобы «Продолжить»
// и подсказка отката не вели к только что сброшенной главе.
function clearChapterProgress(ficId, partId) {
    if (!ficId) return;
    const targetPart = partId || 'root';

    try {
        localStorage.removeItem(STORAGE_KEYS.chapterPos(ficId, targetPart));

        const lastActive = localStorage.getItem(STORAGE_KEYS.lastActive(ficId));
        if (lastActive === targetPart) {
            localStorage.removeItem(STORAGE_KEYS.lastActive(ficId));
        }

        const furthest = readFurthestRead(ficId);
        if (furthest && furthest.partId === targetPart) {
            const next = findNextFurthestRead(ficId, targetPart);
            if (next) {
                localStorage.setItem(STORAGE_KEYS.furthestRead(ficId), JSON.stringify(next));
            } else {
                localStorage.removeItem(STORAGE_KEYS.furthestRead(ficId));
            }
        }
    } catch (_) {}
}

// --- api/comments.js ---
// Comments feed: paged async fetch + parse of /readfic/{ficId}/comments.
// Each comment exposes author name/profile link/avatar, date and HTML
// body. Pages are cached in memory and sessionStorage under
// ficbook_comments_{ficId}_p{page}.

// --- engine/scroll-tracker.js ---
let isScrollTrackingActive = false;
let scrollThrottleTimer = null;
let contentScrollEl = null;

// Активная смонтированная глава/работа — защищает от записи позиции не в ту
// главу при SPA-переходах и даёт savePos дефолтный таргет
let activeMountedPartId = null;
let activeMountedFicId = null;
// Гард: не перетирать позицию нулём/промежуточным значением, пока идёт
// восстановление (шрифты/картинки устаканиваются, затем скролл-restore)
let isRestoringPosition = false;

function savePos() {
    if (isScrubberDragging) return;
    // Во время SPA-смены главы позиция не сохраняется: scroll ещё считает
    // старую главу, а storageKey (см. ниже) уже пересчитан на новую
    if (isSpaNavigating) return;
    // Во время восстановления scroll-события от layout-сдвигов не должны
    // переписать восстанавливаемую позицию
    if (isRestoringPosition) return;

    const isPaged = settings.get('readingMode') === 'paged';
    let pct = 0;

    if (isPaged) {
        const content = contentScrollEl;
        if (content) {
            const scrollable = content.scrollWidth - content.clientWidth;
            if (scrollable > 0) {
                pct = content.scrollLeft / scrollable;
            }
            const { totalPages, curPage, pageWidth } = getPaginationMetrics(content);
            if (pageWidth > 0) {
                currentPagedIndex = curPage;
                if (typeof syncScrubberUI === 'function') {
                    syncScrubberUI(curPage, totalPages, true);
                }
            }
        }
    } else {
        const docEl = document.documentElement;
        const scrollY = window.scrollY || docEl.scrollTop || 0;
        const scrollable = docEl.scrollHeight - window.innerHeight;
        if (scrollable > 0) {
            pct = scrollY / scrollable;
        }
        if (typeof syncScrubberUI === 'function') {
            syncScrubberUI(pct * 100, 100, false);
        }
    }

    if (!Number.isFinite(pct) || Number.isNaN(pct)) {
        return;
    }

    const clamped = Math.min(Math.max(pct, 0), 1);

    // Ключ считается лениво: при SPA-навигации (history.pushState)
    // getFicParams() уже отдаёт новую главу, и позиция пишется туда, куда
    // надо — поэтому ключ нельзя замыкать один раз при старте
    const { ficId: curFicId, partId: curPartId } = getFicParams();
    if (!curFicId) return;
    const effectivePartId = curPartId || 'root';

    try {
        localStorage.setItem(STORAGE_KEYS.chapterPos(curFicId, effectivePartId), clamped.toFixed(4));
        localStorage.setItem(STORAGE_KEYS.lastActive(curFicId), effectivePartId);
        updateFurthestRead(curFicId, effectivePartId, clamped);
        // Баннер «Вернуться к чтению» больше не нужен когда пользователь
        // дочитал до furthest-точки (или дальше)
        if (resumeBannerEl) {
            const furthest = readFurthestRead(curFicId);
            if (!furthest || clamped >= furthest.pct - 0.05) removeResumeBanner();
        }
    } catch (_) {}
}

function cancelPendingSave() {
    if (scrollThrottleTimer) {
        clearTimeout(scrollThrottleTimer);
        scrollThrottleTimer = null;
    }
}

// Запоминает текущую смонтированную главу/работу — savePos берёт их как
// дефолтный таргет, а navigateToChapter вычисляет покидаемую главу
function setActiveMountedPart(partId, ficId = null) {
    activeMountedPartId = partId || 'root';
    if (ficId) activeMountedFicId = ficId;
}

// Отмечает последнюю ОТКРЫТУЮ главу (в отличие от furthest-read — последней
// реально прочитанной точки)
function markActiveChapter(ficId, partId) {
    if (!ficId) return;
    const targetPart = partId || 'root';
    try {
        localStorage.setItem(STORAGE_KEYS.lastActive(ficId), targetPart);
    } catch (_) {}
}

// Furthest-read: последняя реально прочитанная точка. Только вперёд — pct не
// уменьшается внутри главы, а смена главы требует > 5% прогресса, чтобы
// беглый взгляд в следующую главу не перетёр настоящую точку. Это якорь для
// подсказки «вернуться к месту чтения» после отката сессии браузером.
function updateFurthestRead(ficId, partId, pct) {
    if (!ficId) return;
    const targetPart = partId || 'root';
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.furthestRead(ficId));
        const stored = raw ? JSON.parse(raw) : null;

        if (stored && stored.partId === targetPart) {
            if (pct > (Number(stored.pct) || 0)) {
                localStorage.setItem(STORAGE_KEYS.furthestRead(ficId), JSON.stringify({ partId: targetPart, pct }));
            }
        } else if (pct > 0.05) {
            localStorage.setItem(STORAGE_KEYS.furthestRead(ficId), JSON.stringify({ partId: targetPart, pct }));
        }
    } catch (_) {}
}

function onScrollThrottle() {
    cancelPendingSave();
    scrollThrottleTimer = setTimeout(savePos, 100);
}

function setupScrollPositionTracking() {
    if (isScrollTrackingActive) return;

    const { ficId } = getFicParams();
    if (!ficId) return;

    isScrollTrackingActive = true;

    window.addEventListener('scroll', onScrollThrottle, { passive: true });
    rebindContentScrollListener(document.querySelector('#content'));

    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            savePos();
        } else {
            // После разблокировки экрана GeckoView может восстановить DOM но убить
            // JS-процесс — тогда listeners на кнопках мертвы. Проверяем по FAB:
            // если наш DOM есть но FAB не найден или не имеет слушателей — reload.
            if (isInitialized && !document.getElementById('m3-fab')) {
                location.reload();
            }
        }
    });
    window.addEventListener('pagehide', savePos);
}

// Перепривязка слушателя скролла #content при SPA-смене главы: старый узел
// заменяется новым, и его слушатель иначе остаётся на удалённом элементе
function rebindContentScrollListener(newContent) {
    if (contentScrollEl) {
        contentScrollEl.removeEventListener('scroll', onScrollThrottle);
    }
    if (!newContent) {
        contentScrollEl = null;
        return;
    }
    contentScrollEl = newContent;
    newContent.addEventListener('scroll', onScrollThrottle, { passive: true });
}

async function restoreScrollPosition(storageKey) {
    let rawVal = null;
    try {
        rawVal = localStorage.getItem(storageKey);
    } catch (_) {}

    if (!rawVal) return;

    const savedPct = parseFloat(rawVal);
    if (isNaN(savedPct) || !isFinite(savedPct) || savedPct <= 0.0005) return;

    isRestoringPosition = true;

    const targetContent = document.querySelector('#content');

    const applyScroll = () => {
        requestAnimationFrame(() => {
            const content = document.querySelector('#content');
            if (content !== targetContent) { isRestoringPosition = false; return; }
            const isPaged = settings.get('readingMode') === 'paged';

            if (isPaged && content) {
                // Snap columns to integers first, otherwise scrollWidth is
                // measured against a fractional column grid
                if (typeof snapPagedColumns === 'function') {
                    snapPagedColumns(content);
                }

                const scrollable = content.scrollWidth - content.clientWidth;
                if (scrollable > 0) {
                    content.scrollLeft = scrollable * savedPct;
                }
                const { totalPages, curPage, pageWidth } = getPaginationMetrics(content);
                if (pageWidth > 0) {
                    content.scrollLeft = (curPage - 1) * pageWidth;
                    currentPagedIndex = curPage;
                }
            } else {
                const scrollable = document.documentElement.scrollHeight - window.innerHeight;
                if (scrollable > 0) {
                    window.scrollTo(0, scrollable * savedPct);
                }
            }
            recalculateMetrics();
            // Короткий буфер: trailing scroll-события от layout-сдвига не должны
            // запустить savePos, пока позиция ещё устаканивается
            setTimeout(() => { isRestoringPosition = false; }, 120);
        });
    };

    // Ждём прогрузки картинок перед замером scrollHeight — иначе на главах с
    // изображениями восстановленное смещение «недотягивает» (ограничено 600ms)
    const checkReadyAndApply = () => {
        const content = document.querySelector('#content');
        const images = content ? [...content.querySelectorAll('img')] : [];
        const pendingImages = images.filter((img) => !img.complete);

        if (pendingImages.length > 0) {
            const imgPromises = pendingImages.map((img) => new Promise((res) => {
                img.addEventListener('load', res, { once: true });
                img.addEventListener('error', res, { once: true });
            }));
            Promise.race([
                Promise.all(imgPromises),
                new Promise((res) => setTimeout(res, 600))
            ]).then(applyScroll);
        } else {
            applyScroll();
        }
    };

    // Web font selected: wait for its layout reflow before measuring the
    // scroll offset. System font: no font fetch in flight, skip the wait.
    const fontFamily = settings.get('fontFamily');
    const firstFamily = fontFamily ? fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '') : '';
    if (document.fonts && firstFamily && WEB_FONT_URLS[firstFamily]) {
        try {
            await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 3000))]);
            // Завершение браузерного reflow шрифтов перед расчетом смещения
            await new Promise((resolve) => setTimeout(resolve, 60));
        } catch (_) {}
    }

    checkReadyAndApply();
}

// Восстанавливает переданный pct напрямую (resume-тап с карточки проносит
// pct через sessionStorage, минуя localStorage, чтобы устаревший chapterPos
// не перебил намерение). Аналог restoreScrollPosition, но источник pct — аргумент.
function restoreScrollToPct(pct) {
    const clamped = Math.min(Math.max(Number(pct) || 0, 0), 1);
    isRestoringPosition = true;

    return new Promise((resolve) => {
        const finish = () => {
            setTimeout(() => { isRestoringPosition = false; }, 120);
            resolve();
        };

        const targetContent = document.querySelector('#content');

        const applyScroll = () => {
            requestAnimationFrame(() => {
                const content = document.querySelector('#content');
                if (content !== targetContent) { isRestoringPosition = false; finish(); return; }
                const isPaged = settings.get('readingMode') === 'paged';

                if (isPaged && content) {
                    if (typeof snapPagedColumns === 'function') {
                        snapPagedColumns(content);
                    }
                    const scrollable = content.scrollWidth - content.clientWidth;
                    if (scrollable > 0) {
                        content.scrollLeft = scrollable * clamped;
                    }
                    const { totalPages, curPage, pageWidth } = getPaginationMetrics(content);
                    if (pageWidth > 0) {
                        content.scrollLeft = (curPage - 1) * pageWidth;
                        currentPagedIndex = curPage;
                    }
                } else {
                    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
                    if (scrollable > 0) {
                        window.scrollTo(0, scrollable * clamped);
                    }
                }
                recalculateMetrics();
                finish();
            });
        };

        const checkReadyAndApply = () => {
            const content = document.querySelector('#content');
            const images = content ? [...content.querySelectorAll('img')] : [];
            const pendingImages = images.filter((img) => !img.complete);

            if (pendingImages.length > 0) {
                const imgPromises = pendingImages.map((img) => new Promise((res) => {
                    img.addEventListener('load', res, { once: true });
                    img.addEventListener('error', res, { once: true });
                }));
                Promise.race([
                    Promise.all(imgPromises),
                    new Promise((res) => setTimeout(res, 600))
                ]).then(applyScroll);
            } else {
                applyScroll();
            }
        };

        const fontFamily = settings.get('fontFamily');
        const firstFamily = fontFamily ? fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '') : '';
        if (document.fonts && firstFamily && WEB_FONT_URLS[firstFamily]) {
            document.fonts.ready
                .then(() => new Promise((r) => setTimeout(r, 60)))
                .then(checkReadyAndApply)
                .catch(checkReadyAndApply);
        } else {
            checkReadyAndApply();
        }
    });
}

// --- engine/reading-mode.js ---
// Snap the paged column grid to whole CSS pixels.
//
// The multi-column spec makes the used column width equal to the element's
// available width, which is fractional in practice (100vw minus paddings on
// fractional-DPR screens). Page-turn math scrolls in integer clientWidth
// steps, so the rounding drift accumulates page over page and lets the next
// column's glyphs peek in as a 1-2px sliver along the right edge. Pinning
// #content to an integer width (and the same integer as column-width) makes
// the column grid and the scroll math coincide exactly.
function snapPagedColumns(content) {
    const parent = content.parentElement;
    if (!parent) return;

    const avail = parent.getBoundingClientRect().width
        - parseFloat(getComputedStyle(parent).paddingLeft)
        - parseFloat(getComputedStyle(parent).paddingRight);
    const targetWidth = Math.floor(avail);

    if (!Number.isFinite(targetWidth) || targetWidth <= 0) return;

    const widthPx = `${targetWidth}px`;
    if (content.style.width === widthPx) return;

    content.style.setProperty('width', widthPx, 'important');
    content.style.setProperty('column-width', widthPx, 'important');
}

function recalculateMetrics() {
    const isPaged = settings.get('readingMode') === 'paged';
    const content = document.querySelector('#content');
    if (!content) return;

    if (isPaged) {
        snapPagedColumns(content);
        const { totalPages, curPage, pageWidth } = getPaginationMetrics(content);
        if (pageWidth > 0) {
            currentPagedIndex = curPage;

            if (typeof renderScrubberTicks === 'function') {
                renderScrubberTicks(totalPages);
            }
            if (typeof syncScrubberUI === 'function') {
                syncScrubberUI(curPage, totalPages, true);
            }
        }
    } else {
        if (typeof scrubberElements !== 'undefined' && scrubberElements && scrubberElements.ticksContainer) {
            scrubberElements.ticksContainer.replaceChildren();
        }
        const docEl = document.documentElement;
        const scrollable = docEl.scrollHeight - window.innerHeight;
        const scrollY = window.scrollY || docEl.scrollTop || 0;
        const pct = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
        if (typeof syncScrubberUI === 'function') {
            syncScrubberUI(pct, 100, false);
        }
    }
}

function turnPage(delta, isSmooth = false) {
    const content = document.querySelector('#content');
    if (!content) return;

    const { totalPages, pageWidth } = getPaginationMetrics(content);
    if (pageWidth <= 0) return;

    const targetPage = Math.min(totalPages, Math.max(1, currentPagedIndex + delta));

    if (targetPage === currentPagedIndex) return;

    currentPagedIndex = targetPage;
    content.scrollTo({
        left: (targetPage - 1) * pageWidth,
        behavior: isSmooth ? 'smooth' : 'instant'
    });

    if (typeof syncScrubberUI === 'function') {
        syncScrubberUI(currentPagedIndex, totalPages, true);
    }
}

// Handles for pending async recalculation — cancelled if mode switches again
// before they fire, so stale callbacks never move headerCard to the wrong place.
let _applyModeRafId = null;
let _applyModeTimerId = null;

function applyReadingMode(mode) {
    // Cancel any outstanding callbacks from a previous (now-superseded) call so
    // rapid paged↔scroll toggling doesn't accumulate stale rAF/setTimeout tasks
    // that each try to move headerCard based on their own captured `mode`.
    if (_applyModeRafId !== null) {
        cancelAnimationFrame(_applyModeRafId);
        _applyModeRafId = null;
    }
    if (_applyModeTimerId !== null) {
        clearTimeout(_applyModeTimerId);
        _applyModeTimerId = null;
    }

    const isPaged = mode === 'paged';
    document.body.classList.toggle('is-paged-mode', isPaged);

    const headerCard = document.querySelector('.m3-card');
    const textContent = document.querySelector('#content');
    const readerWrapper = document.querySelector('#clean-reader-container');

    // Перемещение шапки в начало колонок при постраничном режиме
    if (headerCard && textContent && readerWrapper) {
        if (isPaged) {
            textContent.prepend(headerCard);
        } else {
            readerWrapper.insertBefore(headerCard, textContent);
        }
    }

    if (isPaged) {
        window.scrollTo(0, 0);
        if (textContent) {
            textContent.scrollLeft = 0;
        }
        snapPagedColumns(textContent);
        currentPagedIndex = 1;
    } else {
        // Remove the pinned integer width so scroll mode reflows freely
        if (textContent) {
            textContent.style.removeProperty('width');
            textContent.style.removeProperty('column-width');
            textContent.scrollLeft = 0;
        }
    }

    _applyModeRafId = requestAnimationFrame(() => {
        _applyModeRafId = null;
        recalculateMetrics();
        // Paged mode: column layout may not have settled yet after the rAF;
        // a second pass after 60ms re-snaps the metrics once columns are stable.
        // Scroll mode: single pass is sufficient.
        if (isPaged) {
            _applyModeTimerId = setTimeout(() => {
                _applyModeTimerId = null;
                recalculateMetrics();
            }, 60);
        }
    });
}

// --- ui/gestures.js ---
function bindSwipeToDismiss(sheetNode, closeFn) {
    if (!sheetNode || typeof closeFn !== 'function') return;

    let startY = 0;
    let deltaY = 0;
    let isDragging = false;

    const bar = sheetNode.querySelector('.m3-drag-handle-bar') || sheetNode;

    const onTouchStart = (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        // Keep the drag from bubbling to pull-navigate's window listeners,
        // which would track the same vertical movement and fire a chapter
        // change while the sheet is still open.
        e.stopPropagation();
        startY = e.touches[0].clientY;
        deltaY = 0;
        isDragging = true;
        sheetNode.style.transition = 'none';
    };

    const onTouchMove = (e) => {
        if (!isDragging || !e.touches || e.touches.length !== 1) return;
        e.stopPropagation();
        const diff = e.touches[0].clientY - startY;
        if (diff > 0) {
            deltaY = diff;
            sheetNode.style.transform = `translateY(${diff}px)`;
        }
    };

    const onTouchEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        sheetNode.style.transition = '';
        // Always clear the inline transform: leaving it in place overrides
        // the stylesheet's closed transform (translateY(105%)) and the sheet
        // would stay visible, detached from its own dismiss animation.
        sheetNode.style.transform = '';

        if (deltaY > 80) {
            closeFn();
        } else if (deltaY > 10) {
            // The synthetic click that follows a touch drag would land on
            // the handle's tap-to-dismiss and close the sheet even though
            // the swipe snapped back. Arm a one-shot suppression.
            bar.dataset.swiped = '1';
            setTimeout(() => { delete bar.dataset.swiped; }, 300);
        }
    };

    bar.addEventListener('touchstart', onTouchStart, { passive: true });
    bar.addEventListener('touchmove', onTouchMove, { passive: true });
    bar.addEventListener('touchend', onTouchEnd);
    bar.addEventListener('touchcancel', onTouchEnd);
}

// --- ui/footnotes.js ---
const footnotesMap = new Map();
let footnoteDialogEl = null;
let footnoteScrimEl = null;

function setFootnoteOpen(isOpen) {
    if (footnoteDialogEl) footnoteDialogEl.classList.toggle('open', isOpen);
    if (footnoteScrimEl) footnoteScrimEl.classList.toggle('open', isOpen);
}

// Публичный close идёт через менеджер оверлеев (валидация стека)
function closeFootnote() {
    OverlayManager.close('footnote');
}

// Сноска открывается с контентом (showFootnote), поэтому open в реестре
// пустой — стек переключается через markOpen
OverlayManager.register('footnote', {
    open: () => {},
    close: () => setFootnoteOpen(false),
    isOpen: () => Boolean(footnoteDialogEl && footnoteDialogEl.classList.contains('open'))
});

function ensureFootnoteElements() {
    if (footnoteDialogEl && footnoteScrimEl) return;

    footnoteScrimEl = el('div', {
        className: 'm3-footnote-scrim',
        events: { click: closeFootnote }
    });

    const titleEl = el('div', { className: 'm3-footnote-title', text: 'Сноска' });
    const bodyEl = el('div', { className: 'm3-footnote-body' });

    footnoteDialogEl = el('div', {
        className: 'm3-footnote-dialog'
    }, [titleEl, bodyEl]);

    document.body.appendChild(footnoteScrimEl);
    document.body.appendChild(footnoteDialogEl);
}

function showFootnote(title, content) {
    ensureFootnoteElements();

    const titleEl = footnoteDialogEl.querySelector('.m3-footnote-title');
    const bodyEl = footnoteDialogEl.querySelector('.m3-footnote-body');

    if (titleEl) {
        titleEl.textContent = title || 'Сноска';
    }
    if (bodyEl) {
        if (typeof content === 'string') {
            bodyEl.innerHTML = sanitizeHtml(content);
        } else if (content instanceof Node) {
            bodyEl.replaceChildren(content);
        }
    }

    // markOpen вызывается синхронно с setFootnoteOpen, чтобы стек оверлеев и
    // DOM-класс open менялись в одном rAF-тике. Если вызвать markOpen до rAF,
    // то за ~16ms между markOpen и открытием dialog можно успеть вызвать
    // OverlayManager.close('footnote'): id вынут из стека, а isOpen()=false
    // (класс ещё не добавлен), поэтому api.close() не сработает; после rAF
    // класс open появится и сноска застрянет.
    requestAnimationFrame(() => {
        OverlayManager.markOpen('footnote');
        setFootnoteOpen(true);
    });
}

// root: живой документ при начальной загрузке, распарсенный документ —
// при SPA-смене главы. Контейнеры сносок удаляются из root, чтобы в
// смонтированный DOM они не попадали.
function collectFootnotesFromPage(root = document) {
    footnotesMap.clear();

    // 1. Ficbook stores inline translations in a page script as textFootnotes object.
    // Read it before touching the DOM — script tags live outside root.
    try {
        const scripts = (root === document ? document : root).querySelectorAll('script:not([src])');
        for (const s of scripts) {
            const m = s.textContent.match(/const\s+textFootnotes\s*=\s*(\{[\s\S]*?\})/);
            if (m) {
                const data = JSON.parse(m[1]);
                for (const [key, val] of Object.entries(data)) {
                    footnotesMap.set(key, val);
                    const numMatch = key.match(/(\d+)$/);
                    if (numMatch) footnotesMap.set(numMatch[1], val);
                }
                break;
            }
        }
    } catch (_) {}

    // 2. Classic .part-footnotes nodes (other authors / older markup)
    const footnoteNodes = root.querySelectorAll(
        '.part-footnotes li, .part-footnotes .footnote, .part_footnotes li, .part_footnotes .footnote,' +
        ' [id^="footnote-"], [id^="fn-"], .footnote-item,' +
        ' .part-footnote-item, [data-footnote-id], .part-footnotes > p'
    );

    footnoteNodes.forEach((node) => {
        const id = node.id || node.getAttribute('data-id') || node.getAttribute('data-footnote-id');
        const clone = node.cloneNode(true);

        clone.querySelectorAll('.back-link, a[href^="#fnref"]').forEach((n) => n.remove());
        const contentHtml = clone.innerHTML.trim();
        if (!contentHtml) return;

        if (id) {
            footnotesMap.set(id, contentHtml);
            const numMatch = id.match(/\d+/);
            if (numMatch) {
                footnotesMap.set(numMatch[0], contentHtml);
            }
        }
    });

    root.querySelectorAll('.part-footnotes, .part_footnotes').forEach((c) => c.remove());

    // 3. Replace <span class="footnote" id="fn_..."> anchors with clickable [?] links.
    // Ficbook uses these as inline translation markers; text lives in textFootnotes.
    root.querySelectorAll('span.footnote[id]').forEach((anchor) => {
        const id = anchor.id;
        if (!footnotesMap.has(id)) return;
        const a = document.createElement('a');
        a.className = 'part-footnote';
        a.href = '#' + id;
        a.textContent = '[?]';
        anchor.replaceWith(a);
    });
}

function setupFootnoteInterception(container) {
    if (!container) return;

    container.addEventListener('click', (e) => {
        const link = e.target.closest(
            'a.part-footnote, a.footnote-link, a[href*="#footnote"], a[href*="#fn-"], a[href^="#fn"]'
        );
        if (!link) return;

        e.preventDefault();
        e.stopPropagation();

        const href = link.getAttribute('href') || '';
        const targetId = href.startsWith('#') ? href.slice(1) : href.split('#')[1];
        const linkText = link.textContent.trim();

        let footnoteText = null;

        if (targetId && footnotesMap.has(targetId)) {
            footnoteText = footnotesMap.get(targetId);
        } else if (targetId) {
            const numMatch = targetId.match(/\d+/);
            if (numMatch && footnotesMap.has(numMatch[0])) {
                footnoteText = footnotesMap.get(numMatch[0]);
            }
        }

        if (!footnoteText) {
            // Прямой поиск по id в живом DOM — на случай если сноски
            // не попали в footnotesMap (нестандартные селекторы)
            if (targetId) {
                const node = document.getElementById(targetId);
                if (node) {
                    const clone = node.cloneNode(true);
                    clone.querySelectorAll('.back-link, a[href^="#fnref"]').forEach((n) => n.remove());
                    footnoteText = clone.innerHTML.trim() || null;
                }
            }
        }

        if (!footnoteText) {
            const titleAttr = link.getAttribute('title') || link.getAttribute('data-content') || link.getAttribute('data-footnote');
            if (titleAttr) {
                footnoteText = titleAttr;
            }
        }

        if (footnoteText) {
            const numLabel = linkText.replace(/[^\d]/g, '');
            showFootnote(numLabel ? `Сноска ${numLabel}` : 'Сноска', footnoteText);
        }
    });
}

// --- ui/palette-dialog.js ---
let paletteDialogEl = null;

function dismissPaletteDialog() {
    if (!paletteDialogEl) return;
    paletteDialogEl.classList.remove('is-open');
    setTimeout(() => {
        if (paletteDialogEl) {
            paletteDialogEl.remove();
            paletteDialogEl = null;
        }
    }, 200);
}

// Публичный close идёт через менеджер оверлеев (валидация стека)
function closePaletteDialog() {
    OverlayManager.close('palette');
}

OverlayManager.register('palette', {
    open: buildPaletteDialog,
    close: dismissPaletteDialog,
    isOpen: () => Boolean(paletteDialogEl && paletteDialogEl.classList.contains('is-open'))
});

function normalizeHex(val) {
    if (!val) return null;
    let clean = val.trim();
    if (!clean.startsWith('#')) clean = '#' + clean;
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(clean) ? clean.toUpperCase() : null;
}

// Открытие идёт через менеджер: оно взаимоисключающе закроет любой другой
// открытый оверлей
function openPaletteDialog() {
    OverlayManager.open('palette');
}

function buildPaletteDialog() {
    if (paletteDialogEl) {
        paletteDialogEl.remove();
        paletteDialogEl = null;
    }

    const currentBg = settings.get('customBg') || DEFAULT_THEME_COLORS.bg;
    const currentText = settings.get('customText') || DEFAULT_THEME_COLORS.text;

    let tempBg = currentBg;
    let tempText = currentText;

    const bgSwatch = el('div', {
        className: 'm3-color-swatch',
        attrs: { style: `background-color: ${tempBg};` }
    });

    const textSwatch = el('div', {
        className: 'm3-color-swatch',
        attrs: { style: `background-color: ${tempText};` }
    });

    const previewBox = el('div', {
        className: 'm3-dialog-preview',
        attrs: { style: `background-color: ${tempBg}; color: ${tempText};` }
    }, ['Образец текста главы на выбранном фоне читалки.']);

    const updatePreview = () => {
        const validBg = normalizeHex(bgInput.value);
        const validText = normalizeHex(textInput.value);

        if (validBg) {
            tempBg = validBg;
            bgSwatch.style.backgroundColor = validBg;
            previewBox.style.backgroundColor = validBg;
        }
        if (validText) {
            tempText = validText;
            textSwatch.style.backgroundColor = validText;
            previewBox.style.color = validText;
        }
    };

    const bgInput = el('input', {
        className: 'm3-hex-input',
        attrs: {
            type: 'text',
            value: tempBg,
            maxlength: '7',
            placeholder: '#141414',
            'aria-label': 'HEX цвет фона'
        },
        events: { input: updatePreview }
    });

    const textInput = el('input', {
        className: 'm3-hex-input',
        attrs: {
            type: 'text',
            value: tempText,
            maxlength: '7',
            placeholder: '#E0E0E0',
            'aria-label': 'HEX цвет текста'
        },
        events: { input: updatePreview }
    });

    const resetBtn = el('button', {
        className: 'm3-dialog-btn reset',
        text: 'Сброс',
        attrs: { type: 'button' },
        events: {
            click: () => {
                bgInput.value = DEFAULT_THEME_COLORS.bg;
                textInput.value = DEFAULT_THEME_COLORS.text;
                updatePreview();
            }
        }
    });

    const cancelBtn = el('button', {
        className: 'm3-dialog-btn',
        text: 'Отмена',
        attrs: { type: 'button' },
        events: { click: closePaletteDialog }
    });

    const saveBtn = el('button', {
        className: 'm3-dialog-btn',
        text: 'Сохранить',
        attrs: { type: 'button' },
        events: {
            click: () => {
                const finalBg = normalizeHex(bgInput.value) || currentBg;
                const finalText = normalizeHex(textInput.value) || currentText;

                settings.set('customBg', finalBg);
                settings.set('customText', finalText);
                applyThemeColors(finalBg, finalText);

                closePaletteDialog();
            }
        }
    });

    const dialogContent = el('div', {
        className: 'm3-dialog',
        events: { click: (e) => e.stopPropagation() }
    }, [
        el('h3', { className: 'm3-dialog-title', text: 'Палитра читалки' }),

        el('div', { className: 'm3-dialog-field' }, [
            el('span', { className: 'm3-dialog-label', text: 'Цвет фона (HEX)' }),
            el('div', { className: 'm3-color-input-row' }, [bgSwatch, bgInput])
        ]),

        el('div', { className: 'm3-dialog-field' }, [
            el('span', { className: 'm3-dialog-label', text: 'Цвет текста (HEX)' }),
            el('div', { className: 'm3-color-input-row' }, [textSwatch, textInput])
        ]),

        previewBox,

        el('div', { className: 'm3-dialog-actions' }, [resetBtn, cancelBtn, saveBtn])
    ]);

    paletteDialogEl = el('div', {
        className: 'm3-dialog-scrim',
        events: { click: closePaletteDialog }
    }, [dialogContent]);

    document.body.appendChild(paletteDialogEl);
    requestAnimationFrame(() => {
        paletteDialogEl.classList.add('is-open');
    });
}

// --- ui/scrubber.js ---
let scrubberElements = null;
let isScrubberDragging = false;
let cachedScrubberMetrics = null;

function buildTextScrubber() {
    const bubble = el('div', { className: 'm3-slider-bubble', text: '0%' });
    const activeFill = el('div', { className: 'm3-slider-active-fill' });
    const thumbLine = el('div', { className: 'm3-slider-thumb-line' });
    const ticksContainer = el('div', { className: 'm3-slider-ticks' });
    const track = el('div', { className: 'm3-slider-track' }, [activeFill, ticksContainer]);

    const rangeInput = el('input', {
        className: 'm3-slider-native-input',
        attrs: {
            type: 'range',
            min: '0',
            max: '100',
            step: '1',
            value: '0',
            'aria-label': 'Перемотка текста главы'
        }
    });

    const scrubberWrap = el('div', { className: 'm3-scrubber-dock' }, [
        el('div', { className: 'm3-slider-track-wrap' }, [
            bubble,
            track,
            thumbLine,
            rangeInput
        ])
    ]);

    const startDrag = () => {
        isScrubberDragging = true;
        bubble.classList.add('visible');
        document.body.classList.add('is-scrubbing');

        const isPaged = settings.get('readingMode') === 'paged';
        const content = document.querySelector('#content');

        if (isPaged && content) {
            const { totalPages, pageWidth } = getPaginationMetrics(content);
            cachedScrubberMetrics = { isPaged: true, w: pageWidth, totalPages, content };
        } else {
            const docEl = document.documentElement;
            const maxScroll = docEl.scrollHeight - window.innerHeight;
            cachedScrubberMetrics = { isPaged: false, maxScroll };
        }
    };

    const stopDrag = () => {
        isScrubberDragging = false;
        cachedScrubberMetrics = null;
        bubble.classList.remove('visible');
        document.body.classList.remove('is-scrubbing');
    };

    rangeInput.addEventListener('pointerdown', startDrag);

    rangeInput.addEventListener('input', (e) => {
        if (!cachedScrubberMetrics) {
            startDrag();
        }

        if (cachedScrubberMetrics.isPaged) {
            const { w, totalPages, content } = cachedScrubberMetrics;
            const page = parseInt(e.target.value, 10);
            if (content && w > 0) {
                content.scrollTo({ left: (page - 1) * w, behavior: 'instant' });
                if (typeof currentPagedIndex !== 'undefined') {
                    currentPagedIndex = page;
                }
            }
            syncScrubberUI(page, totalPages, true);
        } else {
            const { maxScroll } = cachedScrubberMetrics;
            const val = parseFloat(e.target.value);
            if (maxScroll > 0) {
                window.scrollTo(0, maxScroll * (val / 100));
            }
            syncScrubberUI(val, 100, false);
        }
    });

    rangeInput.addEventListener('pointerup', stopDrag);
    rangeInput.addEventListener('pointercancel', stopDrag);
    rangeInput.addEventListener('touchend', stopDrag);
    rangeInput.addEventListener('touchcancel', stopDrag);
    rangeInput.addEventListener('change', stopDrag);

    scrubberElements = {
        bubble,
        activeFill,
        thumbLine,
        ticksContainer,
        rangeInput
    };

    return scrubberWrap;
}

function renderScrubberTicks(total) {
    if (!scrubberElements) return;
    const container = scrubberElements.ticksContainer;
    container.replaceChildren();

    if (total <= 2) return;

    const step = total > 40 ? Math.ceil(total / 30) : 1;
    const frag = document.createDocumentFragment();

    for (let i = 1 + step; i < total; i += step) {
        const pct = ((i - 1) / (total - 1)) * 100;
        if (pct <= 0 || pct >= 100) continue;

        const tick = el('div', {
            className: 'm3-slider-tick',
            attrs: { style: `left: ${pct}%;` }
        });
        frag.appendChild(tick);
    }

    container.appendChild(frag);
}

function syncScrubberUI(current, total, isPaged) {
    if (!scrubberElements) return;
    const { bubble, activeFill, thumbLine, rangeInput } = scrubberElements;

    if (isPaged) {
        rangeInput.min = '1';
        rangeInput.max = `${total}`;
        rangeInput.step = '1';
        rangeInput.value = `${current}`;

        const pct = total > 1 ? Math.min(100, Math.max(0, ((current - 1) / (total - 1)) * 100)) : 50;
        bubble.textContent = `${current} / ${total}`;
        bubble.style.left = `${pct}%`;
        thumbLine.style.left = `${pct}%`;
        activeFill.style.width = `${pct}%`;
    } else {
        rangeInput.min = '0';
        rangeInput.max = '100';
        rangeInput.step = '1';
        rangeInput.value = `${Math.round(current)}`;

        const pct = Math.min(Math.max(current, 0), 100);
        bubble.textContent = `${Math.round(pct)}%`;
        bubble.style.left = `${pct}%`;
        thumbLine.style.left = `${pct}%`;
        activeFill.style.width = `${pct}%`;
    }
}

// --- ui/nav-group.js ---
let navLinks = { prev: null, next: null };

// Парсинг prev/next из контейнера навигации ficbook. Работает и с живым
// документом, и с распарсенным через DOMParser: getAttribute('href') вместо
// .href, потому что у распарсенного документа base URL about:blank и .href
// резолвит мусор. Результат пишется в глобал navLinks.
function resolveNavLinksFrom(container) {
    const prevA = container?.querySelector('.btn-prev, a[href*="part_content"]:first-child');
    const nextA = container?.querySelector('.btn-next, a[href*="part_content"]:last-child');

    const isPrevValid = Boolean(prevA && (prevA.classList.contains('btn-prev') || prevA.textContent.includes('Назад')));
    const isNextValid = Boolean(nextA && (nextA.classList.contains('btn-next') || nextA.textContent.includes('Вперёд')));

    const prevHref = prevA?.getAttribute('href');
    const nextHref = nextA?.getAttribute('href');

    navLinks.prev = isPrevValid && prevHref ? absoluteUrl(prevHref.split('#')[0]) : null;
    navLinks.next = isNextValid && nextHref ? absoluteUrl(nextHref.split('#')[0]) : null;

    return { prev: navLinks.prev, next: navLinks.next, isPrevValid, isNextValid };
}

// Обновление уже построенной шторки при SPA-смене главы: navLinks
// перевычисляется, а кнопки патчатся на месте
function refreshNavLinks(container) {
    resolveNavLinksFrom(container);
    patchNavBtn(document.querySelector('.m3-connected-btn.prev-btn'), navLinks.prev);
    patchNavBtn(document.querySelector('.m3-connected-btn.next-btn'), navLinks.next);
}

function patchNavBtn(btn, href) {
    if (!btn) return;
    if (href) {
        btn.setAttribute('href', href);
        btn.classList.remove('disabled');
    } else {
        btn.removeAttribute('href');
        btn.classList.add('disabled');
    }
}

function buildConnectedNav(container) {
    const { isPrevValid, isNextValid } = resolveNavLinksFrom(container);

    const onChapterChangeClick = (e) => {
        const href = e.currentTarget.getAttribute('href');
        if (!href) {
            e.preventDefault();
            return;
        }
        // SPA-переход вместо полной перезагрузки; fallback на window.location
        // происходит внутри navigateToChapter при ошибке fetch/парсинга
        e.preventDefault();
        navigateToChapter(absoluteUrl(href));
    };

    let lastTocTrigger = 0;
    const handleTocOpen = (e) => {
        const now = Date.now();
        if (now - lastTocTrigger < 400) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        lastTocTrigger = now;
        e.preventDefault();
        e.stopPropagation();

        // Поглощаем отложенный синтетический клик браузера в фазе capture
        const suppressGhostClick = (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            window.removeEventListener('click', suppressGhostClick, true);
        };

        window.addEventListener('click', suppressGhostClick, true);
        setTimeout(() => {
            window.removeEventListener('click', suppressGhostClick, true);
        }, 400);

        // Через менеджер оверлеев: он закроет всё прочее открытое и
        // поставит оглавление на вершину стека (Escape/свайпы видят его)
        OverlayManager.open('toc');
    };

    // Card-return target: the work's root URL. No flags are set — a leaked
    // fic_nav_fresh_chapter would wipe the next chapter's saved position,
    // and fic_read_intent is only for entering the reader from the card.
    const { ficId } = getFicParams();
    const cardHref = ficId ? `/readfic/${ficId}` : null;

    return el('div', { className: 'm3-connected-group' }, [
        el('a', {
            className: `m3-connected-btn prev-btn${isPrevValid ? '' : ' disabled'}`,
            attrs: { href: navLinks.prev, 'aria-label': 'Предыдущая глава' },
            events: { click: onChapterChangeClick }
        }, [createSvgIcon(ICONS.arrowBack), ' Назад']),

        el('a', {
            className: 'm3-connected-btn card-btn icon-only',
            attrs: { href: cardHref, 'aria-label': 'Карточка книги' },
        }, [createSvgIcon(ICONS.autoStories)]),

        el('button', {
            className: 'm3-connected-btn toc-btn icon-only',
            attrs: { type: 'button', 'aria-label': 'Открыть оглавление' },
            events: {
                pointerup: handleTocOpen,
                click: handleTocOpen
            }
        }, [createSvgIcon(ICONS.menuBook)]),

        el('a', {
            className: `m3-connected-btn next-btn${isNextValid ? '' : ' disabled'}`,
            attrs: { href: navLinks.next, 'aria-label': 'Следующая глава' },
            events: { click: onChapterChangeClick }
        }, ['Вперёд ', createSvgIcon(ICONS.arrowNext)])
    ]);
}

// --- ui/toc.js ---
let tocSheetEl = null;
let tocScrimEl = null;

function setTocSheetOpen(isOpen) {
    if (tocSheetEl) {
        tocSheetEl.classList.toggle('open', isOpen);
        // Secondary guard: a swipe that left an inline translateY would
        // override the stylesheet's closed transform and keep the sheet
        // visible mid-screen.
        if (!isOpen) tocSheetEl.style.transform = '';
    }
    if (tocScrimEl) tocScrimEl.classList.toggle('open', isOpen);

    // When closing, remove the TOC scroll handler so it doesn't linger on
    // listWrapper if the user later SPA-navigates to a work with fewer chapters
    // (where no new slider/handler would be installed to replace it).
    if (!isOpen && tocSheetEl) {
        const lw = tocSheetEl.querySelector('.m3-chapters-list-wrapper');
        if (lw && lw._tocScrollHandler) {
            lw.removeEventListener('scroll', lw._tocScrollHandler);
            lw._tocScrollHandler = null;
        }
    }

    // Lock the chapter text under the sheet in scroll mode; paged mode is
    // horizontally scrolled and unaffected.
    if (settings.get('readingMode') !== 'paged') {
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
}

// Публичный close идёт через менеджер, чтобы стек оверлеев оставался валидным
function closeTocSheet() {
    OverlayManager.close('toc');
}

OverlayManager.register('toc', {
    open: openTocSheet,
    close: () => setTocSheetOpen(false),
    isOpen: () => Boolean(tocSheetEl && tocSheetEl.classList.contains('open'))
});

function buildTocSlider(totalChapters, onScrub) {
    if (totalChapters <= 1) return null;

    const bubble = el('div', { className: 'm3-slider-bubble', text: '1' });
    const activeFill = el('div', { className: 'm3-slider-active-fill' });
    const thumbLine = el('div', { className: 'm3-slider-thumb-line' });
    const track = el('div', { className: 'm3-slider-track' }, [activeFill]);

    const rangeInput = el('input', {
        className: 'm3-slider-native-input',
        attrs: {
            type: 'range',
            min: '1',
            max: `${totalChapters}`,
            step: '1',
            value: '1',
            'aria-label': 'Быстрая прокрутка списка глав'
        }
    });

    const updateSliderUI = (val) => {
        const pct = totalChapters > 1 ? ((val - 1) / (totalChapters - 1)) * 100 : 0;
        bubble.textContent = `${val}`;
        bubble.style.left = `${pct}%`;
        thumbLine.style.left = `${pct}%`;
        activeFill.style.width = `${pct}%`;
    };

    const startScrub = () => {
        bubble.classList.add('visible');
    };

    const stopScrub = () => {
        bubble.classList.remove('visible');
    };

    rangeInput.addEventListener('pointerdown', startScrub);

    rangeInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        updateSliderUI(val);
        if (typeof onScrub === 'function') {
            onScrub(val);
        }
    });

    rangeInput.addEventListener('pointerup', stopScrub);
    rangeInput.addEventListener('pointercancel', stopScrub);
    rangeInput.addEventListener('touchend', stopScrub);
    rangeInput.addEventListener('touchcancel', stopScrub);

    const dock = el('div', { className: 'm3-toc-slider-dock' }, [
        el('div', { className: 'm3-slider-track-wrap' }, [
            bubble,
            track,
            thumbLine,
            rangeInput
        ])
    ]);

    return { dock, setSliderValue: (val) => {
        rangeInput.value = `${val}`;
        updateSliderUI(val);
    }};
}

function ensureTocSheet() {
    if (tocSheetEl && tocScrimEl) return;

    tocScrimEl = el('div', {
        className: 'm3-bottom-sheet-scrim',
        events: { click: closeTocSheet }
    });

    const dragHandle = el('div', {
        className: 'm3-drag-handle-bar',
        attrs: {
            role: 'button',
            tabindex: '0',
            'aria-label': 'Закрыть оглавление'
        },
        events: {
            // Stop propagation so the click never reaches the scrim (which
            // would double-dismiss via OverlayManager) or the sheet body.
            click: (e) => {
                e.stopPropagation();
                // Suppress the synthetic click following a drag on the
                // handle (gestures.js arms this after a snapped-back swipe).
                if (dragHandle.dataset.swiped) {
                    delete dragHandle.dataset.swiped;
                    return;
                }
                closeTocSheet();
            },
            keydown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    closeTocSheet();
                }
            }
        }
    }, [
        el('div', { className: 'm3-drag-handle' })
    ]);

    const listWrapper = el('div', { className: 'm3-chapters-list-wrapper' });

    tocSheetEl = el('div', {
        className: 'm3-bottom-sheet m3-toc-sheet'
    }, [dragHandle, listWrapper]);

    bindSwipeToDismiss(tocSheetEl, closeTocSheet);

    document.body.appendChild(tocScrimEl);
    document.body.appendChild(tocSheetEl);
}

async function openTocSheet() {
    ensureTocSheet();

    const listWrapper = tocSheetEl.querySelector('.m3-chapters-list-wrapper');
    const existingDock = tocSheetEl.querySelector('.m3-toc-slider-dock');
    if (existingDock) existingDock.remove();

    listWrapper.replaceChildren(
        el('div', { className: 'm3-toc-message', text: 'Загрузка списка глав...' })
    );

    requestAnimationFrame(() => {
        setTocSheetOpen(true);
    });

    const { ficId } = getFicParams();
    let chapters = [];

    try {
        chapters = await fetchChaptersList(ficId);
    } catch (e) {
        listWrapper.replaceChildren(
            el('div', { className: 'm3-toc-message', text: 'Не удалось загрузить список глав.' })
        );
        return;
    }

    if (!chapters || chapters.length === 0) {
        listWrapper.replaceChildren(
            el('div', { className: 'm3-toc-message', text: 'В фанфике нет других глав.' })
        );
        return;
    }

    listWrapper.replaceChildren();

    // Актуальный partId на момент открытия шторки: кэш списка печётся один
    // раз, и isCurrent в нём устаревает после SPA-переходов между главами
    const { partId: currentPartId } = getFicParams();

    const chapterElements = [];
    let currentElement = null;
    let currentIndex = 1;

    chapters.forEach((ch, idx) => {
        const isCurrent = Boolean(ch.partId && currentPartId && ch.partId === currentPartId);

        let savedPct = 0;
        try {
            const targetPartId = ch.partId || 'root';
            savedPct = parseFloat(localStorage.getItem(STORAGE_KEYS.chapterPos(ficId, targetPartId))) || 0;
        } catch (_) {}

        const infoCol = el('div', { className: 'm3-ch-item-info-col' }, [
            el('div', { className: 'm3-ch-item-title', text: `${ch.index}. ${ch.title}` }),
            ch.info ? el('div', { className: 'm3-ch-item-sub', text: ch.info }) : null
        ]);

        const progressEl = createCircularProgress(savedPct);

        // Сброс прогресса главы: кольцо становится hit-зоной — hover/focus (или
        // удержание на тач) меняет дугу на крестик, тап стирает сохранённую
        // позицию без запуска навигации ряда. Только когда есть что стирать.
        if (savedPct > 0.005) {
            progressEl.classList.add('is-clearable');
            progressEl.setAttribute('role', 'button');
            progressEl.tabIndex = 0;
            progressEl.title = 'Сбросить прогресс чтения главы';
            progressEl.setAttribute('aria-label', `Сбросить прогресс чтения главы «${ch.title}»`);
            progressEl.appendChild(el('span', {
                className: 'm3-ch-progress-clear',
                attrs: { 'aria-hidden': 'true' }
            }, [createSvgIcon(ICONS.close)]));

            const resetProgress = (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Тач-устройства не дают :hover до первого тапа, поэтому без
                // шага «взвода» этот тап молча стёр бы прогресс, который
                // пользователь только хотел посмотреть. Первый тап на грубом
                // указателе показывает крестик; второй стирает.
                const isCoarse = typeof window.matchMedia === 'function'
                    && window.matchMedia('(hover: none)').matches;
                if (isCoarse && !progressEl.classList.contains('is-armed')) {
                    progressEl.classList.add('is-armed');
                    const disarm = (ev) => {
                        if (!progressEl.contains(ev.target)) {
                            progressEl.classList.remove('is-armed');
                            document.removeEventListener('pointerdown', disarm, true);
                        }
                    };
                    document.addEventListener('pointerdown', disarm, true);
                    return;
                }

                if (typeof clearChapterProgress === 'function') {
                    clearChapterProgress(ficId, ch.partId || 'root');
                }
                // Мгновенный отклик: подставляем пустое кольцо; свежий узел не
                // несёт reset-обработчиков, т.к. стирать больше нечего
                progressEl.replaceWith(createCircularProgress(0));
            };
            progressEl.addEventListener('click', resetProgress);
            progressEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') resetProgress(e);
            });
        }

        const item = el('a', {
            className: `m3-ch-item${isCurrent ? ' is-selected' : ''}`,
            attrs: { href: ch.href },
            events: {
                click: (e) => {
                    // SPA-переход: шторка закрывается через менеджер оверлеев,
                    // страница не перезагружается
                    e.preventDefault();
                    closeTocSheet();
                    navigateToChapter(ch.href);
                }
            }
        }, [infoCol, progressEl]);

        if (isCurrent) {
            currentElement = item;
            currentIndex = idx + 1;
        }

        chapterElements.push(item);
        listWrapper.appendChild(item);
    });

    if (chapters.length > 5) {
        const slider = buildTocSlider(chapters.length, (targetIndex) => {
            const targetEl = chapterElements[targetIndex - 1];
            if (targetEl) {
                targetEl.scrollIntoView({ block: 'center', behavior: 'instant' });
            }
        });

        if (slider) {
            tocSheetEl.appendChild(slider.dock);
            slider.setSliderValue(currentIndex);

            // Remove any previous scroll listener: listWrapper is reused across
            // openTocSheet() calls, so without cleanup listeners would stack up.
            // The new listener must close over the fresh chapterElements / slider
            // refs from this open, so we can't guard with a one-shot flag.
            if (listWrapper._tocScrollHandler) {
                listWrapper.removeEventListener('scroll', listWrapper._tocScrollHandler);
            }
            let scrollTimer = null;
            const tocScrollHandler = () => {
                if (scrollTimer) return;
                scrollTimer = setTimeout(() => {
                    scrollTimer = null;
                    const wrapperRect = listWrapper.getBoundingClientRect();
                    const midY = wrapperRect.top + wrapperRect.height / 2;

                    for (let i = 0; i < chapterElements.length; i++) {
                        const rect = chapterElements[i].getBoundingClientRect();
                        if (rect.top <= midY && rect.bottom >= midY) {
                            slider.setSliderValue(i + 1);
                            break;
                        }
                    }
                }, 80);
            };
            listWrapper._tocScrollHandler = tocScrollHandler;
            listWrapper.addEventListener('scroll', tocScrollHandler, { passive: true });
        }
    }

    if (currentElement) {
        requestAnimationFrame(() => {
            currentElement.scrollIntoView({ block: 'center', behavior: 'instant' });
        });
    }
}

// --- ui/settings-sheet.js ---
let settingsSheetEl = null;
let settingsScrimEl = null;

function isSettingsSheetOpen() {
    return Boolean(settingsSheetEl && settingsSheetEl.classList.contains('open'));
}

function showSettingsSheet() {
    if (!settingsSheetEl || !settingsScrimEl) return;
    settingsScrimEl.classList.add('open');
    settingsSheetEl.classList.add('open');
    settingsSheetEl.style.transform = '';
    document.body.style.overflow = 'hidden';
    recalculateMetrics();
}

function hideSettingsSheet() {
    if (!settingsSheetEl || !settingsScrimEl) return;
    closeAllDropdowns();
    document.body.classList.remove('is-scrubbing');
    // If the sheet is programmatically closed while the scrubber is being
    // dragged (e.g. SPA navigation calls OverlayManager.closeTop()), the
    // pointer/touch events that normally reset isScrubberDragging never fire.
    // Reset it here so savePos() is not permanently blocked after navigation.
    isScrubberDragging = false;
    cachedScrubberMetrics = null;
    settingsScrimEl.classList.remove('open');
    settingsSheetEl.classList.remove('open');
    settingsSheetEl.style.transform = '';
    if (settings.get('readingMode') !== 'paged') {
        document.body.style.overflow = '';
    }
}

// Публичный close идёт через менеджер оверлеев (валидация стека)
function closeSettingsSheet() {
    OverlayManager.close('settings');
}

OverlayManager.register('settings', {
    open: showSettingsSheet,
    close: hideSettingsSheet,
    isOpen: isSettingsSheetOpen
});

function closeAllDropdowns() {
    document.querySelectorAll('.m3-split-button-container.is-open').forEach((c) => {
        c.classList.remove('is-open');
        setTimeout(() => {
            if (!c.classList.contains('is-open')) {
                c.classList.remove('open-up');
            }
        }, 220);
    });
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.m3-split-button-container')) {
        closeAllDropdowns();
    }
});

function buildSplitSelect(items, currentVal, ariaLabel, onSelect) {
    let selectedVal = currentVal;
    const currentItem = items.find((i) => i.value === selectedVal) || items[0];

    const leadingBtn = el('button', {
        className: 'm3-split-btn-leading',
        text: currentItem ? currentItem.name : '',
        attrs: { type: 'button', 'aria-label': ariaLabel },
        events: {
            click: (e) => {
                e.stopPropagation();
                toggleDropdown();
            }
        }
    });

    const trailingBtn = el('button', {
        className: 'm3-split-btn-trailing',
        attrs: { type: 'button', 'aria-label': `Меню: ${ariaLabel}` },
        events: {
            click: (e) => {
                e.stopPropagation();
                toggleDropdown();
            }
        }
    }, [createSvgIcon(ICONS.expandMore)]);

    const menuItems = items.map((item) => {
        const itemBtn = el('button', {
            className: `m3-menu-item${item.value === selectedVal ? ' is-selected' : ''}`,
            text: item.name,
            attrs: { type: 'button', role: 'menuitem' },
            events: {
                click: (e) => {
                    e.stopPropagation();
                    selectedVal = item.value;
                    leadingBtn.textContent = item.name;
                    container.querySelectorAll('.m3-menu-item').forEach((m) => m.classList.remove('is-selected'));
                    itemBtn.classList.add('is-selected');
                    closeDropdown();
                    onSelect(item.value);
                }
            }
        });
        return itemBtn;
    });

    const dropdown = el('div', {
        className: 'm3-menu-dropdown',
        attrs: { role: 'menu' }
    }, menuItems);

    const container = el('div', { className: 'm3-split-button-container' }, [
        leadingBtn,
        trailingBtn,
        dropdown
    ]);

    function toggleDropdown() {
        const isOpen = container.classList.contains('is-open');
        closeAllDropdowns();
        if (!isOpen) {
            openDropdown();
        }
    }

    function openDropdown() {
        const rect = container.getBoundingClientRect();
        const estimatedHeight = items.length * 42 + 16;
        if (rect.bottom + estimatedHeight > window.innerHeight - 20) {
            container.classList.add('open-up');
        } else {
            container.classList.remove('open-up');
        }
        container.classList.add('is-open');
    }

    function closeDropdown() {
        container.classList.remove('is-open');
        setTimeout(() => {
            if (!container.classList.contains('is-open')) {
                container.classList.remove('open-up');
            }
        }, 220);
    }

    return container;
}

function buildAutoGridToolbar() {
    const sizeLimits = READER_LIMITS.fontSize;
    const lineLimits = READER_LIMITS.lineHeight;

    const sizeVal = el('span', { className: 'm3-split-stepper-val', text: `${settings.get('fontSize')}px` });
    const fontStepper = el('div', { className: 'm3-split-stepper' }, [
        el('button', {
            className: 'm3-split-stepper-btn left',
            text: 'A−',
            attrs: { type: 'button', 'aria-label': 'Уменьшить шрифт' },
            events: {
                click: () => {
                    const next = Math.max(settings.get('fontSize') - 1, sizeLimits.min);
                    settings.set('fontSize', next);
                    sizeVal.textContent = `${next}px`;
                    recalculateMetrics();
                }
            }
        }),
        sizeVal,
        el('button', {
            className: 'm3-split-stepper-btn right',
            text: 'A+',
            attrs: { type: 'button', 'aria-label': 'Увеличить шрифт' },
            events: {
                click: () => {
                    const next = Math.min(settings.get('fontSize') + 1, sizeLimits.max);
                    settings.set('fontSize', next);
                    sizeVal.textContent = `${next}px`;
                    recalculateMetrics();
                }
            }
        })
    ]);

    const lineVal = el('span', { className: 'm3-split-stepper-val', text: `${settings.get('lineHeight').toFixed(2)}` });
    const lineStepper = el('div', { className: 'm3-split-stepper' }, [
        el('button', {
            className: 'm3-split-stepper-btn left',
            attrs: { type: 'button', 'aria-label': 'Уменьшить интервал' },
            events: {
                click: () => {
                    const current = settings.get('lineHeight');
                    const next = Math.max(lineLimits.min, Math.round((current - lineLimits.step) * 100) / 100);
                    settings.set('lineHeight', next);
                    lineVal.textContent = next.toFixed(2);
                    recalculateMetrics();
                }
            }
        }, [
            el('span', { className: 'm3-split-stepper-icon', text: '↕' }),
            document.createTextNode(' −')
        ]),
        lineVal,
        el('button', {
            className: 'm3-split-stepper-btn right',
            attrs: { type: 'button', 'aria-label': 'Увеличить интервал' },
            events: {
                click: () => {
                    const current = settings.get('lineHeight');
                    const next = Math.min(lineLimits.max, Math.round((current + lineLimits.step) * 100) / 100);
                    settings.set('lineHeight', next);
                    lineVal.textContent = next.toFixed(2);
                    recalculateMetrics();
                }
            }
        }, [
            el('span', { className: 'm3-split-stepper-icon', text: '↕' }),
            document.createTextNode(' +')
        ])
    ]);

    const fontPicker = buildSplitSelect(FONTS, settings.get('fontFamily'), 'Выбор шрифта', (val) => {
        settings.set('fontFamily', val);
        recalculateMetrics();
    });

    const alignPicker = buildSplitSelect(ALIGNMENTS, settings.get('textAlign'), 'Выравнивание текста', (val) => {
        settings.set('textAlign', val);
        recalculateMetrics();
    });

    const isHyphensActive = () => {
        const h = settings.get('hyphens');
        return h === 'auto' || h === true || h === 'true';
    };

    const hyphensBtn = el('button', {
        className: `m3-standard-btn${isHyphensActive() ? ' active' : ''}`,
        text: 'Переносы',
        attrs: { type: 'button', 'aria-label': 'Переносы строк' },
        events: {
            click: () => {
                const next = isHyphensActive() ? 'none' : 'auto';
                settings.set('hyphens', next);
                hyphensBtn.classList.toggle('active', next === 'auto');
                recalculateMetrics();
            }
        }
    });

    const modePicker = buildSplitSelect(READING_MODES, settings.get('readingMode'), 'Режим чтения', (val) => {
        settings.set('readingMode', val);
        applyReadingMode(val);
        // Кнопка «Зоны и жесты» активна только в постраничном режиме
        syncTapZonesState(val);
    });

    // Кнопка открывает визуальный диалог настройки зон тапа и ширины edge-swipe.
    // В режиме прокрутки зоны тапа не применяются — кнопка отключается.
    const tapZonesBtn = el('button', {
        className: 'm3-standard-btn',
        attrs: { type: 'button', 'aria-label': 'Зоны и жесты' },
        events: {
            click: () => {
                if (typeof openTapZonesDialog === 'function') {
                    openTapZonesDialog();
                }
            }
        }
    }, [createSvgIcon(ICONS.touchApp || ICONS.tune), ' Зоны и жесты']);

    const syncTapZonesState = (mode) => {
        tapZonesBtn.classList.toggle('disabled', mode !== 'paged');
    };
    syncTapZonesState(settings.get('readingMode'));
    settings.subscribe('readingMode', syncTapZonesState);

    const paletteBtn = el('button', {
        className: 'm3-standard-btn',
        attrs: { type: 'button', 'aria-label': 'Палитра читалки' },
        events: {
            click: () => {
                openPaletteDialog();
            }
        }
    }, [createSvgIcon(ICONS.palette), ' Палитра']);

    return el('div', { className: 'm3-toolbar-auto-grid' }, [
        el('div', { className: 'm3-grid-item' }, [fontStepper]),
        el('div', { className: 'm3-grid-item' }, [lineStepper]),
        el('div', { className: 'm3-grid-item' }, [fontPicker]),
        el('div', { className: 'm3-grid-item' }, [alignPicker]),
        el('div', { className: 'm3-grid-item' }, [hyphensBtn]),
        el('div', { className: 'm3-grid-item' }, [modePicker]),
        el('div', { className: 'm3-grid-item' }, [tapZonesBtn]),
        el('div', { className: 'm3-grid-item full-width' }, [paletteBtn])
    ]);
}

function openSettingsSheet() {
    // Sheet построена отложенно (requestIdleCallback из main.js); при
    // раннем клике по FAB — принудительная синхронная сборка
    if (!settingsSheetEl || !settingsScrimEl) {
        if (typeof ensureSettingsSheetBuilt === 'function') {
            ensureSettingsSheetBuilt();
        }
        if (!settingsSheetEl || !settingsScrimEl) return;
    }
    // Взаимоисключение (например, закрытие открытого оглавления) делает
    // OverlayManager — жёсткий вызов closeTocSheet больше не нужен
    OverlayManager.open('settings');
}

function buildSettingsSheet(navContainer) {
    settingsScrimEl = el('div', { className: 'm3-bottom-sheet-scrim', events: { click: closeSettingsSheet } });

    const dragHandleBar = el('div', {
        className: 'm3-drag-handle-bar',
        attrs: { role: 'button', tabindex: '0', 'aria-label': 'Закрыть настройки' },
        events: {
            click: (e) => {
                e.stopPropagation();
                if (dragHandleBar.dataset.swiped) { delete dragHandleBar.dataset.swiped; return; }
                closeSettingsSheet();
            },
            keydown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); closeSettingsSheet(); }
            }
        }
    }, [
        el('div', { className: 'm3-drag-handle' })
    ]);

    const sheetContent = el('div', { className: 'm3-sheet-content' }, [
        buildTextScrubber(),
        buildConnectedNav(navContainer),
        buildAutoGridToolbar()
    ]);

    settingsSheetEl = el('div', {
        className: 'm3-bottom-sheet',
        attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Настройки чтения' }
    }, [dragHandleBar, sheetContent]);

    bindSwipeToDismiss(settingsSheetEl, closeSettingsSheet);

    document.body.appendChild(settingsScrimEl);
    document.body.appendChild(settingsSheetEl);
}

// --- ui/tap-zones-dialog.js ---
// Визуальный диалог настройки зон тапа (схема перелистывания) и ширины зоны
// edge-swipe для смены глав. Регистрируется как оверлей 'tap-zones'.
let tapZonesDialogEl = null;

function dismissTapZonesDialog() {
    if (!tapZonesDialogEl) return;
    // Захватываем конкретный элемент: если за 200ms диалог переоткрыли,
    // tapZonesDialogEl уже указывает на новый — его удалять нельзя
    const elToRemove = tapZonesDialogEl;
    elToRemove.classList.remove('is-open');
    setTimeout(() => {
        elToRemove.remove();
        if (tapZonesDialogEl === elToRemove) {
            tapZonesDialogEl = null;
        }
    }, 200);
}

function closeTapZonesDialog() {
    OverlayManager.close('tap-zones');
}

OverlayManager.register('tap-zones', {
    open: buildTapZonesDialog,
    close: dismissTapZonesDialog,
    isOpen: () => Boolean(tapZonesDialogEl && tapZonesDialogEl.classList.contains('is-open'))
});

function openTapZonesDialog() {
    OverlayManager.open('tap-zones');
}

function buildTapZonesDialog() {
    if (tapZonesDialogEl) {
        tapZonesDialogEl.remove();
        tapZonesDialogEl = null;
    }

    const currentTapZone = settings.get('tapZones') || 'split50';
    let selectedTapZone = currentTapZone;

    const SCHEMATICS = [
        {
            id: 'split50',
            name: '50 / 50',
            cols: [
                { text: 'Назад', width: '50%', cls: 'prev' },
                { text: 'Вперёд', width: '50%', cls: 'next' }
            ]
        },
        {
            id: 'classic',
            name: 'Классика',
            cols: [
                { text: 'Назад', width: '30%', cls: 'prev' },
                { text: 'Меню', width: '40%', cls: 'menu' },
                { text: 'Вперёд', width: '30%', cls: 'next' }
            ]
        },
        {
            id: 'rightHand',
            name: 'Правша',
            cols: [
                { text: 'Назад', width: '18%', cls: 'prev' },
                { text: 'Вперёд', width: '82%', cls: 'next' }
            ]
        },
        {
            id: 'leftHand',
            name: 'Левша',
            cols: [
                { text: 'Вперёд', width: '82%', cls: 'next' },
                { text: 'Назад', width: '18%', cls: 'prev' }
            ]
        }
    ];

    const cardsContainer = el('div', { className: 'm3-tap-zones-grid' });

    const cardElements = SCHEMATICS.map((item) => {
        const schematicCols = item.cols.map((col) => el('div', {
            className: `m3-zone-col ${col.cls}`,
            attrs: { style: `width: ${col.width};` },
            text: col.text
        }));

        const schematicBox = el('div', { className: 'm3-zone-schematic' }, schematicCols);
        const cardTitle = el('span', { className: 'm3-zone-name', text: item.name });

        const card = el('div', {
            className: `m3-zone-card${item.id === selectedTapZone ? ' is-selected' : ''}`,
            attrs: { role: 'button', tabindex: '0', 'aria-label': `Схема: ${item.name}` },
            events: {
                click: () => {
                    selectedTapZone = item.id;
                    cardElements.forEach((c) => c.classList.remove('is-selected'));
                    card.classList.add('is-selected');
                }
            }
        }, [schematicBox, cardTitle]);

        return card;
    });

    cardElements.forEach((c) => cardsContainer.appendChild(c));

    // Степпер ширины edge-зоны
    const edgeLimits = READER_LIMITS.chapterSwipeEdge;
    let currentEdgeVal = Number(settings.get('chapterSwipeEdge')) || 28;

    const edgeValSpan = el('span', {
        className: 'm3-split-stepper-val',
        text: `${currentEdgeVal}px`
    });

    const edgeStepper = el('div', { className: 'm3-split-stepper' }, [
        el('button', {
            className: 'm3-split-stepper-btn left',
            text: '−',
            attrs: { type: 'button', 'aria-label': 'Уменьшить зону свайпа глав' },
            events: {
                click: () => {
                    currentEdgeVal = Math.max(edgeLimits.min, currentEdgeVal - edgeLimits.step);
                    edgeValSpan.textContent = `${currentEdgeVal}px`;
                }
            }
        }),
        edgeValSpan,
        el('button', {
            className: 'm3-split-stepper-btn right',
            text: '+',
            attrs: { type: 'button', 'aria-label': 'Увеличить зону свайпа глав' },
            events: {
                click: () => {
                    currentEdgeVal = Math.min(edgeLimits.max, currentEdgeVal + edgeLimits.step);
                    edgeValSpan.textContent = `${currentEdgeVal}px`;
                }
            }
        })
    ]);

    const saveBtn = el('button', {
        className: 'm3-dialog-btn',
        text: 'Готово',
        attrs: { type: 'button' },
        events: {
            click: () => {
                settings.set('tapZones', selectedTapZone);
                settings.set('chapterSwipeEdge', currentEdgeVal);
                closeTapZonesDialog();
            }
        }
    });

    const dialogContent = el('div', {
        className: 'm3-dialog m3-tap-zones-dialog',
        events: { click: (e) => e.stopPropagation() }
    }, [
        el('h3', { className: 'm3-dialog-title', text: 'Зоны и жесты' }),

        el('div', { className: 'm3-dialog-field' }, [
            el('span', { className: 'm3-dialog-label', text: 'Схема перелистывания тапом' }),
            cardsContainer,
            el('p', {
                className: 'm3-dialog-helper-text',
                text: 'Вызов меню: свайп снизу вверх (всегда активен).'
            })
        ]),

        el('div', { className: 'm3-dialog-field' }, [
            el('span', { className: 'm3-dialog-label', text: 'Зона смены глав от кромки' }),
            edgeStepper,
            el('p', {
                className: 'm3-dialog-helper-text',
                text: 'Свайп от края экрана переключает главы, в остальной части — страницы.'
            })
        ]),

        el('div', { className: 'm3-dialog-actions' }, [saveBtn])
    ]);

    tapZonesDialogEl = el('div', {
        className: 'm3-dialog-scrim',
        events: { click: closeTapZonesDialog }
    }, [dialogContent]);

    document.body.appendChild(tapZonesDialogEl);
    requestAnimationFrame(() => {
        tapZonesDialogEl.classList.add('is-open');
    });
}

// --- ui/paged-zones.js ---
let pagedZonesEl = null;

// Возвращает 'prev' | 'next' | 'settings' по координатам клика и текущей
// схеме тап-зон. 'settings' возвращается для split50 (нет) и classic (центр).
// rightHand/leftHand делят экран на prev/next без мёртвой зоны.
function getTapZoneAction(clientX, clientY, width, height) {
    const zone = settings.get('tapZones') || 'split50';
    const rx = clientX / width;   // 0..1 горизонтально

    switch (zone) {
        case 'split50':
            // Левая половина — назад, правая — вперёд; нет центральной зоны
            return rx < 0.5 ? 'prev' : 'next';
        case 'classic':
            // Лево (30%) — назад, центр (40%) — настройки, право (30%) — вперёд
            if (rx < 0.30) return 'prev';
            if (rx > 0.70) return 'next';
            return 'settings';
        case 'rightHand':
            // 18% слева — назад, остальное (82%) — вперёд (большой палец правой руки)
            return rx > 0.18 ? 'next' : 'prev';
        case 'leftHand':
            // 82% слева — вперёд (большой палец левой руки), 18% справа — назад
            return rx < 0.82 ? 'next' : 'prev';
        default:
            return rx < 0.5 ? 'prev' : 'next';
    }
}

function initPagedZones() {
    if (pagedZonesEl) return;

    pagedZonesEl = el('div', {
        className: 'm3-paged-touch-zones'
    });

    // Touch-свайп для листания страниц в paged-режиме.
    // Горизонтальный флик по центру экрана (не из edge-зоны pull-navigate)
    // листает страницу со smooth-анимацией. Trailing click после свайпа
    // подавляется через dataset.swiped.
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwipeGesture = false;

    pagedZonesEl.addEventListener('touchstart', (e) => {
        if (settings.get('readingMode') !== 'paged' || e.touches.length !== 1) return;
        if (OverlayManager.hasActive()) return;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = e.timeStamp;
        isSwipeGesture = false;
    }, { passive: true });

    pagedZonesEl.addEventListener('touchmove', (e) => {
        if (settings.get('readingMode') !== 'paged' || e.touches.length !== 1) return;
        if (OverlayManager.hasActive()) return;
        // Не перехватываем движения из edge-зон — они принадлежат pull-navigate
        const edgeThreshold = Number(settings.get('chapterSwipeEdge')) || 28;
        const isFromEdge = touchStartX <= edgeThreshold || touchStartX >= window.innerWidth - edgeThreshold;
        if (isFromEdge) return;
        const diffX = e.touches[0].clientX - touchStartX;
        const diffY = e.touches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 18 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
            isSwipeGesture = true;
        }
    }, { passive: true });

    pagedZonesEl.addEventListener('touchend', (e) => {
        if (settings.get('readingMode') !== 'paged' || !isSwipeGesture) return;
        if (OverlayManager.hasActive()) return;
        const edgeThreshold = Number(settings.get('chapterSwipeEdge')) || 28;
        const isFromEdge = touchStartX <= edgeThreshold || touchStartX >= window.innerWidth - edgeThreshold;
        if (isFromEdge) { isSwipeGesture = false; return; }

        const touch = e.changedTouches[0];
        const diffX = touch.clientX - touchStartX;
        const diffY = touch.clientY - touchStartY;
        const elapsed = e.timeStamp - touchStartTime;
        const isQuickFlick = elapsed < 300 && Math.abs(diffX) > 30;
        const isDeepSwipe = Math.abs(diffX) > 60;

        if ((isQuickFlick || isDeepSwipe) && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
            e.preventDefault();
            e.stopPropagation();
            turnPage(diffX < 0 ? 1 : -1, true);
            // Подавляем trailing click, который браузер генерирует после touchend
            pagedZonesEl.dataset.swiped = '1';
            setTimeout(() => { delete pagedZonesEl.dataset.swiped; }, 350);
        }
        isSwipeGesture = false;
    });

    pagedZonesEl.addEventListener('click', (e) => {
        if (settings.get('readingMode') !== 'paged') return;

        // Пропускаем click, порождённый завершённым свайпом
        if (pagedZonesEl.dataset.swiped) {
            delete pagedZonesEl.dataset.swiped;
            return;
        }

        // Игнорируем клик при открытых модальных окнах и шторках
        if (OverlayManager.hasActive()) {
            return;
        }

        // Игнорируем клик при выделении текста пользователем
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
            return;
        }

        // Пропуск клика к ссылкам и сноскам под сенсорным слоем
        // Ищем в радиусе 12px — мелкие сноски [?] иначе промахиваются
        pagedZonesEl.style.visibility = 'hidden';
        let link = null;
        const offsets = [[0,0],[0,-8],[0,8],[-8,0],[8,0],[-6,-6],[6,-6],[-6,6],[6,6],[0,-12],[0,12],[-12,0],[12,0]];
        for (const [dx, dy] of offsets) {
            const under = document.elementFromPoint(e.clientX + dx, e.clientY + dy);
            const found = under?.closest('a, .part-footnote, .footnote-link');
            if (found) { link = found; break; }
        }
        pagedZonesEl.style.visibility = 'visible';

        if (link) {
            // Для сносок вызываем showFootnote напрямую — link.click() не всегда
            // всплывает до setupFootnoteInterception через слой overlay.
            if (link.matches('a.part-footnote, a.footnote-link, a[href*="#footnote"], a[href*="#fn-"], a[href^="#fn"]')) {
                const href = link.getAttribute('href') || '';
                const targetId = href.startsWith('#') ? href.slice(1) : href.split('#')[1];
                const linkText = link.textContent.trim();
                let footnoteText = targetId ? footnotesMap.get(targetId) : null;
                if (!footnoteText && targetId) {
                    const numMatch = targetId.match(/\d+/);
                    if (numMatch) footnoteText = footnotesMap.get(numMatch[0]);
                }
                if (!footnoteText && targetId) {
                    const node = document.getElementById(targetId);
                    if (node) {
                        const clone = node.cloneNode(true);
                        clone.querySelectorAll('.back-link, a[href^="#fnref"]').forEach(n => n.remove());
                        footnoteText = clone.innerHTML.trim() || null;
                    }
                }
                if (footnoteText) {
                    const numLabel = linkText.replace(/[^\d]/g, '');
                    showFootnote(numLabel ? `Сноска ${numLabel}` : 'Сноска', footnoteText);
                }
            } else {
                link.click();
            }
            return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;
        const action = getTapZoneAction(e.clientX, e.clientY, width, height);

        if (action === 'prev') {
            turnPage(-1);
        } else if (action === 'next') {
            turnPage(1);
        } else {
            // settings-sheet.js загружается раньше paged-zones.js — гард не нужен
            openSettingsSheet();
        }
    });

    document.body.appendChild(pagedZonesEl);
}

// --- ui/pull-navigate.js ---
let pullIndicatorEl = null;

function resolveNavLinks() {
    // nav-group.js загружается раньше pull-navigate.js — гард не нужен
    // Возвращаем кешированные navLinks только если хотя бы одна ссылка есть:
    // если обе null — это может быть неинициализированное состояние, не первая/
    // последняя глава, поэтому сразу пробуем запасной парсинг DOM
    if (navLinks.prev || navLinks.next) {
        return navLinks;
    }

    // Запасной парсинг ссылок из исходной верстки Ficbook
    const prevEl = document.querySelector(
        '.part-navigation-prev, a[data-cy="prev-part-btn"], .part-navigation a[href*="/readfic/"]:first-child'
    );
    const nextEl = document.querySelector(
        '.part-navigation-next, a[data-cy="next-part-btn"], .part-navigation a[href*="/readfic/"]:last-child'
    );
    return {
        prev: prevEl && prevEl.getAttribute('href') ? prevEl.getAttribute('href') : null,
        next: nextEl && nextEl.getAttribute('href') ? nextEl.getAttribute('href') : null
    };
}

function ensurePullIndicator() {
    if (pullIndicatorEl) return pullIndicatorEl;

    pullIndicatorEl = el('div', {
        className: 'm3-pull-indicator'
    });

    document.body.appendChild(pullIndicatorEl);
    return pullIndicatorEl;
}

function initPullNavigate() {
    const indicator = ensurePullIndicator();
    let startX = 0;
    let startY = 0;
    let isPulling = false;
    let activeDirection = null;
    const THRESHOLD = 70;

    function updateIndicator(direction, distance, targetHref) {
        if (!targetHref) return;

        indicator.className = `m3-pull-indicator ${direction} visible`;
        const isReady = distance >= THRESHOLD;

        if (isReady) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }

        let iconSvg = '';
        let label = '';

        if (direction === 'top' || direction === 'left') {
            iconSvg = direction === 'top' ? ICONS.arrowUp : ICONS.arrowBack;
            label = isReady ? 'Отпустите для перехода' : 'Предыдущая глава';
        } else {
            iconSvg = direction === 'bottom' ? ICONS.arrowDown : ICONS.arrowNext;
            label = isReady ? 'Отпустите для перехода' : 'Следующая глава';
        }

        indicator.innerHTML = `${iconSvg}<span>${label}</span>`;
    }

    // Bottom-to-top swipe in paged mode: opens the settings sheet
    function updateSettingsIndicator(distance) {
        const isReady = distance >= THRESHOLD;

        indicator.className = `m3-pull-indicator top visible`;
        if (isReady) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }

        const label = isReady ? 'Отпустите для настроек' : 'Настройки';
        indicator.innerHTML = `${ICONS.tune}<span>${label}</span>`;
    }

    function resetIndicator() {
        indicator.className = 'm3-pull-indicator';
        indicator.textContent = '';
        isPulling = false;
        activeDirection = null;
    }

    window.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;

        if (OverlayManager.hasActive()) return;

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isPulling = false;
        activeDirection = null;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;

        // A sheet is open: a gesture that started on the sheet (or leaked
        // through its own stopPropagation) must not move chapters or show
        // the pull indicator.
        if (OverlayManager.hasActive()) {
            if (isPulling) resetIndicator();
            return;
        }

        const touch = e.touches[0];
        const diffX = touch.clientX - startX;
        const diffY = touch.clientY - startY;
        const isPaged = settings.get('readingMode') === 'paged';
        const links = resolveNavLinks();

        if (!isPaged) {
            const scroller = document.scrollingElement || document.documentElement;
            const scrollY = window.scrollY || scroller.scrollTop || 0;
            const maxScroll = Math.max(0, scroller.scrollHeight - window.innerHeight);

            const isAtTop = scrollY <= 8;
            const isAtBottom = scrollY >= maxScroll - 8;

            if (isAtTop && diffY > 20 && Math.abs(diffX) < 40 && links.prev) {
                isPulling = true;
                activeDirection = 'top';
                updateIndicator('top', diffY, links.prev);
            } else if (isAtBottom && diffY < -20 && Math.abs(diffX) < 40 && links.next) {
                isPulling = true;
                activeDirection = 'bottom';
                updateIndicator('bottom', Math.abs(diffY), links.next);
            } else if (isPulling) {
                resetIndicator();
            }
        } else {
            const content = document.querySelector('#content');
            if (!content) return;

            const { totalPages } = getPaginationMetrics(content);
            const isAtFirst = currentPagedIndex <= 1;
            const isAtLast = currentPagedIndex >= totalPages;

            if (diffY < -20 && Math.abs(diffX) < 40) {
                // Swipe up anywhere on the page opens the settings sheet
                isPulling = true;
                activeDirection = 'settings';
                updateSettingsIndicator(Math.abs(diffY));
            } else if (isAtFirst && diffX > 20 && Math.abs(diffY) < 40 && links.prev) {
                isPulling = true;
                activeDirection = 'left';
                updateIndicator('left', diffX, links.prev);
            } else if (isAtLast && diffX < -20 && Math.abs(diffY) < 40 && links.next) {
                isPulling = true;
                activeDirection = 'right';
                updateIndicator('right', Math.abs(diffX), links.next);
            } else if (isPulling) {
                resetIndicator();
            }
        }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (!isPulling || !activeDirection) return;

        // The gesture may have begun before the sheet opened; don't fire a
        // chapter navigation out from under an open overlay.
        if (OverlayManager.hasActive()) {
            resetIndicator();
            return;
        }

        // SPA-переход ещё идёт — игнорируем жест, не дублируем переход
        if (isNavigating) {
            resetIndicator();
            return;
        }

        const touch = e.changedTouches[0];
        const diffX = touch.clientX - startX;
        const diffY = touch.clientY - startY;

        if (activeDirection === 'settings') {
            if (-diffY >= THRESHOLD) {
                // settings-sheet.js загружается раньше pull-navigate.js — гард не нужен
                openSettingsSheet();
            }
            resetIndicator();
            return;
        }

        const links = resolveNavLinks();

        let distance = 0;
        let targetHref = null;

        if (activeDirection === 'top') {
            distance = diffY;
            targetHref = links.prev;
        } else if (activeDirection === 'bottom') {
            distance = -diffY;
            targetHref = links.next;
        } else if (activeDirection === 'left') {
            distance = diffX;
            targetHref = links.prev;
        } else if (activeDirection === 'right') {
            distance = -diffX;
            targetHref = links.next;
        }

        if (distance >= THRESHOLD && targetHref) {
            // navigateToChapter объявлена в spa-nav.js (позже по порядку), но
            // вызов происходит в обработчике события — к runtime все модули
            // уже выполнены, гард не нужен
            navigateToChapter(targetHref);
        }

        resetIndicator();
    });

    window.addEventListener('touchcancel', resetIndicator);
}

// --- engine/spa-nav.js ---
// SPA-движок смены глав: fetch + DOM-swap вместо полной перезагрузки.
// Все триггеры переходов (nav-group, toc, pull-navigate, стрелки клавиатуры
// в scroll-режиме, кнопки Back/Forward браузера) идут через navigateToChapter.
// При любой ошибке — fallback на window.location.href с флагом свежей
// навигации, как при обычном переходе.

let isNavigating = false;
let isSpaNavigating = false;
// Pending popstate queue: when Back/Forward fires while a SPA fetch is in
// flight, we can't drop the navigation (the URL has already changed). Each
// popstate is queued here and replayed in order once the current fetch ends.
// Using an array so rapid Back×3 during a slow fetch queues all three chapters
// instead of only keeping the last one.
let pendingPopstate = [];
// How many pushState entries we've added to the browser history during this
// reader session. Used by exitBtn to skip back over all reader pages in one
// go instead of stepping through each chapter one by one. Each pushState
// embeds its depth index in the state object so popstate can restore the
// exact counter regardless of whether the user went back or forward.
let spaHistoryDepth = 0;

async function navigateToChapter(targetHref, { pushHistory = true, restorePosition = false, restorePct = null } = {}) {
    if (!targetHref) return;

    // Любой переход гасит незавершённый throttled-save и resume-баннер:
    // баннер описывает контекст, которого после перехода уже нет
    if (typeof cancelPendingSave === 'function') cancelPendingSave();
    if (typeof removeResumeBanner === 'function') removeResumeBanner();

    if (isNavigating) {
        // Only popstate navigations (pushHistory === false) are queued;
        // explicit user taps while loading are dropped as before.
        if (!pushHistory) {
            pendingPopstate.push({ href: targetHref, restorePosition, restorePct });
        }
        return;
    }

    const readerWrapper = document.querySelector('#clean-reader-container');
    // Ридер не смонтирован (например, карточка книги) — обычный переход
    if (!readerWrapper) {
        window.location.href = targetHref;
        return;
    }

    isNavigating = true;

    // Закрываем все открытые оверлеи перед переходом: если шторка или скрим
    // зависли в открытом состоянии (touch-action:none на scrim), скролл на
    // новой главе был бы заблокирован навсегда.
    { let s = 10; while (OverlayManager.hasActive() && s-- > 0) { if (!OverlayManager.closeTop()) break; } }

    // Сохраняем позицию покидаемой главы: при полной перезагрузке это делал
    // обработчик pagehide, при SPA-переходе он не сработает
    if (typeof savePos === 'function') savePos();

    isSpaNavigating = true;

    // Немедленный визуальный отклик: приглушаем контент, пока идёт загрузка.
    // transition: opacity 0.2s уже задана в 02-base.css
    readerWrapper.style.opacity = '0.3';

    const fetchAbort = new AbortController();
    const fetchTimeout = setTimeout(() => fetchAbort.abort(), 30000);
    try {
        const response = await fetch(targetHref, { signal: fetchAbort.signal });
        clearTimeout(fetchTimeout);
        if (!response.ok) throw new Error(`Ошибка загрузки: HTTP ${response.status}`);

        const html = await response.text();
        const doc = sharedDomParser.parseFromString(html, 'text/html');

        // 1. Сноски из распарсенного документа: сбор в footnotesMap и удаление
        // контейнеров из doc — до извлечения #content, иначе они попадут в
        // смонтированный DOM
        // Также закрываем любые оверлеи, что могли открыться пока шёл fetch
        // (например, showFootnote rAF может сработать во время await выше).
        { let s = 10; while (OverlayManager.hasActive() && s-- > 0) { if (!OverlayManager.closeTop()) break; } }
        collectFootnotesFromPage(doc);

        // 2. Новый #content. Если его нет — это не глава (карточка, 404,
        // Cloudflare-челлендж) — отдаём fallback на полную перезагрузку
        const newContent = doc.querySelector('#content');
        if (!newContent) throw new Error('В загруженном документе нет #content');

        // 3. Вычистка рекламы/промо/iframe — тем же селектором, что при
        // начальной загрузке в main.js
        newContent.querySelectorAll(AD_CLEANUP_SELECTOR)
            .forEach((node) => node.remove());

        // 4. Шапка главы обновляется на месте. В paged-режиме она лежит
        // внутри #content, поэтому выносим её обёртку до swap — иначе
        // replaceChild её уничтожит
        const oldContent = readerWrapper.querySelector('#content');
        const headerCard = updateChapterHeader(readerWrapper, doc);
        if (oldContent && oldContent.contains(headerCard)) {
            readerWrapper.insertBefore(headerCard, oldContent);
        }

        // 5. pushState ДО чтения позиции: после него getFicParams() отдаёт
        // новую главу, и ключ сохранения позиции считается для неё
        if (pushHistory) {
            spaHistoryDepth++;
            history.pushState({ spaDepth: spaHistoryDepth }, '', targetHref);
        }

        const { ficId, partId } = getFicParams();
        const posKey = ficId ? STORAGE_KEYS.chapterPos(ficId, partId) : null;

        // Фиксируем новую смонтированную главу: savePos берёт её как таргет,
        // lastActive обновляется на открытую главу
        if (typeof setActiveMountedPart === 'function') setActiveMountedPart(partId, ficId);
        if (typeof markActiveChapter === 'function') markActiveChapter(ficId, partId);

        // 6. Явная навигация стартует сверху; позицию не удаляем — пользователь
        // мог там уже читать, и стирать его прогресс нельзя. Первый скролл
        // перепишет значение. popstate восстанавливает сохранённую позицию.

        // 7. Swap содержимого
        if (oldContent) {
            readerWrapper.replaceChild(newContent, oldContent);
        } else {
            readerWrapper.appendChild(newContent);
        }

        // 8. Перепривязка подсистем к новому узлу
        setupFootnoteInterception(newContent);
        if (typeof rebindContentScrollListener === 'function') {
            rebindContentScrollListener(newContent);
        }
        if (typeof rebindResizeObserver === 'function') {
            rebindResizeObserver(newContent);
        }

        // Обновление prev/next: refreshNavLinks патчит уже построенную
        // шторку, mainNavContainerRef — для ещё не построенной (отложенная
        // сборка через runDeferredInit)
        const navContainer = doc.querySelector('.navigation-to-fanfic-parts-container');
        if (navContainer) {
            if (typeof refreshNavLinks === 'function') refreshNavLinks(navContainer);
            if (typeof mainNavContainerRef !== 'undefined') mainNavContainerRef = navContainer;
        }

        // 9. Применение режима: snap колонок, сброс currentPagedIndex и
        // скролла, возврат шапки в #content при постраничном режиме
        applyReadingMode(settings.get('readingMode'));

        // 10. Позиция: восстановление или старт сверху
        if (restorePct !== null && restorePct > 0.0005) {
            restoreScrollToPct(restorePct);
        } else if (restorePosition && posKey) {
            restoreScrollPosition(posKey);
        } else {
            window.scrollTo(0, 0);
        }

        // 11. Возврат прозрачности
        readerWrapper.style.opacity = '1';
    } catch (err) {
        // Сетевая ошибка, Cloudflare-челлендж или неожиданная структура DOM —
        // полный fallback. Флаг freshChapter ставится только когда нет restorePct:
        // если позиция была передана, проносим её через pendingPos чтобы ридер
        // восстановил место чтения после перезагрузки, а не сбросил в 0.
        readerWrapper.style.opacity = '1';
        document.body.classList.remove('is-paged-mode');
        pendingPopstate = []; // страница перезагружается — очередь не нужна
        try {
            if (restorePct !== null && restorePct > 0.0005) {
                sessionStorage.setItem(STORAGE_KEYS.pendingPos, String(restorePct));
                sessionStorage.removeItem(STORAGE_KEYS.freshChapter);
            } else {
                sessionStorage.setItem(STORAGE_KEYS.freshChapter, '1');
            }
        } catch (_) {}
        window.location.href = targetHref;
        // isNavigating не сбрасываем — страница уходит на перезагрузку
        return;
    }

    isNavigating = false;
    // isSpaNavigating держится ещё 120ms: подавляет trailing scroll-события
    // от старого контента, пока layout новой главы не устоялся
    setTimeout(() => {
        isSpaNavigating = false;
    }, 120);

    // Replay any popstates that arrived while this fetch was in-flight, in order
    if (pendingPopstate.length > 0) {
        const { href, restorePosition: rp, restorePct: rpct } = pendingPopstate.shift();
        navigateToChapter(href, { pushHistory: false, restorePosition: rp, restorePct: rpct });
    }
}

// Обновление шапки главы на месте: новая карточка заменяет старую там же,
// где та стояла (в обёртке или внутри #content в paged-режиме)
function updateChapterHeader(readerWrapper, doc) {
    const { ficTitle, partTitle, partDate } = scrapeChapterHeader(doc);

    const newCard = el('div', { className: 'm3-card' }, [
        ficTitle && el('div', { className: 'm3-fic-title', text: ficTitle }),
        partTitle && el('div', { className: 'm3-part-title', text: partTitle }),
        partDate && el('div', { className: 'm3-part-date', text: partDate })
    ]);

    const oldCard = readerWrapper.querySelector('.m3-card');
    if (oldCard) {
        oldCard.replaceWith(newCard);
    } else {
        readerWrapper.prepend(newCard);
    }

    return newCard;
}

// Back/Forward: браузер уже изменил URL, поэтому pushState не нужен, а
// позицию восстанавливаем из сохранённой
window.addEventListener('popstate', (e) => {
    // На карточке книги (#m3-book-card-root) reader не инициализирован —
    // не перехватываем popstate, даём браузеру обработать нативно.
    if (!document.getElementById('clean-reader-container')) return;
    // Restore exact depth from state so Back AND Forward both keep the
    // counter accurate (a simple decrement would undercount on Forward).
    spaHistoryDepth = (e.state && typeof e.state.spaDepth === 'number')
        ? e.state.spaDepth
        : 0;
    navigateToChapter(window.location.href, { pushHistory: false, restorePosition: true });
});

// --- ui/book-card.js ---
let bookCardInitialized = false;

function isBookCardActive() {
    return Boolean(bookCardInitialized && document.getElementById('m3-book-card-root'));
}

// Template.html: description clamps to 3 lines, "Ещё"/«Свернуть» toggles
function buildCardDescription(summaryHtml) {
    if (!summaryHtml) return null;

    const descText = el('div', { className: 'm3-card-description-text' });
    descText.innerHTML = sanitizeHtml(summaryHtml);

    let isExpanded = false;
    const toggleBtn = el('button', {
        className: 'm3-card-link-action',
        text: 'Ещё',
        attrs: { type: 'button', 'aria-label': 'Раскрыть описание' },
        events: {
            click: () => {
                isExpanded = !isExpanded;
                descText.classList.toggle('expanded', isExpanded);
                toggleBtn.textContent = isExpanded ? 'Свернуть' : 'Ещё';
            }
        }
    });

    return el('section', { className: 'm3-card-section' }, [
        el('div', { className: 'm3-card-section-row' }, [
            el('span', { className: 'm3-card-section-title', text: 'Описание' }),
            toggleBtn
        ]),
        descText
    ]);
}

// Spoiler/adult tags: adult tags with warning border (first), spoiler tags blurred
function buildCardTags(tags) {
    if (!tags || tags.length === 0) return null;

    // Sort: adult tags first, then spoilers, then others
    const sortedTags = [...tags].sort((a, b) => {
        if (a.isAdult && !b.isAdult) return -1;
        if (!a.isAdult && b.isAdult) return 1;
        if (a.isSpoiler && !b.isSpoiler) return -1;
        if (!a.isSpoiler && b.isSpoiler) return 1;
        return 0;
    });

    const chips = sortedTags.map((tag) => {
        const isAdult = tag.isAdult;
        const isSpoiler = tag.isSpoiler && !isAdult;
        const chip = el(tag.href ? 'a' : 'span', {
            className: `m3-card-tag${isAdult ? ' is-adult-tag' : ''}${isSpoiler ? ' is-hidden-tag' : ''}`,
            text: tag.name,
            attrs: (!isSpoiler && tag.href) ? { href: tag.href } : {}
        });

        if (isSpoiler) {
            chip.setAttribute('role', 'button');
            chip.setAttribute('tabindex', '0');
            chip.setAttribute('aria-label', 'Скрытый тег: раскрыть');
            const reveal = (e) => {
                if (chip.classList.contains('is-hidden-tag')) {
                    e.preventDefault();
                    chip.classList.remove('is-hidden-tag');
                    chip.classList.add('is-spoiler-revealed');
                    chip.removeAttribute('role');
                    chip.removeAttribute('tabindex');
                    chip.removeAttribute('aria-label');
                    if (tag.href) chip.setAttribute('href', tag.href);
                }
            };
            chip.addEventListener('click', reveal);
            chip.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    reveal(e);
                }
            });
        }
        return chip;
    });

    return el('section', { className: 'm3-card-tags' }, chips);
}

// Metadata grid (normalized: no duplication, only reference fields)
function buildCardMetadata(workInfo) {
    const rows = [];

    if (workInfo.fandoms.length > 0) {
        rows.push(['Фэндом', workInfo.fandoms.map((f) => f.name).join(', ')]);
    }
    if (workInfo.direction) {
        rows.push(['Направление', workInfo.direction]);
    }
    if (workInfo.rating) {
        rows.push(['Рейтинг', workInfo.rating]);
    }
    if (workInfo.status) {
        rows.push(['Статус', workInfo.status]);
    }
    if (workInfo.chaptersCountLabel) {
        rows.push(['Главы', workInfo.chaptersCountLabel]);
    }
    // Pairings and characters moved out of the hero into the grid, where
    // long lists can truncate and expand instead of breaking the header
    if (workInfo.pairings.length > 0) {
        rows.push(['Пэйринг', workInfo.pairings.join(', ')]);
    }
    if (workInfo.characters.length > 0) {
        rows.push(['Персонажи', workInfo.characters.join(', ')]);
    }
    if (workInfo.permissions) {
        rows.push(['Публикация', workInfo.permissions]);
    }
    // Parse all metaRows (already filtered, no blacklist items). Skip
    // pairings — they are rendered in the hero under the title.
    workInfo.metaRows.forEach((row) => {
        const parts = row.split(':');
        if (parts.length < 2) return;
        const key = parts[0].trim().toLowerCase();
        if (workInfo.pairings.length > 0 && key.includes('пэйринг')) return;
        rows.push([parts[0].trim(), parts.slice(1).join(':').trim()]);
    });

    if (rows.length === 0) return null;

    const gridChildren = [];
    rows.forEach(([key, val]) => {
        const valSpan = el('span', { className: 'm3-card-meta-val', text: val });
        valSpan.addEventListener('click', () => {
            if (valSpan.classList.contains('is-truncated')) {
                const isExpanded = valSpan.classList.toggle('expanded');
                valSpan.setAttribute('aria-label', isExpanded ? 'Свернуть значение' : 'Раскрыть значение');
            }
        });
        valSpan.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && valSpan.classList.contains('is-truncated')) {
                e.preventDefault();
                valSpan.click();
            }
        });
        gridChildren.push(el('span', { className: 'm3-card-meta-key', text: key }));
        gridChildren.push(valSpan);
    });

    const grid = el('section', { className: 'm3-card-metadata' }, gridChildren);
    grid.dataset.pendingTruncationCheck = '1';
    return grid;
}

// Promo quote card (author's promo snippet), between hero and description
function buildCardPromo(promoHtml) {
    if (!promoHtml) return null;

    const promoText = el('div', { className: 'm3-card-promo-text' });
    promoText.innerHTML = sanitizeHtml(promoHtml);

    return el('section', { className: 'm3-card-promo' }, [
        el('span', { className: 'm3-card-promo-badge', text: 'ПРОМО' }),
        promoText
    ]);
}

// Author notes section
function buildCardNotes(notes) {
    if (!notes) return null;

    return el('section', { className: 'm3-card-section' }, [
        el('div', { className: 'm3-card-section-row' }, [
            el('span', { className: 'm3-card-section-title', text: 'Примечания' })
        ]),
        el('div', { className: 'm3-card-notes-text', text: notes })
    ]);
}

// Dedication section
function buildCardDedication(dedication) {
    if (!dedication) return null;

    return el('section', { className: 'm3-card-section m3-card-dedication' }, [
        el('blockquote', { className: 'm3-card-dedication-text', text: dedication })
    ]);
}

// Awards list section
// Top app bar: exit to plain ficbook, download, share. Fixed to viewport
// top so it survives card scroll. Share copies the URL and shows a snackbar.
function showCardSnackbar(text) {
    const existing = document.querySelector('.m3-card-snackbar');
    if (existing) existing.remove();

    const snackbar = el('div', { className: 'm3-card-snackbar', text });
    document.body.appendChild(snackbar);
    requestAnimationFrame(() => snackbar.classList.add('visible'));
    setTimeout(() => {
        snackbar.classList.remove('visible');
        setTimeout(() => snackbar.remove(), 250);
    }, 2200);
}

function buildCardTopBar(workInfo) {
    const exitBtn = el('button', {
        className: 'm3-card-top-bar-btn',
        attrs: { type: 'button', 'aria-label': 'Выйти из читалки' },
        events: {
            click: () => {
                let preUrl = null;
                try { preUrl = sessionStorage.getItem(STORAGE_KEYS.preReaderUrl); } catch (_) {}
                // preUrl === null  → key never written (unknown entry point)
                // preUrl === ''    → explicit "no referrer" (opened via deep link)
                // preUrl is a URL  → the page we came from before /readfic/
                if (preUrl) {
                    window.location.href = preUrl;
                } else if (preUrl === null && window.history.length > 1) {
                    // Entry point unknown; try to step back over all /readfic/ entries
                    const steps = spaHistoryDepth > 0 ? spaHistoryDepth + 1 : 1;
                    history.go(-steps);
                } else {
                    // preUrl === '' (deep-link open) or no history: go to ficbook home
                    window.location.href = 'https://ficbook.net/';
                }
            }
        }
    }, [createSvgIcon(ICONS.arrowBack)]);

    const rightActions = [];

    // TODO: download dialog in GeckoView — hidden for now
    if (false && workInfo.downloadHref) {
        rightActions.push(el('a', {
            className: 'm3-card-top-bar-btn',
            attrs: { href: workInfo.downloadHref, 'aria-label': 'Скачать фанфик' }
        }, [createSvgIcon(ICONS.download)]));
    }

    rightActions.push(el('button', {
        className: 'm3-card-top-bar-btn',
        attrs: { type: 'button', 'aria-label': 'Поделиться ссылкой' },
        events: {
            click: async () => {
                const url = window.location.href;
                try {
                    if (navigator.clipboard?.writeText) {
                        await navigator.clipboard.writeText(url);
                        showCardSnackbar('Ссылка скопирована');
                        return;
                    }
                } catch (_) {}
                // Legacy fallback
                const textarea = document.createElement('textarea');
                textarea.value = url;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showCardSnackbar('Ссылка скопирована');
                } catch (_) {
                    showCardSnackbar('Не удалось скопировать');
                }
                textarea.remove();
            }
        }
    }, [createSvgIcon(ICONS.share)]));

    return el('div', { className: 'm3-card-top-bar' }, [
        exitBtn,
        el('div', { className: 'm3-card-top-bar-actions' }, rightActions)
    ]);
}

// Hero: flat card background + cover (or M3 placeholder) + title +
// creators. Structure stays two-column even without a cover.
function buildCardHero(workInfo) {
    const cover = workInfo.coverUrl
        ? el('div', { className: 'm3-card-cover' }, [
            el('img', {
                attrs: {
                    src: workInfo.coverUrl,
                    alt: workInfo.title || 'Обложка',
                    loading: 'lazy',
                    referrerpolicy: 'no-referrer'
                }
            })
        ])
        : el('div', {
            className: 'm3-card-cover is-placeholder',
            attrs: { 'aria-label': 'Обложка отсутствует' }
        }, [
            createSvgIcon(ICONS.autoStories),
            workInfo.title && el('span', {
                className: 'm3-card-cover-monogram',
                text: workInfo.title.trim().charAt(0).toUpperCase()
            })
        ].filter(Boolean));

    // Creators: horizontal list of chips (avatar + nick + role badge)
    const creatorsRow = workInfo.creators.length > 0
        ? el('div', { className: 'm3-card-creators' }, workInfo.creators.map((c) => el('a', {
            className: 'm3-card-creator-chip',
            attrs: { href: c.href || '#' }
        }, [
            c.avatarUrl
                ? el('img', {
                    className: 'm3-card-creator-avatar',
                    attrs: {
                        src: c.avatarUrl,
                        alt: c.name,
                        loading: 'lazy',
                        referrerpolicy: 'no-referrer'
                    }
                })
                : el('span', { className: 'm3-card-creator-avatar is-fallback' }),
            el('span', { className: 'm3-card-creator-name', text: c.name }),
            el('span', { className: 'm3-card-creator-role', text: c.role })
        ])))
        : (workInfo.author ? el('div', { className: 'm3-card-creators' }, [
            el('a', {
                className: 'm3-card-creator-chip',
                attrs: { href: workInfo.author.href || '#' }
            }, [
                workInfo.authorAvatarUrl
                    ? el('img', {
                        className: 'm3-card-creator-avatar',
                        attrs: {
                            src: workInfo.authorAvatarUrl,
                            alt: workInfo.author.name,
                            loading: 'lazy',
                            referrerpolicy: 'no-referrer'
                        }
                    })
                    : el('span', { className: 'm3-card-creator-avatar is-fallback' }),
                el('span', { className: 'm3-card-creator-name', text: workInfo.author.name })
            ])
        ]) : null);

    const titleCol = el('div', { className: 'm3-card-title-col' }, [
        workInfo.title && el('h1', { className: 'm3-card-work-title', text: workInfo.title }),
        workInfo.specialBadges.length > 0 && el('div', { className: 'm3-card-special-badges' },
            workInfo.specialBadges.map((badge) => el('span', {
                className: `m3-card-badge m3-card-badge-${badge.type}`,
                text: badge.label
            }))),
        creatorsRow
    ].filter(Boolean));

    return el('section', { className: 'm3-card-hero' }, [
        el('div', { className: 'm3-card-hero-content' }, [
            cover,
            titleCol
        ].filter(Boolean))
    ]);
}

// Chapters dock (template.html): persistent bottom sheet — collapsed
// --card-dock-collapsed (handle + menu icon + read pill), expanded 65vh
// (chapter list + scrim). Toggle by tap, by fling, or by dragging the
// header area (height follows the finger, then snaps via the .expanded
// class transition).
let cardDockState = { root: null, scrim: null, isExpanded: false, activeTab: 'chapters' };

function isCardDockExpanded() {
    return Boolean(cardDockState.root && cardDockState.isExpanded);
}

function syncDockTabAria() {
    if (!cardDockState.root) return;
    const btns = cardDockState.root.querySelectorAll('.m3-card-dock-btn-group .m3-card-dock-icon-btn');
    const tabs = ['chapters', 'feedback', 'collections'];
    btns.forEach((btn, i) => {
        btn.setAttribute('aria-expanded', String(
            cardDockState.activeTab === tabs[i] && cardDockState.isExpanded
        ));
    });
}

function setCardDockExpanded(isExpanded) {
    if (!cardDockState.root) return;
    cardDockState.isExpanded = isExpanded;
    cardDockState.root.classList.toggle('expanded', isExpanded);
    if (cardDockState.scrim) {
        cardDockState.scrim.classList.toggle('visible', isExpanded);
    }
    syncDockTabAria();
    if (isExpanded && cardDockState.activeTab === 'chapters') {
        ensureChaptersRendered();
    }
}

// Dock tabs: «Главы» (menuBook) ↔ «Отклики» (forum) ↔ «Сборники» (bookmark).
// Toggles the visible list and the active state of the header buttons.
function setDockTab(tab) {
    if (!cardDockState.root) return;
    cardDockState.activeTab = tab;
    cardDockState.root.classList.toggle('tab-feedback', tab === 'feedback');
    cardDockState.root.classList.toggle('tab-collections', tab === 'collections');

    const buttons = cardDockState.root.querySelectorAll('.m3-card-dock-btn-group .m3-card-dock-icon-btn');
    buttons.forEach((btn) => btn.classList.remove('is-active-tab'));
    const index = tab === 'feedback' ? 1 : (tab === 'collections' ? 2 : 0);
    if (buttons[index]) {
        buttons[index].classList.add('is-active-tab');
    }
    if (tab === 'feedback') {
        ensureFeedbackTabLoaded();
    }

    syncDockTabAria();
}

// Collections tab data: paged infinite scroll. First page loads on first
// tab open; further pages auto-fetch when the user scrolls within 160px
// of the bottom. Page results are cached by fetchCollectionsPage.
const dockLazyState = {
    workInfo: null,
    resumeTarget: null,
    chaptersRendered: false
};

// Lazy chapters render: node tree is built in one DocumentFragment on the
// first dock expansion (works with 300+ chapters build in a single pass).
let initBookCardResumeHook = null;

function ensureChaptersRendered() {
    if (dockLazyState.chaptersRendered) return;
    const container = cardDockState.root?.querySelector('.m3-card-dock-chapters');
    if (!container) return;
    dockLazyState.chaptersRendered = true;

    const { workInfo, resumeTarget } = dockLazyState;
    if (!workInfo) return;

    const fragment = document.createDocumentFragment();

    if (workInfo.chapters.length > 0) {
        workInfo.chapters.forEach((ch) => {
            fragment.appendChild(el('a', {
                className: `m3-card-dock-chapter${resumeTarget && resumeTarget.chapter.partId === ch.partId ? ' is-resume' : ''}`,
                attrs: { href: ch.href },
                events: {
                    click: () => {
                        // Deliberate chapter choice = fresh start (consistent
                        // with the reader TOC behavior)
                        setReadIntent();
                        try {
                            sessionStorage.setItem(STORAGE_KEYS.freshChapter, '1');
                        } catch (_) {}
                    }
                }
            }, [
                el('span', { className: 'm3-card-dock-chapter-title', text: `${ch.index}. ${ch.title}` }),
                ch.info ? el('span', { className: 'm3-card-dock-chapter-info', text: ch.info }) : null
            ]));
        });
    } else {
        fragment.appendChild(el('div', {
            className: 'm3-card-dock-chapters-empty',
            text: 'Единая глава — нажмите «Читать»'
        }));
    }

    container.replaceChildren(fragment);

    if (initBookCardResumeHook) {
        initBookCardResumeHook();
        initBookCardResumeHook = null;
    }
}

// Feedback tab («Отклики»): stats capsules + awards + paged comments feed.
// Built on first tab open; comments auto-load on scroll near the bottom.

// Stats capsules: strict [icon] [number] format — no text labels, so all
// four capsules fit one line (see .m3-card-dock-feedback-stats in CSS).
function buildFeedbackStatsRow(workInfo) {
    const { stats } = workInfo;
    // Vue mounts .jsVueComponent buttons after DOMContentLoaded, so stored
    // workInfo.likeNode/followNode are always null at scrape time. Query live
    // DOM here — this function runs lazily when user opens the feedback tab,
    // by which time Vue has already mounted the buttons.
    const hatBtns = [...document.querySelectorAll('section.fanfic-hat button.jsVueComponent, .hat-actions-container button.jsVueComponent')];
    const likeNode = hatBtns.find(b => b.querySelector('use[href*="ic_thumbs-up"], use[xlink\\:href*="ic_thumbs-up"]'))
        || hatBtns[0] || workInfo.likeNode;
    const followNode = hatBtns.find(b => b.querySelector('use[href*="ic_star"], use[xlink\\:href*="ic_star"]'))
        || hatBtns[1] || workInfo.followNode;
    const lazyReward = () => {
        const btn = document.querySelector('.fanfic-reward-container button, .fanfic-reward-container a[href*="reward"]');
        if (btn) btn.click();
    };
    const capsules = [
        [ICONS.thumbUp,  stats.likes,      likeNode,   null,       null],
        [ICONS.star,     stats.followings, followNode, null,       null],
        [ICONS.comment,  stats.comments,   null,                workInfo.commentsHref, null],
        [ICONS.trophy,   stats.awards,     null,                null,       lazyReward]
    ].filter(([, value]) => value != null);

    if (capsules.length === 0) return null;

    return el('div', { className: 'm3-card-dock-feedback-stats' },
        capsules.map(([icon, value, nativeNode, href, lazyClick]) => {
            const tag = href ? 'a' : 'div';
            const isInitiallyActive = nativeNode?.classList.contains('ds-btn-success-filled');
            const isInteractive = nativeNode || href || lazyClick;
            const capsule = el(tag, {
                className: 'm3-card-dock-feedback-capsule' + (isInteractive ? ' is-interactive' : '') + (isInitiallyActive ? ' is-active' : ''),
                attrs: href ? { href } : {}
            }, [
                el('span', { className: 'm3-card-dock-feedback-capsule-icon' }, [createSvgIcon(icon)]),
                el('span', { className: 'm3-card-dock-feedback-capsule-value', text: String(value) })
            ]);
            if (lazyClick) {
                capsule.addEventListener('click', () => { try { lazyClick(); } catch (_) {} });
            }
            if (nativeNode) {
                const valueEl = capsule.querySelector('.m3-card-dock-feedback-capsule-value');
                capsule.addEventListener('click', () => {
                    try {
                        nativeNode.click();
                        // Read state after Vue settles (may update class in multiple microtasks)
                        const syncState = () => {
                            if (valueEl) {
                                const txt = nativeNode.textContent || '';
                                const m = txt.match(/\d[\d\s]*/);
                                if (m) valueEl.textContent = m[0].trim();
                            }
                            capsule.classList.toggle('is-active', nativeNode.classList.contains('ds-btn-success-filled'));
                        };
                        setTimeout(syncState, 400);
                        setTimeout(syncState, 1000);
                    } catch (_) {}
                });
            }
            return capsule;
        })
    );
}

function buildFeedbackAwardsSection(workInfo) {
    const children = [];
    if (workInfo.awards.length > 0) {
        workInfo.awards.forEach((award) => {
            children.push(el('div', { className: 'm3-card-dock-award' }, [
                el('span', { className: 'm3-card-dock-award-icon' }, [createSvgIcon(ICONS.trophy)]),
                el('div', { className: 'm3-card-dock-award-body' }, [
                    el('span', { className: 'm3-card-dock-award-title', text: award.title }),
                    award.giver && el('span', {
                        className: 'm3-card-dock-award-giver',
                        text: `от ${award.giver}`
                    }),
                    award.comment && el('span', {
                        className: 'm3-card-dock-award-comment',
                        text: award.comment
                    })
                ].filter(Boolean))
            ]));
        });
    } else if (workInfo.stats.awards) {
        // Counter is set but no giver cards were scraped (the hat only
        // renders a subset behind a «Все награды» link): show the counter
        // instead of contradicting it with «Пока нет наград»
        children.push(el('div', {
            className: 'm3-card-dock-chapters-empty',
            text: `Наград: ${workInfo.stats.awards}`
        }));
    } else {
        children.push(el('div', {
            className: 'm3-card-dock-chapters-empty',
            text: 'Пока нет наград'
        }));
    }

    // «Наградить»: jumps to the original reward anchor on ficbook
    if (workInfo.rewardHref) {
        children.push(el('a', {
            className: 'm3-card-dock-reward-btn',
            attrs: { href: workInfo.rewardHref }
        }, [
            createSvgIcon(ICONS.trophy),
            'Наградить'
        ]));
    }

    return el('section', { className: 'm3-card-dock-feedback-awards' }, children);
}

// Generic paged feed controller: the comments and collections dock tabs
// duplicated the same page-counter / loader-row / error-empty-state /
// throttled scroll-watcher logic. The controller owns the fetch loop and
// the near-bottom listener; the caller supplies the fetch function and the
// item renderer.
function createPagedFeedController({ fetchPage, renderItems, loadingText, errorText, threshold = 200 }) {
    const state = {
        ficId: null,
        initialized: false,
        page: 1,
        hasMore: true,
        isLoading: false,
        items: []
    };

    function reset(ficId) {
        state.ficId = ficId;
        state.initialized = false;
        state.page = 1;
        state.hasMore = true;
        state.isLoading = false;
        state.items = [];
    }

    async function loadNextPage(listEl, { replace = false } = {}) {
        if (!listEl) return;
        if (!state.hasMore || state.isLoading) return;

        state.isLoading = true;

        if (replace) {
            listEl.replaceChildren(el('div', {
                className: 'm3-card-dock-collections-loading',
                text: loadingText
            }));
        } else if (state.items.length > 0) {
            listEl.appendChild(el('div', {
                className: 'm3-card-dock-collections-loading',
                text: 'Загрузка…'
            }));
        }

        try {
            const result = await fetchPage(state.ficId, state.page);
            state.hasMore = Boolean(result.hasMore);
            state.items = state.items.concat(result.items || []);
            state.page += 1;
            renderItems(listEl, state.items);
        } catch (_) {
            if (state.items.length === 0) {
                listEl.replaceChildren(el('div', {
                    className: 'm3-card-dock-chapters-empty',
                    text: errorText
                }));
                state.hasMore = false;
            } else {
                // Drop the loader row; the next scroll retries this page
                listEl.querySelector('.m3-card-dock-collections-loading')?.remove();
            }
        } finally {
            state.isLoading = false;
        }
    }

    // Throttled (~90ms) near-bottom check on the tab's scroll container
    function bindScroll(container, listEl) {
        if (!container || container._feedScrollBound) return;
        container._feedScrollBound = true;

        let lastCheck = 0;
        container.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastCheck < 90) return;
            lastCheck = now;

            const remaining = container.scrollHeight - container.scrollTop - container.clientHeight;
            if (remaining < threshold) {
                loadNextPage(listEl);
            }
        }, { passive: true });
    }

    return { state, reset, loadNextPage, bindScroll };
}

// Feedback tab: stats capsules + awards
function ensureFeedbackTabLoaded() {
    const container = cardDockState.root?.querySelector('.m3-card-dock-feedback');
    if (!container || container._feedbackLoaded) return;
    container._feedbackLoaded = true;

    const { workInfo } = dockLazyState;
    if (!workInfo) return;

    container.replaceChildren(...[
        buildFeedbackStatsRow(workInfo),
        buildFeedbackAwardsSection(workInfo),
    ].filter(Boolean));
}

// Drag-to-expand/collapse. Drag surface = header area only (handle +
// controls row); buttons/links pass through, the chapters list owns its
// own scroll. The CSS height transition is disabled mid-drag; on release
// the inline height is dropped and .expanded is toggled in the same
// frame, so the class transition animates from the dragged position.
function bindDockGestures(dockEl) {
    const header = dockEl.querySelector('.m3-card-dock-controls');

    let startY = 0;
    let startHeight = 0;
    let lastY = 0;
    let lastMoveTime = 0;
    let velocity = 0;
    let isDragging = false;

    const inHeader = (target) => {
        const node = target instanceof Element ? target : target?.parentElement;
        return Boolean(node && (dockEl.querySelector('.m3-card-dock-handle').contains(node) || header.contains(node)));
    };

    const onTouchStart = (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        // Buttons, the read pill and chapter links keep their taps
        if (e.target.closest('button, a')) return;
        if (!inHeader(e.target)) return;

        startY = lastY = e.touches[0].clientY;
        startHeight = dockEl.offsetHeight;
        const collapsedH = startHeight;
        const expandedH = 0.65 * window.innerHeight;
        velocity = 0;
        lastMoveTime = e.timeStamp;
        isDragging = true;
        dockEl.classList.add('is-dragging');
        // Compositor promotion: высота будет меняться каждый touchmove —
        // фиксируем слой заранее, чтобы drag не вызывал layout thrashing
        dockEl.style.willChange = 'height';
        dockEl.style.transition = 'none';
        if (cardDockState.scrim) {
            cardDockState.scrim.style.transition = 'none';
            cardDockState.scrim.style.visibility = 'visible';
        }
        dockEl._dragMetrics = { collapsedH, expandedH };
    };

    const onTouchMove = (e) => {
        if (!isDragging || !e.touches || e.touches.length !== 1) return;
        const y = e.touches[0].clientY;

        const dt = e.timeStamp - lastMoveTime;
        if (dt > 0) {
            // px/ms, positive = moving down; smoothed over the last event
            velocity = (y - lastY) / dt;
        }
        lastY = y;
        lastMoveTime = e.timeStamp;

        const { collapsedH, expandedH } = dockEl._dragMetrics;
        const dy = y - startY;
        const h = Math.min(expandedH, Math.max(0, startHeight - dy));
        dockEl.style.height = `${h}px`;

        if (cardDockState.scrim) {
            const range = expandedH - collapsedH;
            const ratio = range > 0 ? (h - collapsedH) / range : 0;
            cardDockState.scrim.style.opacity = String(Math.min(Math.max(ratio, 0), 1));
        }
    };

    const onTouchEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;

        const { collapsedH, expandedH } = dockEl._dragMetrics;
        const currentHeight = dockEl.offsetHeight;
        const midpoint = collapsedH + (expandedH - collapsedH) / 2;
        // Fling: fast movement (velocity in px/ms; up is negative)
        const flickUp = velocity < -0.5;
        const flickDown = velocity > 0.5;

        let expand;
        if (e.type === 'touchcancel') {
            // Cancel: snap back to the pre-drag state
            expand = startHeight > midpoint;
        } else if (flickUp) {
            expand = true;
        } else if (flickDown) {
            expand = false;
        } else {
            expand = currentHeight > midpoint;
        }

        dockEl.classList.remove('is-dragging');
        // will-Change снимается вместе с остальным drag-состоянием —
        // постоянный слой утекает памятью на простаивающем доке
        dockEl.style.willChange = '';
        dockEl.style.transition = '';
        dockEl.style.height = '';
        if (cardDockState.scrim) {
            cardDockState.scrim.style.transition = '';
            cardDockState.scrim.style.visibility = '';
            cardDockState.scrim.style.opacity = '';
        }
        setCardDockExpanded(expand);

        // Insurance against the synthetic click landing on the toggle
        dockEl.dataset.gestureJustEnded = '1';
        setTimeout(() => delete dockEl.dataset.gestureJustEnded, 50);
    };

    dockEl.addEventListener('touchstart', onTouchStart, { passive: true });
    dockEl.addEventListener('touchmove', onTouchMove, { passive: true });
    dockEl.addEventListener('touchend', onTouchEnd);
    dockEl.addEventListener('touchcancel', onTouchEnd);
}

function buildCardDock(workInfo, resumeTarget) {
    const { ficId } = getFicParams();

    // Read pill: «Продолжить» when a saved position exists (last-in-list
    // chapter with pct > 0.01), else «Читать» → first chapter. The resume
    // path must NOT set fic_nav_fresh_chapter — the reader restores position.
    const isResume = Boolean(resumeTarget);
    const pillHref = isResume ? resumeTarget.chapter.href : (workInfo.firstChapterHref || '#');

    const readPill = el('a', {
        className: 'm3-card-dock-read-pill',
        attrs: { href: pillHref, 'aria-label': isResume ? 'Продолжить чтение' : 'Читать' },
        events: {
            click: () => {
                setReadIntent();
                if (!isResume) {
                    try {
                        sessionStorage.setItem(STORAGE_KEYS.freshChapter, '1');
                    } catch (_) {}
                }
            }
        }
    }, [isResume ? 'Продолжить' : 'Читать']);

    const menuBtn = el('button', {
        className: 'm3-card-dock-icon-btn is-active-tab',
        attrs: { type: 'button', 'aria-label': 'Список глав', 'aria-expanded': 'false' },
        events: {
            click: () => {
                if (cardDockState.root?.dataset.gestureJustEnded) return;
                if (cardDockState.activeTab === 'chapters') {
                    setCardDockExpanded(!cardDockState.isExpanded);
                } else {
                    setDockTab('chapters');
                    setCardDockExpanded(true);
                }
            }
        }
    }, [createSvgIcon(ICONS.menuBook)]);

    // Feedback tab («Отклики»): awards section + comments feed, loaded
    // lazily on first open. Always interactive — even a work with zero
    // feedback opens the tab with its stats and empty states.
    const feedbackBadgeCount = (workInfo.stats.comments || 0) + (workInfo.stats.awards || 0);
    const feedbackBtn = el('button', {
        className: 'm3-card-dock-icon-btn',
        attrs: {
            type: 'button',
            'aria-label': 'Отклики',
            'aria-expanded': 'false'
        },
        events: {
            click: () => {
                if (cardDockState.root?.dataset.gestureJustEnded) return;
                if (cardDockState.activeTab === 'feedback') {
                    setCardDockExpanded(!cardDockState.isExpanded);
                } else {
                    setDockTab('feedback');
                    setCardDockExpanded(true);
                }
            }
        }
    }, [createSvgIcon(ICONS.forum)]);
    if (feedbackBadgeCount > 0) {
        feedbackBtn.appendChild(el('span', {
            className: 'm3-card-dock-tab-badge',
            text: feedbackBadgeCount >= 1000
                ? `${(feedbackBadgeCount / 1000).toFixed(1).replace('.0', '')}k`
                : String(feedbackBadgeCount)
        }));
    }

    // Collections tab: add-to-collection action + link to the full list.
    // Disabled when the work has no collections counter at all.
    const collectionsBtn = el('button', {
        className: 'm3-card-dock-icon-btn',
        attrs: {
            type: 'button',
            'aria-label': 'Сборники',
            'aria-expanded': 'false',
            disabled: null
        },
        events: {
            click: () => {
                if (cardDockState.root?.dataset.gestureJustEnded) return;
                if (cardDockState.activeTab === 'collections') {
                    setCardDockExpanded(!cardDockState.isExpanded);
                } else {
                    setDockTab('collections');
                    setCardDockExpanded(true);
                }
            }
        }
    }, [createSvgIcon(ICONS.bookmark)]);
    if (workInfo.collections.count !== null) {
        collectionsBtn.appendChild(el('span', {
            className: 'm3-card-dock-tab-badge',
            text: workInfo.collections.count >= 1000
                ? `${(workInfo.collections.count / 1000).toFixed(1).replace('.0', '')}k`
                : String(workInfo.collections.count)
        }));
    }

    const controlsDock = el('div', { className: 'm3-card-dock-controls' }, [
        el('div', { className: 'm3-card-dock-btn-group' }, [menuBtn, feedbackBtn, collectionsBtn]),
        readPill
    ]);

    // "Прочитано" action pill: shown only when the native Vue button was found
    if (workInfo.readNode) {
        const readActionPill = el('button', {
            className: 'm3-card-dock-read-action-pill',
            attrs: { type: 'button', 'aria-label': 'Отметить как прочитанное' },
            events: {
                click: () => {
                    try { workInfo.readNode.click(); } catch (_) {}
                }
            }
        }, [createSvgIcon(ICONS.checkCircle), 'Прочитано']);
        controlsDock.appendChild(readActionPill);
    }

    // Chapter list: rendered lazily on first dock expansion (large lists
    // stay off the initial layout pass). Placeholder until then.
    const chaptersScroll = el('div', { className: 'm3-card-dock-chapters' });

    // Feedback tab: stats capsules + awards + comments feed, rendered
    // lazily on first switch to the tab
    const feedbackScroll = el('div', { className: 'm3-card-dock-feedback' });

    // Collections tab: add action + link to full list
    const collectionsScroll = el('div', { className: 'm3-card-dock-collections' });
    collectionsScroll.appendChild(el('button', {
            className: 'm3-card-dock-add-collection-btn',
            attrs: { type: 'button' },
            text: 'Добавить в сборник',
            events: {
                click: () => {
                    const node = [...document.querySelectorAll('.button-container.jsVueComponent span.ds-btn, fanfic-collections-modal span.ds-btn')]
                        .find(n => n.textContent.includes('сборник')) ||
                        workInfo.addToCollectionNode;
                    if (node) {
                        node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }));
                    }
                }
            }
        }));
    if (workInfo.collections.href) {
        collectionsScroll.appendChild(el('a', {
            className: 'm3-card-dock-add-collection-btn',
            attrs: { href: workInfo.collections.href }
        }, ['Все сборники']));
    }

    const dragHandle = el('div', {
        className: 'm3-card-dock-handle',
        attrs: { role: 'button', 'aria-label': 'Свернуть список глав', tabindex: '0' },
        events: {
            click: () => {
                if (cardDockState.root?.dataset.gestureJustEnded) return;
                setCardDockExpanded(!cardDockState.isExpanded);
            },
            keydown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setCardDockExpanded(!cardDockState.isExpanded);
                }
            }
        }
    }, [el('div', { className: 'm3-card-dock-drag-pill' })]);

    cardDockState.scrim = el('div', {
        className: 'm3-card-dock-scrim',
        events: { click: () => setCardDockExpanded(false) }
    });

    cardDockState.root = el('div', {
        className: `m3-card-dock${workInfo.chapters.length > 1 ? ' has-chapters' : ''}`
    }, [
        dragHandle,
        controlsDock,
        chaptersScroll,
        feedbackScroll,
        collectionsScroll
    ]);

    bindDockGestures(cardDockState.root);

    dockLazyState.workInfo = workInfo;
    dockLazyState.resumeTarget = isResume ? resumeTarget : null;
    dockLazyState.chaptersRendered = false;

    return [cardDockState.scrim, cardDockState.root];
}

// Related-works carousel: merges every .fanfic-promo-carousel of the
// source page into one horizontal snap-scroller of mini cards.
function buildCardPromoCarousel(promoCards) {
    if (!promoCards || promoCards.length === 0) return null;

    const items = promoCards.map((card) => el('a', {
        className: 'm3-card-promo-item',
        attrs: { href: card.href }
    }, [
        el('div', { className: 'm3-card-promo-cover-wrap' }, [
            card.coverUrl
                ? el('img', {
                    className: 'm3-card-promo-cover',
                    attrs: {
                        src: card.coverUrl,
                        alt: card.title,
                        loading: 'lazy',
                        referrerpolicy: 'no-referrer'
                    }
                })
                : el('div', { className: 'm3-card-promo-cover is-placeholder' }),
            card.direction && el('span', {
                className: `m3-card-promo-direction direction-${card.direction}`
            })
        ].filter(Boolean)),
        el('span', {
            className: 'm3-card-promo-title',
            text: card.title,
            attrs: { title: card.title }
        }),
        card.fandom && el('span', {
            className: 'm3-card-promo-fandom',
            text: card.fandom,
            attrs: { title: card.fandom }
        })
    ].filter(Boolean)));

    return el('section', { className: 'm3-card-promo-carousel-wrap' }, [
        el('span', { className: 'm3-card-section-title', text: 'Похожие работы' }),
        el('div', { className: 'm3-card-promo-carousel' }, items)
    ]);
}

// Card body: page content + persistent dock. Dock replaces the inline read
// button from the phase 2 stub.
function buildCardPage(workInfo, resumeTarget) {
    return el('div', { className: 'm3-card-page' }, [
        buildCardTopBar(workInfo),
        buildCardHero(workInfo),
        buildCardMetadata(workInfo),
        buildCardPromo(workInfo.promoHtml),
        buildCardDescription(workInfo.summaryHtml),
        buildCardNotes(workInfo.notes),
        buildCardDedication(workInfo.dedication),
        buildCardTags(workInfo.tags),
        buildCardPromoCarousel(workInfo.promoCards)
    ].filter(Boolean));
}

// Mark metadata values that actually overflow their grid column. Runs
// after layout (and on resize, reflow-dependent) — before that the
// measurement is meaningless. Re-checks a row even when already expanded:
// a width change can un-truncate it.
//
// Reads and writes are split into separate phases over the whole set, so
// the browser computes one reflow for all scrollWidth/clientWidth reads
// instead of one per element (layout thrashing).
function checkMetadataTruncation() {
    const grid = document.querySelector('.m3-card-metadata[data-pending-truncation-check]');
    if (!grid) return;
    delete grid.dataset.pendingTruncationCheck;

    const measure = () => {
        const vals = [...grid.querySelectorAll('.m3-card-meta-val')];
        if (vals.length === 0) return;

        // Phase 1 — record prior state and drop .expanded, so every value
        // is measured in its collapsed (nowrap) rendering
        const wasExpanded = vals.map((v) => v.classList.contains('expanded'));
        vals.forEach((v) => v.classList.remove('expanded'));

        // Phase 2 — one contiguous batch of reads = a single reflow
        const truncated = vals.map((v) => v.scrollWidth > v.clientWidth + 1);

        // Phase 3 — batch the writes: classes + ARIA, then restore
        vals.forEach((v, i) => {
            v.classList.toggle('is-truncated', truncated[i]);
            if (wasExpanded[i]) v.classList.add('expanded');

            if (truncated[i]) {
                v.setAttribute('role', 'button');
                v.setAttribute('tabindex', '0');
                if (!v.getAttribute('aria-label')) {
                    v.setAttribute('aria-label', 'Раскрыть значение');
                }
            } else {
                v.removeAttribute('role');
                v.removeAttribute('tabindex');
                v.removeAttribute('aria-label');
            }
        });
    };

    requestAnimationFrame(measure);

    // A previous observer (dynamic re-render of the same grid node) would
    // keep resizing against a detached tree — tear it down first
    if (typeof grid._roCleanup === 'function') {
        grid._roCleanup();
        delete grid._roCleanup;
    }
    grid._roCleanup = observeResize(grid, measure);
}

function initBookCard() {
    if (bookCardInitialized || document.getElementById('m3-book-card-root')) return;

    // Card init is a deliberate navigation target, never a position restore
    try {
        sessionStorage.removeItem(STORAGE_KEYS.freshChapter);
    } catch (_) {}

    const { ficId } = getFicParams();
    const workInfo = extractWorkInfo(document);

    // Seed the shared chapter cache so the reader TOC skips its fetch
    seedChaptersCacheFromCard(ficId, workInfo.chapters);

    const resumeTarget = findResumeChapter(ficId, workInfo.chapters);

    const cardRoot = el('div', { attrs: { id: 'm3-book-card-root' } }, [
        buildCardPage(workInfo, resumeTarget),
        ...buildCardDock(workInfo, resumeTarget)
    ]);

    // Overlay approach: keep original ficbook DOM intact so Vue stays alive.
    // cardRoot is position:fixed;inset:0;z-index:5000 — covers the whole screen.
    document.body.style.overflow = 'hidden';
    document.body.appendChild(cardRoot);
    // main.js загружается позже — гард обязателен
    if (typeof revealAfterMount === 'function') revealAfterMount();

    // Подсказка отката «вернуться к месту чтения» на карточке: если есть
    // furthest-read точка (> 5%), показываем таблетку над hero. currentPartId
    // null + currentPct 0 → любая записанная точка считается откатом.
    if (typeof findResumeRollback === 'function' && typeof showResumeBanner === 'function') {
        const rollback = findResumeRollback(ficId, workInfo.chapters, null, 0);
        if (rollback) showResumeBanner(rollback, { variant: 'card' });
    }

    // Esc collapses the dock (card page has no other overlays in v1)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isCardDockExpanded()) {
            setCardDockExpanded(false);
        }
    });

    // If «Продолжить» exists, make sure the chapter is visible when the
    // user expands the dock — chapters render lazily on first expansion,
    // so the scroll runs after ensureChaptersRendered has built the rows
    if (resumeTarget) {
        const scrollResumeIntoView = () => {
            requestAnimationFrame(() => {
                const resumeEl = cardDockState.root?.querySelector('.is-resume');
                if (resumeEl) {
                    resumeEl.scrollIntoView({ block: 'center', behavior: 'instant' });
                }
            });
        };
        if (dockLazyState.chaptersRendered) {
            scrollResumeIntoView();
        } else {
            initBookCardResumeHook = scrollResumeIntoView;
        }
    }

    checkMetadataTruncation();

    bookCardInitialized = true;
}

// --- ui/resume-banner.js ---
// Подсказка-таблетка «Вернуться к месту чтения». Показывается, когда контекст
// загрузки ПОЗАДИ записанной furthest-read точки — обычно браузер перезапустился
// на старой вкладке/URL (откат истории сессии), хотя прошлая сессия уже ушла
// вперёд. Это не оверлей: без scrim, без OverlayManager, без Esc — пассивная
// подсказка со своей кнопкой закрытия.

let resumeBannerEl = null;

function removeResumeBanner() {
    if (resumeBannerEl) {
        resumeBannerEl.remove();
        resumeBannerEl = null;
    }
}

function isResumeBannerDismissed(ficId) {
    try {
        return sessionStorage.getItem(STORAGE_KEYS.resumeBannerDismissed(ficId)) === '1';
    } catch (_) {
        return false;
    }
}

function dismissResumeBanner(ficId) {
    try {
        sessionStorage.setItem(STORAGE_KEYS.resumeBannerDismissed(ficId), '1');
    } catch (_) {}
    removeResumeBanner();
}

// rollback — { chapter, pct } из findResumeRollback(); variant — 'reader'
// (фиксированная таблетка над FAB) или 'card' (встроенная таблетка на карточке,
// вставляется перед hero).
function showResumeBanner(rollback, { variant = 'reader' } = {}) {
    if (!rollback || !rollback.chapter) return;

    const { ficId } = getFicParams();
    if (!ficId || isResumeBannerDismissed(ficId)) return;

    removeResumeBanner();

    const target = rollback.chapter;
    const pctLabel = `${Math.round(Math.min(Math.max(rollback.pct, 0), 1) * 100)}%`;
    const label = target.title
        ? `Вернуться к месту чтения · ${target.title} · ${pctLabel}`
        : `Вернуться к месту чтения · ${pctLabel}`;

    const actionBtn = el('button', {
        className: 'm3-resume-banner-action',
        attrs: { type: 'button', 'aria-label': label },
        events: {
            click: () => {
                removeResumeBanner();
                // Во всех вариантах: полный reload с pendingPos — тот же путь что
                // кнопка «Продолжить», которая работает стабильно.
                try {
                    sessionStorage.setItem(STORAGE_KEYS.pendingPos, String(rollback.pct));
                    sessionStorage.removeItem(STORAGE_KEYS.freshChapter);
                } catch (_) {}
                window.location.href = target.href;
            }
        }
    }, [
        createSvgIcon(ICONS.autoStories),
        el('span', { className: 'm3-resume-banner-text', text: label })
    ]);

    const closeBtn = el('button', {
        className: 'm3-resume-banner-close',
        attrs: { type: 'button', 'aria-label': 'Скрыть' },
        events: {
            click: (e) => {
                e.stopPropagation();
                dismissResumeBanner(ficId);
            }
        }
    }, [createSvgIcon(ICONS.close)]);

    resumeBannerEl = el('div', {
        className: `m3-resume-banner m3-resume-banner-${variant}`,
        attrs: { role: 'status' }
    }, [actionBtn, closeBtn]);

    if (variant === 'card') {
        const hero = document.querySelector('#m3-book-card-root .m3-card-hero');
        if (hero && hero.parentNode) {
            hero.parentNode.insertBefore(resumeBannerEl, hero);
        } else {
            document.body.appendChild(resumeBannerEl);
        }
    } else {
        document.body.appendChild(resumeBannerEl);
    }
}

// Проверка на стороне ридера: текущая глава/pct против furthest-read записи.
// Список глав берётся из сессионного кэша — без сетевого запроса, баннер не
// должен задерживать первую отрисовку; отсутствие списка откатывается на
// сравнение единственной главы внутри findResumeRollback.
function maybeShowResumeBanner() {
    const { ficId, partId } = getFicParams();
    if (!ficId) return;

    const currentPartId = partId || 'root';

    // Берём фактическую позицию скролла, а не из localStorage:
    // localStorage хранит furthest-read, поэтому разница была бы всегда ~0
    // (особенно для однотомника), и баннер никогда бы не показывался.
    let currentPct = 0;
    try {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable > 0) currentPct = window.scrollY / scrollable;
    } catch (_) {}

    let chapters = null;
    try {
        const raw = sessionStorage.getItem(STORAGE_KEYS.chaptersList(ficId));
        if (raw) chapters = JSON.parse(raw);
    } catch (_) {}

    // Fallback: in-memory cache (populated by SPA navigation / card scrape)
    if (!Array.isArray(chapters) || chapters.length === 0) {
        const cached = chaptersCache.get(ficId);
        if (Array.isArray(cached) && cached.length > 0) chapters = cached;
    }

    const rollback = findResumeRollback(ficId, chapters, currentPartId, currentPct);
    if (rollback) {
        showResumeBanner(rollback, { variant: 'reader' });
        return;
    }

    // Если список глав ещё не загружен (холодный старт) — пробуем async.
    // Нужно для многотомников: без списка findResumeRollback думает что это
    // однотомник и не находит furthest-главу по partId.
    if (chapters !== null) return; // список есть, но rollback не нашёлся
    fetchChaptersList(ficId).then((list) => {
        if (!Array.isArray(list) || list.length <= 1) return;
        // Проверяем что юзер всё ещё на той же странице
        const { ficId: nowFicId, partId: nowPartId } = getFicParams();
        if (nowFicId !== ficId || (nowPartId || 'root') !== currentPartId) return;
        const rollback2 = findResumeRollback(ficId, list, currentPartId, currentPct);
        if (rollback2) showResumeBanner(rollback2, { variant: 'reader' });
    }).catch(() => {});
}

// --- main.js ---
let isInitialized = false;
let domObserver = null;
let mainNavContainerRef = null;
let settingsSheetBuilt = false;
let resizeObserverDisconnect = null;

// Снятие anti-FOUC-щита (инъектируется первым модулем, core/anti-fouc.js):
// вызывается, когда чистый DOM заменяет исходный.
function revealAfterMount() {
    const shield = document.getElementById('m3-anti-fouc-shield');
    if (shield) shield.remove();
}

// Deferred UI path: settings sheet, pull-navigate gesture, cache warm —
// everything the reader can paint without. requestIdleCallback with a
// 250ms timeout fallback so the sheet always exists soon.
function runDeferredInit() {
    if (settingsSheetBuilt) return;
    settingsSheetBuilt = true;
    buildSettingsSheet(mainNavContainerRef);
    initPullNavigate();
    warmChaptersCache();
}

function scheduleDeferredInit() {
    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(runDeferredInit, { timeout: 250 });
    } else {
        setTimeout(runDeferredInit, 250);
    }
}

// Fallback when the user opens the sheet before the deferred path ran:
// build synchronously on demand so the FAB never no-ops.
function ensureSettingsSheetBuilt() {
    runDeferredInit();
}

// Перепривязка ResizeObserver к новому #content при SPA-смене главы:
// старый наблюдатель держит ссылку на удалённый узел
function rebindResizeObserver(newContent) {
    if (resizeObserverDisconnect) resizeObserverDisconnect();
    resizeObserverDisconnect = observeResize(newContent, recalculateMetrics);
}

function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

        if (e.key === 'Escape') {
            // Единственный диспетч закрытия: верхнее окно стека оверлеев
            OverlayManager.closeTop();
            return;
        }

        if (OverlayManager.hasActive()) {
            return;
        }

        const isPaged = settings.get('readingMode') === 'paged';

        if (e.key === 'ArrowLeft') {
            if (isPaged) {
                turnPage(-1);
            } else if (navLinks.prev) {
                navigateToChapter(navLinks.prev);
            }
        } else if (e.key === 'ArrowRight') {
            if (isPaged) {
                turnPage(1);
            } else if (navLinks.next) {
                navigateToChapter(navLinks.next);
            }
        }
    });
}

function initReaderMode() {
    if (isInitialized || document.getElementById('clean-reader-container')) {
        if (domObserver) {
            domObserver.disconnect();
            domObserver = null;
        }
        return;
    }

    const textContent = document.querySelector('#content');
    if (!textContent) return;

    if (domObserver) {
        domObserver.disconnect();
        domObserver = null;
    }

    // Извлечение сносок из исходного DOM до его очистки
    collectFootnotesFromPage();

    const headerInfo = scrapeChapterHeader(document);

    const headerCard = el('div', { className: 'm3-card' }, [
        headerInfo.ficTitle && el('div', { className: 'm3-fic-title', text: headerInfo.ficTitle }),
        headerInfo.partTitle && el('div', { className: 'm3-part-title', text: headerInfo.partTitle }),
        headerInfo.partDate && el('div', { className: 'm3-part-date', text: headerInfo.partDate })
    ]);

    const navContainers = document.querySelectorAll('.navigation-to-fanfic-parts-container');
    const mainNavContainer = navContainers[0];

    // Ad/promo/iframe cleanup: one combined selector, one DOM pass
    textContent.querySelectorAll(AD_CLEANUP_SELECTOR).forEach((node) => node.remove());

    // Site inline typography is neutralized by the high-specificity
    // !important rules in 03-content.css — no JS style sweep needed
    const fab = el('button', {
        className: 'm3-fab',
        attrs: { type: 'button', 'aria-label': 'Меню настроек' },
        events: { click: openSettingsSheet }
    }, [createSvgIcon(ICONS.tune)]);

    const readerWrapper = el('div', { attrs: { id: 'clean-reader-container' } }, [
        headerCard,
        textContent
    ]);

    document.body.replaceChildren(readerWrapper);
    document.body.className = '';
    document.body.appendChild(fab);
    revealAfterMount();

    // Инициализация подсистем интерфейса
    // (подписки настроек — после объявления всех модулей, поэтому без typeof-гардов)
    setupSettingsSubscriptions();
    setupFootnoteInterception(textContent);
    initPagedZones();

    // Критический путь завершён — вторичный UI откладывается до idle
    mainNavContainerRef = mainNavContainer;
    scheduleDeferredInit();

    applyReadingMode(settings.get('readingMode'));

    resizeObserverDisconnect = observeResize(textContent, recalculateMetrics);

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    if (window.location.hash.includes('part_content')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const { ficId, partId } = getFicParams();
    const storageKey = STORAGE_KEYS.chapterPos(ficId, partId);
    let isFreshNavigation = false;
    try {
        isFreshNavigation = sessionStorage.getItem(STORAGE_KEYS.freshChapter) === '1';
    } catch (_) {}

    // Одноразовый pendingPos: resume-тап с карточки проносит pct через
    // sessionStorage (ридер там не смонтирован → полный reload). Потребляем
    // и удаляем сразу, чтобы он не утёк в следующую загрузку.
    let pendingPct = 0;
    try {
        const rawPending = sessionStorage.getItem(STORAGE_KEYS.pendingPos);
        if (rawPending !== null) {
            pendingPct = parseFloat(rawPending) || 0;
            sessionStorage.removeItem(STORAGE_KEYS.pendingPos);
        }
    } catch (_) {}

    if (isFreshNavigation) {
        try {
            sessionStorage.removeItem(STORAGE_KEYS.freshChapter);
            localStorage.removeItem(storageKey);
        } catch (_) {}
        window.scrollTo(0, 0);
    } else if (pendingPct > 0.0005) {
        restoreScrollToPct(pendingPct);
    } else {
        restoreScrollPosition(storageKey);
    }

    setupScrollPositionTracking();
    setupKeyboardShortcuts();
    // Фиксируем смонтированную главу и показываем подсказку отката (если
    // текущая позиция позади furthest-read точки)
    if (typeof setActiveMountedPart === 'function') setActiveMountedPart(partId, ficId);
    if (typeof markActiveChapter === 'function') markActiveChapter(ficId, partId);
    if (typeof maybeShowResumeBanner === 'function') maybeShowResumeBanner();
    isInitialized = true;
}

// Two-state router: chapter reader vs book card.
// URL shape is primary; DOM presence resolves the one-part case where the
// root /readfic/{ficId} URL serves the chapter text itself.
function routePage() {
    // Парсер ещё не закончил: соскребать полусобранный DOM нельзя.
    // Роутинг повторно запускается по DOMContentLoaded (см. ниже) или
    // следующим срабатыванием MutationObserver после парсинга.
    if (document.readyState === 'loading') return false;

    // One-shot read intent: consumed on every load, in every branch, so a
    // stale flag can never leak into a later navigation
    const hasReadIntent = consumeReadIntent();

    if (isInitialized || document.getElementById('clean-reader-container')) {
        // DOM наш, но isInitialized=false — JS-процесс был убит и восстановлен,
        // listeners мертвы. reload() убьёт наш DOM → следующий запуск инициализируется чисто.
        if (!isInitialized) location.reload();
        return true;
    }
    if (isBookCardActive() || document.getElementById('m3-book-card-root')) {
        // Карточка в DOM: либо живая (isBookCardActive), либо restore после убийства процесса.
        if (!bookCardInitialized) location.reload();
        return true;
    }

    const { state, ficId, partId } = detectPageState();

    if (state === 'chapter' && (partId || hasReadIntent)) {
        initReaderMode();
        return isInitialized;
    }

    if (state === 'chapter' && !partId && !hasReadIntent) {
        // One-part work serving text at the root URL: card wins ("always
        // show the card at root"); the read action re-enters via intent
        initBookCard();
        return true;
    }

    if (state === 'work') {
        initBookCard();
        return true;
    }

    // Unknown or not-yet-ready DOM — let the MutationObserver retry
    return false;
}

// Parse-gating: while readyState === 'loading' the incremental parser
// exposes half-built #content (scraping it would freeze partial data).
// Ficbook serves full HTML documents, so routing after DOMContentLoaded
// is still far earlier than the old document-idle.

// Наблюдатель активируется только если к моменту DOMContentLoaded
// маршрутизируемый DOM ещё не появился (SPA-дозагрузка). Всё время
// потокового парсинга главной главы он не активен — нулевой overhead
// на мутации для многостраничных глав.
function startDomObserver() {
    if (domObserver || isInitialized || isBookCardActive()) return;

    // Фильтр мутаций: роутер вызывается только когда добавляются узлы с
    // маркерами страниц ficbook (иначе наблюдатель реагировал на каждый узел)
    const ROUTE_TARGET_SELECTORS = '#content, .fanfic-hat, .chapter-info, ul.list-of-fanfic-parts';

    const hasRelevantNodes = (mutations) => {
        for (let i = 0; i < mutations.length; i++) {
            const nodes = mutations[i].addedNodes;
            for (let j = 0; j < nodes.length; j++) {
                const node = nodes[j];
                if (node.nodeType === 1) {
                    if (node.matches?.(ROUTE_TARGET_SELECTORS) || node.querySelector?.(ROUTE_TARGET_SELECTORS)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    domObserver = new MutationObserver((mutations) => {
        if (isInitialized || isBookCardActive()) {
            domObserver.disconnect();
            domObserver = null;
            return;
        }
        if (hasRelevantNodes(mutations)) {
            routePage();
        }
    });
    // documentElement (not body): at document-start the body may not exist yet
    domObserver.observe(document.documentElement, { childList: true, subtree: true });

    // Safety net: if the page never surfaces a routable DOM (unknown
    // ficbook page structure, Cloudflare challenge, etc.), disconnect
    // the observer and remove the anti-FOUC shield so the page is not
    // invisible indefinitely. 2500ms is well above any realistic load time.
    setTimeout(() => {
        if (domObserver) {
            domObserver.disconnect();
            domObserver = null;
        }
        if (!isInitialized && !isBookCardActive()) {
            revealAfterMount();
        }
    }, 2500);
}

// Удаляем Vue-компонент модального баннера "скачай приложение".
// CSS уже скрывает его через display:none, но Vue монтирует контент
// асинхронно — нужно также убрать узел из DOM.
{
    const removeAppInstallAds = () => {
        document.querySelectorAll('app-install-ads').forEach(el => el.remove());
    };
    removeAppInstallAds();
    const appAdsObs = new MutationObserver(removeAppInstallAds);
    appAdsObs.observe(document.body || document.documentElement, { childList: true, subtree: !document.body });
    setTimeout(() => appAdsObs.disconnect(), 15000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (routePage()) return;
        // Целевой DOM не появился при парсинге — следим за SPA-дозагрузкой
        startDomObserver();
    }, { once: true });
} else {
    if (!routePage()) startDomObserver();
}
} catch(e) { const s = document.getElementById('m3-anti-fouc-shield'); if(s) s.remove(); const b = document.querySelector('body'); if(b) b.style.setProperty('visibility','visible','important'); }
})();