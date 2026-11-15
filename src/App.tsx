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
import { lldCourse, lldAllQuestions, lldPlannedTopics } from '@/content/course-lld';
import { hldCourse, hldAllQuestions, hldPlannedTopics } from '@/content/course-hld';
import { devopsCourse, devopsAllQuestions, devopsPlannedTopics } from '@/content/course-devops';
import { gitCourse, gitAllQuestions, gitPlannedTopics } from '@/content/course-git';
import { hrCourse, hrAllQuestions, hrPlannedTopics } from '@/content/course-hr';
import { androidCourse, androidAllQuestions } from '@/content/course-android';
import { AndroidOverviewPage } from '@/features/android/AndroidOverviewPage';
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
        {/* Low-Level Design course */}
        <Route
          path="/lld"
          element={
            <CourseOverviewPage
              course={lldCourse}
              basePath="/lld"
              courseNumber={7}
              accent="brand"
              blurb="Turn requirements into clean, extensible class designs — UML, SOLID, design patterns, and full FAANG machine-coding case studies, interactive throughout."
              extras={[{ to: '/lld/exam', title: 'Final Exam', desc: 'Mixed questions · unlimited tries', icon: GraduationCap }]}
              comingSoon={lldPlannedTopics}
            />
          }
        />
        <Route path="/lld/exam" element={<ExamPage pool={lldAllQuestions()} quizId="lld-final-exam" reviewPath="/lld" />} />
        <Route path="/lld/:slug" element={<ModulePage course={lldCourse} basePath="/lld" examPath="/lld/exam" />} />
        {/* High-Level / System Design course */}
        <Route
          path="/hld"
          element={
            <CourseOverviewPage
              course={hldCourse}
              basePath="/hld"
              courseNumber={8}
              accent="brand"
              blurb="Architect systems that scale to millions — scaling, load balancing, caching, databases, sharding, CAP, messaging, and full FAANG case studies, interactive throughout."
              extras={[{ to: '/hld/exam', title: 'Final Exam', desc: 'Mixed questions · unlimited tries', icon: GraduationCap }]}
              comingSoon={hldPlannedTopics}
            />
          }
        />
        <Route path="/hld/exam" element={<ExamPage pool={hldAllQuestions()} quizId="hld-final-exam" reviewPath="/hld" />} />
        <Route path="/hld/:slug" element={<ModulePage course={hldCourse} basePath="/hld" examPath="/hld/exam" />} />
        {/* DevOps Essentials course */}
        <Route
          path="/devops"
          element={
            <CourseOverviewPage
              course={devopsCourse}
              basePath="/devops"
              courseNumber={9}
              accent="brand"
              blurb="Ship faster and safer — the DevOps lifecycle, Docker & containers, CI/CD, Kubernetes, infrastructure as code, cloud and observability — visual and interview-focused throughout."
              extras={[{ to: '/devops/exam', title: 'Final Exam', desc: 'Mixed questions · unlimited tries', icon: GraduationCap }]}
              comingSoon={devopsPlannedTopics}
            />
          }
        />
        <Route path="/devops/exam" element={<ExamPage pool={devopsAllQuestions()} quizId="devops-final-exam" reviewPath="/devops" />} />
        <Route path="/devops/:slug" element={<ModulePage course={devopsCourse} basePath="/devops" examPath="/devops/exam" />} />
        {/* Git & GitHub course */}
        <Route
          path="/git"
          element={
            <CourseOverviewPage
              course={gitCourse}
              basePath="/git"
              courseNumber={10}
              accent="brand"
              blurb="The version control you’ll use every day — commits & the three areas, branching & merging, merge vs rebase, GitHub collaboration, and undoing mistakes — short, visual, and interactive."
              extras={[{ to: '/git/exam', title: 'Final Exam', desc: 'Mixed questions · unlimited tries', icon: GraduationCap }]}
              comingSoon={gitPlannedTopics}
            />
          }
        />
        <Route path="/git/exam" element={<ExamPage pool={gitAllQuestions()} quizId="git-final-exam" reviewPath="/git" />} />
        <Route path="/git/:slug" element={<ModulePage course={gitCourse} basePath="/git" examPath="/git/exam" />} />
        {/* Behavioral / HR course */}
        <Route
          path="/hr"
          element={
            <CourseOverviewPage
              course={hrCourse}
              basePath="/hr"
              courseNumber={11}
              accent="brand"
              blurb="The round that decides the offer — the STAR method, the common questions (and what they’re really asking), your story bank, and confident delivery."
              extras={[{ to: '/hr/exam', title: 'Final Exam', desc: 'Mixed questions · unlimited tries', icon: GraduationCap }]}
              comingSoon={hrPlannedTopics}
            />
          }
        />
        <Route path="/hr/exam" element={<ExamPage pool={hrAllQuestions()} quizId="hr-final-exam" reviewPath="/hr" />} />
        <Route path="/hr/:slug" element={<ModulePage course={hrCourse} basePath="/hr" examPath="/hr/exam" />} />
        {/* Android Framework course */}
        <Route path="/android" element={<AndroidOverviewPage />} />
        <Route path="/android/exam" element={<ExamPage pool={androidAllQuestions()} quizId="android-final-exam" reviewPath="/android" />} />
        <Route path="/android/:slug" element={<ModulePage course={androidCourse} basePath="/android" examPath="/android/exam" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
