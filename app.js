function formatMoney(value) {
  return Number(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return '0.00%';
  return `${(value * 100).toFixed(2)}%`;
}

const yearsInput = document.getElementById('years');
const annualPayInput = document.getElementById('annualPay');
const totalPremiumInput = document.getElementById('totalPremium');
const selectedYearGainInput = document.getElementById('selectedYearGain');
const selectedYearInput = document.getElementById('selectedYear');
const summaryBox = document.getElementById('summary');
const resultBody = document.getElementById('resultBody');

function calculate() {
  const years = Number(yearsInput.value) || 0;
  const annualPay = Number(annualPayInput.value) || 0;
  const explicitTotalPremium = Number(totalPremiumInput.value) || 0;
  const selectedYearGain = Number(selectedYearGainInput.value) || 0;
  let selectedYear = Number(selectedYearInput.value) || 1;

  if (years <= 0 || annualPay <= 0) {
    summaryBox.innerHTML = '请正确填写“缴费年限”和“每年缴费金额”。';
    resultBody.innerHTML = '';
    return;
  }

  selectedYear = Math.min(Math.max(selectedYear, 1), years);

  const totalContribution = explicitTotalPremium > 0 ? explicitTotalPremium : annualPay * years;

  const simpleInterestAmount = (selectedYearGain - totalContribution) / selectedYear;
  const simpleAnnualRate = totalContribution > 0 ? simpleInterestAmount / totalContribution : 0;

  const selectedYearEndValue = totalContribution + selectedYearGain;
  const compoundAnnualRate =
    totalContribution > 0 && selectedYearEndValue > 0
      ? Math.pow(selectedYearEndValue / totalContribution, 1 / selectedYear) - 1
      : 0;

  const rows = [];
  for (let year = 1; year <= 50; year += 1) {
    const cumulativeInput = annualPay * year;
    const simpleAccumulatedValue = totalContribution * (1 + simpleAnnualRate * year);
    const compoundAccumulatedValue = totalContribution * Math.pow(1 + compoundAnnualRate, year);

    rows.push(`
      <tr>
        <td>${year}</td>
        <td>${formatMoney(annualPay)}</td>
        <td>${formatMoney(cumulativeInput)}</td>
        <td>${formatMoney(simpleAccumulatedValue)}</td>
        <td>${formatMoney(compoundAccumulatedValue)}</td>
        <td>${formatPercent(simpleAnnualRate)}</td>
        <td>${formatPercent(compoundAnnualRate)}</td>
      </tr>
    `);
  }

  resultBody.innerHTML = rows.join('');

  summaryBox.innerHTML = `
    <strong>试算结果</strong><br>
    1. 总投入：<strong>${formatMoney(totalContribution)}</strong> 元<br>
    2. 选定收益年份：第 <strong>${selectedYear}</strong> 年<br>
    3. 该年总收益：<strong>${formatMoney(selectedYearGain)}</strong> 元<br>
    4. 年化单利率：<strong>${formatPercent(simpleAnnualRate)}</strong><br>
    5. 年化复利率：<strong>${formatPercent(compoundAnnualRate)}</strong>
  `;
}

document.getElementById('calculateBtn').addEventListener('click', calculate);

document.getElementById('resetBtn').addEventListener('click', () => {
  yearsInput.value = 10;
  annualPayInput.value = 12000;
  totalPremiumInput.value = '';
  selectedYearGainInput.value = 15000;
  selectedYearInput.value = 5;
  summaryBox.innerHTML = '';
  resultBody.innerHTML = '';
});

calculate();
