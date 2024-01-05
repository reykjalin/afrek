defmodule Afrek.Repo.Migrations.DeleteDueDate do
  use Ecto.Migration

  def change do
    alter table(:tasks) do
      remove :due_date
    end
  end
end
