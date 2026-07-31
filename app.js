const SUPABASE_URL = 'https://bmokrazyympqrglbyadq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7HzqPREmW08INEJ10uhO6Q_QAD9nVey';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const result = document.getElementById("result");

async function loadDocuments() {
  result.innerHTML = '<p>جاري تحميل البيانات...</p>';

  const { data, error } = await client
    .from('documents')
    .select('id, title, source_type, content_hash, created_at')
    .order('id', { ascending: true });

  if (error) {
    result.innerHTML = `<p>خطأ: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    result.innerHTML = '<p>ما كاش documents.</p>';
    return;
  }

  result.innerHTML = `
    <h3>Documents</h3>
    <ul>
      ${data.map(doc => `
        <li>
          <strong>#${doc.id}</strong> - ${doc.title} | ${doc.source_type}
        </li>
      `).join('')}
    </ul>
  `;
}

loadDocuments();
