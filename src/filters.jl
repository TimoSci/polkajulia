function remove_missing(df)
    combine(
           groupby(df, [:era, :display]),
           :eraPoints => maximum => :eraPoints
       )
end