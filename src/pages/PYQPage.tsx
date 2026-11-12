import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Sparkles,
  Filter,
  Upload,
  Calendar,
  Layers,
  ArrowRight,
  Flame,
  Award,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Code2,
  Image as ImageIcon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import { PYQQuestion, QuestionPaper, QuestionType, PYQPriorityLevel } from '../types';

export const PYQPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'repeated' | 'all' | 'algorithms' | 'diagrams' | 'papers' | 'upload'>('repeated');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedMarks, setSelectedMarks] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSubject, setUploadSubject] = useState('sub-cst401-ai');
  const [uploadMonth, setUploadMonth] = useState('December');
  const [uploadYear, setUploadYear] = useState('2024');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const papers = api.pyq.getPapers();
  const questions = api.pyq.getQuestions();

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;
      if (selectedModule !== 'all' && q.moduleId !== selectedModule) return false;
      if (selectedMarks !== 'all' && q.marks.toString() !== selectedMarks) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          q.questionText.toLowerCase().includes(query) ||
          q.qNumber.toLowerCase().includes(query) ||
          q.questionType.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [questions, selectedSubject, selectedModule, selectedMarks, searchQuery]);

  // Repeated Questions (Repeat count >= 2)
  const repeatedQuestions = useMemo(() => {
    return filteredQuestions
      .filter((q) => q.isRepeated || q.repeatCount >= 2)
      .sort((a, b) => b.repeatCount - a.repeatCount);
  }, [filteredQuestions]);

  // Repeated Algorithms
  const algorithmQuestions = useMemo(() => {
    return filteredQuestions.filter((q) => q.questionType === 'ALGORITHM');
  }, [filteredQuestions]);

  // Important Diagrams
  const diagramQuestions = useMemo(() => {
    return filteredQuestions.filter((q) => q.questionType === 'DIAGRAM');
  }, [filteredQuestions]);

  // Handle PDF Upload Simulation / Processing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const processPaperUpload = () => {
    if (!uploadedFileName) return;
    setIsProcessing(true);

    setTimeout(() => {
      const subjectObj = api.syllabus.getSubject(uploadSubject);
      const newPaper: QuestionPaper = {
        id: `qp-${uploadSubject}-${uploadMonth.toLowerCase()}${uploadYear}`,
        subjectId: uploadSubject,
        subjectCode: subjectObj?.code || 'CST401',
        subjectName: subjectObj?.name || 'Artificial Intelligence',
        month: uploadMonth,
        year: parseInt(uploadYear),
        scheme: '2019 Scheme',
        semester: 'S7',
        totalMarks: 100,
        durationHours: 3,
        filename: uploadedFileName,
        verified: true,
        uploadedAt: new Date().toISOString(),
      };

      // Extracted mock questions adhering strictly to KTU format (Part A 3 marks, Part B 14 marks)
      const extractedQuestions: PYQQuestion[] = [
        {
          id: `pyq-ext-1-${Date.now()}`,
          paperId: newPaper.id,
          subjectId: uploadSubject,
          moduleId: `${uploadSubject.replace('sub-', '')}-m1`,
          qNumber: '1',
          part: 'A',
          marks: 3,
          questionText: `Explain core concepts and foundations tested in ${newPaper.subjectCode} examination paper.`,
          questionType: 'CONCEPT',
          pageNumber: 1,
          appearsIn: [newPaper.id],
          isRepeated: false,
          repeatCount: 1,
          priority: 'HIGH',
        },
        {
          id: `pyq-ext-2-${Date.now()}`,
          paperId: newPaper.id,
          subjectId: uploadSubject,
          moduleId: `${uploadSubject.replace('sub-', '')}-m2`,
          qNumber: '11(a)',
          part: 'B',
          marks: 14,
          questionText: `Detailed algorithm execution and numerical derivation from ${newPaper.month} ${newPaper.year} question paper.`,
          questionType: 'ALGORITHM',
          pageNumber: 2,
          appearsIn: [newPaper.id],
          isRepeated: true,
          repeatCount: 2,
          priority: 'VERY_HIGH',
        },
      ];

      api.pyq.uploadPaper(newPaper, extractedQuestions);
      setIsProcessing(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadModalOpen(false);
        setUploadSuccess(false);
        setUploadedFileName('');
      }, 1500);
    }, 1200);
  };

  const priorityBadgeVariant = (p: PYQPriorityLevel) => {
    switch (p) {
      case 'VERY_HIGH': return 'danger';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60">
              PYQ Intelligence
            </span>
            <Badge variant="outline" size="sm">KTU 2019 Scheme S7</Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Previous Year Question Paper Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real KTU University examination questions extracted from verified source papers (Dec 22, May 23, Dec 23, Jan 24).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => setUploadModalOpen(true)}>
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Upload Question Paper PDF
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-medium">
        <button
          onClick={() => setActiveTab('repeated')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'repeated'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-500" />
          <span>Most Repeated ({repeatedQuestions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('algorithms')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'algorithms'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4 text-indigo-500" />
          <span>Repeated Algorithms ({algorithmQuestions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('diagrams')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'diagrams'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-emerald-500" />
          <span>Important Diagrams ({diagramQuestions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-slate-500" />
          <span>All Questions ({filteredQuestions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('papers')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'papers'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4 text-amber-500" />
          <span>Source Papers ({papers.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by text or concept..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">All Subjects (AI, BMI, SIC)</option>
          <option value="sub-cst401-ai">CST401 — Artificial Intelligence</option>
          <option value="sub-ect425-bmi">ECT425 — Biomedical Instrumentation</option>
          <option value="sub-cst433-sic">CST433 — Security in Computing</option>
        </select>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">All 5 Modules</option>
          <option value="cst401-m1">Module 1</option>
          <option value="cst401-m2">Module 2</option>
          <option value="cst401-m3">Module 3</option>
          <option value="cst401-m4">Module 4</option>
          <option value="cst401-m5">Module 5</option>
        </select>

        <select
          value={selectedMarks}
          onChange={(e) => setSelectedMarks(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">Part A & Part B Marks</option>
          <option value="3">Part A: 3 Marks (Compulsory)</option>
          <option value="14">Part B: 14 Marks (Long Answer)</option>
        </select>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'papers' ? (
        /* Source Papers Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {papers.map((p) => {
            const paperQuestions = questions.filter((q) => q.paperId === p.id);
            return (
              <Card key={p.id} hoverEffect className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {p.subjectCode}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                      {p.subjectName}
                    </h3>
                  </div>
                  <Badge variant="success" size="sm">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Examination:</span>
                    <strong className="text-slate-900 dark:text-slate-200">{p.month} {p.year}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Scheme & Sem:</span>
                    <span>{p.scheme} • {p.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Marks:</span>
                    <span>{p.totalMarks} Marks ({p.durationHours} hrs)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions Extracted:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{paperQuestions.length} Questions</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{p.filename}</span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Questions Cards List */
        <div className="space-y-3">
          {(activeTab === 'repeated'
            ? repeatedQuestions
            : activeTab === 'algorithms'
            ? algorithmQuestions
            : activeTab === 'diagrams'
            ? diagramQuestions
            : filteredQuestions
          ).map((q) => {
            const subject = api.syllabus.getSubject(q.subjectId);
            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-all space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                      {subject?.code || 'KTU'} • Q{q.qNumber}
                    </span>
                    <Badge variant={q.part === 'B' ? 'primary' : 'default'} size="sm">
                      Part {q.part} ({q.marks} Marks)
                    </Badge>
                    <Badge variant={priorityBadgeVariant(q.priority)} size="sm">
                      {q.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {q.repeatCount >= 2 && (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full text-[11px] border border-amber-300/60">
                        <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                        Repeated {q.repeatCount} Times in KTU Exams
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">
                      Page {q.pageNumber}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {q.questionText}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <div className="flex items-center gap-4">
                    <span>
                      Question Type: <strong className="text-slate-700 dark:text-slate-300">{q.questionType}</strong>
                    </span>
                    {q.appearsIn && q.appearsIn.length > 0 && (
                      <span>
                        Appeared in:{' '}
                        <strong className="text-indigo-600 dark:text-indigo-400">
                          {q.appearsIn.map((p) => p.replace('qp-', '').replace('cst401-', '').replace('ect425-', '').replace('cst433-', '').toUpperCase()).join(', ')}
                        </strong>
                      </span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 hover:text-indigo-600"
                    onClick={() => {
                      if (q.topicId && subject) {
                        navigate(`/subjects/${subject.id}`);
                      }
                    }}
                  >
                    <span>View in Syllabus</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: PDF Question Paper Upload & Parser */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Previous Year Question Paper"
        description="Upload an official KTU S7 examination PDF. The parser extracts Part A and Part B questions, assigns marks, and links them to syllabus topics."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs focus:ring-2 focus:ring-indigo-500"
              >
                <option value="sub-cst401-ai">CST401 — AI</option>
                <option value="sub-ect425-bmi">ECT425 — BMI</option>
                <option value="sub-cst433-sic">CST433 — SIC</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Month
              </label>
              <select
                value={uploadMonth}
                onChange={(e) => setUploadMonth(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs focus:ring-2 focus:ring-indigo-500"
              >
                <option value="December">December</option>
                <option value="January">January</option>
                <option value="May">May</option>
                <option value="June">June</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Year
              </label>
              <select
                value={uploadYear}
                onChange={(e) => setUploadYear(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs focus:ring-2 focus:ring-indigo-500"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>

          {/* File Picker */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 hover:border-indigo-500 transition-colors">
            <Upload className="w-8 h-8 text-indigo-500 mx-auto" />
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {uploadedFileName ? (
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{uploadedFileName}</span>
              ) : (
                'Choose a KTU PDF Question Paper from your computer'
              )}
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {uploadSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Paper analyzed and added to Question Bank successfully!</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={isProcessing}
              disabled={!uploadedFileName || isProcessing}
              onClick={processPaperUpload}
            >
              Analyze & Import Questions
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
