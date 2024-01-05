defmodule Afrek.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :position, :integer
    field :title, :string
    field :details, :string
    field :scheduled_date, :naive_datetime
    field :duration, :string

    belongs_to :user, Afrek.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:title, :details, :scheduled_date, :duration, :position])
    |> validate_required([:title])
  end
end
