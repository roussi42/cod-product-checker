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
  const adLibrary = document.getElementById("adLibrary").value;
  const googleTrends = document.getElementById("googleTrends").value;
  const supplierProof = document.getElementById("supplierProof").value;

  const expectedLoss = (failureRate / 100) * sellPrice;
  const estimatedProfit = sellPrice - buyPrice - shippingCost - expectedLoss;

  let score = 0;
  let reasons = [];

  if (estimatedProfit > 5) {
    score += 25;
    reasons.push("هامش الربح المبدئي جيد.");
  } else if (estimatedProfit > 0) {
    score += 10;
    reasons.push("هامش الربح موجود لكنه متوسط.");
  } else {
    reasons.push("هامش الربح ضعيف بعد احتساب المخاطر.");
  }

  if (isLight === "yes") {
    score += 10;
    reasons.push("المنتج خفيف، وهذا يساعد في الشحن.");
  }

  if (solvesProblem === "yes") {
    score += 15;
    reasons.push("المنتج يحل مشكلة واضحة.");
  }

  if (wowFactor === "yes") {
    score += 10;
    reasons.push("المنتج فيه wow factor.");
  }

  if (adLibrary === "yes") {
    score += 15;
    reasons.push("تم العثور على إعلانات في Meta Ad Library.");
  } else {
    reasons.push("لم يتم العثور على إعلانات واضحة في Meta Ad Library.");
  }

  if (googleTrends === "yes") {
    score += 15;
    reasons.push("يوجد اهتمام ظاهر في Google Trends.");
  } else {
    reasons.push("الاهتمام غير واضح في Google Trends.");
  }

  if (supplierProof === "yes") {
    score += 10;
    reasons.push("يوجد دليل طلب من صفحة المورد.");
  } else {
    reasons.push("لا يوجد دليل طلب واضح من المورد.");
  }

  let verdict = "";
  if (score >= 70) {
    verdict = "إشارات المنتج قوية مبدئيًا.";
  } else if (score >= 40) {
    verdict = "إشارات المنتج متوسطة وتحتاج تحقق إضافي.";
  } else {
    verdict = "إشارات المنتج ضعيفة مبدئيًا.";
  }

  result.innerHTML = `
    <h3>النتيجة</h3>
    <p><strong>المنتج:</strong> ${productName}</p>
    <p><strong>الربح التقديري:</strong> ${estimatedProfit.toFixed(2)}</p>
    <p><strong>السكور:</strong> ${score} / 100</p>
    <p><strong>الحكم:</strong> ${verdict}</p>
    <h4>أسباب النتيجة:</h4>
    <ul>${reasons.map(reason => `<li>${reason}</li>`).join("")}</ul>
  `;
});
