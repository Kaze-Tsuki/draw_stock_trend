
# 如果chat gpt沒錯應該沒問題。用之前推薦檢查有沒有錯誤

# standardize the data

- 1. center the data: for each features, substract the data with each feature's mean
- 2. scale the data(if the data is measure in different scales): divide the data with the standard deviation 

# process

- 1. matrix X with m rows and n columns, where n stands for features and m stands for samples
- 2. find covariance matrix C of X: C = (1 / (m - 1)) * X * transpose(X)
- 3. find eigenvalues and eigenvectors of C
- 4. pick the eigenvectors with the relative big eigenvalues to form the projection matrix M(the chosen eigenvectors are the columns of M)
- 5. projected data(wanted data) matrix Z = XW
