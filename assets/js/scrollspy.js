// Highlights the nav link for the section currently in view.
(function(){
  if(!('IntersectionObserver' in window)) return;
  var links = Array.prototype.filter.call(
    document.querySelectorAll('.topnav a'),
    function(a){ return a.getAttribute('href').charAt(0) === '#'; }
  );

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      var hash = '#' + entry.target.id;
      links.forEach(function(l){
        l.classList.toggle('active', l.getAttribute('href') === hash);
      });
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  links.forEach(function(l){
    var section = document.getElementById(l.getAttribute('href').slice(1));
    if(section) observer.observe(section);
  });
})();
