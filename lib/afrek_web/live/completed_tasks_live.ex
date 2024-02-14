defmodule AfrekWeb.CompletedTasksLive do
  use AfrekWeb, :live_view

  alias Afrek.CompletedTasks

  def render(assigns) do
    ~H"""
    <section class="max-w-prose mx-auto">
      <h2 class="text-2xl font-bold mt-4 mb-10 text-center">
        Completed Tasks
      </h2>

      <div id="completed-tasks" class="w-full" phx-update="stream">
        <div :for={{date, tasks} <- @tasks}>
          <h2 class="text-2xl mt-5 mb-3 font-bold"><%= Calendar.strftime(date, "%a %b %d, %Y") %></h2>
          <div class="flex flex-col gap-2 items-center">
            <div :for={{id, task} <- tasks} id={id} class="w-full">
              <.completed_task class="w-full" task={task} />
            </div>
          </div>
        </div>
      </div>
    </section>
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
      |> assign(:tasks, tasks)
    }
  end
end
