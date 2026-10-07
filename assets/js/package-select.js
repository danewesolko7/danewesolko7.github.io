// Links with data-package="…" preselect that option in the quote form.
(function(){
  var select = document.querySelector('select[name="package"]');
  if(!select) return;
  document.querySelectorAll('a[data-package]').forEach(function(a){
    a.addEventListener('click', function(){
      select.value = a.getAttribute('data-package');
    });
  });
})();
