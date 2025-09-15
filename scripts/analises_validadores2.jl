using CSV, DataFrames, Statistics
       
       # Ler CSV

df = CSV.read("validadores_ultimas_eras.csv", DataFrame)
       
       # Filtrar apenas quem tem identidade

println("Linhas antes: ", nrow(df))
Linhas antes: 11973

println("Linhas depois de remover sem identidade: ", nrow(df_com_identidade))
       
       # --- ETAPA CRÍTICA ---  
       # Agregar por era + display, pegando o máximo de eraPoints
Linhas depois de remover sem identidade: 6146

df_agregado = combine(
           groupby(df_com_identidade, [:era, :display]),
           :eraPoints => maximum => :eraPoints
       )
       
       # Pivotar

binary_matrix_df = unstack(df_agregado, :era, :display, :eraPoints)

julia> for col in names(binary_matrix_df)[2:end]
           binary_matrix_df[!, col] = ifelse.(ismissing.(binary_matrix_df[!, col]), 0, 1)
       end
       
       # Identificar validadores que variam

julia> variaveis = [name for name in names(binary_matrix_df)[2:end] if length(unique(binary_matrix_df[!, name])) > 1]

julia> println("Validadores que variam: ", length(variaveis))

#fazer o grafico pca
using CSV
using DataFrames
using LinearAlgebra
using MultivariateStats
using Plots

# 1) Ler a matriz binária
df = CSV.read("binary_matrix.csv", DataFrame)

# 2) Matrizes e rótulos
validators = names(df, Not(:era))                 # nomes das colunas (validadores)
X = Matrix(df[:, Not(:era)])                      # 20 (eras) x 155 (validadores)

# 3) PCA com amostras em colunas (validadores) e features nas linhas (eras)
pca = fit(PCA, X; maxoutdim=2)

# 4) Projeção (retorna outdim x n_amostras) => 2 x 155
Z = MultivariateStats.transform(pca, X)

# 5) DataFrame para plot (155 linhas)
df_pca = DataFrame(
    validator = validators,
    PC1 = vec(Z[1, :]),
    PC2 = vec(Z[2, :])
)

# 6) Scatter PC1 vs PC2 e salvar
plt = scatter(df_pca.PC1, df_pca.PC2;
    xlabel = "PC1",
    ylabel = "PC2",
    title = "PCA dos Validadores (amostras = validadores; features = eras)",
    legend = false,
    markersize = 5,
)
savefig(plt, "pca_validadores.png")

# (Opcional) Verificar dimensões e variância explicada
@show size(X)            # deve ser (20, 155)
@show size(Z)            # deve ser (2, 155)
println(pca)             # imprime variância explicada etc.
println("Gráfico salvo em: pca_validadores.png")
