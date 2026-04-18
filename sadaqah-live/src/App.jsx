import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HostCreateCampaign from './pages/HostCreateCampaign';
import HostDashboard from './pages/HostDashboard';
import DonorJoinRoom from './pages/DonorJoinRoom';
import DonorGive from './pages/DonorGive';
import DonorNiyyah from './pages/DonorNiyyah';
import DonorPledgeContact from './pages/DonorPledgeContact';
import DonationSuccess from './pages/DonationSuccess';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HostCreateCampaign />} />
        <Route path="/host/:roomId" element={<HostDashboard />} />
        <Route path="/join" element={<DonorJoinRoom />} />
        <Route path="/room/:roomId/give" element={<DonorGive />} />
        <Route path="/room/:roomId/niyyah" element={<DonorNiyyah />} />
        <Route path="/room/:roomId/pledge-contact" element={<DonorPledgeContact />} />
        <Route path="/room/:roomId/success" element={<DonationSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}
