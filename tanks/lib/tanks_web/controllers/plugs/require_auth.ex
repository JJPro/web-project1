defmodule TanksWeb.Plugs.RequireAuth do
  import Plug.Conn
  alias Tanks.{Accounts, Accounts.User}
  import TanksWeb.Router.Helpers, only: [auth_path: 2]
  import Phoenix.Controller, only: [put_flash: 3, redirect: 2, ]

  def init(_params) do
  end

  @doc """
  Put user struct into conn
  """
  def call(conn, _params) do
    if conn.assigns.current_user do
      conn
    else
      conn
      # |> put_flash(:error, "Please log in.")
      |> redirect(to: auth_path(conn, :index))
      |> halt()
    end
  end
end