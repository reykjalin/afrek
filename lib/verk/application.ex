defmodule Verk.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      VerkWeb.Telemetry,
      Verk.Repo,
      {DNSCluster, query: Application.get_env(:verk, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Verk.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Verk.Finch},
      # Start a worker by calling: Verk.Worker.start_link(arg)
      # {Verk.Worker, arg},
      # Start to serve requests, typically the last entry
      VerkWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Verk.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    VerkWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
