
# Standardize the Data

1. **Center the Data**: For each feature, subtract its mean from all data points in that feature.  
   \[
   X_{\text{centered}} = X - \mu
   \]  

2. **Scale the Data (if features are on different scales)**: Divide each centered feature by its standard deviation.  
   \[
   X_{\text{standardized}} = \frac{X - \mu}{\sigma}
   \]  

---

# PCA Process

1. **Input Matrix \( X \)**:  
   - \( X \) has \( m \) rows (samples) and \( n \) columns (features).

2. **Compute the Covariance Matrix \( C \)**:  
   \[
   C = \frac{1}{m - 1} X^T X
   \]  

3. **Find Eigenvalues and Eigenvectors of \( C \)**:  
   - do it by yourself

4. **Form the Projection Matrix \( W \)**:  
   - Select the eigenvectors corresponding to the largest eigenvalues.  
   - These eigenvectors form the columns of \( W \) (an \( n \times k \) matrix, where \( k \) is the reduced dimension).

5. **Project the Data onto the Principal Components**:  
   \[
   Z = X W
   \]  
   - \( Z \) is the projected data matrix with \( m \) rows and \( k \) columns (wanted reduced data matrix).

---

### **Notes:**
- you should check for mistakes before applying it