using DataFrames
include("filters.jl")
include("load.jl")

df = load_eras_data()
df_pruned = remove_missing(df)

println(df_pruned)