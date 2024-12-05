export function linearRegression(x, y) {
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

export function multiLinearRegression
    (gold, exchange, weighted_stock, debt, y) {
    // weight gold, exchange, weighted_stock, debt to x1 & x2
    const x1 = gold.map((val, i) => val * 0.1 + exchange[i] * 0.2 + weighted_stock[i] * 0.3 + debt[i] * 0.4);
    const x2 = gold.map((val, i) => val * 0.4 + exchange[i] * 0.3 + weighted_stock[i] * 0.2 + debt[i] * 0.1);
    
    console.log("x1: ", x1);
    console.log("x2: ", x2);
    console.log("y: ", y);
    // Running the function to find the curve coefficients
    const result = FunctionSet.run(x1, x2, y);

    // Output the result
    console.log(result);
    // change form into y = c + ax1 + bx2 and x1 & x2
    return { c: result[2], a: result[0], b: result[1], x1, x2 };
};

class FunctionSet {
    static doubleError = 0.001;
    static extremeBound = 2.0;

    constructor() {
        // cannot create an object
        throw new Error("This class cannot be instantiated.");
    }

    static run(x1, x2, y) {
        let equation = this.find2VariableCurve(x1, x2, y);
        const extremes = this.findExtreme(x1, x2, y, equation);
        x1 = this.removeExtreme(x1, extremes);
        x2 = this.removeExtreme(x2, extremes);
        y = this.removeExtreme(y, extremes);
        equation = this.find2VariableCurve(x1, x2, y);
        return equation;
    }

    static transpose(arr) {
        const m = arr.length;
        const n = arr[0].length;
        const trans = Array.from({ length: n }, () => Array(m).fill(0));

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                trans[j][i] = arr[i][j];
            }
        }
        return trans;
    }

    static multiply(arr1, arr2) {
        const m1 = arr1.length;
        const n1 = arr1[0].length;
        const m2 = arr2.length;
        const n2 = arr2[0].length;

        if (n1 !== m2) {
            console.error("Error: n1 != m2 at function : multiply");
            return null;
        }

        const result = Array.from({ length: m1 }, () => Array(n2).fill(0));

        for (let i = 0; i < m1; i++) {
            for (let j = 0; j < n2; j++) {
                for (let k = 0; k < m2; k++) {
                    result[i][j] += arr1[i][k] * arr2[k][j];
                }
            }
        }

        return result;
    }

    static isZeroVector(v) {
        return v.every(value => Math.abs(value) <= this.doubleError);
    }

    static GramSchmidtProcess(A) {
        const m = A.length; // row number
        const n = A[0].length; // Rn
        let idx = 0;
        const Q = [];
        let v;
        let len;

        // first step
        v = [...A[idx++]]; // error vector (let e1 = v1)
        len = Math.sqrt(v.reduce((sum, i) => sum + i * i, 0));

        v = v.map(i => i / len); // normalization

        // step iteration
        while (!this.isZeroVector(v)) {
            Q.push(v); // add to Q

            if (idx >= m) break;

            // find error vector
            v = [...A[idx++]];
            for (const q of Q) {
                const t = q.reduce((sum, qi, i) => sum + qi * v[i], 0);
                for (let i = 0; i < v.length; i++) {
                    v[i] -= t * q[i];
                }
            }

            // normalization
            len = Math.sqrt(v.reduce((sum, i) => sum + i * i, 0));
            v = v.map(i => i / len);
        }

        return Q;
    }

    static QRFactorization(A) { // get(0) = Q; get(1) = R
        const as = Array.from({ length: A[0].length }, (_, i) => A.map(row => row[i]));

        const qs = this.GramSchmidtProcess(as); // orthonormal column vectors : q
        const m = qs[0].length; // dim of column vectors
        const k = qs.length; // number of orthonormal vectors

        // Q
        const Q = Array.from({ length: m }, (_, j) => qs.map(q => q[j]));

        // R
        const R = Array.from({ length: k }, () => Array(k).fill(0));
        for (let i = 0; i < k; i++) {
            for (let j = i; j < k; j++) {
                R[i][j] = qs[i].reduce((sum, qi, t) => sum + qi * as[j][t], 0);
            }
        }

        return [Q, R];
    }

    static findX(A, b) { // b is column vector {{}, {}, {} ...}
        const [Q, R] = this.QRFactorization(A);
        const c = this.multiply(this.transpose(Q), b);

        const x = Array(R.length).fill(0);
        for (let i = R.length - 1; i >= 0; i--) {
            let temp = 0;
            for (let j = R.length - 1; j > i; j--) {
                temp += R[i][j] * x[j];
            }
            x[i] = (c[i][0] - temp) / R[i][i];
        }

        return x;
    }

    static find2VariableCurve(x1, x2, y) {
        // y = ax1 + bx2 + c
        const A = x1.map((val, i) => [x1[i], x2[i], 1]);
        const b = y.map(val => [val]);

        return this.findX(A, b);
    }

    static findExtreme(x1, x2, y, equation) { // equation { a, b, c } where y = ax1 + bx2 + c
        const e = x1.map((_, i) =>
            Math.abs((equation[0] * x1[i] + equation[1] * x2[i] + equation[2]) - y[i])
        );

        // find sigma
        const average = e.reduce((sum, val) => sum + val, 0) / e.length;
        let sigma = Math.sqrt(
            e.reduce((sum, val) => sum + (val - average) ** 2, 0) / e.length
        );
        if (sigma < this.doubleError) return [];

        // find extreme
        const normalizedE = e.map(val => val / sigma);

        return normalizedE
            .map((val, i) => (val > this.extremeBound ? i : -1))
            .filter(index => index !== -1);
    }

    static removeExtreme(arr, extremes) {
        return arr.filter((_, i) => !extremes.includes(i));
    }
}

// Call the main function to execute
// main();