const SUPABASE_URL = 'https://bmokrazyympqrglbyadq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7HzqPREmW08INEJ10uhO6Q_QAD9nVey';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('productForm');
const result = document.getElementById('result');

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function truncateText(text, max = 160) {
  const value = text || '';
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

function documentCard(doc) {
  return `
    <article class="card">
      <div class="card-head">
        <h3>${escapeHtml(doc.title || 'بدون عنوان')}</h3>
        <span class="badge">#${doc.id}</span>
      </div>
      <p class="meta">${escapeHtml(doc.source_type || 'unknown')} · ${escapeHtml(doc.source_url || '')}</p>
      <p class="body">${escapeHtml(truncateText(doc.raw_text, 180))}</p>
    </article>
  `;
}

function chunkCard(chunk) {
  return `
    <article class="card card-soft">
      <div class="card-head">
        <h3>Chunk #${chunk.id}</h3>
        <span class="badge">doc ${chunk.document_id} · ${chunk.chunk_index}</span>
      </div>
      <p class="body">${escapeHtml(chunk.chunk_text || '')}</p>
      <p class="meta">${escapeHtml(chunk.citation_label || '')}</p>
    </article>
  `;
}

async function loadData() {
  if (!result) return;

  result.innerHTML = '<p class="loading">جاري تحميل البيانات من Supabase...</p>';

  const { data: documents, error: documentsError } = await client
    .from('documents')
    .select('id, title, source_url, source_type, raw_text')
    .order('id', { ascending: true });

  if (documentsError) {
    result.innerHTML = `<p class="error">خطأ في جلب documents: ${escapeHtml(documentsError.message)}</p>`;
    return;
  }

  const { data: chunks, error: chunksError } = await client
    .from('chunks')
    .select('id, document_id, chunk_index, chunk_text, citation_label')
    .order('id', { ascending: true });

  if (chunksError) {
    result.innerHTML = `<p class="error">خطأ في جلب chunks: ${escapeHtml(chunksError.message)}</p>`;
    return;
  }

  result.innerHTML = `
    <section class="summary">
      <div class="summary-item">
        <strong>${documents.length}</strong>
        <span>Documents</span>
      </div>
      <div class="summary-item">
        <strong>${chunks.length}</strong>
        <span>Chunks</span>
      </div>
    </section>

    <section class="section-block">
      <h2>Documents</h2>
      <div class="grid">
        ${documents.map(documentCard).join('')}
      </div>
    </section>

    <section class="section-block">
      <h2>Chunks</h2>
      <div class="grid">
        ${chunks.map(chunkCard).join('')}
      </div>
    </section>
  `;
}

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    loadData();
  });
}

loadData();
