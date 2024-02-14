defmodule AfrekWeb.ArchivedTasksLive do
  use AfrekWeb, :live_view

  alias Afrek.ArchivedTasks

  def render(assigns) do
    ~H"""
    <section class="max-w-prose mx-auto">
      <.header class="text-center mt-4 mb-10">Archived Tasks</.header>

      <div id="archived-tasks" class="w-full flex flex-col gap-4" phx-update="stream">
        <div
          :for={{id, task} <- @streams.tasks}
          id={id}
          class="group flex flex-row gap-2 items-center"
        >
          <div class="grow">
            <.completed_task task={task} />
          </div>
        </div>
      </div>
    </section>
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
