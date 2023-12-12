defmodule TasksWeb.TasksLive do
  use TasksWeb, :live_view

  def render(assigns) do
    ~H"""
    <h1 class="text-2xl font-bold mt-4 mb-2">Tasks</h1>

    <div class="flex gap-4">
      <div class="w-full px-10 border-r border-black">
        <.card :for={task <- @tasks}>
          <div class="flex items-center gap-2">
            <.icon name="hero-chevron-right" />
            <p class="grow"><%= task["title"] %></p>
            <p :if={task["due_date"] != nil} class="text-sm text-red-600"><%= task["due_date"] %></p>
            <p :if={task["duration"] != nil} class="text-sm"><%= task["duration"] %></p>
            <.icon name="hero-check" />
            <.icon name="hero-pencil-square" />
            <.icon name="hero-archive-box" />
          </div>
        </.card>
      </div>

      <div class="w-full px-10">
        <hr class="w-full border-black mx-auto w-[250px] mb-[40px]" />
        <hr class="w-full border-black mx-auto w-[250px] mb-[40px]" />
        <hr class="w-full border-black mx-auto w-[250px] mb-[40px]" />
        <hr class="w-full border-black mx-auto w-[250px] mb-[40px]" />
        <hr class="w-full border-black mx-auto w-[250px] mb-[40px]" />
        <hr class="w-full border-black mx-auto w-[250px] mb-[40px]" />
        <hr class="w-full border-black mx-auto w-[250px] mb-[40px]" />
        <hr class="w-full border-black mx-auto w-[250px] mb-[40px]" />
        <hr class="w-full border-black mx-auto w-[250px] mb-[40px]" />
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
