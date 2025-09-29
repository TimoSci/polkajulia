function remove_missing(df)
    filter(row -> !ismissing(row.display), df)
end

function filter_varying(binary_matrix,addresses)
    select(binary_matrix, [:era; addresses]...)
end