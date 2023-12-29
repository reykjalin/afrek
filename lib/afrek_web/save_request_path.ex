defmodule AfrekWeb.SaveRequestPath do
  def on_mount(:save_request_path, _params, _session, socket) do
    {
      :cont,
      Phoenix.LiveView.attach_hook(
        socket,
        :save_request_path,
        :handle_params,
        &save_request_path/3
      )
    }
  end

  defp save_request_path(_params, url, socket) do
    {:cont, Phoenix.Component.assign(socket, :current_url_path, URI.parse(url) |> Map.get(:path))}
  end
end
