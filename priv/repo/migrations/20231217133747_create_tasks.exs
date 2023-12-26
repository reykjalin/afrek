defmodule Afrek.Repo.Migrations.CreateTasks do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :title, :string
      add :details, :string
      add :due_date, :date
      add :duration, :string
      add :position, :integer, null: false

      add :user_id, references(:users, on_delete: :delete_all)

      timestamps(type: :utc_datetime)
    end
  end
end
