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