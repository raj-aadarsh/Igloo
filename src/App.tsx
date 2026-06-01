import { Routes, Route, Navigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/features/course/HomePage';
import { CourseOverviewPage } from '@/features/course/CourseOverviewPage';
import { ModulePage } from '@/features/course/ModulePage';
import { osCourse, osAllQuestions, osPlannedTopics } from '@/content/course-os';
import { cnCourse, cnAllQuestions, cnPlannedTopics } from '@/content/course-cn';
import { dbmsCourse, dbmsAllQuestions, dbmsPlannedTopics } from '@/content/course-dbms';
import { javaCourse, javaAllQuestions, javaPlannedTopics } from '@/content/course-java';
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
        {/* OS course */}
        <Route
          path="/os"
          element={
            <CourseOverviewPage
              course={osCourse}
              basePath="/os"
              courseNumber={3}
              accent="brand"
              blurb="A visual, interactive tour of how operating systems work — light on reading, heavy on diagrams."
              extras={[{ to: '/os/exam', title: 'Final Exam', desc: 'Mixed questions · unlimited tries', icon: GraduationCap }]}
              comingSoon={osPlannedTopics}
            />
          }
        />
        <Route path="/os/exam" element={<ExamPage pool={osAllQuestions()} quizId="os-final-exam" reviewPath="/os" />} />
        <Route path="/os/:slug" element={<ModulePage course={osCourse} basePath="/os" examPath="/os/exam" />} />
        {/* Computer Networks course */}
        <Route
          path="/cn"
          element={
            <CourseOverviewPage
              course={cnCourse}
              basePath="/cn"
              courseNumber={4}
              accent="brand"
              blurb="A visual tour of how the internet works — OSI layers, IP & subnetting, TCP/UDP, DNS & HTTP — light on reading, heavy on diagrams."
              extras={[{ to: '/cn/exam', title: 'Final Exam', desc: 'Mixed questions · unlimited tries', icon: GraduationCap }]}
              comingSoon={cnPlannedTopics}
            />
          }
        />
        <Route path="/cn/exam" element={<ExamPage pool={cnAllQuestions()} quizId="cn-final-exam" reviewPath="/cn" />} />
        <Route path="/cn/:slug" element={<ModulePage course={cnCourse} basePath="/cn" examPath="/cn/exam" />} />
        {/* DBMS course */}
        <Route
          path="/dbms"
          element={
            <CourseOverviewPage
              course={dbmsCourse}
              basePath="/dbms"
              courseNumber={5}
              accent="brand"
              blurb="From ER diagrams and normalization to transactions and SQL — visual, hands-on, interview-focused."
              extras={[{ to: '/dbms/exam', title: 'Final Exam', desc: 'Mixed questions · unlimited tries', icon: GraduationCap }]}
              comingSoon={dbmsPlannedTopics}
            />
          }
        />
        <Route path="/dbms/exam" element={<ExamPage pool={dbmsAllQuestions()} quizId="dbms-final-exam" reviewPath="/dbms" />} />
        <Route path="/dbms/:slug" element={<ModulePage course={dbmsCourse} basePath="/dbms" examPath="/dbms/exam" />} />
        {/* Core Java course */}
        <Route
          path="/java"
          element={
            <CourseOverviewPage
              course={javaCourse}
              basePath="/java"
              courseNumber={6}
              accent="brand"
              blurb="The Java that interviews and real work demand — OOP, collections, generics, streams, concurrency and the JVM, with a built-in playground that runs real Java in your browser."
              extras={[{ to: '/java/exam', title: 'Final Exam', desc: 'Mixed questions · unlimited tries', icon: GraduationCap }]}
              comingSoon={javaPlannedTopics}
            />
          }
        />
        <Route path="/java/exam" element={<ExamPage pool={javaAllQuestions()} quizId="java-final-exam" reviewPath="/java" />} />
        <Route path="/java/:slug" element={<ModulePage course={javaCourse} basePath="/java" examPath="/java/exam" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
