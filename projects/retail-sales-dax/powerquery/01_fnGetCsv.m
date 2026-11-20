// ============================================================================
// Function: fnGetCsv(fileName)
// Reads one CSV from DataFolder (web or local) and promotes the header row.
// Create it as a Blank Query named fnGetCsv; every table query below uses it,
// so the source location is defined in exactly one place.
// ============================================================================
(fileName as text) as table =>
let
    Path     = DataFolder & fileName,
    Raw      = if Text.StartsWith(Path, "http") then Web.Contents(Path) else File.Contents(Path),
    Csv      = Csv.Document(Raw, [Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Csv, [PromoteAllScalars = true])
in
    Promoted
