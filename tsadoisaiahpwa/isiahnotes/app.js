(function () {
  const steps = ["Create the shell", "Make it installable", "Make it offline", "Test the boundary", "Deploy it"];
  const starter = [{ id: 1, title: "What makes a PWA?", body: "A manifest, a service worker, and a reliable user experience.", updated: "Starter note" }];
  const NOTES_KEY = "offline-notes-lab-notes";
  const DONE_KEY = "offline-notes-lab-progress";

  const safeGet = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch (_) { return fallback; }
  };
  let notes = safeGet(NOTES_KEY, starter);
  let done = safeGet(DONE_KEY, []);
  let online = navigator.onLine;

  const esc = (s) => String(s).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
  const save = () => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    localStorage.setItem(DONE_KEY, JSON.stringify(done));
  };
  const progress = () => Math.round(done.length / steps.length * 100);

  function render() {
    document.getElementById("app").innerHTML = `
      <div class="app-shell">
        ${online ? "" : '<div class="offline-banner" role="status">You are offline — Notes Lab is using its cached application shell.</div>'}
        <header class="topbar"><strong>Offline Notes Lab</strong><span class="status ${online ? "online":"offline"}"><span class="status-dot"></span>${online ? "Online":"Offline"}</span></header>
        <div class="layout">
          <aside class="workshop-map">
            <p class="section-label">WORKSHOP MAP</p>
            <div class="step-list">${steps.map((step,i)=>`<button class="step ${done.includes(i)?"complete":""}" data-step="${i}" type="button"><span class="step-number">${done.includes(i)?"✓":i+1}</span><span>${step}</span></button>`).join("")}</div>
            <div class="progress-block"><div class="progress-meta"><span>Progress</span><strong>${progress()}%</strong></div><div class="progress-track"><span style="width:${progress()}%"></span></div></div>
            <p class="sidebar-note">Complete each checkpoint, then deliberately test what happens when the network disappears.</p>
          </aside>
          <main class="content">
            <p class="eyebrow">FOUNDATION TRACK · PWA PRACTICAL</p>
            <div class="hero-grid">
              <div><h1>Keep learning when the network leaves.</h1><br>
              <h2>Tsado Isaiah Yetu</h2>
              <h2>Telecommunication Engineering Department</h2>
              <h2>2024/1/97637CM</h2>
              <p class="lede">Create a note, refresh the page, then test the same experience with the network turned off. This small project demonstrates the core PWA building blocks from the workshop.</p><div class="concept-row"><span>React UI</span><span>localStorage</span><span>Manifest</span><span>Service worker</span></div></div>
              <div class="signal-card"><span class="signal-kicker">LIVE TEST SIGNAL</span><strong>${online ? "NETWORK AVAILABLE":"NETWORK OFFLINE"}</strong><p>${online ? "Your browser can reach the network. Reload once to make the offline boundary easy to test." : "The interface should still load because the application shell was cached by the service worker."}</p></div>
            </div>
            <section class="columns">
              <div class="notes-panel"><div class="panel-heading"><div><p class="eyebrow">LOCAL DATA</p><h2>Notes from the lab</h2></div><span class="count-pill">${notes.length} ${notes.length === 1 ? "note":"notes"}</span></div><div class="notes-list">${notes.map(n=>`<article class="note-card"><div class="note-accent"></div><div><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p><small>${esc(n.updated)}</small></div></article>`).join("")}</div></div>
              <form class="note-form" id="noteForm"><p class="eyebrow">TRY IT YOURSELF</p><h2>Write a note</h2><p class="form-intro">The note is stored in your browser with localStorage.</p><label>Title<input id="noteTitle" placeholder="e.g. Offline test result"></label><label>Observation<textarea id="noteBody" rows="6" placeholder="What did you observe?"></textarea></label><button class="save-button" type="submit">Save locally</button><p class="form-message" id="formMessage" aria-live="polite"></p></form>
            </section>
          </main>
        </div>
      </div>`;

    document.querySelectorAll("[data-step]").forEach(btn => btn.addEventListener("click", () => {
      const i = Number(btn.dataset.step);
      done = done.includes(i) ? done.filter(x=>x!==i) : [...done,i];
      save(); render();
    }));

    document.getElementById("noteForm").addEventListener("submit", e => {
      e.preventDefault();
      const title = document.getElementById("noteTitle").value.trim();
      const body = document.getElementById("noteBody").value.trim();
      const msg = document.getElementById("formMessage");
      if (!title || !body) { msg.textContent = "Add a title and observation before saving."; return; }
      notes = [{id:Date.now(), title, body, updated:"Just now"}, ...notes];
      save(); render();
      document.getElementById("formMessage").textContent = "Saved on this device.";
    });
  }

  window.addEventListener("online", () => { online = true; render(); });
  window.addEventListener("offline", () => { online = false; render(); });
  render();
})();
