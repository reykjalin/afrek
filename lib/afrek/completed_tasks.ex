defmodule Afrek.CompletedTasks do
  @moduledoc """
  The CompletedTasks context.
  """

  import Ecto.Query, warn: false
  alias Afrek.Repo

  alias Afrek.CompletedTasks.CompletedTask
  alias Afrek.{Events, Scope}

  @doc """
  Returns the list of completed_tasks.

  ## Examples

      iex> list_completed_tasks()
      [%CompletedTask{}, ...]

  """
  def list_completed_tasks(%Scope{} = scope) do
    Repo.all(
      from(t in CompletedTask,
        where: t.user_id == ^scope.current_user_id,
        order_by: [desc: :inserted_at],
        group_by: [t.id, fragment("DATE(?)", t.inserted_at)],
        select: {fragment("DATE(?)", t.inserted_at), data: t}
      )
    )
    |> List.foldl(%{}, fn {date, task}, acc -> Map.update(acc, date, task, &(&1 ++ task)) end)
    |> Map.to_list()
    |> Enum.sort(fn d1, d2 -> Date.compare(elem(d1, 0), elem(d2, 0)) == :gt end)
  end

  @doc """
  Gets a single completed_task.

  Raises `Ecto.NoResultsError` if the Completed task does not exist.

  ## Examples

      iex> get_completed_task!(123)
      %CompletedTask{}

      iex> get_completed_task!(456)
      ** (Ecto.NoResultsError)

  """
  def get_completed_task!(id), do: Repo.get!(CompletedTask, id)

  @doc """
  Creates a completed_task.

  ## Examples

      iex> create_completed_task(%{field: value})
      {:ok, %CompletedTask{}}

      iex> create_completed_task(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_completed_task(%Scope{} = scope, attrs \\ %{}) do
    task = %CompletedTask{
      user_id: scope.current_user_id
    }

    Ecto.Multi.new()
    |> Ecto.Multi.insert(:task, fn _ ->
      CompletedTask.changeset(task, attrs)
    end)
    |> Repo.transaction()
    |> case do
      {:ok, %{task: task}} ->
        broadcast(scope, %Events.CompletedTaskAdded{task: task})

        {:ok, task}

      {:error, :task, changeset, _changes_so_far} ->
        {:error, changeset}
    end
  end

  @doc """
  Updates a completed_task.

  ## Examples

      iex> update_completed_task(completed_task, %{field: new_value})
      {:ok, %CompletedTask{}}

      iex> update_completed_task(completed_task, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_completed_task(%CompletedTask{} = completed_task, attrs) do
    completed_task
    |> CompletedTask.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a completed_task.

  ## Examples

      iex> delete_completed_task(completed_task)
      {:ok, %CompletedTask{}}

      iex> delete_completed_task(completed_task)
      {:error, %Ecto.Changeset{}}

  """
  def delete_completed_task(%CompletedTask{} = completed_task) do
    Repo.delete(completed_task)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking completed_task changes.

  ## Examples

      iex> change_completed_task(completed_task)
      %Ecto.Changeset{data: %CompletedTask{}}

  """
  def change_completed_task(%CompletedTask{} = completed_task, attrs \\ %{}) do
    CompletedTask.changeset(completed_task, attrs)
  end

  def subscribe(%Scope{} = scope) do
    Phoenix.PubSub.subscribe(Afrek.PubSub, topic(scope))
  end

  defp topic(%Scope{} = scope), do: "completed_tasks:#{scope.current_user.id}"

  defp broadcast(%Scope{} = scope, event) do
    Phoenix.PubSub.broadcast(Afrek.PubSub, topic(scope), {__MODULE__, event})
  end
end
