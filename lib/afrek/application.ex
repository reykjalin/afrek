defmodule Afrek.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      AfrekWeb.Telemetry,
      Afrek.Repo,
      {DNSCluster, query: Application.get_env(:afrek, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Afrek.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Afrek.Finch},
      # Start a worker by calling: Afrek.Worker.start_link(arg)
      # {Afrek.Worker, arg},
      # Start to serve requests, typically the last entry
      AfrekWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Afrek.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    AfrekWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
