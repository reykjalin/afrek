defmodule Afrek.Repo.Migrations.CreateArchivedTasks do
  use Ecto.Migration

  def change do
    create table(:archived_tasks) do
      add :title, :string
      add :details, :string

      add :user_id, references(:users, on_delete: :delete_all)

      timestamps(type: :utc_datetime)
    end
  end
end
