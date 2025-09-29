using DataFrames
using StatsPlots  # para heatmap e scatter PCA

include("filters.jl")
include("load.jl")
include("algorithms.jl")

df = load_eras_data()
df_pruned = remove_missing(df)

binary_matrix_df = create_binary_matrix(df_pruned)

# display(df_pruned)
# display(df)

# display(binary_matrix)
varying_addresses = varying_validators_addresses(binary_matrix_df)

filtered_matrix_df = filter_varying(binary_matrix_df, varying_addresses)

# println(filtered_matrix_df)

mat = Matrix(filtered_matrix_df[:, 2:end])

println(correlation_matrix(mat))