using CSV, DataFrames

# 1) Ler CSV original longo
df_long = CSV.read("data/validadores_ultimas_eras.csv", DataFrame)

# 2) Ler lista de validadores com identidade
# Exemplo: lista simples em arquivo txt ou CSV
validadores_id = CSV.read("data/validadores_com_identidade.csv", DataFrame)  # coluna "address"

# 3) Filtrar para validadores com identidade
df_filtrado = filter(row -> row.address in validadores_id.address, df_long)

# 4) Criar matriz binária com pivot
# Primeiro transformar eraPoints > 0 para 1 (online) e 0 caso contrário
df_filtrado.online = Int.(df_filtrado.eraPoints .> 0)

using DataFramesMeta
using Pipe

# Pivot para wide format: eras × validadores
df_wide = unstack(df_filtrado, :era, :address, :online; fill=0)

# 5) Salvar CSV binário com identidade
CSV.write("data/binary_matrix_com_identidade.csv", df_wide)

println("Arquivo binary_matrix_com_identidade.csv criado com validadores que têm identidade.")
