defmodule AfrekWeb.PageController do
  use AfrekWeb, :controller

  ## ==
  ## Static pages.
  ## ==

  def home(conn, _params) do
    # The home page is often custom made,
    # so skip the default app layout.
    render(conn, :home, layout: false)
  end

  def privacy(conn, _params) do
    render(conn, :privacy, layout: false)
  end

  def blog(conn, _params) do
    render(conn, :blog, layout: false)
  end

  def blog_post(conn, %{"post" => post}) do
    case post do
      "introduction" ->
        render(conn, :introduction, layout: false)

      _ ->
        put_view(conn, AfrekWeb.ErrorHTML)
        |> render("404.html", layout: false)
    end
  end
end
