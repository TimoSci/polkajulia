# src/Config.jl

# const DB_URL = get(ENV, "DB_URL", "postgres://localhost:5432/mydb")

const PRUNE = false  # prune validators with missing identity information

const DATATYPE = "csv"  # or "json"
const OUTPUTS_DIR = "../outputs"
const MEDIA_DIR = "../media/"
# const ERAS_DATA_PATH = "$OUTPUTS_DIR/validadores_ultimas_eras.csv"
const ERAS_DATA_PATH = "$OUTPUTS_DIR/erapoints250930.csv"
const IMAGE_FILENAME = "validator_heatmap.png"

