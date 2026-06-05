const API = 'https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca2';

let allCountries = [];
let filteredCountries = [];
let maxPop = 1;
let currentPage = 1;
const PAGE_SIZE = 20;

const grid        = document.getElementById('countries-grid');
const spinner     = document.getElementById('spinner');
const errorBox    = document.getElementById('error-box');
const emptyState  = document.getElementById('empty-state');
const statsBar    = document.getElementById('stats-bar');
const searchInput = document.getElementById('search');
const clearBtn    = document.getElementById('clear-btn');
const retryBtn    = document.getElementById('retry-btn');
const loadMoreBtn = document.getElementById('load-more-btn');

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return n.toString();
}

function showSpinner(v) {
  spinner.classList.toggle('active', v);
  if (v) {
    grid.innerHTML = '';
    errorBox.classList.remove('active');
    emptyState.classList.remove('active');
    loadMoreBtn.style.display = 'none';
  }
}

function showError() {
  spinner.classList.remove('active');
  errorBox.classList.add('active');
  statsBar.textContent = '';
  loadMoreBtn.style.display = 'none';
}

function makeCard(c, i) {
  const pct = Math.max(2, Math.round((c.population / maxPop) * 100));
  const capital = c.capital?.[0] ?? '—';
  return `
    <div class="country-card" style="animation-delay:${(i % PAGE_SIZE) * 30}ms">
      <div class="flag-col">
        <img src="${c.flags.svg || c.flags.png}" alt="Flag of ${c.name.common}" loading="lazy">
        <span class="rank-badge">#${i + 1}</span>
      </div>
      <div class="info-col">
        <div class="country-name" title="${c.name.common}">${c.name.common}</div>
        <div class="meta-row">
          <span class="meta-chip"><span class="label">📍</span><span class="val">${capital}</span></span>
          <span class="meta-chip"><span class="label">🌍</span><span class="val">${c.region}</span></span>
        </div>
        <div class="pop-row">
          <span class="pop-label">Pop.</span>
          <div class="pop-bar-wrap"><div class="pop-bar" style="width:${pct}%"></div></div>
          <span class="pop-val">${fmt(c.population)}</span>
        </div>
      </div>
    </div>`;
}

function renderPage(reset = false) {
  spinner.classList.remove('active');

  if (!filteredCountries.length) {
    emptyState.classList.add('active');
    document.getElementById('search-term-label').textContent = `"${searchInput.value}"`;
    grid.innerHTML = '';
    statsBar.textContent = '';
    loadMoreBtn.style.display = 'none';
    return;
  }

  emptyState.classList.remove('active');

  if (reset) {
    grid.innerHTML = '';
    currentPage = 1;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const end   = currentPage * PAGE_SIZE;
  const slice = filteredCountries.slice(start, end);

  grid.insertAdjacentHTML('beforeend', slice.map((c, i) => makeCard(c, start + i)).join(''));

  const shown = Math.min(currentPage * PAGE_SIZE, filteredCountries.length);
  statsBar.innerHTML = `Showing <strong>${shown}</strong> of <strong>${filteredCountries.length}</strong> countries`;

  if (shown < filteredCountries.length) {
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.textContent = `Load more (${filteredCountries.length - shown} remaining)`;
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

async function fetchCountries() {
  showSpinner(true);
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    allCountries = data
      .sort((a, b) => b.population - a.population);

    maxPop = allCountries[0]?.population || 1;
    filteredCountries = [...allCountries];
    renderPage(true);
  } catch (e) {
    showError();
  }
}

function filterCountries(query) {
  currentPage = 1;
  if (!query.trim()) {
    filteredCountries = [...allCountries];
  } else {
    const q = query.toLowerCase();
    filteredCountries = allCountries.filter(c =>
      c.name.common.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q) ||
      (c.capital?.[0] || '').toLowerCase().includes(q)
    );
  }
  renderPage(true);
}

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  renderPage(false);
  // smooth scroll to new cards
  const cards = grid.querySelectorAll('.country-card');
  const firstNew = cards[(currentPage - 2) * PAGE_SIZE];
  if (firstNew) firstNew.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

searchInput.addEventListener('input', () => {
  const val = searchInput.value;
  clearBtn.classList.toggle('visible', val.length > 0);
  filterCountries(val);
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearBtn.classList.remove('visible');
  filterCountries('');
  searchInput.focus();
});

retryBtn.addEventListener('click', () => {
  errorBox.classList.remove('active');
  fetchCountries();
});

fetchCountries();