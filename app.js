const SUPABASE_URL = 'https://bmokrazyympqrglbyadq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7HzqPREmW08INEJ10uhO6Q_QAD9nVey';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const result = document.getElementById("result");

async function loadData() {
  result.innerHTML = `<p>جاري تحميل البيانات...</p>`;

  const { data: documents, error: docsError } = await client
    .from('documents')
    .select('id, title, source_type, content_hash, created_at')
    .order('id', { ascending: true });

  if (docsError) {
    result.innerHTML = `<p>خطأ في جلب documents: ${docsError.message}</p>`;
    return;
  }

  const { data: chunks, error: chunksError } = await client
    .from('chunks')
    .select('id, document_id, chunk_index, content, created_at')
    .order('document_id', { ascending: true })
    .order('chunk_index', { ascending: true });

  if (chunksError) {
    result.innerHTML = `<p>خطأ في جلب chunks: ${chunksError.message}</p>`;
    return;
  }

  const docsHtml = !documents || documents.length === 0
    ? `<p>ما كاش documents.</p>`
    : `
      <h3>Documents</h3>
      <ul>
        ${documents.map(doc => `
          <li>
            <strong>#${doc.id}</strong> - ${doc.title} | ${doc.source_type} | ${doc.content_hash}
          </li>
        `).join('')}
      </ul>
    `;

  const chunksHtml = !chunks || chunks.length === 0
    ? `<p>ما كاش chunks.</p>`
    : `
      <h3>Chunks</h3>
      <ul>
        ${chunks.map(chunk => `
          <li>
            <strong>#${chunk.id}</strong> - doc ${chunk.document_id} | chunk ${chunk.chunk_index}<br>
            ${chunk.content}
          </li>
        `).join('')}
      </ul>
    `;

  result.innerHTML = `
    <div>
      ${docsHtml}
      <hr>
      ${chunksHtml}
    </div>
  `;
}

loadData();
