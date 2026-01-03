namespace backend.src.Schemas;

internal record User
{
    public required string Username { get; init; }
}