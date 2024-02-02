defmodule AfrekWeb.PageHTML do
  use AfrekWeb, :html

  embed_templates "page_html/*"
  embed_templates "page_html/posts/*"
end
