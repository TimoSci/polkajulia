using CSV, DataFrames
include("config.jl")
include("filters.jl")

filename = ERAS_DATA_PATH

df = CSV.read(filename, DataFrame)

df_pruned = remove_missing(df)

println(df_pruned)