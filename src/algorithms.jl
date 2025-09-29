function create_binary_matrix(df)

    binary_matrix_df = unstack(df, :era, :address, :eraPoints)
    for col in names(binary_matrix_df)[2:end]
           binary_matrix_df[!, col] = ifelse.(ismissing.(binary_matrix_df[!, col]), 0, 1)
    end
    return binary_matrix_df
end