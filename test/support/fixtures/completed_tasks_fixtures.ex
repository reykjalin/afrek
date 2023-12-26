defmodule Afrek.CompletedTasksFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Afrek.CompletedTasks` context.
  """

  @doc """
  Generate a completed_task.
  """
  def completed_task_fixture(attrs \\ %{}) do
    {:ok, completed_task} =
      attrs
      |> Enum.into(%{
        details: "some details",
        title: "some title",
        user: "some user"
      })
      |> Afrek.CompletedTasks.create_completed_task()

    completed_task
  end
end
