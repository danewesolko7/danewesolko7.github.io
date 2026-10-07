// Mobile menu: toggle, close on link click / Escape / resize to desktop.
(function(){
  var toggle = document.getElementById('navtoggle');
  var nav = document.getElementById('topnav');
  if(!toggle || !nav) return;

  function setOpen(open){
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function(){
    setOpen(!nav.classList.contains('open'));
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setOpen(false); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && nav.classList.contains('open')){
      setOpen(false);
      toggle.focus();
    }
  });
  window.addEventListener('resize', function(){
    if(window.innerWidth > 768) setOpen(false);
  });
})();
