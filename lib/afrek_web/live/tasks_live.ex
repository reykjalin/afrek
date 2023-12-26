defmodule AfrekWeb.TasksLive do
  use AfrekWeb, :live_view

  alias Afrek.{Events, Tasks}
  alias Afrek.Tasks.Task

  def render(assigns) do
    ~H"""
    <h1 class="text-2xl font-bold mt-4 mb-10 text-center">
      <%= DateTime.utc_now() |> Calendar.strftime("%A %b %d") %>
    </h1>

    <.simple_form
      id="new-task"
      for={@form}
      class="my-10 md:m-10"
      phx-change="validate"
      phx-submit="save"
      phx-hook="SubmitTask"
    >
      <div class="flex flex-col md:flex-row gap-4">
        <.input
          field={@form[:title]}
          type="text"
          wrapper_class="grow"
          placeholder="Foo the bar…"
          required
        />

        <.input field={@form[:due_date]} type="date" wrapper_class="" placeholder="Due date…" />

        <.input
          field={@form[:duration]}
          type="text"
          wrapper_class=""
          placeholder="1h 25m"
          pattern="^([0-9]+h)? ?([0-9]+m)?$"
          title="Examples of valid durations: 1h, 45m, 1h 43m, 12h30m"
        />
      </div>

      <.rte id="task-details" />

      <div class="text-right mt-2">
        <.button type="submit">Add Task</.button>
      </div>
    </.simple_form>

    <div class="flex flex-col md:flex-row my-5">
      <div
        id="tasks"
        class="w-full md:px-10 mb-10 flex flex-col gap-4 md:border-r"
        phx-update="stream"
      >
        <div
          :for={{id, task} <- @streams.tasks}
          id={id}
          class="group flex flex-row gap-2 items-center"
        >
          <div class="flex flex-col md:invisible group-hover:visible self-start">
            <.no_outline_button
              class="group-first:invisible"
              phx-click="increment_task_position"
              phx-value-task={task.id}
            >
              <.icon name="hero-chevron-up" />
            </.no_outline_button>
            <.no_outline_button
              class="group-last:invisible"
              phx-click="decrement_task_position"
              phx-value-task={task.id}
            >
              <.icon name="hero-chevron-down" />
            </.no_outline_button>
          </div>
          <div class="grow">
            <.task task={task} />
          </div>
        </div>
      </div>

      <hr class="md:hidden w-full border-black mb-10" />

      <div class="w-full px-10">
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">12am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">1am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">2am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">3am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">4am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">5am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">6am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">7am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">8am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">9am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">10am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">11am <hr class="w-full border-black mx-auto" /></p>
        </div>

        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">12pm <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">1pm <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">2pm <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">3am <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">4pm <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">5pm <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">6pm <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">7pm <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">8pm <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">9pm <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">10pm <hr class="w-full border-black mx-auto" /></p>
        </div>
        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">11pm <hr class="w-full border-black mx-auto" /></p>
        </div>

        <div class="flex flex-column items-start h-[60px] gap-4">
          <p class="text-sm mt-[-10px] w-[40px]">12am <hr class="w-full border-black mx-auto" /></p>
        </div>
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    if connected?(socket) do
      Tasks.subscribe(socket.assigns.scope)
    end

    tasks = Tasks.list_tasks(socket.assigns.scope)

    {
      :ok,
      socket
      |> assign(form: to_change_form(%Task{}, %{}))
      |> stream(:tasks, tasks)
    }
  end

  def handle_info({Afrek.Tasks, %Events.TaskAdded{task: task}}, socket) do
    {:noreply, stream_insert(socket, :tasks, task, at: 0)}
  end

  def handle_info({Afrek.Tasks, %Events.TaskDeleted{task: task}}, socket) do
    {:noreply, stream_delete(socket, :tasks, task)}
  end

  def handle_info({Afrek.Tasks, %Events.TaskRepositioned{task: task}}, socket) do
    # List is in descending order, which is why we need to subtract the new position from the size to get the right position.
    {
      :noreply,
      stream_insert(
        socket,
        :tasks,
        task,
        at: Enum.count(Tasks.list_tasks(socket.assigns.scope)) - 1 - task.position
      )
    }
  end

  def handle_event("validate", %{"task" => task_params, "details" => task_details}, socket) do
    task_params = Map.put(task_params, "details", task_details)

    {:noreply,
     assign(
       socket,
       :form,
       to_change_form(%Task{}, task_params, :validate)
     )}
  end

  def handle_event("validate", %{"task" => task_params}, socket),
    do: handle_event("validate", %{"task" => task_params, "details" => ""}, socket)

  def handle_event("save", %{"task" => task_params, "details" => task_details}, socket) do
    task_params = Map.put(task_params, "details", task_details)

    case Tasks.create_task(socket.assigns.scope, task_params) do
      {:ok, new_todo} ->
        {
          :noreply,
          socket
          |> stream_insert(:tasks, new_todo)
          |> assign(:form, to_change_form(%Task{}, %{}))
          |> push_event("task_added", %{task: new_todo.id})
        }

      {:error, changeset} ->
        {:noreply, assign(socket, :form, to_change_form(changeset, task_params, :insert))}
    end
  end

  def handle_event("complete_task", %{"task" => task_id}, socket) do
    task = Tasks.get_task!(socket.assigns.scope, task_id)

    # FIXME: Move task to the completed tasks table.

    {:ok, _} = Tasks.delete_task(socket.assigns.scope, task)

    {:noreply, socket}
  end

  def handle_event("reposition_task", %{"task" => task_id, "new-pos" => new_pos}, socket) do
    task = Tasks.get_task!(socket.assigns.scope, task_id)
    Tasks.update_task_position(socket.assigns.scope, task, new_pos |> String.to_integer())

    {:noreply, socket}
  end

  def handle_event("increment_task_position", %{"task" => task_id}, socket) do
    task = Tasks.get_task!(socket.assigns.scope, task_id)
    Tasks.update_task_position(socket.assigns.scope, task, task.position + 1)

    {:noreply, socket}
  end

  def handle_event("decrement_task_position", %{"task" => task_id}, socket) do
    task = Tasks.get_task!(socket.assigns.scope, task_id)
    Tasks.update_task_position(socket.assigns.scope, task, task.position - 1)

    {:noreply, socket}
  end

  def handle_event("edit_task", %{"task" => _task_id}, socket) do
    # task = Enum.find(socket.assigns.tasks, &(&1["id"] == task_id))

    {:noreply, socket}
  end

  def handle_event("archive_task", %{"task" => task_id}, socket) do
    task = Tasks.get_task!(socket.assigns.scope, task_id)

    # FIXME: Move task to the archived tasks table.

    {:ok, _} = Tasks.delete_task(socket.assigns.scope, task)

    {:noreply, socket}
  end

  defp to_change_form(task_or_changeset, params, action \\ nil) do
    task_or_changeset
    |> Tasks.change_task(params)
    |> Map.put(:action, action)
    |> to_form()
  end
end
