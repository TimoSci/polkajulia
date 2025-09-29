using CSV, DataFrames
include("config.jl")

filename = ERAS_DATA_PATH

function load_eras_data()
  CSV.read(filename, DataFrame)
end

