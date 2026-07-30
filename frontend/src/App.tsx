import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { LogAnalyzer } from './pages/LogAnalyzer';
import { LogExplorer } from './pages/LogExplorer';
import { Entities } from './pages/Entities';
import { SemanticSearch } from './pages/SemanticSearch';
import { Settings } from './pages/Settings';
import { UserSettings } from './pages/UserSettings';
import { Notifications } from './pages/Notifications';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="analyze" element={<LogAnalyzer />} />
        <Route path="logs" element={<LogExplorer />} />
        <Route path="entities" element={<Entities />} />
        <Route path="search" element={<SemanticSearch />} />
        <Route path="settings" element={<Settings />} />
        <Route path="user-settings" element={<UserSettings />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
}

export default App;
