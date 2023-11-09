import React from 'react';
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {HomeLayout} from "./layout/HomeLayout";
import {BoardList} from "./page/BoardList";
import {BoardWrite} from "./page/BoardWrite";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
    </Route>
  )
)

function App(props) {
  return (
    <div></div>
  );
}

export default App;