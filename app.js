const SUPABASE_URL = 'https://bmokrazyympqrglbyadq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7HzqPREmW08INEJ10uhO6Q_QAD9nVey';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('productForm');
const result = document.getElementById('result');

async function loadDocuments() {
  if (!result) return;

  result.innerHTML = '<p>جاري تحميل البيانات من Supabase...</p>';

  const { data, error } = await client
    .from('documents')
    .select('id, title, source_type, content_hash, created_at')
    .order('id', { ascending: true });

  if (error) {
    result.innerHTML = `<p>خطأ في جلب documents: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    result.innerHTML = '<p>ما كاش documents في الجدول.</p>';
    return;
  }

  result.innerHTML = `
    <h3>Documents من Supabase</h3>
    <ul>
      ${data.map(doc => `
        <li>
          <strong>#${doc.id}</strong> - ${doc.title || 'بدون عنوان'} | ${doc.source_type || 'بدون نوع'}
        </li>
      `).join('')}
    </ul>
  `;
}

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    loadDocuments();
  });
}

loadDocuments();
