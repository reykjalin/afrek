defmodule Afrek.ArchivedTasksTest do
  use Afrek.DataCase

  alias Afrek.ArchivedTasks

  describe "archived_tasks" do
    alias Afrek.ArchivedTasks.ArchivedTask

    import Afrek.ArchivedTasksFixtures

    @invalid_attrs %{user: nil, title: nil, details: nil}

    test "list_archived_tasks/0 returns all archived_tasks" do
      archived_task = archived_task_fixture()
      assert ArchivedTasks.list_archived_tasks() == [archived_task]
    end

    test "get_archived_task!/1 returns the archived_task with given id" do
      archived_task = archived_task_fixture()
      assert ArchivedTasks.get_archived_task!(archived_task.id) == archived_task
    end

    test "create_archived_task/1 with valid data creates a archived_task" do
      valid_attrs = %{user: "some user", title: "some title", details: "some details"}

      assert {:ok, %ArchivedTask{} = archived_task} = ArchivedTasks.create_archived_task(valid_attrs)
      assert archived_task.user == "some user"
      assert archived_task.title == "some title"
      assert archived_task.details == "some details"
    end

    test "create_archived_task/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = ArchivedTasks.create_archived_task(@invalid_attrs)
    end

    test "update_archived_task/2 with valid data updates the archived_task" do
      archived_task = archived_task_fixture()
      update_attrs = %{user: "some updated user", title: "some updated title", details: "some updated details"}

      assert {:ok, %ArchivedTask{} = archived_task} = ArchivedTasks.update_archived_task(archived_task, update_attrs)
      assert archived_task.user == "some updated user"
      assert archived_task.title == "some updated title"
      assert archived_task.details == "some updated details"
    end

    test "update_archived_task/2 with invalid data returns error changeset" do
      archived_task = archived_task_fixture()
      assert {:error, %Ecto.Changeset{}} = ArchivedTasks.update_archived_task(archived_task, @invalid_attrs)
      assert archived_task == ArchivedTasks.get_archived_task!(archived_task.id)
    end

    test "delete_archived_task/1 deletes the archived_task" do
      archived_task = archived_task_fixture()
      assert {:ok, %ArchivedTask{}} = ArchivedTasks.delete_archived_task(archived_task)
      assert_raise Ecto.NoResultsError, fn -> ArchivedTasks.get_archived_task!(archived_task.id) end
    end

    test "change_archived_task/1 returns a archived_task changeset" do
      archived_task = archived_task_fixture()
      assert %Ecto.Changeset{} = ArchivedTasks.change_archived_task(archived_task)
    end
  end
end
