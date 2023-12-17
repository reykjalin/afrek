defmodule Verk.Events do
  @moduledoc """
  Defines Event structs for use within the PubSub system.
  """

  defmodule TaskAdded do
    defstruct task: nil
  end
end
