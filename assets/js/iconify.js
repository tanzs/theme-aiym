/* Iconify 图标库加载 - 工具箱图标渲染 */
(function() {
  if (window.Iconify) return;
  var script = document.createElement('script');
  script.src = 'https://code.iconify.design/3/3.1.0/iconify.min.js';
  script.onload = function() {
    /* 渲染所有 .iconify 元素 */
    document.querySelectorAll('.iconify[data-icon]').forEach(function(el) {
      var icon = el.getAttribute('data-icon');
      if (icon && window.Iconify) {
        Iconify.renderIcon(el, icon);
      }
    });
  };
  document.head.appendChild(script);
})();
