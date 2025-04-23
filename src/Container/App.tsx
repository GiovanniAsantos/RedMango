import { Footer, Header } from "../Components/Layout";
import { Home, MenuItemDetails, NotFound } from "../Pages";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="text-success">
      <Header />
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menuItemDetails/:menuItemId" element={<MenuItemDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
