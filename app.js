const SUPABASE_URL = 'https://bmokrazyympqrglbyadq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7HzqPREmW08INEJ10uhO6Q_QAD9nVey';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const result = document.getElementById("result");

async function loadDocuments() {
  const { data, error } = await client
    .from('documents')
    .select('id, title, source_type, content_hash, created_at')
    .order('id', { ascending: true });

  if (error) {
    return `<p>خطأ في جلب documents: ${error.message}</p>`;
  }

  if (!data || data.length === 0) {
    return `<p>ما كاش documents.</p>`;
  }

  return `
    <h3>Documents</h3>
    <ul>
      ${data.map(doc => `
        <li>
          <strong>#${doc.id}</strong> - ${doc.title} | ${doc.source_type} | ${doc.content_hash}
        </li>
      `).join('')}
    </ul>
  `;
}

async function loadChunks(searchTerm = '') {
  let query = client
    .from('chunks')
    .select('id, document_id, chunk_index, content, created_at')
    .order('document_id', { ascending: true })
    .order('chunk_index', { ascending: true });

  if (searchTerm.trim() !== '') {
    query = query.ilike('content', `%${searchTerm}%`);
  }

  const { data, error } = await query;

  if (error) {
    return `<p>خطأ في جلب chunks: ${error.message}</p>`;
  }

  if (!data || data.length === 0) {
    return `<p>ما كاش chunks مطابقة.</p>`;
  }

  return `
    <h3>Chunks</h3>
    <ul>
      ${data.map(chunk => `
        <li style="margin-bottom: 12px;">
          <strong>#${chunk.id}</strong> - doc ${chunk.document_id} | chunk ${chunk.chunk_index}<br>
          ${chunk.content}
        </li>
      `).join('')}
    </ul>
  `;
}

async function renderPage(searchTerm = '') {
  result.innerHTML = `<p>جاري تحميل البيانات...</p>`;

  const docsHtml = await loadDocuments();
  const chunksHtml = await loadChunks(searchTerm);

  result.innerHTML = `
    <div style="margin-bottom: 20px;">
      <input
        id="searchInput"
        type="text"
        placeholder="ابحث داخل chunks..."
        value="${searchTerm}"
        style="padding:10px; width:70%; max-width:400px;"
      />
      <button id="searchBtn" style="padding:10px;">بحث</button>
      <button id="clearBtn" style="padding:10px;">مسح</button>
    </div>

    <div>
      ${docsHtml}
      <hr>
      ${chunksHtml}
    </div>
  `;

  document.getElementById('searchBtn').addEventListener('click', () => {
    const value = document.getElementById('searchInput').value;
    renderPage(value);
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    renderPage('');
  });

  document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      renderPage(e.target.value);
    }
  });
}

renderPage();
