defmodule Verk.Repo do
  use Ecto.Repo,
    otp_app: :verk,
    adapter: Ecto.Adapters.Postgres
end
