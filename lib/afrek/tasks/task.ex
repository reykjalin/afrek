defmodule Afrek.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :position, :integer
    field :title, :string
    field :details, :string
    field :due_date, :date
    field :duration, :string

    belongs_to :user, Afrek.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:title, :details, :due_date, :duration, :position])
    |> validate_required([:title])
  end
end
