// Handling for registration workflow
// The idea is that there shall be an initial invite token given as ENV.
// Users shall be able to create additional invite tokens.
// The ENV token shall be eternally valid to create users with
// The user-created tokens shall be valid once.
// User-created tokens shall be saved to disk so that they can be re-read on restarts.
