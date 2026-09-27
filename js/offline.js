/* The offline page: retry, reload when back online, and list saved pages. */
(function () {
    var statusBox = document.getElementById("status");
    var statusText = document.getElementById("status-text");
    var retry = document.getElementById("retry");

    var goBack = function () { window.location.reload(); };

    var setOnline = function () {
        statusBox.classList.add("is-on");
        statusText.textContent = "Back online. Reloading…";
        setTimeout(goBack, 800);
    };

    retry.addEventListener("click", function () {
        statusText.textContent = "Checking your connection…";
        goBack();
    });
    window.addEventListener("online", setOnline);

    // Pages this visitor opened before are saved and still work offline
    var names = { "": "Home", "work": "Work", "about": "About", "services": "Services", "process": "Process", "pricing": "Pricing", "contact": "Contact" };
    if ("caches" in window) {
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) { return caches.open(k).then(function (c) { return c.keys(); }); }));
        }).then(function (lists) {
            var seen = {};
            var list = document.getElementById("saved-list");
            lists.forEach(function (reqs) {
                reqs.forEach(function (req) {
                    var url = new URL(req.url);
                    if (url.origin !== location.origin) return;
                    var slug = url.pathname.replace(/^\//, "").replace(/\.html$/, "");
                    if (slug === "index") slug = "";
                    if (!(slug in names) || seen[slug]) return;
                    seen[slug] = true;
                    var li = document.createElement("li");
                    var a = document.createElement("a");
                    a.href = "/" + slug;
                    a.textContent = names[slug];
                    li.appendChild(a);
                    list.appendChild(li);
                });
            });
            if (list.children.length) document.getElementById("saved").hidden = false;
        }).catch(function () {});
    }
})();
