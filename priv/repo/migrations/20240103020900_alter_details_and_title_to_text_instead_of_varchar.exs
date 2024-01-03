defmodule Afrek.Repo.Migrations.AlterDetailsAndTitleToTextInsteadOfVarchar do
  use Ecto.Migration

  def change do
    alter table(:tasks) do
      modify :details, :text
      modify :title, :text
    end

    alter table(:completed_tasks) do
      modify :details, :text
      modify :title, :text
    end

    alter table(:archived_tasks) do
      modify :details, :text
      modify :title, :text
    end
  end
end
