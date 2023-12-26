defmodule Afrek.CompletedTasks.CompletedTask do
  use Ecto.Schema
  import Ecto.Changeset

  schema "completed_tasks" do
    field :title, :string
    field :details, :string

    belongs_to :user, Afrek.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(completed_task, attrs) do
    completed_task
    |> cast(attrs, [:title, :details])
    |> validate_required([:title, :details])
  end
end
