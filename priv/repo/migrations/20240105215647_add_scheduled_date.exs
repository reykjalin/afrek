defmodule Afrek.Repo.Migrations.AddScheduledDate do
  use Ecto.Migration

  def change do
    alter table(:tasks) do
      add :scheduled_date, :naive_datetime
    end
  end
end
