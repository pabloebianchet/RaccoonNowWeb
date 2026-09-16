(function(){
  function push(data){ window.dataLayer = window.dataLayer || []; window.dataLayer.push(data); }

  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if(!a) return;
    var href = a.getAttribute('href') || '';
    if(/wa\.me/.test(href)){
      push({event:'click_whatsapp', link_url: href});
    } else if(/^mailto:/i.test(href)){
      push({event:'click_email', link_url: href});
    } else if(/linkedin\.com/.test(href)){
      push({event:'click_linkedin', link_url: href});
    } else if(/^tel:/i.test(href)){
      push({event:'click_call', link_url: href});
    }
  }, true);

  var SERVICE_PAGES = [
    '/es/desarrollo-software-a-medida.html','/es/diseno-web-seo.html','/es/apps-web-moviles.html',
    '/es/sistemas-gestion-erp-crm.html','/es/consultoria-digital-automatizacion.html','/automatizacion-ia.html',
    '/en/custom-software-development.html','/en/web-design-seo.html','/en/web-mobile-apps.html',
    '/en/erp-crm-management-systems.html','/en/digital-consulting-automation.html',
    '/it/sviluppo-software-su-misura.html','/it/siti-web-seo.html','/it/app-web-mobile.html',
    '/it/sistemi-gestionali-erp-crm.html','/it/consulenza-digitale-automazione.html'
  ];
  if(SERVICE_PAGES.indexOf(location.pathname) !== -1){
    push({event:'view_service_page', page_path: location.pathname, page_title: document.title});
  }

  var form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var statusEl = form.querySelector('.form-status');
      var btn = form.querySelector('button[type=submit]');
      if(btn) btn.disabled = true;
      fetch(form.getAttribute('action') || '/contact.php', {
        method: 'POST',
        body: new FormData(form),
        headers: {'X-Requested-With': 'XMLHttpRequest'}
      }).then(function(r){ return r.json(); }).then(function(data){
        if(data && data.ok){
          push({event:'submit_contact_form', form_id:'contact-form'});
          form.reset();
          if(statusEl){ statusEl.textContent = form.getAttribute('data-success') || 'OK'; statusEl.className = 'form-status ok'; }
        } else {
          if(statusEl){ statusEl.textContent = form.getAttribute('data-error') || 'Error'; statusEl.className = 'form-status err'; }
        }
      }).catch(function(){
        if(statusEl){ statusEl.textContent = form.getAttribute('data-error') || 'Error'; statusEl.className = 'form-status err'; }
      }).finally(function(){ if(btn) btn.disabled = false; });
    });
  }
})();
