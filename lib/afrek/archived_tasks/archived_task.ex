defmodule Afrek.ArchivedTasks.ArchivedTask do
  use Ecto.Schema
  import Ecto.Changeset

  schema "archived_tasks" do
    field :title, :string
    field :details, :string

    belongs_to :user, Afrek.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(archived_task, attrs) do
    archived_task
    |> cast(attrs, [:title, :details])
    |> validate_required([:title, :details])
  end
end
