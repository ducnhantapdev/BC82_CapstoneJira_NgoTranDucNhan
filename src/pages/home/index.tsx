import AppBar from "../../components/AppBar";
import ListProjects from "../../components/ListProject";

export default function Home() {
  return (
    <>
      <div id="wrapper" className="w-screen">
        <div id="wrapper-header">
          <AppBar />
        </div>
        <div id="wrapper-content" className="pt-7 max-w-[1200px] m-auto">
          <div className="container">
            <ListProjects />
          </div>
        </div>
      </div>
    </>
  );
}
