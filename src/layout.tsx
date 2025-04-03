import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"
import { useEffect } from "react"
import { fetchAccountAPI } from "services/api.service"
import { useCurrentApp } from "components/context/app.context"
import PropagateLoader from "react-spinners/PropagateLoader"

const Layout = () => {
  const { setUser, isAppLoading, setIsAppLoading } = useCurrentApp();
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res.data) {
        setUser(res.data.user);
        setIsAppLoading(false);
      } else setIsAppLoading(false);
    }
    fetchAccount();
  }, [])
  return (
    <>{isAppLoading === true ?
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}>
        <PropagateLoader size={40} color="#35d1b2" />
      </div>
      :
      <>
        <AppHeader />
        <Outlet />
      </>
    }
    </>
  )
}

export default Layout
