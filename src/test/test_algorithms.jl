using Test
include("../algorithms.jl")
include("../load.jl")


# All Values 1

df = CSV.read("./fixtures/testset01.csv", DataFrame)
display(df)

@test 1+1 == 2
binary_matrix_df = create_binary_matrix(df)
binary_matrix = Matrix(binary_matrix_df[:, 2:end])
display(binary_matrix) 

@test all(binary_matrix .== 1)
corr_mat = correlation_matrix(binary_matrix)
# @test all(corr_mat .== 1.0)
display(corr_mat)



# Random Values

df = CSV.read("./fixtures/testset02.csv", DataFrame)
display(df)

binary_matrix_df = create_binary_matrix(df)
binary_matrix = Matrix(binary_matrix_df[:, 2:end])
display(binary_matrix) 

# @test all(binary_matrix .== 1)
corr_mat = correlation_matrix(binary_matrix)
@test !all(corr_mat .== 1.0)
display(corr_mat)

