using DataFrames
using StatsPlots  # para heatmap e scatter PCA

include("filters.jl")
include("load.jl")
include("algorithms.jl")
include("config.jl")

println("Loading data frame")
df = load_eras_data()

println("Removing missing data")
df_pruned = remove_missing(df)

println("Creating binary matrix data frame")
binary_matrix_df = create_binary_matrix(df_pruned)

println("Filtering varying validators")
varying_addresses = varying_validators_addresses(binary_matrix_df)
filtered_matrix_df = filter_varying(binary_matrix_df, varying_addresses)

println("Calculating correlation matrix")
mat = Matrix(filtered_matrix_df[:, 2:end])
cor_mat = correlation_matrix(mat)

# val_names = names(df)[2:end]
val_names = varying_addresses #TODO replace with search function for names instead of addresses

println("Creating heatmap plot")
hm= heatmap(
           val_names, val_names, cor_mat;
           xlabel = "Validador",
           ylabel = "Validador",
           title = "Validador Absence Correlation Heatmap",
           c = :balance,  # diverging colormap
           clim = (-1, 1), # correlações vão de -1 a 1
           size = (900, 900),
           dpi = 300,
           yflip = true,
           legend = true
       )

# display(hm)
println("Saving heatmap to file: $OUTPUT_FILENAME")
savefig(hm, OUTPUT_FILENAME)