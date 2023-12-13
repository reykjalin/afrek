defmodule TasksWeb.TasksLive do
  use TasksWeb, :live_view

  def render(assigns) do
    ~H"""
    <h1 class="text-2xl font-bold mt-4 mb-10 text-center">
      <%= DateTime.utc_now() |> Calendar.strftime("%A %b %d") %>
    </h1>

    <.button class="mx-10">Add Task</.button>

    <form class="m-10">
      <.input
        type="text"
        name="task_title"
        id="task_title"
        class="mx-10"
        placeholder="Foo the bar…"
        value=""
      />

      <.rte id="task-details" class="w-full my-4 border border-black" />
    </form>

    <div class="flex gap-4 my-5">
      <div class="w-full px-10 border-r border-black">
        <.card :for={task <- @tasks}>
          <details class="group">
            <summary class="flex items-center gap-2 p-1 group-open:border-b group-open:border-slate-400">
              <.icon
                class="transition ease-in-out duration-100 group-open:rotate-90"
                name="hero-chevron-right"
              />
              <p class="grow"><%= task["title"] %></p>
              <p :if={task["due_date"] != nil} class="text-sm text-red-600">
                <%= task["due_date"] %>
              </p>
              <p :if={task["duration"] != nil} class="text-sm"><%= task["duration"] %></p>
              <.icon name="hero-check" />
              <.icon name="hero-pencil-square" />
              <.icon name="hero-archive-box" />
            </summary>

            <div class="p-1">
              <%= task["details"] %>
            </div>
          </details>
        </.card>
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
        "title" => "Foo the bar",
        "details" => "Foo the bar",
        "due_date" => "Jan 31, 2024",
        "duration" => "1h 30m"
      },
      %{
        "title" => "Baz the qux",
        "details" => "Baz the qux",
        "due_date" => nil,
        "duration" => "1h"
      },
      %{
        "title" => "Quux the quuz",
        "details" => "Quux the quuz",
        "due_date" => nil,
        "duration" => "30m"
      },
      %{
        "title" => "Corge the grault",
        "details" => "Corge the grault",
        "due_date" => nil,
        "duration" => nil
      }
    ]

    {:ok, assign(socket, tasks: tasks)}
  end
end
