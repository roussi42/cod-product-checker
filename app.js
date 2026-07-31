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

async function loadData() {
  if (!result) return;

  result.innerHTML = '<p>جاري تحميل البيانات من Supabase...</p>';

  const { data: documents, error: documentsError } = await client
    .from('documents')
    .select('id, title, source_url, source_type, raw_text')
    .order('id', { ascending: true });

  if (documentsError) {
    result.innerHTML = `<p>خطأ في جلب documents: ${documentsError.message}</p>`;
    return;
  }

  const { data: chunks, error: chunksError } = await client
    .from('chunks')
    .select('id, document_id, chunk_index, chunk_text, citation_label')
    .order('id', { ascending: true });

  if (chunksError) {
    result.innerHTML = `<p>خطأ في جلب chunks: ${chunksError.message}</p>`;
    return;
  }

  result.innerHTML = `
    <div style="text-align:right;">
      <h3>Documents (${documents.length})</h3>
      <ul>
        ${documents.map(doc => `
          <li style="margin-bottom:12px;">
            <strong>#${doc.id}</strong> - ${escapeHtml(doc.title)}<br>
            <small>${escapeHtml(doc.source_type)} | ${escapeHtml(doc.source_url)}</small><br>
            <span>${escapeHtml((doc.raw_text || '').slice(0, 120))}</span>
          </li>
        `).join('')}
      </ul>

      <hr style="margin:20px 0;">

      <h3>Chunks (${chunks.length})</h3>
      <ul>
        ${chunks.map(chunk => `
          <li style="margin-bottom:12px;">
            <strong>#${chunk.id}</strong> - doc ${chunk.document_id} | chunk ${chunk.chunk_index}<br>
            <span>${escapeHtml(chunk.chunk_text)}</span><br>
            <small>${escapeHtml(chunk.citation_label || '')}</small>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    loadData();
  });
}

loadData();
