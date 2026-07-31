const form = document.getElementById("productForm");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const productName = document.getElementById("productName").value;
  const buyPrice = parseFloat(document.getElementById("buyPrice").value) || 0;
  const sellPrice = parseFloat(document.getElementById("sellPrice").value) || 0;
  const shippingCost = parseFloat(document.getElementById("shippingCost").value) || 0;
  const failureRate = parseFloat(document.getElementById("failureRate").value) || 0;

  const expectedLoss = (failureRate / 100) * sellPrice;
  const estimatedProfit = sellPrice - buyPrice - shippingCost - expectedLoss;

  let verdict = "";
  if (estimatedProfit > 5) {
    verdict = "المنتج يبدو جيد مبدئيًا.";
  } else if (estimatedProfit > 0) {
    verdict = "المنتج متوسط، يحتاج تحقق أكثر.";
  } else {
    verdict = "المنتج ضعيف مبدئيًا.";
  }

  result.innerHTML = `
    <h3>النتيجة</h3>
    <p><strong>المنتج:</strong> ${productName}</p>
    <p><strong>الربح التقديري:</strong> ${estimatedProfit.toFixed(2)}</p>
    <p><strong>الحكم:</strong> ${verdict}</p>
  `;
});
