defmodule Afrek.ArchivedTasks do
  @moduledoc """
  The ArchivedTasks context.
  """

  import Ecto.Query, warn: false
  alias Afrek.Repo

  alias Afrek.ArchivedTasks.ArchivedTask
  alias Afrek.{Events, Scope}

  @doc """
  Returns the list of archived_tasks.

  ## Examples

      iex> list_archived_tasks()
      [%ArchivedTask{}, ...]

  """
  def list_archived_tasks(%Scope{} = scope) do
    Repo.all(
      from(t in ArchivedTask,
        where: t.user_id == ^scope.current_user_id,
        order_by: [desc: :inserted_at]
      )
    )
  end

  @doc """
  Gets a single archived_task.

  Raises `Ecto.NoResultsError` if the Archived task does not exist.

  ## Examples

      iex> get_archived_task!(123)
      %ArchivedTask{}

      iex> get_archived_task!(456)
      ** (Ecto.NoResultsError)

  """
  def get_archived_task!(id), do: Repo.get!(ArchivedTask, id)

  @doc """
  Creates a archived_task.

  ## Examples

      iex> create_archived_task(%{field: value})
      {:ok, %ArchivedTask{}}

      iex> create_archived_task(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_archived_task(%Scope{} = scope, attrs \\ %{}) do
    task = %ArchivedTask{
      user_id: scope.current_user_id
    }

    Ecto.Multi.new()
    |> Ecto.Multi.insert(:task, fn _ ->
      ArchivedTask.changeset(task, attrs)
    end)
    |> Repo.transaction()
    |> case do
      {:ok, %{task: task}} ->
        broadcast(scope, %Events.ArchivedTaskAdded{task: task})

        {:ok, task}

      {:error, :task, changeset, _changes_so_far} ->
        {:error, changeset}
    end
  end

  @doc """
  Updates a archived_task.

  ## Examples

      iex> update_archived_task(archived_task, %{field: new_value})
      {:ok, %ArchivedTask{}}

      iex> update_archived_task(archived_task, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_archived_task(%ArchivedTask{} = archived_task, attrs) do
    archived_task
    |> ArchivedTask.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a archived_task.

  ## Examples

      iex> delete_archived_task(archived_task)
      {:ok, %ArchivedTask{}}

      iex> delete_archived_task(archived_task)
      {:error, %Ecto.Changeset{}}

  """
  def delete_archived_task(%ArchivedTask{} = archived_task) do
    Repo.delete(archived_task)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking archived_task changes.

  ## Examples

      iex> change_archived_task(archived_task)
      %Ecto.Changeset{data: %ArchivedTask{}}

  """
  def change_archived_task(%ArchivedTask{} = archived_task, attrs \\ %{}) do
    ArchivedTask.changeset(archived_task, attrs)
  end

  def subscribe(%Scope{} = scope) do
    Phoenix.PubSub.subscribe(Afrek.PubSub, topic(scope))
  end

  defp topic(%Scope{} = scope), do: "archived_tasks:#{scope.current_user.id}"

  defp broadcast(%Scope{} = scope, event) do
    Phoenix.PubSub.broadcast(Afrek.PubSub, topic(scope), {__MODULE__, event})
  end
end
