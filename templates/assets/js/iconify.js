/**
 * 轻量 Iconify 渲染器 - 从 api.iconify.design 获取 SVG
 * 替代外部 CDN，适配内网环境
 */
(function() {
    var API = 'https://api.iconify.design';
    var cache = {};
    var pending = {};

    function loadIcon(el) {
        var iconName = el.getAttribute('data-icon');
        if (!iconName) return;

        var parts = iconName.split(':');
        if (parts.length !== 2) return;
        var provider = parts[0];
        var name = parts[1];
        var iconKey = provider + ':' + name;

        // 已缓存
        if (cache[iconKey]) {
            el.innerHTML = cache[iconKey];
            return;
        }

        // 正在加载
        if (pending[iconKey]) {
            pending[iconKey].push(el);
            return;
        }

        pending[iconKey] = [el];

        fetch(API + '/' + provider + '.json?icons=' + name)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data && data.icons && data.icons[name]) {
                    var icon = data.icons[name];
                    var body = icon.body || '';
                    var w = icon.width || 24;
                    var h = icon.height || 24;
                    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h +
                        '" width="100%" height="100%" style="display:block">' + body + '</svg>';
                    cache[iconKey] = svg;
                    // 渲染所有等待的元素
                    (pending[iconKey] || []).forEach(function(el2) {
                        el2.innerHTML = svg;
                    });
                    delete pending[iconKey];
                }
            })
            .catch(function() {
                delete pending[iconKey];
            });
    }

    function scan() {
        document.querySelectorAll('.iconify[data-icon]').forEach(loadIcon);
    }

    // DOM Ready 后扫描
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scan);
    } else {
        scan();
    }

    // MutationObserver 监听动态内容
    function startObserver() {
        if (typeof MutationObserver !== 'undefined' && document.body) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(m) {
                    m.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('iconify')) {
                                loadIcon(node);
                            }
                            if (node.querySelectorAll) {
                                node.querySelectorAll('.iconify[data-icon]').forEach(loadIcon);
                            }
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }
})();
