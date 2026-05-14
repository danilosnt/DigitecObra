import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './presentation/layouts/AppLayout';
import { ProjectsPage } from './presentation/pages/ProjectsPage';
import { ProjectDetailsPage } from './presentation/pages/ProjectDetailsPage';
import { CostDetailsPage } from './presentation/pages/CostDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ProjectsPage />} />
          <Route path="project/:id" element={<ProjectDetailsPage />} />
          <Route path="project/:projectId/cost/:costId" element={<CostDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
