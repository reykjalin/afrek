defmodule AfrekWeb.CompletedTasksLive do
  use AfrekWeb, :live_view

  alias Afrek.CompletedTasks

  def render(assigns) do
    ~H"""
    <h2 class="text-2xl font-bold mt-4 mb-10 text-center">
      Completed Tasks
    </h2>

    <div id="completed-tasks" class="w-full flex flex-col gap-4" phx-update="stream">
      <div :for={{id, task} <- @streams.tasks} id={id} class="group flex flex-row gap-2 items-center">
        <div class="grow">
          <.completed_task task={task} />
        </div>
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    if connected?(socket) do
      CompletedTasks.subscribe(socket.assigns.scope)
    end

    tasks = CompletedTasks.list_completed_tasks(socket.assigns.scope)

    {
      :ok,
      socket
      |> stream(:tasks, tasks)
    }
  end
end
