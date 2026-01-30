(function(){
  function applySeal(){
    var brand = document.querySelector('.brand[data-seal]');
    if (!brand) return;
    if (brand.classList.contains('brand--seal')) return;
    var text = (brand.textContent || '').trim();
    var chars = Array.from(text);
    if (chars.length !== 4) return;
    brand.textContent = '';
    chars.forEach(function(ch){
      var span = document.createElement('span');
      span.className = 'brand__char';
      span.textContent = ch;
      brand.appendChild(span);
    });
    brand.classList.add('brand--seal');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySeal);
  } else {
    applySeal();
  }
})();
