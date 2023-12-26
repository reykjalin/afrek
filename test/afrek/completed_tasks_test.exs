defmodule Afrek.CompletedTasksTest do
  use Afrek.DataCase

  alias Afrek.CompletedTasks

  describe "completed_tasks" do
    alias Afrek.CompletedTasks.CompletedTask

    import Afrek.CompletedTasksFixtures

    @invalid_attrs %{user: nil, title: nil, details: nil}

    test "list_completed_tasks/0 returns all completed_tasks" do
      completed_task = completed_task_fixture()
      assert CompletedTasks.list_completed_tasks() == [completed_task]
    end

    test "get_completed_task!/1 returns the completed_task with given id" do
      completed_task = completed_task_fixture()
      assert CompletedTasks.get_completed_task!(completed_task.id) == completed_task
    end

    test "create_completed_task/1 with valid data creates a completed_task" do
      valid_attrs = %{user: "some user", title: "some title", details: "some details"}

      assert {:ok, %CompletedTask{} = completed_task} = CompletedTasks.create_completed_task(valid_attrs)
      assert completed_task.user == "some user"
      assert completed_task.title == "some title"
      assert completed_task.details == "some details"
    end

    test "create_completed_task/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = CompletedTasks.create_completed_task(@invalid_attrs)
    end

    test "update_completed_task/2 with valid data updates the completed_task" do
      completed_task = completed_task_fixture()
      update_attrs = %{user: "some updated user", title: "some updated title", details: "some updated details"}

      assert {:ok, %CompletedTask{} = completed_task} = CompletedTasks.update_completed_task(completed_task, update_attrs)
      assert completed_task.user == "some updated user"
      assert completed_task.title == "some updated title"
      assert completed_task.details == "some updated details"
    end

    test "update_completed_task/2 with invalid data returns error changeset" do
      completed_task = completed_task_fixture()
      assert {:error, %Ecto.Changeset{}} = CompletedTasks.update_completed_task(completed_task, @invalid_attrs)
      assert completed_task == CompletedTasks.get_completed_task!(completed_task.id)
    end

    test "delete_completed_task/1 deletes the completed_task" do
      completed_task = completed_task_fixture()
      assert {:ok, %CompletedTask{}} = CompletedTasks.delete_completed_task(completed_task)
      assert_raise Ecto.NoResultsError, fn -> CompletedTasks.get_completed_task!(completed_task.id) end
    end

    test "change_completed_task/1 returns a completed_task changeset" do
      completed_task = completed_task_fixture()
      assert %Ecto.Changeset{} = CompletedTasks.change_completed_task(completed_task)
    end
  end
end
