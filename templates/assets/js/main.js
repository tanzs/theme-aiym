/* ============================================================
   AIYM Theme - Main JS
   ============================================================ */

/* --- Theme Manager --- */
const THEME_STORAGE_KEY = "aiym-theme-mode";
const THEME_DEFAULT = "system";

class ThemeManager {
  constructor() {
    this.currentMode = THEME_DEFAULT;
    this.toggleButtons = null;
  }
  init() {
    this.currentMode = this.getStoredMode() || this.getConfiguredDefaultMode();
    this.applyMode();
    this.toggleButtons = document.querySelectorAll("[data-theme-toggle]");
    this.toggleButtons.forEach(b => b.addEventListener("click", () => this.toggle()));
    this.watchSystemTheme();
  }
  getStoredMode() {
    try {
      const v = localStorage.getItem(THEME_STORAGE_KEY);
      if (v && ["system", "light", "dark"].includes(v)) return v;
    } catch {}
    return null;
  }
  getConfiguredDefaultMode() {
    const v = document.documentElement.dataset.defaultTheme;
    return v && ["system", "light", "dark"].includes(v) ? v : THEME_DEFAULT;
  }
  setStoredMode(v) {
    try { localStorage.setItem(THEME_STORAGE_KEY, v); } catch {}
  }
  applyMode() {
    const resolved = this.resolveMode(this.currentMode);
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add("theme-" + resolved);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", resolved === "dark" ? "#1a1a1a" : "#ffffff");
    this.updateToggleButton(resolved);
  }
  resolveMode(mode) {
    return mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : mode;
  }
  updateToggleButton(resolved) {
    if (!this.toggleButtons || !this.toggleButtons.length) return;
    this.toggleButtons.forEach(btn =>
      btn.setAttribute("aria-label", resolved === "dark" ? "切换到浅色模式" : "切换到深色模式")
    );
  }
  toggle() {
    const next = this.resolveMode(this.currentMode) === "dark" ? "light" : "dark";
    this.currentMode = next;
    this.setStoredMode(next);
    this.applyMode();
  }
  watchSystemTheme() {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (this.currentMode === "system") this.applyMode();
    });
  }
}

/* --- Search Modal (miniapp 风格) --- */
const SEARCH_HISTORY_KEY = "aiym-search-history";
const SEARCH_MAX_HISTORY = 15;

class SearchModal {
  constructor() {
    this.modal = null;
    this.input = null;
    this.body = null;
    this.clearBtn = null;
    this.submitBtn = null;
    this.historyEl = null;
    this.historyTagsEl = null;
    this.hotEl = null;
    this.hotTagsEl = null;
    this.countEl = null;
    this.loading = false;
    this.isOpen = false;
  }

  init() {
    this.modal = document.getElementById("searchModal");
    if (!this.modal) return;
    this.input = this.modal.querySelector("[data-search-modal-input]");
    this.body = this.modal.querySelector("#searchModalBody");
    this.clearBtn = this.modal.querySelector("[data-search-modal-clear]");
    this.submitBtn = this.modal.querySelector("[data-search-modal-submit]");
    this.historyEl = this.modal.querySelector("[data-search-modal-history]");
    this.historyTagsEl = this.modal.querySelector("[data-search-modal-history-tags]");
    this.hotEl = this.modal.querySelector("[data-search-modal-hot]");
    this.hotTagsEl = this.modal.querySelector("[data-search-modal-hot-tags]");
    this.countEl = this.modal.querySelector("[data-search-modal-count]");

    this.loadHotKeywords();

    // Bind open buttons
    document.querySelectorAll("[data-search-open]").forEach(btn => {
      btn.addEventListener("click", (e) => { e.preventDefault(); this.open(); });
    });

    // Bind close
    this.modal.querySelectorAll("[data-search-close]").forEach(el => {
      el.addEventListener("click", () => this.close());
    });

    // Click outside panel to close
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Input events
    if (this.input) {
      this.input.addEventListener("input", () => this.handleInput());
      this.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); this.doSearch(); }
      });
    }

    // ESC 全局监听（不依赖 input 焦点）
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        e.preventDefault();
        this.close();
      }
    });

    // Clear button
    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => this.clearSearch());
    }

    // Submit button
    if (this.submitBtn) {
      this.submitBtn.addEventListener("click", () => this.doSearch());
    }

    // Hot tag clicks (delegated)
    if (this.hotTagsEl) {
      this.hotTagsEl.addEventListener("click", (e) => {
        const tag = e.target.closest("[data-search-modal-hot-tag]");
        if (tag) {
          const kw = tag.textContent.trim();
          this.input.value = kw;
          this.doSearch();
        }
      });
    }

    // History tag clicks (delegated)
    if (this.historyTagsEl) {
      this.historyTagsEl.addEventListener("click", (e) => {
        const tag = e.target.closest("[data-search-modal-tag]");
        if (tag) {
          const kw = tag.textContent.trim();
          this.input.value = kw;
          this.doSearch();
        }
      });
    }

    // Clear history
    const clearBtn = this.modal.querySelector("[data-search-clear-history]");
    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.clearHistory();
      });
    }

    // Keyboard shortcut: Cmd/Ctrl + K
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        this.isOpen ? this.close() : this.open();
      }
    });
  }

  loadHotKeywords() {
    const raw = this.modal.getAttribute("data-hot-keywords") || "";
    const keywords = raw.split("\n").map(s => s.trim()).filter(Boolean);
    if (keywords.length > 0 && this.hotTagsEl) {
      this.hotTagsEl.innerHTML = keywords.map(kw =>
        '<button class="search-modal__tag" data-search-modal-hot-tag>' + this.escapeHtml(kw) + '</button>'
      ).join("");
    }
  }

  open() {
    this.isOpen = true;
    this.modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    this.renderDefault();
    requestAnimationFrame(() => { if (this.input) this.input.focus(); });
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  renderDefault() {
    const history = this.getHistory();
    if (this.historyEl) {
      if (history.length > 0) {
        this.historyEl.style.display = "";
        this.historyTagsEl.innerHTML = history.map(kw =>
          '<button class="search-modal__tag" data-search-modal-tag>' + this.escapeHtml(kw) + '</button>'
        ).join("");
      } else {
        this.historyEl.style.display = "none";
      }
    }
    if (this.hotEl) this.hotEl.style.display = "";
    this.clearResults();
  }

  handleInput() {
    const q = (this.input.value || "").trim();
    const wrap = this.modal.querySelector(".search-modal__input-wrap");
    if (wrap) wrap.classList.toggle("focused", !!q);
    if (this.clearBtn) this.clearBtn.hidden = !q;
    if (!q) this.renderDefault();
  }

  clearSearch() {
    if (this.input) this.input.value = "";
    if (this.clearBtn) this.clearBtn.hidden = true;
    const wrap = this.modal.querySelector(".search-modal__input-wrap");
    if (wrap) wrap.classList.remove("focused");
    this.renderDefault();
    if (this.input) this.input.focus();
  }

  async doSearch() {
    const kw = (this.input.value || "").trim();
    if (!kw || this.loading) return;
    this.search(kw);
  }

  async search(keyword) {
    if (!keyword) return;
    this.saveHistory(keyword);
    this.hotEl && (this.hotEl.style.display = "none");
    this.historyEl && (this.historyEl.style.display = "none");
    this.clearResults();
    if (this.clearBtn) this.clearBtn.hidden = false;
    this.loading = true;

    // Loading state
    this.body.insertAdjacentHTML("beforeend",
      '<div class="search-modal__loading">' +
      '<div class="search-modal__spinner"></div>' +
      '<div class="search-modal__loading-text">搜索中...</div>' +
      '</div>'
    );

    const start = Date.now();

    try {
      const res = await fetch("/apis/api.halo.run/v1alpha1/indices/-/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: keyword,
          limit: 20,
          highlightPreTag: "<mark>",
          highlightPostTag: "</mark>"
        })
      });
      if (!res.ok) throw new Error("搜索请求失败");
      const data = await res.json();
      const hits = data.hits || [];

      // Minimum loading time 400ms (like miniapp)
      const elapsed = Date.now() - start;
      if (elapsed < 400) await new Promise(r => setTimeout(r, 400 - elapsed));

      this.clearResults();
      this.loading = false;

      if (hits.length === 0) {
        this.body.insertAdjacentHTML("beforeend",
          '<div class="search-modal__status">' +
          '<div class="search-modal__status-icon"><span>&lt;/&gt;</span></div>' +
          '<div class="search-modal__status-text">没有找到相关文章</div>' +
          '<div class="search-modal__status-sub">换个关键词试试</div>' +
          '</div>'
        );
        if (this.countEl) this.countEl.textContent = "";
        return;
      }

      // Render results (miniapp card style)
      const html = hits.map(hit => {
        const title = this.cleanHtml(hit.title || "无标题");
        const excerpt = this.cleanHtml(hit.description || hit.content || "").substring(0, 120);
        const permalink = hit.permalink || "#";
        const time = this.formatTime(hit.creationTimestamp);
        return '<a href="' + this.escapeHtml(permalink) + '" class="search-modal__result">' +
          '<div class="search-modal__result-title">' + this.highlightText(title, keyword) + '</div>' +
          (excerpt ? '<div class="search-modal__result-excerpt">' + this.highlightText(excerpt, keyword) + '</div>' : '') +
          (time ? '<div class="search-modal__result-footer"><span class="search-modal__result-time">' + time + '</span></div>' : '') +
          '</a>';
      }).join("");

      this.body.insertAdjacentHTML("beforeend",
        '<div class="search-modal__results">' +
        '<div class="search-modal__result-count">找到 ' + (data.total || hits.length) + ' 篇相关文章</div>' +
        html +
        '</div>'
      );
      if (this.countEl) this.countEl.textContent = (data.total || hits.length) + " 篇";
    } catch (err) {
      this.loading = false;
      this.clearResults();
      this.body.insertAdjacentHTML("beforeend",
        '<div class="search-modal__status">' +
        '<div class="search-modal__status-icon"><span>!</span></div>' +
        '<div class="search-modal__status-text">搜索出错，请稍后重试</div>' +
        '</div>'
      );
    }
  }

  clearResults() {
    const existing = this.body.querySelectorAll(".search-modal__results, .search-modal__loading, .search-modal__status");
    existing.forEach(el => el.remove());
    if (this.countEl) this.countEl.textContent = "";
  }

  cleanHtml(str) {
    if (!str) return "";
    return str.replace(/<[^>]+>/g, "").trim();
  }

  highlightText(text, keyword) {
    if (!keyword || !text) return this.escapeHtml(text);
    var escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return this.escapeHtml(text).replace(new RegExp("(" + escaped + ")", "gi"), '<mark>$1</mark>');
  }

  formatTime(ts) {
    if (!ts) return "";
    var d = new Date(ts);
    var now = new Date();
    var diff = now.getTime() - d.getTime();
    if (diff < 60000) return "刚刚";
    if (diff < 3600000) return Math.floor(diff / 60000) + "分钟前";
    if (diff < 86400000) return Math.floor(diff / 3600000) + "小时前";
    if (diff < 2592000000) return Math.floor(diff / 86400000) + "天前";
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  /* --- Search History (localStorage) --- */
  getHistory() {
    try { return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || []; }
    catch { return []; }
  }

  saveHistory(keyword) {
    var history = this.getHistory().filter(k => k !== keyword);
    history.unshift(keyword);
    if (history.length > SEARCH_MAX_HISTORY) history = history.slice(0, SEARCH_MAX_HISTORY);
    try { localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history)); } catch {}
  }

  clearHistory() {
    try { localStorage.removeItem(SEARCH_HISTORY_KEY); } catch {}
    if (this.historyEl) this.historyEl.style.display = "none";
  }

  escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
}

/* --- Post Page Manager (TOC, Code Copy, Image Preview, Back to Top) --- */
class PostPageManager {
  constructor() { this.activeImagePreview = null; }

  init() {
    this.initTableOfContents();
    this.initCodeCopy();
    this.initImagePreview();
    this.initBackToTop();
  }

  initTableOfContents() {
    const content = document.querySelector("[data-post-content]");
    const tocNav = document.querySelector("[data-toc-nav]");
    const tocMobileNav = document.querySelector("[data-toc-mobile-nav]");
    const headings = content && content.querySelectorAll("h1, h2, h3");
    if (!headings || headings.length === 0) return;
    if (tocNav) tocNav.innerHTML = this.generateTocList(headings, "toc-item");
    if (tocMobileNav) tocMobileNav.innerHTML = this.generateTocList(headings, "toc-mobile-item");
    this.initTocHighlight(headings);
    this.initTocMobile();
  }

  generateTocList(headings, baseClass) {
    let html = "";
    headings.forEach((h, i) => {
      const id = "heading-" + i;
      h.id = id;
      const level = parseInt(h.tagName[1]);
      const cls = level === 1 ? "" : level === 2 ? " toc-item--h2" : " toc-item--h3";
      const text = (h.textContent || "").trim();
      html += '<a href="#' + id + '" class="' + baseClass + cls + '" data-heading-id="' + id + '"><span class="' + baseClass + '__text">' + this.escapeHtml(text) + '</span></a>';
    });
    return html;
  }

  initTocHighlight(headings) {
    const tocItems = document.querySelectorAll("[data-heading-id]");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocItems.forEach(item => {
            item.classList.toggle("toc-item--active", item.getAttribute("data-heading-id") === id);
          });
        }
      });
    }, { root: null, rootMargin: "-20% 0px -80% 0px", threshold: 0 });
    headings.forEach(h => observer.observe(h));
  }

  initTocMobile() {
    const toggle = document.querySelector("[data-toc-toggle]");
    const mask = document.querySelector("[data-toc-mobile-mask]");
    const panel = document.querySelector("[data-toc-mobile-panel]");
    if (!toggle || !mask) return;
    toggle.addEventListener("click", () => {
      mask.removeAttribute("hidden");
      document.body.style.overflow = "hidden";
    });
    mask.addEventListener("click", (e) => {
      if (e.target === mask || e.target === panel) {
        mask.setAttribute("hidden", "");
        document.body.style.overflow = "";
      }
    });
  }

  initCodeCopy() {
    document.querySelectorAll("pre code").forEach(code => {
      const pre = code.parentElement;
      if (!pre || pre.querySelector(".code-copy-btn")) return;
      const btn = document.createElement("button");
      btn.className = "code-copy-btn";
      btn.textContent = "复制";
      btn.setAttribute("aria-label", "复制代码");
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.textContent = "已复制";
          btn.classList.add("copied");
          setTimeout(() => { btn.textContent = "复制"; btn.classList.remove("copied"); }, 2000);
        }).catch(() => {
          const range = document.createRange();
          range.selectNodeContents(code);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          document.execCommand("copy");
          sel.removeAllRanges();
          btn.textContent = "已复制";
          btn.classList.add("copied");
          setTimeout(() => { btn.textContent = "复制"; btn.classList.remove("copied"); }, 2000);
        });
      });
      pre.style.position = "relative";
      pre.appendChild(btn);
    });
  }

  initImagePreview() {
    document.querySelectorAll("[data-post-content] img").forEach(img => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => this.openImagePreview(img.src, img.alt));
    });
  }

  openImagePreview(src, alt) {
    if (this.activeImagePreview) return;
    const overlay = document.createElement("div");
    overlay.className = "image-preview-overlay";
    overlay.innerHTML =
      '<div class="image-preview-container">' +
      '<button class="image-preview-close" aria-label="关闭预览">&times;</button>' +
      '<img src="' + this.escapeHtml(src) + '" alt="' + this.escapeHtml(alt || "") + '" class="image-preview-img">' +
      (alt ? '<div class="image-preview-caption">' + this.escapeHtml(alt) + '</div>' : '') +
      '</div>';
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("image-preview-close")) {
        this.closeImagePreview(overlay);
      }
    });
    const onKey = (e) => {
      if (e.key === "Escape") {
        this.closeImagePreview(overlay);
        document.removeEventListener("keydown", onKey);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    this.activeImagePreview = overlay;
    requestAnimationFrame(() => overlay.classList.add("image-preview-overlay--active"));
  }

  closeImagePreview(overlay) {
    if (!overlay) return;
    overlay.classList.remove("image-preview-overlay--active");
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "";
      this.activeImagePreview = null;
    }, 300);
  }

  initBackToTop() {
    const btn = document.querySelector("[data-back-to-top]");
    if (!btn) return;
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      btn.classList.toggle("visible", y > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
}

/* --- Cover Gallery (random cover replacement) --- */
class CoverGallery {
  constructor() { this.config = { gallery: [], defaultCover: "" }; }

  init() {
    this.loadConfig();
    this.processCovers();
  }

  loadConfig() {
    try {
      const galleryEl = document.querySelector("[data-cover-gallery]");
      const defaultEl = document.querySelector("[data-default-cover]");
      if (galleryEl) {
        const raw = galleryEl.getAttribute("data-cover-gallery");
        if (raw) this.config.gallery = this.parseGallery(raw);
      }
      if (defaultEl) {
        this.config.defaultCover = defaultEl.getAttribute("data-default-cover") || "";
      }
    } catch {}
  }

  parseGallery(raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.filter(s => typeof s === "string" && s !== "");
    } catch {}
    return raw.trim().replace(/^\[/, "").replace(/]$/, "").split(",")
      .map(s => s.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
  }

  processCovers() {
    document.querySelectorAll("[data-cover]").forEach(img => {
      const postName = img.getAttribute("data-post-name");
      if (!postName) return;
      const cover = this.getStableCover(postName);
      if (cover) {
        const original = img.src;
        img.src = cover;
        img.onerror = () => { img.src = this.config.defaultCover || original; img.onerror = null; };
      }
    });
  }

  getStableCover(postName) {
    if (this.config.gallery.length === 0) return null;
    const idx = this.hashString(postName) % this.config.gallery.length;
    return this.config.gallery[idx];
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return Math.abs(hash);
  }
}

/* --- Initialize --- */
document.addEventListener("DOMContentLoaded", function () {
  // Theme
  var tm = new ThemeManager();
  tm.init();

  // Search Modal
  var sm = new SearchModal();
  sm.init();

  // Post page (TOC, code copy, etc.)
  var pm = new PostPageManager();
  pm.init();

  // Cover gallery
  var cg = new CoverGallery();
  cg.init();

  // Nav active state
  var path = location.pathname;
  document.querySelectorAll("[data-nav-link]").forEach(function (link) {
    var href = link.getAttribute("data-href") || link.getAttribute("href");
    if (href && path === href) link.classList.add("active");
  });
  document.querySelectorAll("[data-mobile-nav-link]").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href && (path === href || (href !== "/" && path.indexOf(href) === 0))) {
      link.classList.add("mobile-nav-item--active");
    }
  });
});
