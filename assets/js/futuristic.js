/* Contact form: AJAX submit to Formspree with inline feedback */
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;

  const submitBtn = document.getElementById('contact-submit');
  const loadingEl = form.querySelector('.loading');
  const errorEl = form.querySelector('.error-message');
  const successEl = form.querySelector('.sent-message');

  function setLoading(active){
    if(loadingEl) loadingEl.style.display = active ? 'inline-flex' : 'none';
    if(submitBtn) submitBtn.setAttribute('aria-busy', active ? 'true' : 'false');
    if(submitBtn) submitBtn.disabled = active;
    const spinner = submitBtn && submitBtn.querySelector('.btn-spinner');
    if(spinner) spinner.style.display = active ? 'inline-block' : 'none';
  }

  form.addEventListener('submit', function(e){
    if (!form.hasAttribute('data-ajax')) return; // fallback if not wanting ajax
    e.preventDefault();
    errorEl && (errorEl.textContent = '');
    successEl && (successEl.style.display = 'none');

    setLoading(true);

    const data = new FormData(form);

    fetch(form.action, {
      method: form.method || 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(async (response) => {
      setLoading(false);
      let json = null;
      try { json = await response.json(); } catch (e) { /* ignore parse errors */ }

      // Treat Formspree style responses with {"ok": true, "next": "..."} as success
      const isSuccess = response.ok && (json === null || json.ok === true || response.status === 200);

      if (isSuccess) {
        if (successEl) successEl.style.display = 'block';
        form.reset();
        if (submitBtn) {
          submitBtn.classList.add('btn-success');
          setTimeout(() => submitBtn.classList.remove('btn-success'), 2200);
        }
      } else {
        // Prefer structured error messages; never dump raw JSON to the UI
        const msg = (json && (json.error || json.message)) ?
          (json.error || json.message) :
          'Failed to send message. Please try again later.';
        if (errorEl) errorEl.textContent = msg;
        console.warn('Contact form non-OK response', { status: response.status, json });
      }
    }).catch(err => {
      setLoading(false);
      if (errorEl) errorEl.textContent = 'Network error — check your connection and try again.';
      console.error('Contact submit error', err);
    });
  });
})();