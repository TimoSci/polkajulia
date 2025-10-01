using Statistics
using MultivariateStats 

function create_binary_matrix(df)

    binary_matrix_df = unstack(df, :era, :address, :eraPoints)
    for col in names(binary_matrix_df)[2:end]
           binary_matrix_df[!, col] = ifelse.(ismissing.(binary_matrix_df[!, col]), 0, 1)
    end
    return binary_matrix_df
end

function varying_validators_addresses(binary_matrix_df)
    return [name for name in names(binary_matrix_df)[2:end] if length(unique(binary_matrix_df[!, name])) > 1]
end

function correlation_matrix(mat)
    mat_t = mat' # transpose
    n_val = size(mat_t, 1)
    cor_mat = Matrix{Float64}(undef, n_val, n_val)
    for i in 1:n_val, j in 1:n_val
        cor_mat[i, j] = cor(mat_t[i, :], mat_t[j, :])
    end
    return cor_mat
end

function phi_coefficient_(a, b, c, d)
        numerator = (a * d) - (b * c)
        denominator = sqrt((a + b) * (c + d) * (a + c) * (b + d))
        return numerator / denominator
end

function phi_coefficient(col1, col2)
    a = sum((col1 .== 1) .& (col2 .== 1))  # both present
    b = sum((col1 .== 1) .& (col2 .== 0))  # col1 present, col2 absent
    c = sum((col1 .== 0) .& (col2 .== 1))  # col1 absent, col2 present
    d = sum((col1 .== 0) .& (col2 .== 0))  # both absent
    return phi_coefficient_(a, b, c, d)
end

function phi_matrix(mat)
    mat_t = mat' # transpose
    n_val = size(mat_t, 1)
    phi_mat = Matrix(undef, n_val, n_val)
    for i in 1:n_val, j in 1:n_val
        phi_mat[i, j] = phi_coefficient(mat_t[i, :], mat_t[j, :])
    end
    return phi_mat
end