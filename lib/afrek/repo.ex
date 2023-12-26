defmodule Afrek.Repo do
  use Ecto.Repo,
    otp_app: :afrek,
    adapter: Ecto.Adapters.Postgres
end
