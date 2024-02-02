defmodule AfrekWeb.Router do
  use AfrekWeb, :router

  import AfrekWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {AfrekWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_user
  end

  ## Application routes.

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", AfrekWeb do
    pipe_through :browser

    get "/", PageController, :home
    get "/privacy", PageController, :privacy
    get "/blog/:post", PageController, :blog_post
    get "/blog", PageController, :blog

    live_session :default,
      on_mount: [
        {AfrekWeb.UserAuth, :ensure_authenticated},
        {AfrekWeb.SaveRequestPath, :save_request_path},
        AfrekWeb.Scope
      ] do
      live "/tasks", TasksLive, :index
      live "/completed", CompletedTasksLive, :index
      live "/archived", ArchivedTasksLive, :index
    end
  end

  # Other scopes may use custom stacks.
  # scope "/api", AfrekWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:afrek, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: AfrekWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  ## Authentication routes

  scope "/", AfrekWeb do
    pipe_through [:browser, :redirect_if_user_is_authenticated]

    live_session :redirect_if_user_is_authenticated,
      on_mount: [{AfrekWeb.UserAuth, :redirect_if_user_is_authenticated}] do
      live "/users/register", UserRegistrationLive, :new
      live "/users/log_in", UserLoginLive, :new
      live "/users/reset_password", UserForgotPasswordLive, :new
      live "/users/reset_password/:token", UserResetPasswordLive, :edit
    end

    post "/users/log_in", UserSessionController, :create
  end

  scope "/", AfrekWeb do
    pipe_through [:browser, :require_authenticated_user]

    live_session :require_authenticated_user,
      on_mount: [
        {AfrekWeb.UserAuth, :ensure_authenticated},
        {AfrekWeb.SaveRequestPath, :save_request_path}
      ] do
      live "/users/settings", UserSettingsLive, :edit
      live "/users/settings/confirm_email/:token", UserSettingsLive, :confirm_email
    end
  end

  scope "/", AfrekWeb do
    pipe_through [:browser]

    delete "/users/log_out", UserSessionController, :delete

    live_session :current_user,
      on_mount: [{AfrekWeb.UserAuth, :mount_current_user}] do
      live "/users/confirm/:token", UserConfirmationLive, :edit
      live "/users/confirm", UserConfirmationInstructionsLive, :new
    end
  end
end
