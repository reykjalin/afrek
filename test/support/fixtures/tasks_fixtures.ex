defmodule Verk.TasksFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Verk.Tasks` context.
  """

  @doc """
  Generate a task.
  """
  def task_fixture(attrs \\ %{}) do
    {:ok, task} =
      attrs
      |> Enum.into(%{
        details: "some details",
        due_date: ~D[2023-12-16],
        duration: "some duration",
        position: 42,
        title: "some title",
        user: "some user"
      })
      |> Verk.Tasks.create_task()

    task
  end
end
