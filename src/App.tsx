import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/features/course/HomePage';
import { CourseOverviewPage } from '@/features/course/CourseOverviewPage';
import { ModulePage } from '@/features/course/ModulePage';
import { GlossaryPage } from '@/features/glossary/GlossaryPage';
import { ExamPage } from '@/features/exam/ExamPage';
import { AtlasHome } from '@/features/atlas/AtlasHome';
import { AtlasCompanies } from '@/features/atlas/AtlasCompanies';
import { AtlasModels } from '@/features/atlas/AtlasModels';
import { AtlasProducts } from '@/features/atlas/AtlasProducts';
import { AtlasCategories } from '@/features/atlas/AtlasCategories';
import { AtlasHardware } from '@/features/atlas/AtlasHardware';
import { AtlasOnDevice } from '@/features/atlas/AtlasOnDevice';
import { AboutPage } from '@/features/about/AboutPage';
import { DsaOverviewPage } from '@/features/dsa/DsaOverviewPage';
import { SubCoursePage } from '@/features/dsa/SubCoursePage';
import { ProblemPage } from '@/features/dsa/ProblemPage';
import { ArenaPage } from '@/features/dsa/ArenaPage';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<CourseOverviewPage />} />
        <Route path="/courses/ai" element={<Navigate to="/learn" replace />} />
        <Route path="/learn/:slug" element={<ModulePage />} />
        <Route path="/atlas" element={<AtlasHome />} />
        <Route path="/atlas/companies" element={<AtlasCompanies />} />
        <Route path="/atlas/models" element={<AtlasModels />} />
        <Route path="/atlas/products" element={<AtlasProducts />} />
        <Route path="/atlas/categories" element={<AtlasCategories />} />
        <Route path="/atlas/hardware" element={<AtlasHardware />} />
        <Route path="/atlas/on-device" element={<AtlasOnDevice />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/exam" element={<ExamPage />} />
        {/* DSA course */}
        <Route path="/dsa" element={<DsaOverviewPage />} />
        <Route path="/dsa/arena" element={<ArenaPage />} />
        <Route path="/dsa/:topic" element={<SubCoursePage />} />
        <Route path="/dsa/:topic/problem/:problemId" element={<ProblemPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
