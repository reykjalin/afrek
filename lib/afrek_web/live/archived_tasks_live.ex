defmodule AfrekWeb.ArchivedTasksLive do
  use AfrekWeb, :live_view

  alias Afrek.ArchivedTasks

  def render(assigns) do
    ~H"""
    <h2 class="text-2xl font-bold mt-4 mb-10 text-center">
      Archived Tasks
    </h2>

    <div id="archived-tasks" class="w-full flex flex-col gap-4" phx-update="stream">
      <div :for={{id, task} <- @streams.tasks} id={id} class="group flex flex-row gap-2 items-center">
        <div class="grow">
          <.completed_task task={task} />
        </div>
      </div>
    </div>
    """
  end

  @spec mount(any(), any(), Phoenix.LiveView.Socket.t()) :: {:ok, any()}
  def mount(_params, _session, socket) do
    if connected?(socket) do
      ArchivedTasks.subscribe(socket.assigns.scope)
    end

    tasks = ArchivedTasks.list_archived_tasks(socket.assigns.scope)

    {
      :ok,
      socket
      |> stream(:tasks, tasks)
    }
  end
end
