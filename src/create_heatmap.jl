using DataFrames
using StatsPlots  # para heatmap e scatter PCA

include("filters.jl")
include("load.jl")
include("algorithms.jl")
include("config.jl")

println("Loading data frame")
df = load_eras_data()

if PRUNE
    println("Pruning validators with missing identity information")
    df_pruned = remove_missing(df)
else
    df_pruned = df
end

println("Creating binary matrix data frame")
binary_matrix_df = create_binary_matrix(df_pruned)
binary_matrix = Matrix(binary_matrix_df[:, 2:end])
println("Binary matrix size: $(size(binary_matrix))")

println("Filtering varying validators")
varying_addresses = varying_validators_addresses(binary_matrix_df)
println("Number of varying addresses: $(length(varying_addresses))")
filtered_matrix_df = filter_varying(binary_matrix_df, varying_addresses)

println("Calculating correlation matrix")
mat = Matrix(filtered_matrix_df[:, 2:end])
cor_mat = correlation_matrix(mat)

# val_names = names(df)[2:end]
val_names = varying_addresses #TODO replace with search function for names instead of addresses

println("Creating heatmap plot for correlation matrix of size: $(size(cor_mat))")
hm= heatmap(
           val_names, val_names, cor_mat;
        #    xlabel = "Validador",
        #    ylabel = "Validador",
            xticks=false, 
            yticks=false,
           title = "Validador Absence Correlation Heatmap",
           c = :balance,  # diverging colormap
           clim = (-1, 1), # correlações vão de -1 a 1
           size = (900, 900),
           dpi = 300,
           yflip = true,
           legend = false
       )

# display(hm)
println("Saving heatmap to file: $MEDIA_DIR$IMAGE_FILENAME")
savefig(hm, "$MEDIA_DIR/$IMAGE_FILENAME")