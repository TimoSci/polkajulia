using CSV, DataFrames
include("config.jl")

filename = ERAS_DATA_PATH

df = CSV.read(filename, DataFrame)

println(df)