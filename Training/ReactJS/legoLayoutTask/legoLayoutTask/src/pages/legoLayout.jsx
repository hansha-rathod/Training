import "./legoLayout.css"
import Navbar from "../components/Navbar"
import MainContent from "../components/MainContent"
import Footer from "../components/Footer"
import Sidebar from "../components/Sidebar"


function LegoLayout() {

  return (
    <div className="lego-layout">
        
      <Navbar title="React Website" />
      
      <div className="lego-layout-body">
           
        <div className="lego-layout-content">
          <MainContent />
        </div>
           
        <Sidebar />

      </div>
      
      <Footer />
    </div>
  )
}


export default LegoLayout