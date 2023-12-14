defmodule TasksWeb.TasksLive do
  use TasksWeb, :live_view

  def render(assigns) do
    ~H"""
    <h1 class="text-2xl font-bold mt-4 mb-10 text-center">
      <%= DateTime.utc_now() |> Calendar.strftime("%A %b %d") %>
    </h1>

    <form class="m-10">
      <div class="flex flex-row gap-4">
        <.input
          type="text"
          name="task-title"
          id="task-title"
          wrapper_class="grow"
          placeholder="Foo the bar…"
          value=""
          required
        />

        <.input
          type="date"
          name="task-due-date"
          id="task-due-date"
          wrapper_class=""
          placeholder="Due date…"
          value=""
        />

        <.input
          type="text"
          name="task-duration"
          id="task-duration"
          wrapper_class=""
          placeholder="1h 25m"
          value=""
          pattern="^([0-9]+h)? ?([0-9]+m)?$"
          title="Examples of valid durations: 1h, 45m, 1h 43m, 12h30m"
        />
      </div>

      <.rte id="task-details" />

      <div class="text-right mt-2">
        <.button type="submit">Add Task</.button>
      </div>
    </form>

    <div class="flex my-5">
      <div class="w-full px-10 flex flex-col gap-4 border-r">
        <.task :for={task <- @tasks} task={task} />
      </div>

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
    tasks = [
      %{
        "id" => "1",
        "title" => "Foo the bar",
        "details" => "Foo the bar",
        "due_date" => "Jan 31, 2024",
        "duration" => "1h 30m"
      },
      %{
        "id" => "2",
        "title" => "Baz the qux",
        "details" => "Baz the qux",
        "due_date" => nil,
        "duration" => "1h"
      },
      %{
        "id" => "3",
        "title" => "Quux the quuz",
        "details" => "Quux the quuz",
        "due_date" => nil,
        "duration" => "30m"
      },
      %{
        "id" => "4",
        "title" => "Corge the grault",
        "details" => "Corge the grault",
        "due_date" => nil,
        "duration" => nil
      }
    ]

    {:ok, assign(socket, tasks: tasks)}
  end

  def handle_event("complete_task", %{"task" => task_id}, socket) do
    {:noreply, assign(socket, tasks: Enum.filter(socket.assigns.tasks, &(&1["id"] != task_id)))}
  end

  def handle_event("edit_task", %{"task" => task_id}, socket) do
    task = Enum.find(socket.assigns.tasks, &(&1["id"] == task_id))

    {:noreply, socket}
  end

  def handle_event("archive_task", %{"task" => task_id}, socket) do
    {:noreply, assign(socket, tasks: Enum.filter(socket.assigns.tasks, &(&1["id"] != task_id)))}
  end
end
