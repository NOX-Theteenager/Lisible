import React from 'react';
import Sidebar from './layout/Sidebar.jsx';
import Header from './layout/Header.jsx';
import Home from './screens/Home.jsx';
import Editor from './screens/Editor.jsx';
import Import from './screens/Import.jsx';
import Adapt from './screens/Adapt.jsx';
import Letter from './screens/Letter.jsx';
import Interview from './screens/Interview.jsx';
import Applications from './screens/Applications.jsx';
import Jobs from './screens/Jobs.jsx';
import Settings from './screens/Settings.jsx';
import Versions from './screens/Versions.jsx';
import TemplateGallery from './overlays/TemplateGallery.jsx';
import ShareDialog from './overlays/ShareDialog.jsx';
import ExportDialog from './overlays/ExportDialog.jsx';
import MobileNav from './layout/MobileNav.jsx';
import NavDrawer from './overlays/NavDrawer.jsx';
import AuthScreen from './overlays/AuthScreen.jsx';
import Toast from './overlays/Toast.jsx';
import ExportProgress from './overlays/ExportProgress.jsx';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function AppView({ v }) {
  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
        <Sidebar v={v} />
        <main style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', paddingBottom: v.lay?.mainPb }}>
          {' '}
          <Header v={v} /> <Home v={v} /> <Editor v={v} /> <Import v={v} /> <Adapt v={v} /> <Letter v={v} /> <Interview v={v} />{' '}
          {v.isJobs ? (
            <div data-screen-label="Offres" style={{ padding: '22px clamp(12px,3.5vw,24px) 48px', maxWidth: '1100px', width: '100%' }}>
              <Jobs v={v} />
            </div>
          ) : null}
          <Applications v={v} /> <Settings v={v} /> <Versions v={v} />
        </main>
      </div>
      <TemplateGallery v={v} />
      <ShareDialog v={v} />
      <ExportDialog v={v} />
      <MobileNav v={v} />
      <NavDrawer v={v} />
      <AuthScreen v={v} />
      <ExportProgress v={v} />
      <Toast v={v} />
    </>
  );
}
