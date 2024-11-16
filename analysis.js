export default function linearRegression(x, y) {
    const n = x.length;

    // 計算 sums
    const sumX = x.reduce((acc, val) => acc + val, 0);
    const sumY = y.reduce((acc, val) => acc + val, 0);
    const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
    const sumXX = x.reduce((acc, val) => acc + val * val, 0);

    // 計算斜率 (m) 和截距 (b)
    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    return { slope: m, intercept: b };
}
