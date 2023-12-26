defmodule Afrek.Tasks do
  @moduledoc """
  The Tasks context.
  """

  import Ecto.Query, warn: false
  alias Afrek.Repo

  alias Afrek.Tasks.Task
  alias Afrek.{Events, Scope}

  @doc """
  Subscribers the given scope to the todo pubsub.

  For logged in users, this will be a topic scoped only to the logged in user.
  If the system is extended to allow shared lists, the topic subscription could
  be derived for a particular organizatoin or team, particlar list, and so on.
  """
  def subscribe(%Scope{} = scope) do
    Phoenix.PubSub.subscribe(Afrek.PubSub, topic(scope))
  end

  @doc """
  Returns the list of tasks.

  ## Examples

      iex> list_tasks()
      [%Task{}, ...]

  """
  def list_tasks(%Scope{} = scope) do
    Repo.all(
      from(t in Task, where: t.user_id == ^scope.current_user_id, order_by: [desc: :position])
    )
  end

  @doc """
  Gets a single task.

  Raises `Ecto.NoResultsError` if the Task does not exist.

  ## Examples

      iex> get_task!(123)
      %Task{}

      iex> get_task!(456)
      ** (Ecto.NoResultsError)

  """
  def get_task!(%Scope{} = scope, id) do
    from(t in Task, where: t.id == ^id and t.user_id == ^scope.current_user_id)
    |> Repo.one!()
  end

  @doc """
  Creates a task.

  ## Examples

      iex> create_task(%{field: value})
      {:ok, %Task{}}

      iex> create_task(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_task(%Scope{} = scope, attrs \\ %{}) do
    task = %Task{
      user_id: scope.current_user_id
    }

    Ecto.Multi.new()
    |> Ecto.Multi.run(:position, fn repo, _changes ->
      position = repo.one(from t in Task, select: count(t.id))

      {:ok, position}
    end)
    |> Ecto.Multi.insert(:task, fn %{position: position} ->
      Task.changeset(%Task{task | position: position}, attrs)
    end)
    |> Repo.transaction()
    |> case do
      {:ok, %{task: task}} ->
        broadcast(scope, %Events.TaskAdded{task: task})

        {:ok, task}

      {:error, :task, changeset, _changes_so_far} ->
        {:error, changeset}
    end
  end

  @doc """
  Updates a task.

  ## Examples

      iex> update_task(task, %{field: new_value})
      {:ok, %Task{}}

      iex> update_task(task, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_task(%Task{} = task, attrs) do
    task
    |> Task.changeset(attrs)
    |> Repo.update()
  end

  def update_task_position(%Scope{} = scope, task, new_position) do
    Ecto.Multi.new()
    |> multi_reposition(:new, task, new_position)
    |> Repo.transaction()
    |> case do
      {:ok, _} ->
        new_task = %Task{task | position: new_position}
        broadcast(scope, %Events.TaskRepositioned{task: new_task})

        :ok

      {:error, _failed_op, failed_val, _changes_so_far} ->
        {:error, failed_val}
    end
  end

  defp multi_reposition(%Ecto.Multi{} = multi, name, task, new_position)
       when is_integer(new_position) do
    old_position = task.position

    multi
    |> Ecto.Multi.run({:index, name}, fn repo, _changes ->
      case repo.one(from(t in Task, select: count(t.id))) do
        count when new_position < count -> {:ok, new_position}
        count -> {:ok, count - 1}
      end
    end)
    |> multi_update_all({:dec_positions, name}, fn %{{:index, ^name} => computed_index} ->
      from(t in Task,
        where: t.id != ^task.id,
        where: t.position > ^old_position and t.position <= ^computed_index,
        update: [inc: [position: -1]]
      )
    end)
    |> multi_update_all({:inc_positions, name}, fn %{{:index, ^name} => computed_index} ->
      from(t in Task,
        where: t.id != ^task.id,
        where: t.position < ^old_position and t.position >= ^computed_index,
        update: [inc: [position: 1]]
      )
    end)
    |> multi_update_all({:position, name}, fn %{{:index, ^name} => computed_index} ->
      from(t in Task,
        where: t.id == ^task.id,
        update: [set: [position: ^computed_index]]
      )
    end)
  end

  @doc """
  Deletes a task.

  ## Examples

      iex> delete_task(task)
      {:ok, %Task{}}

      iex> delete_task(task)
      {:error, %Ecto.Changeset{}}

  """
  def delete_task(%Scope{} = scope, %Task{} = task) do
    Ecto.Multi.new()
    |> multi_decrement_positions(:dec_rest_in_list, task)
    |> Ecto.Multi.delete(:task, task)
    |> Repo.transaction()
    |> case do
      {:ok, %{task: task}} ->
        broadcast(scope, %Events.TaskDeleted{task: task})

        {:ok, task}

      {:error, _failed_op, failed_val, _changes_so_far} ->
        {:error, failed_val}
    end
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking task changes.

  ## Examples

      iex> change_task(task)
      %Ecto.Changeset{data: %Task{}}

  """
  def change_task(task_or_changeset, attrs \\ %{}) do
    Task.changeset(task_or_changeset, attrs)
  end

  defp broadcast(%Scope{} = scope, event) do
    Phoenix.PubSub.broadcast(Afrek.PubSub, topic(scope), {__MODULE__, event})
  end

  defp topic(%Scope{} = scope), do: "todos:#{scope.current_user.id}"

  defp multi_update_all(multi, name, func, opts \\ []) do
    Ecto.Multi.update_all(multi, name, func, opts)
  end

  defp multi_decrement_positions(%Ecto.Multi{} = multi, name, %type{} = struct) do
    multi_update_all(multi, name, fn _ ->
      from(t in type,
        where:
          t.position > subquery(from og in type, where: og.id == ^struct.id, select: og.position),
        update: [inc: [position: -1]]
      )
    end)
  end

  def test(to, %Scope{} = scope) do
    parent = self()

    Node.spawn_link(to, fn ->
      IO.inspect(scope)
      send(parent, {:done, node()})
    end)
  end
end
