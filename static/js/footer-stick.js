(function(){
  function updateFooter(){
    var footer = document.querySelector('[data-footer]');
    if (!footer) return;
    var bodyHeight = document.body.scrollHeight;
    var viewport = window.innerHeight;
    if (bodyHeight <= viewport) {
      footer.classList.add('is-fixed');
      document.body.style.paddingBottom = footer.offsetHeight + 'px';
    } else {
      footer.classList.remove('is-fixed');
      document.body.style.paddingBottom = '';
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateFooter);
  } else {
    updateFooter();
  }
  window.addEventListener('resize', updateFooter);
})();
