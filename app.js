const SUPABASE_URL = 'https://bmokrazyympqrglbyadq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7HzqPREmW08INEJ10uhO6Q_QAD9nVey';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const result = document.getElementById("result");

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function fetchDocuments() {
  const { data, error } = await client
    .from('documents')
    .select('id, title, source_type, content_hash, created_at')
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

async function fetchChunks(searchTerm = '') {
  let query = client
    .from('chunks')
    .select('id, document_id, chunk_index, content, created_at')
    .order('document_id', { ascending: true })
    .order('chunk_index', { ascending: true });

  if (searchTerm.trim() !== '') {
    query = query.ilike('content', `%${searchTerm}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

function groupChunksByDocument(chunks) {
  const grouped = {};

  for (const chunk of chunks) {
    if (!grouped[chunk.document_id]) {
      grouped[chunk.document_id] = [];
    }
    grouped[chunk.document_id].push(chunk);
  }

  return grouped;
}

function renderDocuments(documents, chunks, searchTerm = '') {
  const groupedChunks = groupChunksByDocument(chunks);

  if (documents.length === 0) {
    return `<p>ما كاش documents.</p>`;
  }

  return `
    <div style="display:grid; gap:20px;">
      ${documents.map(doc => {
        const docChunks = groupedChunks[doc.id] || [];

        return `
          <div style="border:1px solid #ddd; border-radius:12px; padding:16px; background:#fff;">
            <div style="margin-bottom:12px;">
              <h3 style="margin:0 0 8px 0;">#${doc.id} - ${escapeHtml(doc.title)}</h3>
              <p style="margin:4px 0;"><strong>source_type:</strong> ${escapeHtml(doc.source_type || '')}</p>
              <p style="margin:4px 0;"><strong>content_hash:</strong> ${escapeHtml(doc.content_hash || '')}</p>
            </div>

            <div>
              <h4 style="margin:0 0 10px 0;">Chunks (${docChunks.length})</h4>
              ${
                docChunks.length === 0
                  ? `<p style="margin:0;">ما كاش chunks لهذا document.</p>`
                  : `
                    <ul style="padding-left:18px; margin:0;">
                      ${docChunks.map(chunk => `
                        <li style="margin-bottom:12px;">
                          <strong>chunk ${chunk.chunk_index}</strong> (id: ${chunk.id})<br>
                          <span>${escapeHtml(chunk.content)}</span>
                        </li>
                      `).join('')}
                    </ul>
                  `
              }
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

async function renderPage(searchTerm = '') {
  result.innerHTML = `<p>جاري تحميل البيانات...</p>`;

  try {
    const [documents, chunks] = await Promise.all([
      fetchDocuments(),
      fetchChunks(searchTerm)
    ]);

    result.innerHTML = `
      <div style="margin-bottom:20px; display:flex; gap:10px; flex-wrap:wrap;">
        <input
          id="searchInput"
          type="text"
          placeholder="ابحث داخل chunks..."
          value="${escapeHtml(searchTerm)}"
          style="padding:10px; width:320px; max-width:100%;"
        />
        <button id="searchBtn" style="padding:10px 14px;">بحث</button>
        <button id="clearBtn" style="padding:10px 14px;">مسح</button>
      </div>

      <div style="margin-bottom:16px;">
        <p style="margin:0;"><strong>Documents:</strong> ${documents.length}</p>
        <p style="margin:6px 0 0 0;"><strong>Chunks الظاهرة:</strong> ${chunks.length}</p>
      </div>

      ${renderDocuments(documents, chunks, searchTerm)}
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
  } catch (error) {
    result.innerHTML = `<p>خطأ: ${escapeHtml(error.message || 'unknown error')}</p>`;
  }
}

renderPage();
