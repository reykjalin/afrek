defmodule AfrekWeb.Scope do
  def on_mount(:default, _params, _session, socket) do
    current_user = socket.assigns[:current_user]
    {:cont, Phoenix.Component.assign(socket, :scope, Afrek.Scope.for_user(current_user))}
  end
end
