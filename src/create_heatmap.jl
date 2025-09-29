using DataFrames
include("filters.jl")
include("load.jl")
include("algorithms.jl")

df = load_eras_data()
df_pruned = remove_missing(df)

binary_matrix = create_binary_matrix(df_pruned)

# display(df_pruned)
# display(df)

display(binary_matrix)