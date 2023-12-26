defmodule Afrek.TasksTest do
  use Afrek.DataCase

  alias Afrek.Tasks

  describe "tasks" do
    alias Afrek.Tasks.Task

    import Afrek.TasksFixtures

    @invalid_attrs %{
      position: nil,
      user: nil,
      title: nil,
      details: nil,
      due_date: nil,
      duration: nil
    }

    test "list_tasks/0 returns all tasks" do
      task = task_fixture()
      assert Tasks.list_tasks() == [task]
    end

    test "get_task!/1 returns the task with given id" do
      task = task_fixture()
      assert Tasks.get_task!(task.id) == task
    end

    test "create_task/1 with valid data creates a task" do
      valid_attrs = %{
        position: 42,
        user: "some user",
        title: "some title",
        details: "some details",
        due_date: ~D[2023-12-16],
        duration: "some duration"
      }

      assert {:ok, %Task{} = task} = Tasks.create_task(valid_attrs)
      assert task.position == 42
      assert task.user == "some user"
      assert task.title == "some title"
      assert task.details == "some details"
      assert task.due_date == ~D[2023-12-16]
      assert task.duration == "some duration"
    end

    test "create_task/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Tasks.create_task(@invalid_attrs)
    end

    test "update_task/2 with valid data updates the task" do
      task = task_fixture()

      update_attrs = %{
        position: 43,
        user: "some updated user",
        title: "some updated title",
        details: "some updated details",
        due_date: ~D[2023-12-17],
        duration: "some updated duration"
      }

      assert {:ok, %Task{} = task} = Tasks.update_task(task, update_attrs)
      assert task.position == 43
      assert task.user == "some updated user"
      assert task.title == "some updated title"
      assert task.details == "some updated details"
      assert task.due_date == ~D[2023-12-17]
      assert task.duration == "some updated duration"
    end

    test "update_task/2 with invalid data returns error changeset" do
      task = task_fixture()
      assert {:error, %Ecto.Changeset{}} = Tasks.update_task(task, @invalid_attrs)
      assert task == Tasks.get_task!(task.id)
    end

    test "delete_task/1 deletes the task" do
      task = task_fixture()
      assert {:ok, %Task{}} = Tasks.delete_task(task)
      assert_raise Ecto.NoResultsError, fn -> Tasks.get_task!(task.id) end
    end

    test "change_task/1 returns a task changeset" do
      task = task_fixture()
      assert %Ecto.Changeset{} = Tasks.change_task(task)
    end
  end
end
