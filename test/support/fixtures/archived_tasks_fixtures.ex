defmodule Afrek.ArchivedTasksFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Afrek.ArchivedTasks` context.
  """

  @doc """
  Generate a archived_task.
  """
  def archived_task_fixture(attrs \\ %{}) do
    {:ok, archived_task} =
      attrs
      |> Enum.into(%{
        details: "some details",
        title: "some title",
        user: "some user"
      })
      |> Afrek.ArchivedTasks.create_archived_task()

    archived_task
  end
end
