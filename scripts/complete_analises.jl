module LoadData

using CSV, DataFrames

function load_csv(path::String)
    return CSV.read(path, DataFrame)
end

end
