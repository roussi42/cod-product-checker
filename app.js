const form = document.getElementById("productForm");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const productName = document.getElementById("productName").value;
  const buyPrice = parseFloat(document.getElementById("buyPrice").value) || 0;
  const sellPrice = parseFloat(document.getElementById("sellPrice").value) || 0;
  const shippingCost = parseFloat(document.getElementById("shippingCost").value) || 0;
  const failureRate = parseFloat(document.getElementById("failureRate").value) || 0;

  const isLight = document.getElementById("isLight").value;
  const solvesProblem = document.getElementById("solvesProblem").value;
  const wowFactor = document.getElementById("wowFactor").value;

  const expectedLoss = (failureRate / 100) * sellPrice;
  const estimatedProfit = sellPrice - buyPrice - shippingCost - expectedLoss;

  let score = 0;

  if (estimatedProfit > 5) score += 40;
  else if (estimatedProfit > 0) score += 20;

  if (isLight === "yes") score += 20;
  if (solvesProblem === "yes") score += 20;
  if (wowFactor === "yes") score += 20;

  let verdict = "";
  if (score >= 80) {
    verdict = "منتج قوي مبدئيًا.";
  } else if (score >= 50) {
    verdict = "منتج متوسط ويحتاج تحقق إضافي.";
  } else {
    verdict = "منتج ضعيف مبدئيًا.";
  }

  result.innerHTML = `
    <h3>النتيجة</h3>
    <p><strong>المنتج:</strong> ${productName}</p>
    <p><strong>الربح التقديري:</strong> ${estimatedProfit.toFixed(2)}</p>
    <p><strong>السكور:</strong> ${score} / 100</p>
    <p><strong>الحكم:</strong> ${verdict}</p>
  `;
});
