function remove_missing(df)
    filter(row -> !ismissing(row.display), df)
end